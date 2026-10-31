import test from "node:test";
import assert from "node:assert/strict";
import { CraftingRollService, FAILED_ATTEMPT_MATERIALS_NOTE } from "../scripts/crafting/crafting-roll-service.mjs";
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

test("a failed tool roll says the set-aside materials are not lost", async () => {
  const roll = { total: 5, dice: [] };
  const message = { flavor: "<strong>Antitoxin</strong><br>Crafting Check", rolls: [roll], update: async data => { message.flavor = data.flavor; } };
  globalThis.game.messages = { contents: [message] };
  const result = await new CraftingRollService().roll({ recipe, crafter: { rollToolCheck: async () => roll }, dc: 13, toolStatus: { hasTool: true, proficient: true } });
  assert.equal(result.success, false);
  assert.match(message.flavor, new RegExp(FAILED_ATTEMPT_MATERIALS_NOTE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("a failed native roll annotates the chat card when Foundry rebuilds the roll", async () => {
  const note = new RegExp(FAILED_ATTEMPT_MATERIALS_NOTE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const cases = [
    {
      name: "tool",
      recipe,
      crafter(roll) {
        return { rollToolCheck: async () => roll, rollSkill() { assert.fail("tool"); }, rollAbilityCheck() { assert.fail("tool"); } };
      },
      toolStatus: { hasTool: true, proficient: true }
    },
    {
      name: "skill",
      recipe: { name: "Antitoxin", craft: { ability: "Intelligence", skill: "Arcana", dc: 13 } },
      crafter(roll) {
        return { rollSkill: async () => roll, rollToolCheck() { assert.fail("skill"); }, rollAbilityCheck() { assert.fail("skill"); } };
      }
    },
    {
      name: "ability",
      recipe: { name: "Antitoxin", craft: { ability: "Intelligence", dc: 13 } },
      crafter(roll) {
        return { rollAbilityCheck: async () => roll, rollSkill() { assert.fail("ability"); }, rollToolCheck() { assert.fail("ability"); } };
      }
    }
  ];
  for (const entry of cases) {
    const roll = { total: 4, formula: "1d20 - 1", dice: [] };
    const rebuilt = { total: 4, formula: "1d20 - 1" };
    assert.notEqual(rebuilt, roll);
    const decoy = { flavor: "other", rolls: [{ total: 4, formula: "2d20kl" }], update: async () => { throw new Error(`${entry.name} updated the wrong card`); } };
    const message = { flavor: `${entry.name} check`, rolls: [rebuilt], update: async data => { message.flavor = data.flavor; } };
    globalThis.game.messages = { contents: [decoy, message] };
    const result = await new CraftingRollService().roll({
      recipe: entry.recipe,
      crafter: entry.crafter(roll),
      dc: 13,
      toolStatus: entry.toolStatus
    });
    assert.equal(result.success, false, entry.name);
    assert.equal(result.rollType, entry.name);
    assert.match(message.flavor, note, entry.name);
    assert.equal(decoy.flavor, "other");
  }

  const identified = { total: 4, formula: "1d20 - 1", messageId: "craft-1", dice: [] };
  const other = { id: "other", flavor: "same numbers", rolls: [{ total: 4, formula: "1d20 - 1" }], update: async () => { throw new Error("message id should win"); } };
  const card = { id: "craft-1", flavor: "identified", rolls: [{ total: 9, formula: "2d6" }], update: async data => { card.flavor = data.flavor; } };
  globalThis.game.messages = { contents: [other, card] };
  const byId = await new CraftingRollService().roll({
    recipe,
    crafter: { rollToolCheck: async () => identified },
    dc: 13,
    toolStatus: { hasTool: true, proficient: true }
  });
  assert.equal(byId.success, false);
  assert.match(card.flavor, note);
});

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
