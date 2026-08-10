import { weightedPick } from "./random-choice.mjs";

const TABLE_PREFIX = "Magic Item Table ";
const MAX_NESTED_DRAWS = 5;

/**
 * Craftworks-owned weighting for selecting among source-backed Magic Item Tables.
 * This is not a reproduction of DMG treasure-hoard ranges.
 */
const TABLE_WEIGHTS_BY_CR = [
  {
    minCR: 0,
    maxCR: 4,
    tables: [
      { letter: "A", weight: 70 },
      { letter: "B", weight: 25 },
      { letter: "C", weight: 5 }
    ]
  },
  {
    minCR: 5,
    maxCR: 10,
    tables: [
      { letter: "A", weight: 20 },
      { letter: "B", weight: 30 },
      { letter: "C", weight: 30 },
      { letter: "D", weight: 15 },
      { letter: "E", weight: 5 }
    ]
  },
  {
    minCR: 11,
    maxCR: 16,
    tables: [
      { letter: "C", weight: 10 },
      { letter: "D", weight: 25 },
      { letter: "E", weight: 30 },
      { letter: "F", weight: 25 },
      { letter: "G", weight: 10 }
    ]
  },
  {
    minCR: 17,
    maxCR: Infinity,
    tables: [
      { letter: "E", weight: 5 },
      { letter: "F", weight: 15 },
      { letter: "G", weight: 25 },
      { letter: "H", weight: 30 },
      { letter: "I", weight: 25 }
    ]
  }
];

export class SpecialTreasureService {
  constructor() {
    this._tableCache = new Map();
  }

  async rollForEncounter(maxCR) {
    const profile = this.#profileForCR(maxCR);
    const candidates = [];

    for (const entry of profile.tables) {
      const table = await this.findMagicItemTable(entry.letter);
      if (table) candidates.push({ ...entry, table });
    }

    if (!candidates.length) {
      return {
        status: "missing-source",
        itemUuid: null,
        itemName: null,
        itemImg: null,
        tableName: null,
        detail: "No usable Magic Item Table A-I RollTables were found in the world or installed RollTable compendiums."
      };
    }

    const chosen = weightedPick(candidates);
    const resolved = await this.#drawUntilItem(chosen.table, 0);

    if (!resolved?.item) {
      return {
        status: "unresolved-result",
        itemUuid: null,
        itemName: null,
        itemImg: null,
        tableName: chosen.table.name,
        detail: resolved?.detail ?? "The selected treasure table did not resolve to an Item document."
      };
    }

    return {
      status: "item",
      itemUuid: resolved.item.uuid,
      itemName: resolved.item.name,
      itemImg: resolved.item.img ?? "",
      tableName: resolved.sourceTableName ?? chosen.table.name,
      detail: null
    };
  }

  async findMagicItemTable(letter) {
    const normalizedLetter = String(letter ?? "").trim().toUpperCase();
    if (!/^[A-I]$/.test(normalizedLetter)) return null;

    if (this._tableCache.has(normalizedLetter)) {
      return this._tableCache.get(normalizedLetter);
    }

    const promise = this.#findTableByName(`${TABLE_PREFIX}${normalizedLetter}`);
    this._tableCache.set(normalizedLetter, promise);
    return promise;
  }

  async sourceStatus() {
    const found = [];
    for (const letter of "ABCDEFGHI") {
      const table = await this.findMagicItemTable(letter);
      if (table) found.push({ letter, name: table.name, uuid: table.uuid });
    }
    return found;
  }

  #profileForCR(cr) {
    const value = Math.max(0, Number(cr ?? 0));
    return TABLE_WEIGHTS_BY_CR.find(p => value >= p.minCR && value <= p.maxCR)
      ?? TABLE_WEIGHTS_BY_CR[0];
  }

  async #findTableByName(name) {
    const normalize = value => String(value ?? "").trim().toLowerCase();
    const target = normalize(name);

    const world = game.tables?.find(table => normalize(table.name) === target);
    if (world) return world;

    const packs = game.packs?.filter(pack =>
      pack.documentName === "RollTable"
      || pack.metadata?.type === "RollTable"
    ) ?? [];

    for (const pack of packs) {
      try {
        const index = await pack.getIndex({ fields: ["name"] });
        const match = index.find(entry => normalize(entry.name) === target);
        if (match) return await pack.getDocument(match._id);
      } catch (err) {
        console.warn(`Morelord Craftworks | Unable to inspect RollTable pack ${pack.collection}.`, err);
      }
    }

    return null;
  }

  async #drawUntilItem(table, depth) {
    if (!table || depth > MAX_NESTED_DRAWS) {
      return { item: null, detail: "Treasure table nesting exceeded the supported depth." };
    }

    const draw = await table.draw({ displayChat: false });
    const result = draw?.results?.[0] ?? null;

    if (!result) {
      return { item: null, detail: `${table.name} produced no result.` };
    }

    const document = await this.#resolveResultDocument(result);

    if (document?.documentName === "Item") {
      return {
        item: document,
        sourceTableName: table.name
      };
    }

    if (document?.documentName === "RollTable") {
      const nested = await this.#drawUntilItem(document, depth + 1);
      return {
        ...nested,
        sourceTableName: nested.sourceTableName ?? document.name
      };
    }

    const uuid = this.#extractUuid(result);
    if (uuid) {
      try {
        const resolved = await fromUuid(uuid);
        if (resolved?.documentName === "Item") {
          return { item: resolved, sourceTableName: table.name };
        }
        if (resolved?.documentName === "RollTable") {
          return this.#drawUntilItem(resolved, depth + 1);
        }
      } catch {
        // Fall through to a clear unresolved result.
      }
    }

    return {
      item: null,
      detail: this.#plainResultText(result)
        || `${table.name} produced a result that is not an Item or nested RollTable.`
    };
  }

  async #resolveResultDocument(result) {
    try {
      if (typeof result?.getDocument === "function") {
        const doc = await result.getDocument();
        if (doc) return doc;
      }
    } catch {
      // Continue through the v14 UUID fallback.
    }

    const uuid = result?.uuid;
    if (!uuid) return null;

    try {
      const resolved = await fromUuid(uuid);
      if (resolved?.documentName === "Item" || resolved?.documentName === "RollTable") {
        return resolved;
      }
    } catch {
      // The result may still be plain text with an embedded document link.
    }

    return null;
  }

  #extractUuid(result) {
    const text = String(result?.text ?? "");
    const uuidMatch = text.match(/@UUID\[([^\]]+)\]/i);
    if (uuidMatch) return uuidMatch[1];

    const compendiumMatch = text.match(/@Compendium\[([^\]]+)\]/i);
    if (compendiumMatch) {
      const raw = compendiumMatch[1];
      if (raw.startsWith("Compendium.")) return raw;
      return `Compendium.${raw}`;
    }

    return null;
  }

  #plainResultText(result) {
    const raw = String(result?.text ?? "").trim();
    if (!raw) return null;

    const div = document.createElement("div");
    div.innerHTML = raw;
    return div.textContent?.trim() || raw;
  }
}
