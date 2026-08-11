import { MODULE_ID, SCHEMA_VERSION } from "../constants.mjs";

export class ContentPackMaterialInstaller {
  constructor({ registry, contentPacks }) {
    this.registry = registry;
    this.contentPacks = contentPacks;
  }

  async installAll() {
    if (!game.user.isGM) {
      throw new Error("Only a GM can synchronize Craftworks material compendiums.");
    }

    const results = [];

    for (const manifest of this.contentPacks.manifests({ activeOnly: false })) {
      const seedPath = manifest?.materials?.seedPath;
      if (!seedPath) continue;
      results.push(await this.#installManifest(manifest, seedPath));
    }

    await this.registry.indexConfiguredPacks();
    return results;
  }

  async #installManifest(manifest, seedPath) {
    const seed = await foundry.utils.fetchJsonWithTimeout(
      `modules/${MODULE_ID}/${seedPath}`
    );

    const legacyStandard = manifest.id === "standard-core";
    const packName = legacyStandard
      ? "morelord-craftworks-standard-materials"
      : `morelord-craftworks-materials-${manifest.id}`;

    const packLabel = legacyStandard
      ? "Morelord Craftworks — Standard Materials (Dev)"
      : `Morelord Craftworks — ${manifest.id} Materials`;

    const collection = `world.${packName}`;
    let pack = game.packs.get(collection);

    if (!pack) {
      const CompendiumCollection =
        foundry.documents.collections.CompendiumCollection;

      pack = await CompendiumCollection.createCompendium({
        name: packName,
        label: packLabel,
        type: "Item",
        package: "world",
        system: game.system.id
      });
    }

    const existingIndex = await pack.getIndex({
      fields: [`flags.${MODULE_ID}.materialId`]
    });

    const existingByMaterialId = new Map(
      [...existingIndex]
        .map(row => [
          foundry.utils.getProperty(
            row,
            `flags.${MODULE_ID}.materialId`
          ),
          row
        ])
        .filter(([materialId]) => Boolean(materialId))
    );

    const seedIds = new Set(seed.map(entry => entry.materialId));
    const deletes = [...existingByMaterialId]
      .filter(([materialId]) => !seedIds.has(materialId))
      .map(([, row]) => row._id);

    const creates = [];
    const updates = [];

    for (const material of seed) {
      const source = this.#toDnd5eItem(material);
      const existing = existingByMaterialId.get(material.materialId);

      if (!existing) creates.push(source);
      else {
        source._id = existing._id;
        updates.push(source);
      }
    }

    const ItemClass = CONFIG.Item.documentClass ?? Item;

    if (deletes.length) {
      await ItemClass.deleteDocuments(deletes, { pack: pack.collection });
    }
    if (creates.length) {
      await ItemClass.createDocuments(creates, { pack: pack.collection });
    }
    if (updates.length) {
      await ItemClass.updateDocuments(updates, {
        pack: pack.collection,
        diff: false,
        recursive: false
      });
    }

    console.log(
      `Morelord Craftworks | ${manifest.id} materials synchronized `
      + `(${creates.length} created, ${updates.length} updated, `
      + `${deletes.length} removed).`
    );

    return {
      packId: manifest.id,
      collection: pack.collection,
      creates: creates.length,
      updates: updates.length,
      deletes: deletes.length
    };
  }

  #toDnd5eItem(material) {
    if (game.system.id !== "dnd5e") {
      throw new Error(
        "The current Craftworks material seeds support D&D5e only."
      );
    }

    return {
      name: material.name,
      type: "loot",
      img: material.img,
      system: {
        description: {
          value: `<p>Craftworks material: ${material.name}.</p>`
        },
        quantity: 1,
        weight: 0,
        price: {
          value: Number(material.priceGp ?? 0),
          denomination: "gp"
        },
        rarity: material.rarity ?? ""
      },
      flags: {
        [MODULE_ID]: {
          schemaVersion: SCHEMA_VERSION,
          materialId: material.materialId,
          packId: material.packId,
          tags: material.tags ?? [],
          rarity: material.rarity ?? null,
          category: material.category ?? null,
          stage: material.stage ?? null,
          purchasable: material.purchasable === true,
          acquisition: foundry.utils.deepClone(
            material.acquisition ?? {}
          ),
          sourceUuid: null
        }
      }
    };
  }
}
