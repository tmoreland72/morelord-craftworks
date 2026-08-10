import { MODULE_ID, SCHEMA_VERSION } from "../constants.mjs";
import { getContentPackManifest } from "../../data/packs/manifests.mjs";

const PACK_NAME = "morelord-craftworks-standard-materials";
const PACK_LABEL = "Morelord Craftworks — Standard Materials (Dev)";

export class StandardMaterialInstaller {
  constructor({ registry }) {
    this.registry = registry;
  }

  get collection() {
    return `world.${PACK_NAME}`;
  }

  async install() {
    if (!game.user.isGM) throw new Error("Only a GM can install the development material compendium.");
    const manifest = getContentPackManifest("standard-core");
    const seedPath = manifest?.materials?.seedPath;

    if (!seedPath) {
      throw new Error("Craftworks Standard does not declare a material seed path.");
    }

    const seed = await foundry.utils.fetchJsonWithTimeout(
      `modules/${MODULE_ID}/${seedPath}`
    );

    let pack = game.packs.get(this.collection);

    if (!pack) {
      const CompendiumCollection = foundry.documents.collections.CompendiumCollection;
      pack = await CompendiumCollection.createCompendium({
        name: PACK_NAME,
        label: PACK_LABEL,
        type: "Item",
        package: "world",
        system: game.system.id
      });
    }

    const existingIndex = await pack.getIndex({ fields: [`flags.${MODULE_ID}.materialId`] });
    const existingByMaterialId = new Map(
      [...existingIndex]
        .map(row => [foundry.utils.getProperty(row, `flags.${MODULE_ID}.materialId`), row])
        .filter(([materialId]) => Boolean(materialId))
    );

    const creates = [];
    const updates = [];
    const deletes = [];

    const seedMaterialIds = new Set(
      seed.map(material => material.materialId)
    );

    for (const [materialId, row] of existingByMaterialId) {
      if (!seedMaterialIds.has(materialId)) {
        deletes.push(row._id);
      }
    }

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
      await ItemClass.deleteDocuments(
        deletes,
        { pack: pack.collection }
      );
    }

    if (creates.length) {
      await ItemClass.createDocuments(
        creates,
        { pack: pack.collection }
      );
    }

    if (updates.length) {
      await ItemClass.updateDocuments(updates, {
        pack: pack.collection,
        diff: false,
        recursive: false
      });
    }

    await this.registry.indexConfiguredPacks();
    ui.notifications.info(
      `Craftworks Standard materials synchronized `
      + `(${creates.length} created, ${updates.length} updated, `
      + `${deletes.length} removed).`
    );
    return pack;
  }

  #toDnd5eItem(material) {
    if (game.system.id !== "dnd5e") throw new Error("The development seed currently supports D&D5e only.");
    return {
      name: material.name,
      type: "loot",
      img: material.img,
      system: {
        description: { value: `<p>Craftworks material: ${material.name}.</p>` },
        quantity: 1,
        weight: 0,
        price: { value: Number(material.priceGp ?? 0), denomination: "gp" },
        rarity: material.rarity ?? ""
      },
      flags: {
        [MODULE_ID]: {
          schemaVersion: SCHEMA_VERSION,
          materialId: material.materialId,
          packId: material.packId ?? "standard-core",
          tags: material.tags ?? [],
          rarity: material.rarity ?? null,
          category: material.category ?? null,
          stage: material.stage ?? null,
          purchasable: material.purchasable === true,
          acquisition: foundry.utils.deepClone(material.acquisition ?? {}),
          sourceUuid: null
        }
      }
    };
  }
}
