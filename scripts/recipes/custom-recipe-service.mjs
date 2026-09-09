import { MODULE_ID } from "../constants.mjs";

const PACK_NAME = "morelord-craftworks-custom-recipes";
const FLAG_PATH = `flags.${MODULE_ID}.customRecipe`;
const EXPORT_SCHEMA = "morelord-craftworks.custom-recipes";

export class CustomRecipeService {
  constructor({ materialRegistry = null } = {}) {
    this.materialRegistry = materialRegistry;
  }
  get collection() { return `world.${PACK_NAME}`; }

  async all() {
    const pack = game.packs.get(this.collection);
    if (!pack) return [];
    const index = await pack.getIndex({ fields: [FLAG_PATH] });
    return [...index].map(row => foundry.utils.deepClone(
      foundry.utils.getProperty(row, FLAG_PATH)
    )).filter(recipe => recipe?.id).sort((a, b) => a.name.localeCompare(b.name));
  }

  async save(recipe, { previousId = null } = {}) {
    this.#assertGM();
    const normalized = this.#normalize(recipe);
    const pack = await this.#pack();
    const existing = await this.#documents(pack);
    const current = existing.get(String(previousId ?? normalized.id));
    const collision = existing.get(normalized.id);
    if (collision && collision._id !== current?._id) {
      throw new Error(`A custom recipe with id '${normalized.id}' already exists.`);
    }
    const data = { name: normalized.name, flags: { [MODULE_ID]: { customRecipe: normalized } } };
    const DocumentClass = CONFIG.JournalEntry.documentClass ?? JournalEntry;
    if (current) {
      data._id = current._id;
      await DocumentClass.updateDocuments([data], { pack: pack.collection });
    } else await DocumentClass.createDocuments([data], { pack: pack.collection });
    return normalized;
  }

  async delete(recipeId) {
    this.#assertGM();
    const pack = game.packs.get(this.collection);
    if (!pack) return false;
    const current = (await this.#documents(pack)).get(String(recipeId));
    if (!current) return false;
    const DocumentClass = CONFIG.JournalEntry.documentClass ?? JournalEntry;
    await DocumentClass.deleteDocuments([current._id], { pack: pack.collection });
    return true;
  }

  export(recipes) {
    const entries = (Array.isArray(recipes) ? recipes : [recipes])
      .filter(Boolean).map(recipe => this.#normalize(recipe));
    return JSON.stringify({ schema: EXPORT_SCHEMA, version: 1,
      exportedAt: new Date().toISOString(), recipes: entries }, null, 2);
  }

  async import(text, { conflict = "skip" } = {}) {
    this.#assertGM();
    let payload;
    try { payload = JSON.parse(String(text ?? "")); }
    catch { throw new Error("The selected file is not valid JSON."); }
    if (payload?.schema !== EXPORT_SCHEMA || payload?.version !== 1 || !Array.isArray(payload.recipes)) {
      throw new Error("This is not a supported Craftworks custom recipe export.");
    }
    const existing = new Map((await this.all()).map(recipe => [recipe.id, recipe]));
    const summary = { created: 0, replaced: 0, skipped: 0 };
    for (const raw of payload.recipes) {
      let recipe = this.#normalize(raw);
      if (existing.has(recipe.id)) {
        if (conflict === "skip") { summary.skipped += 1; continue; }
        if (conflict === "replace") {
          await this.save(recipe, { previousId: recipe.id });
          summary.replaced += 1;
          existing.set(recipe.id, recipe);
          continue;
        } else { summary.skipped += 1; continue; }
      } else summary.created += 1;
      await this.save(recipe);
      existing.set(recipe.id, recipe);
    }
    return summary;
  }

  #normalize(raw) {
    const recipe = foundry.utils.deepClone(raw ?? {});
    if (!recipe.output?.uuid) {
      throw new Error("Each custom recipe requires an output Item UUID.");
    }
    recipe.name = String(recipe.output.label ?? recipe.output.name ?? recipe.name ?? "").trim();
    if (!recipe.name) throw new Error("The output Item must have a name.");
    recipe.id = this.#recipeId(recipe.output.uuid);
    if (!recipe.requirementGroups?.[0]?.requirements?.length) {
      throw new Error(`Custom recipe '${recipe.name}' requires at least one material.`);
    }
    const drakkenheim = recipe.source?.contentPackId === "monsters-of-drakkenheim";
    for (const group of recipe.requirementGroups) {
      if (!Array.isArray(group.requirements) || !group.requirements.length) {
        throw new Error(`Custom recipe '${recipe.name}' contains an empty logical option.`);
      }
      for (const requirement of group.requirements) {
        if (!requirement?.match?.materialId || !Number.isFinite(Number(requirement.quantity))
          || Number(requirement.quantity) < 1) {
          throw new Error(`Custom recipe '${recipe.name}' contains an invalid material requirement.`);
        }
        const material = this.materialRegistry?.get(requirement?.match?.materialId);
        if (material && drakkenheim !== (material.packId === "monsters-of-drakkenheim")) {
          throw new Error(drakkenheim
            ? "Drakkenheim recipes may use only Drakkenheim materials."
            : "Standard custom recipes cannot use Drakkenheim materials.");
        }
      }
    }
    const hours = Number(recipe.craft?.hoursRequired ?? 2);
    if (!Number.isFinite(hours) || hours < 2 || hours % 2 !== 0) {
      throw new Error(`Custom recipe '${recipe.name}' crafting time must be a positive multiple of 2 hours.`);
    }
    recipe.output.type = "foundry-item";
    const craftableTypes = new Set(["equipment", "consumable", "container", "tool", "weapon"]);
    if (recipe.output.itemType && !craftableTypes.has(recipe.output.itemType)) {
      throw new Error(`The output Item type '${recipe.output.itemType}' cannot be crafted.`);
    }
    recipe.output.quantity = Math.max(1, Math.floor(Number(recipe.output.quantity ?? 1)));
    if (recipe.source?.contentPackId !== "monsters-of-drakkenheim") {
      recipe.source = { ...(recipe.source ?? {}), contentPackId: null };
    }
    recipe.schemaVersion = 1;
    recipe.packId = "custom-world";
    recipe.custom = true;
    return recipe;
  }

  async #pack() {
    return game.packs.get(this.collection)
      ?? foundry.documents.collections.CompendiumCollection.createCompendium({
        name: PACK_NAME, label: "Morelord Craftworks — Custom Recipes",
        type: "JournalEntry", package: "world"
      });
  }

  async #documents(pack) {
    const index = await pack.getIndex({ fields: [FLAG_PATH] });
    return new Map([...index].map(row => [
      String(foundry.utils.getProperty(row, `${FLAG_PATH}.id`) ?? ""), row
    ]).filter(([id]) => id));
  }

  #recipeId(uuid) { return `custom-${String(uuid).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`; }

  #assertGM() {
    if (!game.user.isGM) throw new Error("Only a GM can manage custom recipes.");
  }
}
