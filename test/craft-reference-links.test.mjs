import test from "node:test";
import assert from "node:assert/strict";

globalThis.foundry = { applications: { api: { ApplicationV2: class { async _onRender() {} }, HandlebarsApplicationMixin: Base => Base } } };
const { CraftApp } = await import("../scripts/ui/craft-app.mjs");
const { RecipeRegistry } = await import("../scripts/recipes/recipe-registry.mjs");
const { MONSTERS_OF_DRAKKENHEIM_RECIPES } = await import("../data/monsters-of-drakkenheim-recipes.mjs");
const { materialRarityMatches } = await import("../scripts/materials/material-match-utils.mjs");
const { CraftingMaterialService } = await import("../scripts/crafting/crafting-material-service.mjs");
const { readFile } = await import("node:fs/promises");

test("Craft output and ingredient image actions open filtered reference browsers without opening source Items", async () => {
  const listeners = new Map(), events = [];
  const recipe = { dataset: { openRecipeId: "ball-bearings" }, addEventListener: (_event, callback) => listeners.set("recipe", callback) };
  const material = { dataset: { materialId: "iron-ingot" }, addEventListener: (_event, callback) => listeners.set("material", callback) };
  const api = { openRecipes: async options => events.push(["recipes", options]), openMaterials: async options => events.push(["materials", options]) };
  const app = new CraftApp(api, { crafterActorUuid: "Actor.crafter" });
  app.element = { querySelector: () => null, querySelectorAll: selector => selector === "[data-open-recipe-id]" ? [recipe] : selector === "[data-material-id]" ? [material] : [] };
  await app._onRender({}, {});
  const event = target => ({ currentTarget: target, preventDefault() {}, stopPropagation() {} });
  await listeners.get("recipe")(event(recipe));
  await listeners.get("material")(event(material));
  assert.deepEqual(events, [["recipes", { recipeIds: ["ball-bearings"], crafterActorUuid: "Actor.crafter" }], ["materials", { materialId: "iron-ingot" }]]);
});

test("Used in finds real Drakkenheim tag requirements and alternatives without listing producing-only recipes", async () => {
  const entries = JSON.parse(await readFile(new URL("../data/drakkenheim-materials.seed.json", import.meta.url), "utf8"));
  const material = entries.find(entry => entry.materialId === "drakkenheim-rare-organ");
  const registry = new RecipeRegistry({ materialRegistry: { get: id => entries.find(entry => entry.materialId === id) }, contentPacks: { isEnabled: () => true } });
  registry._recipes = new Map(MONSTERS_OF_DRAKKENHEIM_RECIPES.map(recipe => [recipe.id, recipe]));
  const actual = MONSTERS_OF_DRAKKENHEIM_RECIPES.find(recipe => recipe.requirementGroups.some(group => group.requirements.some(req => req.match?.rarity === "rare" && req.match?.tags?.includes("drakkenheim-component-organ"))));
  assert(actual);
  assert(registry.recipesUsingMaterial(material.materialId).some(recipe => recipe.id === actual.id));
  registry._recipes = new Map([
    ["alternative", { id: "alternative", packId: "standard-core", requirementGroups: [{ requirements: [{ alternatives: [{ match: { tags: ["drakkenheim-component-organ"], rarity: "RARE" } }] }] }] }],
    ["wrong-rarity", { id: "wrong-rarity", packId: "standard-core", requirementGroups: [{ requirements: [{ match: { tags: ["drakkenheim-component-organ"], rarity: "common" } }] }] }],
    ["produces", { id: "produces", packId: "standard-core", output: { type: "craftworks-material", materialId: material.materialId } }]
  ]);
  assert.deepEqual(registry.recipesUsingMaterial(material.materialId).map(recipe => recipe.id), ["alternative"]);
  assert(registry.getByMaterial(material.materialId).some(recipe => recipe.id === "produces"), "Existing combined lookup must preserve output matches.");
  assert(materialRarityMatches("veryRare", "Very Rare"));
  assert(materialRarityMatches("very-rare", "veryRare"));
  assert(!materialRarityMatches("rare", "Very Rare"));
});

test("crafting accepts the same Drakkenheim rarity aliases shown by material recipe references", () => {
  const material = { materialId: "organ", tags: ["drakkenheim-component-organ"], rarity: "Very Rare", category: "drakkenheim-organ", stage: "harvested" };
  const item = { id: "organ", uuid: "Actor.test.Item.organ", name: "Organ (Very Rare)", system: { quantity: 1 }, flags: { "morelord-craftworks": material } };
  const service = new CraftingMaterialService({ materialRegistry: { get: () => material }, adapter: {} });
  const recipe = { requirementGroups: [{ id: "default", requirements: [{ quantity: 1, sameMaterial: false, match: { tags: ["drakkenheim-component-organ"], rarity: "veryRare" } }] }] };
  const actor = { uuid: "Actor.test", items: [item] };
  assert.equal(service.planOptions(recipe, actor).length, 1);
  item.flags["morelord-craftworks"].rarity = "Rare";
  assert.equal(service.planOptions(recipe, actor).length, 0);
});
