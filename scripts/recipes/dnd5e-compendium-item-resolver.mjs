import { itemRarity } from "../../../morelord-core/scripts/services/item-rarity.js";

// Explicit Kibbles labels whose compendium title was confirmed in an indexed
// pack. Keys are the punctuation-insensitive form used by normalizeName.
const EXPLICIT_ITEM_ALIASES = new Map([
  ["blacksmithstools", ["Smith's Tools"]],
  ["robeofthearchmage", ["Robe of the Archmagi"]],
  ["dimensionshackles", ["Dimensional Shackles"]],
  ["luckstone", ["Stone of Good Luck (Luckstone)"]],
  ["flametongueweapon", ["Flame Tongue"]],
  ["flametongue", ["Flame Tongue"]],
  ["glassvial", ["Vial"]],
  ["splint", ["Splint Armor"]],
  ["piton", ["Spikes, Iron"]],
  ["pitons", ["Piton", "Spikes, Iron"]],
  // DMG equipment has one Rod of the Pact Keeper document for every bonus.
  ["rodofthepactkeeper3", ["Rod of the Pact Keeper"]]
]);

const BONUS_ITEM = /^(weapon|armor|shield|ammunition)$/i;

function ordinalSpellLevel(level) {
  const value = Number(level);
  const teen = value % 100;
  const suffix = teen >= 11 && teen <= 13
    ? "th"
    : { 1: "st", 2: "nd", 3: "rd" }[value % 10] ?? "th";
  return `${value}${suffix}`;
}

function addNearMissCandidates(form, add) {
  if (form.includes("/")) {
    for (const part of form.split("/")) add(part);
  }

  if (/\sof\s+(?!the\b)/i.test(form)) {
    add(form.replace(/\sof\s+/i, " of the "));
  }

  const words = form.split(/\s+/).filter(Boolean);
  const last = words.at(-1) ?? "";
  if (/[^s]s$/i.test(last) && last.length > 3) {
    add([...words.slice(0, -1), last.slice(0, -1)].join(" "));
  } else if (last && !/s$/i.test(last)) {
    add([...words.slice(0, -1), `${last}s`].join(" "));
  }

  if (/tools$/i.test(form)) add(form.replace(/tools$/i, "Supplies"));
  if (/supplies$/i.test(form)) add(form.replace(/supplies$/i, "Tools"));

  const possessive = form.match(/^(\S+)\s+(.+)$/);
  if (possessive && !/'s$/i.test(possessive[1])) {
    add(`${possessive[1]}'s ${possessive[2]}`);
  }

  const comma = form.match(/^([^,]+),\s*(.+)$/);
  if (comma) add(`${comma[2]} ${comma[1]}`);

  const parenthetical = form.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (parenthetical) {
    const stem = parenthetical[1].trim();
    const inner = parenthetical[2].trim();
    add(`${inner} ${stem}`);
    add(`${stem} of ${inner}`);
    // Length, size, and variant notes ("Chain (5 ft)", "Ballista (Large)",
    // "Figurine of Wondrous Power (Ivory Goats)") keep the specific reorderings
    // above, then try the stem when that exact title exists.
    add(stem);
  }

  if (/archmage/i.test(form)) add(form.replace(/archmage/ig, "Archmagi"));
  if (/oynx/i.test(form)) add(form.replace(/oynx/ig, "Onyx"));
  if (/amplying/i.test(form)) add(form.replace(/amplying/ig, "Amplifying"));

  const leadingBonus = form.match(/^\+(\d+)\s+(.+)$/);
  const trailingBonus = form.match(/^(.+?)\s+\+(\d+)$/);
  const bonus = leadingBonus
    ? { kind: leadingBonus[2], value: leadingBonus[1] }
    : trailingBonus
      ? { kind: trailingBonus[1], value: trailingBonus[2] }
      : null;
  if (bonus && BONUS_ITEM.test(bonus.kind)) {
    add(`${bonus.kind}, +1, +2, or +3`);
    add(`${bonus.kind} +${bonus.value}`);
  }

  const aliasKey = form
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  add(...(EXPLICIT_ITEM_ALIASES.get(aliasKey) ?? []));
}

const DND5E_ITEM_PACKS = Object.freeze({
  "SRD 5.2": [
    "dnd5e.equipment24"
  ],
  "SRD 5.1": [
    "dnd5e.items",
    "dnd5e.tradegoods"
  ],
  "Player's Handbook": [
    "dnd-players-handbook.equipment"
  ],
  "Dungeon Master's Guide": [
    "dnd-dungeon-masters-guide.equipment"
  ],
  "Monsters of Drakkenheim": [
    "drakkenheim-monsters.items",
    "drakkenheim-core.items",
    "drakkenheim-scgd.items"
  ]
});

