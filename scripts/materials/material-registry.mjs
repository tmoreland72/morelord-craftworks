import { MODULE_ID } from "../constants.mjs";
import { log, warn } from "../core/logger.mjs";

export class MaterialRegistry {
  #byId = new Map();

  constructor({ contentPacks = null, sourceFilter = null } = {}) {
    this.contentPacks = contentPacks;
    this.sourceFilter = sourceFilter;
  }

  get size() { return this.#byId.size; }

  clear() { this.#byId.clear(); }

  get(materialId) { return this.#byId.get(materialId) ?? null; }

  all() { return [...this.#byId.values()]; }

  activeAll() { return this.all(); }

  findByTags(tags = [], { rarity = null } = {}) {
    const required = new Set(tags);
    return this.all().filter(entry => {
      if (rarity && entry.rarity !== rarity) return false;
      const itemTags = new Set(entry.tags);
      return [...required].every(tag => itemTags.has(tag));
    });
  }

  async indexConfiguredPacks() {
    this.clear();
    const packs = game.packs
      .filter(pack => pack.documentName === "Item")
      .filter(pack => this.sourceFilter?.isPackEnabled(pack) ?? true);

    for (const pack of packs) {
      const index = await pack.getIndex({ fields: [
        `flags.${MODULE_ID}.materialId`,
        `flags.${MODULE_ID}.packId`,
        `flags.${MODULE_ID}.tags`,
        `flags.${MODULE_ID}.rarity`,
        `flags.${MODULE_ID}.category`,
        `flags.${MODULE_ID}.stage`,
        `flags.${MODULE_ID}.purchasable`,
        `flags.${MODULE_ID}.acquisition`,
        "system.price"
      ]});

      for (const row of index) {
        const flags = foundry.utils.getProperty(row, `flags.${MODULE_ID}`);
        if (!flags?.materialId) continue;

        // Legacy dev materials created before Content Pack manifests are
        // treated as Standard so existing worlds continue to work.
        const packId = flags.packId === "standard-materials"
          ? "standard-core"
          : (flags.packId ?? "standard-core");

        if (this.contentPacks && !this.contentPacks.isEnabled(packId)) continue;

        const manifest = this.contentPacks?.manifest(packId);
        const priority = Number(manifest?.priority ?? 0);

        const current = this.#byId.get(flags.materialId);
        if (current && Number(current.packPriority ?? 0) > priority) {
          warn(
            `Ignoring lower-priority materialId '${flags.materialId}' from ${pack.collection}.`
          );
          continue;
        }

        if (current) {
          warn(
            `Replacing materialId '${flags.materialId}' from '${current.packId}' with higher/equal-priority '${packId}'.`
          );
        }

        this.#byId.set(flags.materialId, {
          materialId: flags.materialId,
          packId,
          packPriority: priority,
          name: row.name,
          img: row.img,
          uuid: `Compendium.${pack.collection}.Item.${row._id}`,
          pack: pack.collection,
          tags: Array.isArray(flags.tags) ? flags.tags : [],
          rarity: flags.rarity ?? null,
          category: flags.category ?? null,
          stage: flags.stage ?? null,
          purchasable: flags.purchasable === true,
          acquisition: foundry.utils.deepClone(flags.acquisition ?? {}),
          price: foundry.utils.deepClone(row.system?.price ?? { value: 0, denomination: "gp" })
        });
      }
    }

    log(`Indexed ${this.size} Craftworks materials.`);
  }

  async resolveItem(materialId) {
    const entry = this.get(materialId);
    if (!entry) return null;
    return fromUuid(entry.uuid);
  }
}
