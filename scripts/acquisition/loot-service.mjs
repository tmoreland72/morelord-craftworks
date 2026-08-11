import { AwardChatCardService } from "../core/award-chat-card-service.mjs";
import { MODULE_ID } from "../constants.mjs";
import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getEncounterLootProfile } from "./encounter-loot-profiles.mjs";
import { randomInt, weightedPick } from "./random-choice.mjs";
import { tierForCreatureCR } from "./loot-profiles.mjs";

const LOOT_FLAG = "lootResolved";

export class LootService {
  constructor({
    adapter,
    materialRegistry,
    materialService,
    sessions,
    recipientResolver,
    specialTreasure,
    contentPacks = null
  }) {
    this.adapter = adapter;
    this.materialRegistry = materialRegistry;
    this.materialService = materialService;
    this.sessions = sessions;
    this.recipientResolver = recipientResolver;
    this.specialTreasure = specialTreasure;
    this.contentPacks = contentPacks;
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

  async start() {
    const allCreatures = this.getDeadCreatureSummary();
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
    const coins = { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
    const rolls = [];

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
        material: null,
        coin: null
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

      rolls.push(entry);

      // Persist the per-corpse result so reopening Loot cannot farm it.
      const token = await fromUuid(creature.tokenUuid);
      if (token) {
        await token.setFlag(MODULE_ID, LOOT_FLAG, {
          resolvedAt: Date.now(),
          material: entry.material,
          coin: entry.coin
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
      found: materials.length > 0 || totalCopper > 0 || Boolean(special.itemUuid),
      materials,
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
