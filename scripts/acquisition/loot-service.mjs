import { AwardChatCardService } from "../core/award-chat-card-service.mjs";
import { MODULE_ID } from "../constants.mjs";
import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getEncounterLootProfile } from "./encounter-loot-profiles.mjs";
import { randomInt, weightedPick } from "./random-choice.mjs";
import { tierForCreatureCR } from "./loot-profiles.mjs";

const LOOT_FLAG = "lootResolved";
const MAGIC_LOOT_CHANCE = 25;
const POTION_SHARE = 60;

export class LootService {
  constructor({
    adapter,
    materialRegistry,
    materialService,
    sessions,
    recipientResolver,
    specialTreasure,
    contentPacks = null,
    potionGenerator = null,
    spellScrollGenerator = null
  }) {
    this.adapter = adapter;
    this.materialRegistry = materialRegistry;
    this.materialService = materialService;
    this.sessions = sessions;
    this.recipientResolver = recipientResolver;
    this.specialTreasure = specialTreasure;
    this.contentPacks = contentPacks;
    this.potionGenerator = potionGenerator;
    this.spellScrollGenerator = spellScrollGenerator;
  }

  getDeadCreatureSummary() {
    return this.adapter.getDeadCreatureTokens().map(token => ({
      tokenUuid: token.document.uuid,
      name: token.name,
      img: token.document.texture?.src ?? token.actor?.img,
      cr: this.adapter.getCreatureCR(token.actor)
    }));
  }

  async isLootResolved(tokenUuid) {
    const token = await fromUuid(tokenUuid);
    return Boolean(token?.getFlag(MODULE_ID, LOOT_FLAG));
  }

  async resetSceneLooting() {
    const tokens = this.adapter.getDeadCreatureTokens();
    await Promise.all(tokens.map(token => token.document.unsetFlag(MODULE_ID, LOOT_FLAG)));
    return tokens.length;
  }

  async reroll(sessionId) {
    const session = this.#requireOpen(sessionId);
    if (session.result?.awarded) throw new Error("Awarded encounter loot cannot be rerolled.");

    await Promise.all(session.creatures.map(async creature => {
      const token = await fromUuid(creature.tokenUuid);
      await token?.unsetFlag(MODULE_ID, LOOT_FLAG);
    }));

    session.result = null;
    return this.roll(sessionId);
  }

  async start({ creatureContexts = null } = {}) {
    const allCreatures = Array.isArray(creatureContexts)
      ? foundry.utils.deepClone(creatureContexts)
      : this.getDeadCreatureSummary();
    if (!allCreatures.length) throw new Error("No dead creatures were found on the current scene.");

    const creatures = [];
    for (const creature of allCreatures) {
      if (!(await this.isLootResolved(creature.tokenUuid))) creatures.push(creature);
    }

    if (!creatures.length) {
      throw new Error("All dead creatures on the current scene have already had their encounter loot resolved.");
    }

    return this.sessions.create({
      type: "loot",
      creatures,
      result: null
    });
  }

