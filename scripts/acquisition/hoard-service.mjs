import { AwardChatCardService } from "../core/award-chat-card-service.mjs";
import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getHoardProfile } from "./hoard-profiles.mjs";
import { tierForCreatureCR } from "./loot-profiles.mjs";
import { randomInt, weightedPick } from "./random-choice.mjs";

export class HoardService {
  constructor({ adapter, materialRegistry, recipientResolver, specialTreasure, potionGenerator, spellScrollGenerator }) {
    this.adapter = adapter;
    this.materialRegistry = materialRegistry;
    this.recipientResolver = recipientResolver;
    this.specialTreasure = specialTreasure;
    this.potionGenerator = potionGenerator;
    this.spellScrollGenerator = spellScrollGenerator;
  }

  async roll(profileId) {
    const profile = getHoardProfile(profileId);

    const materialsEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_MATERIALS));
    const coinEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_COIN));
    const specialEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_SPECIAL));

    const materials = [];
    const potions = [];
    const spellScrolls = [];
    let coinCopper = 0;

    const potionPool = await this.potionGenerator?.availablePotions?.() ?? [];
    const spellPool = await this.spellScrollGenerator?.availableSpells?.() ?? [];
    if (!potionPool.length) {
      throw new Error("A treasure hoard requires potions, but no potions are available from enabled Item sources.");
    }
    if (!spellPool.length) {
      throw new Error("A treasure hoard requires spell scrolls, but no spells are available from enabled Item sources.");
    }

    const potionCount = randomInt(profile.potionRolls.min, profile.potionRolls.max);
    const spellScrollCount = randomInt(profile.spellScrollRolls.min, profile.spellScrollRolls.max);
    for (let i = 0; i < potionCount; i += 1) {
      potions.push(this.#pickPotion(potionPool, profile.representativeCR));
    }
    for (let i = 0; i < spellScrollCount; i += 1) {
      spellScrolls.push(this.#pickSpellScroll(spellPool, profile.representativeCR));
    }

    if (materialsEnabled) {
      const tier = tierForCreatureCR(profile.representativeCR);
      const candidates = tier.results.filter(result => this.materialRegistry.get(result.materialId));
      const rollCount = randomInt(profile.materialRolls.min, profile.materialRolls.max);

      for (let i = 0; i < rollCount; i += 1) {
        const picked = weightedPick(candidates);
        if (!picked) continue;

        const material = this.materialRegistry.get(picked.materialId);
        const baseQuantity = randomInt(picked.min, picked.max);
        const multiplier = Math.max(
          0.25,
          Number(getSetting(SETTINGS.LOOT_MATERIAL_QUANTITY_MULTIPLIER) ?? 1)
        );
        const quantity = Math.max(1, Math.round(baseQuantity * multiplier));

        const existing = materials.find(entry => entry.materialId === picked.materialId);
        if (existing) existing.quantity += quantity;
        else {
          materials.push({
            materialId: picked.materialId,
            name: material?.name ?? picked.materialId,
            img: material?.img ?? "",
            uuid: material?.uuid ?? null,
            quantity
          });
        }
      }
    }

    if (coinEnabled) {
      const multiplier = Math.max(
        0,
        Number(getSetting(SETTINGS.LOOT_COIN_MULTIPLIER) ?? 1)
      );
      const minCopper = Math.round(profile.coinGp.min * 100 * multiplier);
      const maxCopper = Math.round(profile.coinGp.max * 100 * multiplier);
      coinCopper = maxCopper > 0
        ? randomInt(Math.max(0, minCopper), Math.max(0, maxCopper))
        : 0;
    }

    let special = {
      enabled: specialEnabled,
      triggered: false,
      status: specialEnabled ? "none" : "disabled",
      roll: null,
      chance: profile.specialChance,
      itemCountRoll: null,
      items: [],
      detail: null
    };

    if (specialEnabled) {
      const modifier = Number(getSetting(SETTINGS.LOOT_SPECIAL_CHANCE_MODIFIER) ?? 0);
      const chance = Math.max(0, Math.min(100, profile.specialChance + modifier));
      const roll = randomInt(1, 100);

      special.roll = roll;
      special.chance = chance;
      special.triggered = roll <= chance;

      if (special.triggered) {
        const itemCountRoll = randomInt(1, 4);
        const items = [];
        const failures = [];

        for (let i = 0; i < itemCountRoll; i += 1) {
          const resolved = await this.specialTreasure.rollForEncounter(profile.representativeCR);

          if (resolved?.itemUuid) {
            items.push({
              itemUuid: resolved.itemUuid,
              itemName: resolved.itemName,
              itemImg: resolved.itemImg,
              sourceLabel:
                resolved.sourceLabel
                ?? "Unknown Source",
              rarity: resolved.rarity ?? null,
              tableName: null
            });
          } else {
            const detail =
              resolved?.detail
              ?? "No awardable Item was resolved.";

            if (!failures.includes(detail)) failures.push(detail);

            if (resolved?.status === "missing-source") break;
          }
        }

        special = {
          ...special,
          itemCountRoll,
          items,
          status: items.length ? "items" : "unresolved-result",
          detail: failures.length ? failures.join(" ") : null
        };
      }
    }

    return {
      profileId: profile.id,
      profileLabel: profile.label,
      materials,
      potions,
      spellScrolls,
      coinCopper,
      coinLabel: this.adapter.formatCopper(coinCopper),
      special,
      found: materials.length > 0 || potions.length > 0 || spellScrolls.length > 0
        || coinCopper > 0 || Boolean(special.items?.length),
      awarded: false
    };
  }

  async award(result, fallbackActorUuid = null) {
    if (!result) throw new Error("No hoard result is available.");
    if (result.awarded) throw new Error("This hoard has already been awarded.");

    const fallback = fallbackActorUuid ? await fromUuid(fallbackActorUuid) : null;
    const recipient = await this.recipientResolver.resolve(fallback);
    if (!recipient) throw new Error("No valid recipient is available for the hoard.");

    const awardedItems = [];

    for (const material of result.materials ?? []) {
      const source = await this.materialRegistry.resolveItem(
        material.materialId
      );

      await this.adapter.addItemToActor(
        recipient,
        source,
        material.quantity
      );

      awardedItems.push({
        document: source,
        uuid: source.uuid,
        quantity: material.quantity,
        rarity: source.system?.rarity
      });
    }

    for (const potion of result.potions ?? []) {
      const source = await fromUuid(potion.uuid);
      if (!source) throw new Error(`Potion could not be resolved: ${potion.name}`);
      const created = await this.adapter.addItemToActor(recipient, source, 1);
      awardedItems.push({ document: created, linkUuid: potion.uuid, quantity: 1, rarity: created.system?.rarity });
    }

    for (const spell of result.spellScrolls ?? []) {
      const generated = await this.spellScrollGenerator.createScrollItem({ spellUuid: spell.uuid, level: spell.level });
      const created = await this.adapter.addItemToActor(recipient, generated.item, 1);
      awardedItems.push({ document: created, linkUuid: spell.uuid, quantity: 1, rarity: created.system?.rarity });
    }

    if (result.coinCopper > 0) {
      await this.adapter.adjustCurrencyCopper(
        recipient,
        result.coinCopper
      );
    }

    for (const specialItem of result.special?.items ?? []) {
      const item = await fromUuid(specialItem.itemUuid);

      if (!item || item.documentName !== "Item") {
        throw new Error(
          `Special treasure Item could not be resolved: ${
            specialItem.itemName ?? specialItem.itemUuid
          }`
        );
      }

      await this.adapter.addItemToActor(
        recipient,
        item,
        1
      );

      awardedItems.push({
        document: item,
        uuid: item.uuid,
        quantity: 1,
        rarity: item.system?.rarity
      });
    }

    await AwardChatCardService.post({
      recipient,
      items: awardedItems,
      coinLabel:
        result.coinCopper > 0
          ? result.coinLabel
          : null,
      title: "Treasure Hoard Received",
      subtitle: result.profileLabel ?? null
    });

    result.awarded = true;
    result.recipientUuid = recipient.uuid;
    result.recipientName = recipient.name;
    return result;
  }

  #pickPotion(pool, cr) {
    const allowed = cr >= 17
      ? ["rare", "veryRare", "legendary"]
      : cr >= 11
        ? ["uncommon", "rare", "veryRare"]
        : cr >= 5
          ? ["common", "uncommon", "rare"]
          : ["common", "uncommon"];
    const candidates = pool.filter(potion => allowed.includes(potion.rarity));
    const source = candidates.length ? candidates : pool;
    return foundry.utils.deepClone(source[Math.floor(Math.random() * source.length)]);
  }

  #pickSpellScroll(pool, cr) {
    const [min, max] = cr >= 17 ? [5, 9] : cr >= 11 ? [3, 6] : cr >= 5 ? [1, 4] : [0, 2];
    const candidates = pool.filter(spell => Number(spell.level) >= min && Number(spell.level) <= max);
    const source = candidates.length ? candidates : pool;
    return foundry.utils.deepClone(source[Math.floor(Math.random() * source.length)]);
  }
}
