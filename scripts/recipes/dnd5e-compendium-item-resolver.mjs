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
  "Monsters of Drakkenheim": {
    packageId: "drakkenheim-monsters"
  }
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
            fields: ["name", "img", "type"]
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