export class Dnd5eCompendiumItemResolver {
  constructor({ sourceFilter = null } = {}) {
    this.sourceFilter = sourceFilter;
    this._bySourceBook = new Map();
    this._indexedPacks = new Map();
  }

  async refresh() {
    this._bySourceBook.clear();
    this._indexedPacks.clear();

    for (const [sourceBook, source] of Object.entries(DND5E_ITEM_PACKS)) {
      const byName = new Map();
      const indexed = [];

      const collections = Array.isArray(source)
        ? source
        : game.packs
            .filter(pack =>
              pack.documentName === "Item"
              && (
                pack.metadata?.packageName === source.packageId
                || pack.collection.startsWith(`${source.packageId}.`)
              )
            )
            .map(pack => pack.collection);

      for (const collection of collections) {
        const pack = game.packs.get(collection);
        if (!pack || pack.documentName !== "Item") continue;
        if (this.sourceFilter && !this.sourceFilter.isPackEnabled(pack)) continue;

        let index;
        try {
          index = await pack.getIndex({
            fields: ["name", "img", "type", "system.rarity", "system.rarities"]
          });
        } catch (error) {
          console.warn(
            `Morelord Craftworks | Unable to index ${sourceBook} Item pack ${collection}.`,
            error
          );
          continue;
        }

        indexed.push(collection);

        for (const entry of index) {
          const normalizedName = this.normalizeName(entry.name);
          if (!normalizedName || byName.has(normalizedName)) continue;

          byName.set(normalizedName, {
            uuid: `Compendium.${collection}.Item.${entry._id}`,
            id: entry._id,
            name: entry.name,
            img: entry.img ?? "",
            type: entry.type ?? null,
            rarity: itemRarity(entry.system) ?? null,
            packId: collection,
            sourceBook
          });
        }
      }

      this._bySourceBook.set(sourceBook, byName);
      this._indexedPacks.set(sourceBook, indexed);

    }

    return Array.from(this._bySourceBook.values())
      .reduce((sum, map) => sum + map.size, 0);
  }

  async resolve(name, { sourceBook } = {}) {
    if (!sourceBook) {
      throw new Error("D&D5e Item resolution requires an explicit sourceBook.");
    }

    if (!this._bySourceBook.size) {
      await this.refresh();
    }

    const sourceIndex = this._bySourceBook.get(sourceBook);
    if (!sourceIndex) return null;

    for (const candidate of this.candidateNames(name)) {
      const key = this.normalizeName(candidate);
      if (!key) continue;

      const match = sourceIndex.get(key);
      if (
        match
        && (
          !this.sourceFilter
          || this.sourceFilter.isPackEnabled(match.packId)
        )
      ) return match;
    }

    return null;
  }

  async resolveAny(name, { preferredSourceBook = null } = {}) {
    if (!this._bySourceBook.size) {
      await this.refresh();
    }

    const sourceBooks = [
      preferredSourceBook,
      ...this._bySourceBook.keys()
    ].filter((sourceBook, index, values) =>
      sourceBook && values.indexOf(sourceBook) === index
    );

    for (const sourceBook of sourceBooks) {
      const match = await this.resolve(name, { sourceBook });
      if (match) return match;
    }

    return null;
  }

  async resolveDocument(name, { sourceBook } = {}) {
    const match = await this.resolve(name, { sourceBook });
    if (!match?.uuid) return null;

    try {
      const document = await fromUuid(match.uuid);
      return document?.documentName === "Item" ? document : null;
    } catch (error) {
      console.warn(
        `Morelord Craftworks | Unable to resolve ${sourceBook} Item ${match.uuid}.`,
        error
      );
      return null;
    }
  }

  packsFor(sourceBook) {
    return [...(this._indexedPacks.get(sourceBook) ?? [])]
      .filter(collection =>
        !this.sourceFilter
        || this.sourceFilter.isPackEnabled(collection)
      );
  }