  async roll(sessionId) {
    const session = this.#requireOpen(sessionId);
    if (session.result) throw new Error("This encounter loot has already been rolled.");

    const materialsEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_MATERIALS));
    const coinEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_COIN));
    const specialEnabled = Boolean(getSetting(SETTINGS.LOOT_ENABLE_SPECIAL));

    const materials = [];
    const potions = [];
    const spellScrolls = [];
    const coins = { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
    const rolls = [];
    const potionPool = await this.potionGenerator?.availablePotions?.() ?? [];
    const spellPool = await this.spellScrollGenerator?.availableSpells?.() ?? [];

    let maxCR = 0;

    for (const creature of session.creatures) {
      const cr = Number(creature.cr ?? 0);
      maxCR = Math.max(maxCR, cr);

      const activePackIds = this.#activeLootPackIds();
      const encounterProfile = getEncounterLootProfile(cr, { activePackIds });
      const materialTier = tierForCreatureCR(cr, { activePackIds });

      if (!encounterProfile) {
        throw new Error(
          "No active Craftworks Content Pack provides Encounter Loot rules for this creature."
        );
      }

      const materialChance = this.#clampChance(
        encounterProfile.materialChance
          + Number(getSetting(SETTINGS.LOOT_MATERIAL_CHANCE_MODIFIER) ?? 0)
      );
      const coinChance = this.#clampChance(
        encounterProfile.coinChance
          + Number(getSetting(SETTINGS.LOOT_COIN_CHANCE_MODIFIER) ?? 0)
      );

      const materialRoll = materialsEnabled ? randomInt(1, 100) : null;
      const coinRoll = coinEnabled ? randomInt(1, 100) : null;
      const hasMagicLoot = potionPool.length || spellPool.length;
      const magicLootRoll = hasMagicLoot ? randomInt(1, 100) : null;
      const magicLootTypeRoll = magicLootRoll != null && magicLootRoll <= MAGIC_LOOT_CHANCE
        ? randomInt(1, 100)
        : null;
      const potionChance = potionPool.length
        ? (spellPool.length ? MAGIC_LOOT_CHANCE * POTION_SHARE / 100 : MAGIC_LOOT_CHANCE)
        : 0;
      const spellScrollChance = spellPool.length
        ? (potionPool.length ? MAGIC_LOOT_CHANCE - potionChance : MAGIC_LOOT_CHANCE)
        : 0;

      const entry = {
        tokenUuid: creature.tokenUuid,
        creature: creature.name,
        cr,
        materialsEnabled,
        materialChance,
        materialRoll,
        coinEnabled,
        coinChance,
        coinRoll,
        potionChance,
        potionRoll: magicLootRoll,
        spellScrollChance,
        spellScrollRoll: magicLootRoll,
        material: null,
        coin: null,
        potion: null,
        spellScroll: null
      };

      // Materials: most common outcome.
      if (materialsEnabled && materialRoll <= materialChance) {
        const candidates = (materialTier?.results ?? [])
          .filter(result => this.materialRegistry.get(result.materialId));
        const picked = weightedPick(candidates);

        if (picked) {
          const material = this.materialRegistry.get(picked.materialId);
          const baseQuantity = randomInt(picked.min, picked.max);
          const quantityMultiplier = Math.max(
            0.25,
            Number(getSetting(SETTINGS.LOOT_MATERIAL_QUANTITY_MULTIPLIER) ?? 1)
          );
          const quantity = Math.max(1, Math.round(baseQuantity * quantityMultiplier));

          entry.material = {
            materialId: picked.materialId,
            name: material?.name ?? picked.materialId,
            img: material?.img ?? "",
            uuid: material?.uuid ?? null,
            quantity
          };

          const existing = materials.find(result => result.materialId === picked.materialId);
          if (existing) existing.quantity += quantity;
          else materials.push(foundry.utils.deepClone(entry.material));
        }
      }

      // Coin: less common than materials.
      if (coinEnabled && coinRoll <= coinChance) {
        const copper = this.#rollCoinCopper(encounterProfile.coin);
        entry.coin = {
          copper,
          label: this.adapter.formatCopper(copper)
        };
        this.#addCopperToCurrency(coins, copper);
      }

      if (magicLootTypeRoll != null) {
        const choosePotion = potionPool.length && (
          !spellPool.length || magicLootTypeRoll <= POTION_SHARE
        );
        if (choosePotion) {
          entry.potion = this.#pickPotion(potionPool, cr);
          if (entry.potion) potions.push(foundry.utils.deepClone(entry.potion));
        } else {
          entry.spellScroll = this.#pickSpellScroll(spellPool, cr);
          if (entry.spellScroll) spellScrolls.push(foundry.utils.deepClone(entry.spellScroll));
        }
      }

      rolls.push(entry);

      // Persist the per-corpse result so reopening Loot cannot farm it.
      const token = await fromUuid(creature.tokenUuid);
      if (token) {
        await token.setFlag(MODULE_ID, LOOT_FLAG, {
          resolvedAt: Date.now(),
          material: entry.material,
          coin: entry.coin,
          potion: entry.potion,
          spellScroll: entry.spellScroll
        });
      }
    }

    // Special treasure: only once for the entire encounter.
    const specialProfile = getEncounterLootProfile(maxCR, {
      activePackIds: this.#activeLootPackIds()
    });

    if (!specialProfile) {
      throw new Error(
        "No active Craftworks Content Pack provides Encounter Loot rules for this encounter."
      );
    }

    const specialChance = this.#clampChance(
      specialProfile.specialChance
        + Number(getSetting(SETTINGS.LOOT_SPECIAL_CHANCE_MODIFIER) ?? 0)
    );
    const specialRoll = specialEnabled ? randomInt(1, 100) : null;
    const special = {
      enabled: specialEnabled,
      roll: specialRoll,
      chance: specialChance,
      triggered: specialEnabled && specialRoll <= specialChance,
      status: specialEnabled ? "none" : "disabled",
      label: null
    };

    if (special.triggered) {
      const treasure = await this.specialTreasure.rollForEncounter(maxCR);
      Object.assign(special, treasure);
      special.label = treasure.itemName ?? "Special treasure opportunity";
    }

    const totalCopper = this.#currencyToCopper(coins);

    session.result = {
      channels: {
        materials: materialsEnabled,
        coin: coinEnabled,
        special: specialEnabled
      },
      found: materials.length > 0 || potions.length > 0 || spellScrolls.length > 0
        || totalCopper > 0 || Boolean(special.itemUuid),
      materials,
      potions,
      spellScrolls,
      coins,
      coinTotalCopper: totalCopper,
      coinLabel: this.adapter.formatCopper(totalCopper),
      rolls,
      special,
      awarded: false
    };

    return session.result;
  }

  async award(sessionId, fallbackActorUuid = null) {
    const session = this.#requireOpen(sessionId);
    const result = session.result;
    if (!result) throw new Error("Encounter loot has not been rolled.");
    if (result.awarded) throw new Error("The encounter loot has already been awarded.");

    const fallback = fallbackActorUuid ? await fromUuid(fallbackActorUuid) : null;
    const recipient = await this.recipientResolver.resolve(fallback);

    if (!recipient) {
      throw new Error("No valid recipient is available for encounter loot.");
    }

    const awardedItems = [];

    for (const material of result.materials) {
      // Award directly to resolved recipient so we do not resolve Party twice.
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
      const generated = await this.spellScrollGenerator.createScrollItem({
        spellUuid: spell.uuid,
        level: spell.level
      });
      const created = await this.adapter.addItemToActor(recipient, generated.item, 1);
      awardedItems.push({ document: created, linkUuid: spell.uuid, quantity: 1, rarity: created.system?.rarity });
    }

    for (const added of result.customItems ?? []) {
      const source = await fromUuid(added.uuid);
      if (!source || source.documentName !== "Item") throw new Error(`Added Item could not be resolved: ${added.name}`);
      const created = await this.adapter.addItemToActor(recipient, source, Number(added.quantity ?? 1));
      awardedItems.push({ document: created, linkUuid: added.uuid, quantity: Number(added.quantity ?? 1), rarity: created.system?.rarity });
    }

    if (result.coinTotalCopper > 0) {
      await this.adapter.adjustCurrencyCopper(
        recipient,
        result.coinTotalCopper
      );
    }

    if (result.special?.itemUuid) {
      const specialItem = await fromUuid(
        result.special.itemUuid
      );

      if (!specialItem || specialItem.documentName !== "Item") {
        throw new Error(
          `Special treasure Item could not be resolved: ${
            result.special.itemName ?? result.special.itemUuid
          }`
        );
      }

      await this.adapter.addItemToActor(
        recipient,
        specialItem,
        1
      );

      awardedItems.push({
        document: specialItem,
        uuid: specialItem.uuid,
        quantity: 1,
        rarity: specialItem.system?.rarity
      });
    }

    await AwardChatCardService.post({
      recipient,
      items: awardedItems,
      coinLabel:
        result.coinTotalCopper > 0
          ? result.coinLabel
          : null,
      title: "Encounter Loot Received"
    });

    result.awarded = true;
    result.recipientUuid = recipient.uuid;
    result.recipientName = recipient.name;
    return result;
  }

  finalize(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Loot session not found.");
    session.status = "complete";
    session.completedAt = Date.now();
    return session;
  }

  #activeLootPackIds() {
    return this.contentPacks
      ?.enabled({ capability: "loot" })
      .map(pack => pack.id)
      ?? null;
  }

  #clampChance(value) {
    return Math.max(0, Math.min(100, Number(value ?? 0)));
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
    return source.length
      ? foundry.utils.deepClone(source[Math.floor(Math.random() * source.length)])
      : null;
  }

  #pickSpellScroll(pool, cr) {
    const [min, max] = cr >= 17 ? [5, 9] : cr >= 11 ? [3, 6] : cr >= 5 ? [1, 4] : [0, 2];
    const candidates = pool.filter(spell => Number(spell.level) >= min && Number(spell.level) <= max);
    const source = candidates.length ? candidates : pool;
    return source.length
      ? foundry.utils.deepClone(source[Math.floor(Math.random() * source.length)])
      : null;
  }

  #rollCoinCopper({ minGp, maxGp }) {
    const multiplier = Math.max(
      0,
      Number(getSetting(SETTINGS.LOOT_COIN_MULTIPLIER) ?? 1)
    );

    const minCopper = Math.max(0, Math.round(Number(minGp ?? 0) * 100 * multiplier));
    const maxCopper = Math.max(
      minCopper,
      Math.round(Number(maxGp ?? minGp ?? 0) * 100 * multiplier)
    );

    if (maxCopper <= 0) return 0;
    return randomInt(minCopper, maxCopper);
  }

  #addCopperToCurrency(currency, copper) {
    // Preserve a readable mixed-denomination display while maintaining exact value.
    let remaining = Math.max(0, Math.round(copper));
    const denominations = [
      ["pp", 1000],
      ["gp", 100],
      ["ep", 50],
      ["sp", 10],
      ["cp", 1]
    ];

    for (const [denom, value] of denominations) {
      const amount = Math.floor(remaining / value);
      currency[denom] += amount;
      remaining %= value;
    }
  }

  #currencyToCopper(currency) {
    return Number(currency.pp ?? 0) * 1000
      + Number(currency.gp ?? 0) * 100
      + Number(currency.ep ?? 0) * 50
      + Number(currency.sp ?? 0) * 10
      + Number(currency.cp ?? 0);
  }

  #requireOpen(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Loot session not found.");
    if (session.status !== "open") throw new Error("This loot session is no longer open.");
    return session;
  }
}
