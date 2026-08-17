export class KibblesMaterialImageResolver {
  constructor() {
    this._byName = new Map();
    this._packs = [];
  }

  get size() {
    return this._byName.size;
  }

  get packs() {
    return [...this._packs];
  }

  async refresh() {
    this._byName.clear();
    this._packs = [];

    const packs = Array.from(game.packs ?? [])
      .filter(pack => pack.documentName === "Item")
      .map(pack => ({
        pack,
        score: this.#packScore(pack)
      }))
      .filter(entry => entry.score > 0)
      .sort((a, b) =>
        b.score - a.score
        || String(a.pack.collection).localeCompare(String(b.pack.collection))
      );

    for (const { pack } of packs) {
      let index;

      try {
        index = await pack.getIndex({
          fields: ["name", "img"]
        });
      } catch (error) {
        console.warn(
          `Morelord Craftworks | Unable to index Kibbles material pack ${pack.collection}.`,
          error
        );
        continue;
      }

      this._packs.push(pack.collection);

      for (const row of index) {
        const key = this.normalizeName(row.name);
        if (!key || !row.img) continue;

        // Higher-scored Kibbles packs are processed first.
        if (this._byName.has(key)) continue;

        this._byName.set(key, {
          name: row.name,
          img: row.img,
          uuid: `Compendium.${pack.collection}.Item.${row._id}`,
          packId: pack.collection,
          packLabel:
            pack.metadata?.label
            ?? pack.title
            ?? pack.collection
        });
      }
    }

    return this.size;
  }

  resolve(material) {
    if (!material) return null;

    const names = [
      material.name,
      material.sourceName,
      material.materialId
        ? String(material.materialId).replaceAll("-", " ")
        : null
    ].filter(Boolean);

    for (const name of names) {
      const match = this._byName.get(
        this.normalizeName(name)
      );

      if (match) return match;
    }

    return null;
  }

  imageFor(material) {
    return this.resolve(material)?.img
      ?? material?.img
      ?? "";
  }

  apply(material) {
    const match = this.resolve(material);

    if (!match) {
      return {
        ...material,
        img: material?.img ?? "",
        kibblesImageSource: null
      };
    }

    return {
      ...material,
      img: match.img,
      kibblesImageSource: {
        uuid: match.uuid,
        packId: match.packId,
        name: match.name
      }
    };
  }

  applyAll(materials = []) {
    return materials.map(material =>
      this.apply(material)
    );
  }

  normalizeName(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/\badamant\b/g, "adamantine")
      .replace(/[^a-z0-9]/g, "");
  }

  #packScore(pack) {
    const packageName = String(
      pack.metadata?.packageName
      ?? pack.metadata?.package
      ?? ""
    ).toLowerCase();

    const collection = String(
      pack.collection
      ?? ""
    ).toLowerCase();

    const label = String(
      pack.metadata?.label
      ?? pack.title
      ?? ""
    ).toLowerCase();

    const text = [
      packageName,
      collection,
      label
    ].join(" ");

    let score = 0;

    if (text.includes("kibbles")) score += 100;
    if (text.includes("kibble")) score += 100;
    if (text.includes("crafting")) score += 35;
    if (text.includes("craft and creation")) score += 35;
    if (text.includes("material")) score += 20;
    if (text.includes("ingredient")) score += 10;

    return score;
  }
}