  candidateNames(value) {
    const name = String(value ?? "").trim();
    const candidates = [name];
    const add = (...values) => {
      for (const value of values) {
        const text = String(value ?? "").trim();
        if (text) candidates.push(text);
      }
    };

    if (/^playing card set$/i.test(name)) {
      candidates.push("Playing Cards");
      candidates.push("Playing Cards Set");
      candidates.push("Gaming Set (Playing Cards)");
    }

    // SRD 5.2 uses parenthetical naming for the upgraded healing potions:
    // "Potion of Healing (Greater)" rather than Kibbles' source-table label
    // "Potion of Greater Healing". Keep the alias explicit and source-neutral;
    // the actual lookup is still constrained to the selected SRD pack.
    const healing = name.match(
      /^Potion of (Greater|Superior|Supreme) Healing$/i
    );

    if (healing) {
      const tier = healing[1];
      candidates.push(`Potion of Healing (${tier})`);
    }

    const parentheticalHealing = name.match(
      /^Potion of Healing \((Greater|Superior|Supreme)\)$/i
    );

    if (parentheticalHealing) {
      const tier = parentheticalHealing[1];
      candidates.push(`Potion of ${tier} Healing`);
    }

    // The 2024 SRD also uses parenthetical variants for some families.
    // These aliases are intentionally narrow rather than fuzzy matching.
    const kibblesScrollTier = name.match(
      /^(Cantrip|([1-9])(?:st|nd|rd|th)-Level Spell)$/i
    );

    if (kibblesScrollTier) {
      const levelLabel = /^cantrip$/i.test(kibblesScrollTier[1])
        ? "Cantrip"
        : `Level ${Number(kibblesScrollTier[2])}`;

      candidates.push(`Spell Scroll, ${levelLabel}`);
      candidates.push(`Spell Scroll (${levelLabel})`);

      // SRD compendiums name leveled scrolls "Spell Scroll, 2nd Level".
      if (kibblesScrollTier[2]) {
        const ordinalLabel = `${ordinalSpellLevel(kibblesScrollTier[2])} Level`;
        candidates.push(`Spell Scroll, ${ordinalLabel}`);
        candidates.push(`Spell Scroll ${ordinalLabel}`);
      }
    }

    const spellScroll = name.match(
      /^(?:Spell Scroll|Scroll of Spell),?\s*(?:Level\s*)?(Cantrip|\d+)$/i
    );

    if (spellScroll) {
      const rawLevel = spellScroll[1];
      const levelLabel = /^cantrip$/i.test(rawLevel)
        ? "Cantrip"
        : `Level ${Number(rawLevel)}`;

      candidates.push(`Spell Scroll, ${levelLabel}`);
      candidates.push(`Spell Scroll (${levelLabel})`);
      candidates.push(`${levelLabel} Spell Scroll`);
    }

    const sourceStyleScroll = name.match(
      /^(Cantrip|Level\s*\d+)\s+Spell Scroll$/i
    );

    if (sourceStyleScroll) {
      const levelLabel = sourceStyleScroll[1]
        .replace(/\s+/g, " ")
        .replace(/^level/i, "Level");

      candidates.push(`Spell Scroll, ${levelLabel}`);
      candidates.push(`Spell Scroll (${levelLabel})`);
    }

    const giantStrength = name.match(
      /^Potion of (Hill|Stone|Frost|Fire|Cloud|Storm) Giant Strength$/i
    );

    if (giantStrength) {
      candidates.push(`Potion of Giant Strength (${giantStrength[1]})`);
    }

    const parentheticalGiant = name.match(
      /^Potion of Giant Strength \((Hill|Stone|Frost|Fire|Cloud|Storm)\)$/i
    );

    if (parentheticalGiant) {
      candidates.push(`Potion of ${parentheticalGiant[1]} Giant Strength`);
    }

    const stripped = name.replace(/^\s*\d+\s*[x×]\s*/i, "").trim();
    if (stripped && stripped !== name) add(stripped);

    for (const form of [...new Set([name, stripped].filter(Boolean))]) {
      addNearMissCandidates(form, add);
    }

    return [...new Set(candidates)];
  }

  normalizeName(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/^\s*\d+\s*[x×]\s*/i, "")
      .replace(/[^a-z0-9]/g, "");
  }

  extractQuantityAndName(value, fallbackQuantity = 1) {
    const text = String(value ?? "").trim();
    const match = text.match(/^(\d+)\s*[x×]\s*(.+)$/i);

    if (!match) {
      return {
        quantity: Math.max(1, Number(fallbackQuantity ?? 1)),
        name: text
      };
    }

    return {
      quantity:
        Math.max(1, Number(fallbackQuantity ?? 1))
        * Math.max(1, Number(match[1] ?? 1)),
      name: String(match[2] ?? "").trim()
    };
  }
}

// Compatibility alias retained for callers written before PHB support.
export const SRD_ITEM_PACKS = DND5E_ITEM_PACKS;
export { DND5E_ITEM_PACKS };
