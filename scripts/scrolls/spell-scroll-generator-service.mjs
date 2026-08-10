export class SpellScrollGeneratorService {
  constructor({ coreAccess = null } = {}) {
    this.coreAccess = coreAccess;
  }

  get premiumFeatureId() {
    return "spell-scroll-generator";
  }

  get hasAccess() {
    if (!this.coreAccess) return true;
    return Boolean(
      this.coreAccess.hasFeature?.(this.premiumFeatureId)
      || this.coreAccess.hasPremiumAccess?.()
    );
  }

  async availableSpells({ level = null } = {}) {
    const spells = [];
    const seen = new Set();

    for (const pack of Array.from(game.packs ?? [])) {
      if (pack.documentName !== "Item") continue;
      if (!this.#packEnabled(pack)) continue;

      let index;
      try {
        index = await pack.getIndex({
          fields: ["name", "img", "type", "system.level"]
        });
      } catch (error) {
        console.warn(
          `Morelord Craftworks | Unable to index spell pack ${pack.collection}.`,
          error
        );
        continue;
      }

      for (const row of index) {
        if (row.type !== "spell") continue;

        const spellLevel = Number(
          foundry.utils.getProperty(row, "system.level")
          ?? 0
        );

        if (
          level != null
          && Number(level) !== spellLevel
        ) continue;

        const key = `${spellLevel}|${String(row.name).toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);

        spells.push({
          name: row.name,
          img: row.img ?? "icons/svg/book.svg",
          level: spellLevel,
          uuid: `Compendium.${pack.collection}.Item.${row._id}`,
          packId: pack.collection,
          packLabel: pack.metadata?.label ?? pack.title ?? pack.collection
        });
      }
    }

    return spells.sort((a, b) =>
      a.level - b.level
      || a.name.localeCompare(b.name)
    );
  }

  async randomSpell(level) {
    const spells = await this.availableSpells({ level });
    if (!spells.length) return null;

    return spells[
      Math.floor(Math.random() * spells.length)
    ];
  }

  #packEnabled(pack) {
    // Foundry only exposes packs that are available to the world. Avoid
    // hidden/private packs and let active module/system compendiums participate.
    return pack.visible !== false;
  }
}
