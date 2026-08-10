import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getHoardProfile } from "./hoard-profiles.mjs";
import { tierForCreatureCR } from "./loot-profiles.mjs";
import { randomInt, weightedPick } from "./random-choice.mjs";

export class HoardService {
  constructor({ adapter, materialRegistry, recipientResolver, specialTreasure }) {
    this.adapter = adapter;
    this.materialRegistry = materialRegistry;
    this.recipientResolver = recipientResolver;
    this.specialTreasure = specialTreasure;
  }

  async roll(profileId) {
    const profile = getHoardProfile(profileId);

    const materialsEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_MATERIALS));
    const coinEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_COIN));
    const specialEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_SPECIAL));

    const materials = [];
    let coinCopper = 0;

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
              tableName: resolved.tableName
            });
          } else {
            failures.push(resolved?.detail ?? "No awardable Item was resolved.");
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
      coinCopper,
      coinLabel: this.adapter.formatCopper(coinCopper),
      special,
      found: materials.length > 0 || coinCopper > 0 || Boolean(special.items?.length),
      awarded: false
    };
  }

  async award(result, fallbackActorUuid = null) {
    if (!result) throw new Error("No hoard result is available.");
    if (result.awarded) throw new Error("This hoard has already been awarded.");

    const fallback = fallbackActorUuid ? await fromUuid(fallbackActorUuid) : null;
    const recipient = await this.recipientResolver.resolve(fallback);
    if (!recipient) throw new Error("No valid recipient is available for the hoard.");

    for (const material of result.materials ?? []) {
      const source = await this.materialRegistry.resolveItem(material.materialId);
      await this.adapter.addItemToActor(recipient, source, material.quantity);
    }

    if (result.coinCopper > 0) {
      await this.adapter.adjustCurrencyCopper(recipient, result.coinCopper);
    }

    for (const specialItem of result.special?.items ?? []) {
      const item = await fromUuid(specialItem.itemUuid);
      if (!item || item.documentName !== "Item") {
        throw new Error(`Special treasure Item could not be resolved: ${specialItem.itemName ?? specialItem.itemUuid}`);
      }
      await this.adapter.addItemToActor(recipient, item, 1);
    }

    result.awarded = true;
    result.recipientUuid = recipient.uuid;
    result.recipientName = recipient.name;
    return result;
  }
}
