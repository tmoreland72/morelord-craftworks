import { weightedPick } from "./random-choice.mjs";

/**
 * Special treasure is intentionally self-contained.
 *
 * It never requires add-on RollTables. Eligible magic items come only from
 * visible Item compendiums enabled by D&D5e Configure Sources.
 */

const RARITY_PROFILES_BY_CR = [
  {
    minCR: 0,
    maxCR: 4,
    rarities: [
      { rarity: "common", weight: 70 },
      { rarity: "uncommon", weight: 30 }
    ]
  },
  {
    minCR: 5,
    maxCR: 10,
    rarities: [
      { rarity: "common", weight: 10 },
      { rarity: "uncommon", weight: 55 },
      { rarity: "rare", weight: 35 }
    ]
  },
  {
    minCR: 11,
    maxCR: 16,
    rarities: [
      { rarity: "uncommon", weight: 15 },
      { rarity: "rare", weight: 55 },
      { rarity: "very rare", weight: 30 }
    ]
  },
  {
    minCR: 17,
    maxCR: Infinity,
    rarities: [
      { rarity: "rare", weight: 15 },
      { rarity: "very rare", weight: 50 },
      { rarity: "legendary", weight: 35 }
    ]
  }
];

const RARITY_ORDER = [
  "common",
  "uncommon",
  "rare",
  "very rare",
  "legendary"
];

export class SpecialTreasureService {
  constructor({ sourceFilter = null } = {}) {
    this.sourceFilter = sourceFilter;
    this._itemPool = null;
    this._sourceSignature = null;
  }

  async rollForEncounter(maxCR) {
    const pool = await this.#getItemPool();

    if (!pool.length) {
      return {
        status: "missing-source",
        itemUuid: null,
        itemName: null,
        itemImg: null,
        sourceLabel: null,
        tableName: null,
        detail:
          "No eligible magic items were found in the world or the D&D5e system compendiums."
      };
    }

    const profile = this.#profileForCR(maxCR);
    const availableRarities = new Set(pool.map(entry => entry.rarity));

    const weightedRarities = profile.rarities.filter(entry =>
      availableRarities.has(entry.rarity)
    );

    let targetRarity = weightedPick(weightedRarities)?.rarity ?? null;

    if (!targetRarity) {
      targetRarity = this.#nearestAvailableRarity(
        profile.rarities.map(entry => entry.rarity),
        [...availableRarities]
      );
    }

    const candidates = pool.filter(entry => entry.rarity === targetRarity);
    const itemRef = candidates[
      Math.floor(Math.random() * candidates.length)
    ] ?? pool[Math.floor(Math.random() * pool.length)];

    if (!itemRef) {
      return {
        status: "unresolved-result",
        itemUuid: null,
        itemName: null,
        itemImg: null,
        sourceLabel: null,
        tableName: null,
        detail: "No eligible magic item could be selected."
      };
    }

    let item = null;
    try {
      item = itemRef.uuid.startsWith("Item.")
        ? game.items.get(itemRef.id)
        : await fromUuid(itemRef.uuid);
    } catch {
      item = null;
    }

    if (!item || item.documentName !== "Item") {
      this._itemPool = null;
      return {
        status: "unresolved-result",
        itemUuid: null,
        itemName: itemRef.name,
        itemImg: itemRef.img,
        sourceLabel: itemRef.sourceLabel,
        tableName: null,
        detail: `${itemRef.name} could not be resolved to an Item document.`
      };
    }

    return {
      status: "item",
      itemUuid: item.uuid,
      itemName: item.name,
      itemImg: item.img ?? "",
      sourceLabel: itemRef.sourceLabel,
      rarity: itemRef.rarity,
      tableName: null,
      detail: null
    };
  }

  async sourceStatus() {
    const pool = await this.#getItemPool();
    const counts = Object.fromEntries(
      RARITY_ORDER.map(rarity => [
        rarity,
        pool.filter(entry => entry.rarity === rarity).length
      ])
    );

    return {
      total: pool.length,
      counts
    };
  }

  #profileForCR(cr) {
    const value = Math.max(0, Number(cr ?? 0));
    return RARITY_PROFILES_BY_CR.find(
      profile => value >= profile.minCR && value <= profile.maxCR
    ) ?? RARITY_PROFILES_BY_CR[0];
  }

  async #getItemPool() {
    const sourceSignature = JSON.stringify(this.sourceFilter?.configuration ?? {});
    if (!this._itemPool || this._sourceSignature !== sourceSignature) {
      this._itemPool = await this.#buildItemPool();
      this._sourceSignature = sourceSignature;
    }
    return this._itemPool;
  }

  async #buildItemPool() {
    const entries = [];
    const seen = new Set();

    const eligiblePacks = Array.from(game.packs ?? [])
      .filter(pack => pack.documentName === "Item")
      .filter(pack => pack.visible !== false)
      .filter(pack => this.sourceFilter?.isPackEnabled(pack) ?? true);

    for (const pack of eligiblePacks) {
      try {
        const index = await pack.getIndex({
          fields: [
            "name",
            "img",
            "type",
            "system.rarity",
            "system.source.book",
            "system.source.custom",
            "flags.morelord-craftworks.materialId"
          ]
        });

        for (const row of index) {
          if (row.flags?.["morelord-craftworks"]?.materialId) continue;

          const rarity = this.#normalizeRarity(row.system?.rarity);
          if (!rarity) continue;

          const key = this.#key(row.name, rarity);
          if (seen.has(key)) continue;
          seen.add(key);

          entries.push({
            id: row._id,
            uuid: `Compendium.${pack.collection}.Item.${row._id}`,
            name: row.name,
            img: row.img ?? "",
            rarity,
            sourceLabel: this.sourceFilter
              ?.sourceLabelForItem(row, { pack })
              ?? "Unknown Source"
          });
        }
      } catch (error) {
        console.warn(
          `Morelord Craftworks | Unable to index system Item pack ${pack.collection} for special treasure.`,
          error
        );
      }
    }

    return entries;
  }

  #isEligibleItem(item) {
    if (!item || item.documentName !== "Item") return false;
    if (item.getFlag?.("morelord-craftworks", "materialId")) return false;
    return Boolean(this.#normalizeRarity(item.system?.rarity));
  }

  #normalizeRarity(value) {
    const raw = String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

    const aliases = {
      common: "common",
      uncommon: "uncommon",
      rare: "rare",
      "very rare": "very rare",
      veryrare: "very rare",
      legendary: "legendary"
    };

    return aliases[raw] ?? null;
  }

  #nearestAvailableRarity(preferred, available) {
    if (!available.length) return null;

    for (const rarity of preferred) {
      if (available.includes(rarity)) return rarity;
    }

    const preferredIndexes = preferred
      .map(rarity => RARITY_ORDER.indexOf(rarity))
      .filter(index => index >= 0);

    const center = preferredIndexes.length
      ? preferredIndexes.reduce((a, b) => a + b, 0) / preferredIndexes.length
      : 0;

    return [...available].sort((a, b) =>
      Math.abs(RARITY_ORDER.indexOf(a) - center)
      - Math.abs(RARITY_ORDER.indexOf(b) - center)
    )[0];
  }

  #key(name, rarity) {
    return `${String(name ?? "").trim().toLowerCase()}::${rarity}`;
  }
}
