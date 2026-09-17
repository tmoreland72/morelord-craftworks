import test from "node:test";
import assert from "node:assert/strict";
import { CraftingRollService } from "../scripts/crafting/crafting-roll-service.mjs";
import { MONSTERS_OF_DRAKKENHEIM_RECIPES } from "../data/monsters-of-drakkenheim-recipes.mjs";


globalThis.game = { system: { id: "dnd5e" }, i18n: { localize: value => value } };
globalThis.CONFIG = { DND5E: { tools: { alchemist: { label: "Alchemist's Supplies" } } } };
const recipe = { name: "Antitoxin", craft: { tool: "Alchemist's Supplies", ability: "Intelligence", skill: "Arcana", dc: 13, noToolDc: 18 } };

for (const [hasTool, proficient] of [[true, true], [true, false], [false, true], [false, false]]) {
  test(`artisan tool check: inventory=${hasTool}, proficiency=${proficient}`, async () => {
    const calls = [];
    const crafter = {
      rollToolCheck: async (...args) => { calls.push(args); return [{ total: 13, dice: [] }]; },
      rollSkill: () => assert.fail("A tool recipe must not roll a skill"),
      rollAbilityCheck: () => assert.fail("A tool recipe must not roll a plain ability check")
    };
    const result = await new CraftingRollService().roll({ recipe, crafter, dc: 18, toolStatus: { hasTool, proficient } });
    assert.equal(result.dc, 13);
    assert.equal(result.success, true);
    assert.equal(result.rollType, "tool");
    assert.equal(calls[0][0].tool, "alchemist");
    assert.equal(calls[0][0].ability, "int");
    assert.equal(Boolean(calls[0][0].disadvantage), !hasTool || !proficient);
    assert.equal(calls[0][1].configure, true);
    assert.equal(calls[0][2].create, true);
  });
}

test("canceling a tool roll does not count as failure", async () => {
  const result = await new CraftingRollService().roll({ recipe, crafter: { rollToolCheck: async () => null }, toolStatus: { hasTool: true, proficient: true } });
  assert.equal(result.cancelled, true);
  assert.equal(result.success, null);
});

test("official and custom Drakkenheim recipes never call a roll API, even with legacy DCs", async () => {
  assert.ok(MONSTERS_OF_DRAKKENHEIM_RECIPES.every(recipe => recipe.craft.checkRequired === false));
  assert.ok(MONSTERS_OF_DRAKKENHEIM_RECIPES.every(recipe => recipe.craft.hoursRequired === 0));
  assert.ok(MONSTERS_OF_DRAKKENHEIM_RECIPES.every(recipe => recipe.source.craftingTime === "None"));
  for (const source of [{ packId: "monsters-of-drakkenheim" }, { source: { contentPackId: "monsters-of-drakkenheim" } }]) {
    const result = await new CraftingRollService().roll({ recipe: { ...recipe, ...source }, crafter: {} });
    assert.equal(result.rollType, "none");
    assert.equal(result.success, true);
    assert.equal(result.roll, null);
  }
});

test("loading legacy custom recipes removes the DC penalty and removes Drakkenheim checks", async context => {
  context.mock.method(console, "warn", () => {});
  const custom = [false, true].map(drakkenheim => ({
    ...recipe, id: `legacy-${drakkenheim}`, packId: "custom-world",
    source: { contentPackId: drakkenheim ? "monsters-of-drakkenheim" : null },
    craft: { ...recipe.craft, hoursRequired: 2 },
    output: { type: "foundry-item", uuid: "Item.output", label: "Output" },
    requirementGroups: [{ requirements: [{ quantity: 1, match: { materialId: "iron" } }] }]
  }));
  globalThis.foundry = { applications: { api: { ApplicationV2: class {}, HandlebarsApplicationMixin: Base => Base } } };
  const { RecipeRegistry } = await import("../scripts/recipes/recipe-registry.mjs");
  const registry = new RecipeRegistry({ materialRegistry: { get: () => null }, customRecipes: { all: async () => custom } });
  await registry.loadStandardSeed();
  const standard = registry.get("legacy-false", { includeDisabled: true });
  const drakkenheim = registry.get("legacy-true", { includeDisabled: true });
  assert.equal(standard.craft.dc, 13);
  assert.equal(standard.craft.noToolDc, 13);
  assert.equal(standard.craft.checkRequired, true);
  assert.equal(drakkenheim.craft.dc, null);
  assert.equal(drakkenheim.craft.hoursRequired, 0);
  assert.equal(drakkenheim.craft.environment.facility.type, "workshop");
  assert.equal(drakkenheim.craft.checkRequired, false);
});
