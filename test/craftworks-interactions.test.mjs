import test from "node:test";
import assert from "node:assert/strict";

class Application { async _onRender() {} async _prepareContext() { return {}; } }
globalThis.foundry = { applications: { api: { ApplicationV2: Application, HandlebarsApplicationMixin: Base => Base } }, utils: { deepClone: structuredClone, mergeObject: (a, b) => ({ ...a, ...b }) } };
globalThis.ui = { notifications: { info() {}, warn: assert.fail, error: assert.fail } };
const { GatherApp } = await import("../scripts/ui/gather-app.mjs");
const { GatherPlayerApp } = await import("../scripts/ui/gather-player-app.mjs");
const { HarvestPrototypeApp } = await import("../scripts/ui/harvest-app.mjs");
const { HarvestPlayerApp } = await import("../scripts/ui/harvest-player-app.mjs");
const { CustomRecipeEditorApp } = await import("../scripts/ui/custom-recipe-editor-app.mjs");
const { RecipeBrowserApp } = await import("../scripts/ui/recipe-browser-app.mjs");
const { SocketService } = await import("../scripts/socket/socket-service.mjs");
const { CraftApp } = await import("../scripts/ui/craft-app.mjs");
const { CraftingRollService } = await import("../scripts/crafting/crafting-roll-service.mjs");
const { ToolInspector } = await import("../scripts/recipes/tool-inspector.mjs");

function bind(app, selector, node = {}, extra = {}) {
  let callback;
  const control = { ...node, addEventListener: (_, fn) => { callback = fn; } };
  app.element = { querySelector: key => key === selector ? control : null, querySelectorAll: key => key === selector ? [control] : extra[key] ?? [] };
  app.render = async () => {};
  app.close = async () => {};
  return async () => { await app._onRender(); return callback({ preventDefault() {}, currentTarget: control }); };
}

function setup() {
  const gm = { id: "gm", name: "GM", isGM: true, active: true };
  const player = { id: "player", name: "Player", isGM: false, active: true };
  const users = [gm, player]; users.get = id => users.find(user => user.id === id);
  const actors = [{ uuid: "Actor.offline", name: "Offline", type: "character" }, { uuid: "Actor.online", name: "Online", type: "character" }];
  globalThis.game = { user: gm, users, actors, settings: { set: async () => {} } };
  globalThis.fromUuid = async uuid => actors.find(actor => actor.uuid === uuid);
  globalThis.MorelordCore = { users: { activePlayerForActor: actor => actor.uuid === "Actor.online" ? player : null } };
  return { actors };
}

test("player Roll Crafting Check resolves Blacksmith's Tools and records progress", async () => {
  const { actors } = setup();
  game.user = game.users.get("player");
  game.system = { id: "dnd5e" };
  game.i18n = { localize: value => value };
  // Actual D&D5e config entries have ability and compendium ID, not a label.
  globalThis.CONFIG = { DND5E: { tools: { smith: { ability: "str", id: "Compendium.tools.smith" } } } };
  game.dnd5e = { utils: { keyLabel: () => "Smith's Tools" } };
  const actor = actors[1];
  actor.system = { tools: { smith: { value: 1 } } };
  actor.items = [{ name: "Smith's Tools", type: "tool", system: { quantity: 1 } }];
  const rolls = [], attempts = [];
  actor.rollToolCheck = async (...args) => { rolls.push(args); return [{ total: 14, dice: [] }]; };
  actor.rollAbilityCheck = assert.fail;
  const recipe = { id: "ball-bearings", name: "Ball Bearings", craft: { tool: "Blacksmith's Tools", ability: "Strength", dc: 8 } };
  const app = new CraftApp({
    crafterContext: { availableCharacters: () => [actor] }, recipes: { get: () => recipe },
    craftingEnvironment: { evaluate: () => ({ passed: true }) },
    craftingJobs: { get: () => ({ inventoryActorUuid: actor.uuid }), recordAttempt: async (...args) => { attempts.push(args); return { complete: false, successes: 1, requiredSuccesses: 2 }; } },
    craftingRolls: new CraftingRollService(), toolInspector: new ToolInspector()
  }, { crafterActorUuid: actor.uuid });
  await bind(app, "[data-action='craft']", { dataset: { recipeId: recipe.id } })();
  assert.equal(game.user.isGM, false);
  assert.equal(rolls[0][0].tool, "smith");
  assert.equal(Boolean(rolls[0][0].disadvantage), false);
  assert.equal(attempts.length, 1);
  assert.equal(attempts[0][3].success, true);
  assert.match(app.sessionLog[0].text, /Success: 14 vs DC 8/);
});

test("craft button reports failures to the player instead of silently rejecting", async context => {
  setup();
  const errors = [];
  context.mock.method(console, "error", () => {});
  context.mock.method(ui.notifications, "error", message => errors.push(message));
  globalThis.fromUuid = async () => { throw new Error("Actor is unavailable"); };
  const app = new CraftApp({}, { crafterActorUuid: "Actor.missing" });
  await bind(app, "[data-action='craft']", { dataset: { recipeId: "recipe" } })();
  assert.deepEqual(errors, ["Crafting failed: Actor is unavailable"]);
});

test("session operations target their owning GM instead of another connected GM", async () => {
  setup();
  game.users.push({ id: "second-gm", isGM: true, active: true });
  const service = new SocketService();
  service.ready = true;
  const calls = [];
  service.socket = { executeAsUser: async (...args) => calls.push(args), executeAsGM: assert.fail };
  await service.executeAsGm("gather.attempt", { sessionId: "session" }, { gmUserId: "second-gm" });
  assert.equal(calls[0][1], "second-gm");
  assert.equal(calls[0][2].type, "gather.attempt");
  game.users.get("second-gm").active = false;
  await assert.rejects(service.executeAsGm("gather.attempt", {}, { gmUserId: "second-gm" }), /must be connected/);
});

for (const [App, kind] of [[GatherApp, "gather"], [HarvestPrototypeApp, "harvest"]]) {
  test(`${kind} starts with offline and online characters and routes offline windows to the GM`, async () => {
    const { actors } = setup();
    const sent = [];
    const api = { materials: { size: 1 }, socket: { emit: async (...args) => sent.push(args) } };
    api[kind] = { start: (...args) => ({ id: "session", ...(kind === "gather" ? args[1] : args[0]) }) };
    const app = new App(api);
    app.selectedCharacterUuids = new Set(actors.map(actor => actor.uuid));
    app.preflightCreatures = [{ tokenUuid: "Token.monster" }];
    const click = bind(app, "[data-action='start']", {}, { "[data-harvest-creature-select]:checked": [{ dataset: { tokenUuid: "Token.monster" } }] });
    await click();
    assert.equal(sent.length, 2);
    assert.equal(sent.find(([, data]) => data.actorUuid === "Actor.offline")[2].targetUserId, "gm");
    assert.equal(sent.find(([, data]) => data.actorUuid === "Actor.online")[2].targetUserId, "player");
  });
}

for (const [App, kind, action] of [[GatherPlayerApp, "gather", "roll"], [HarvestPlayerApp, "harvest", "roll-harvest-checks"]]) {
  test(`${kind} GM rolls preserve the disconnected player's character identity`, async () => {
    setup();
    const calls = [];
    const session = { id: "session", terrain: { name: "Forest", dc: 15 }, creatures: [{ tokenUuid: "Token.monster", name: "Monster", dc: 15 }], [kind + "ActorsByUser"]: { disconnected: ["Actor.offline"] } };
    const api = { adapter: { rollSkill: async actor => { assert.equal(actor.uuid, "Actor.offline"); return { total: 20, naturalD20: 15 }; } }, socket: { executeAsGm: async (...args) => calls.push(args) } };
    const app = new App(api, session, "Actor.offline");
    app.selectedHarvestSkill = "sur";
    await bind(app, `[data-action='${action}']`, { dataset: { skill: "sur" } })();
    assert.equal(calls[0][1].userId, "disconnected");
    assert.equal((calls[0][1].attempts?.[0] ?? calls[0][1]).actorUuid, "Actor.offline");
    assert.equal((calls[0][1].attempts?.[0] ?? calls[0][1]).total, 20);
  });
}

test("recipe editor round-trips nested choices and legacy complete alternatives without losing ingredients", async () => {
  setup();
  const material = id => ({ quantity: 1, sameMaterial: false, match: { materialId: id } });
  const recipe = { id: "original", output: { uuid: "Item.crest", label: "Crest", rarity: "rare" }, requirementGroups: [
    { id: "option-1", requirements: [material("animus"), { type: "alternatives", alternatives: [material("spine"), material("ribs")] }, material("dust")] },
    { id: "option-2", requirements: [material("legacy-alternative")] }
  ] };
  let saved;
  const app = new CustomRecipeEditorApp({ materials: { get: () => null }, customRecipes: { save: async value => { saved = value; } }, recipes: { loadStandardSeed: async () => {} } }, { recipe });
  assert.equal(app.groups.length, 4);
  assert.equal(app.groups[1].requirements.length, 2);
  await bind(app, "[data-action='save']")();
  assert.deepEqual(saved.requirementGroups, recipe.requirementGroups);
  assert.equal(saved.output.rarity, "rare");
});

test("recipe facets count the visible catalog and cards expose tool checks and a named facility", async () => {
  setup();
  game.settings.get = () => '["unknown"]';
  const material = { id: "iron", materialId: "iron", name: "Iron", tags: ["metal"], rarity: "common" };
  const recipes = ["known", "unknown"].map(id => ({ id, name: id, packId: "test", category: "weapon", rarity: "uncommon", tags: [],
    craft: { tool: "Smith's Tools", ability: "Strength", dc: 13, noToolDc: 18, environment: { facility: { type: "forge", tier: "uncommon" } } },
    output: { type: "catalog-item", label: "Sword" }, requirementGroups: [{ requirements: [{ quantity: 1, match: { materialId: "iron" } }] }] }));
  const app = new RecipeBrowserApp({
    crafterContext: { availableCharacters: () => [], resolve: () => null }, markedRecipes: { list: () => [] },
    recipes: { all: () => recipes, search: () => recipes, packs: () => [{ id: "test" }] },
    materials: { get: () => material, all: () => [material] },
    recipePlanner: { plan: () => ({ requirementGroups: [] }) },
    craftingEnvironment: { facilityOptions: () => ({ types: [{ id: "forge", name: "Forge" }] }) }
  });
  const context = await app._prepareContext();
  assert.deepEqual(context.knowledgeFilters.map(row => row.count), [1, 1]);
  assert.equal(context.categories[0].count, 2);
  assert.equal(context.packs[0].recipeCount, 2);
  assert.equal(context.toolFilters[0].count, 2);
  assert.equal(context.ingredientRarities.find(row => row.id === "uncommon").count, 2);
  assert.equal(context.ingredientTagGroups.flatMap(group => group.options).find(row => row.id === "metal").count, 2);
  const card = context.recipeGroups[0].recipes[0];
  assert.equal(card.craftMeta.check, "Smith's Tools");
  assert.equal(card.craftMeta.dc, 13);
  assert.equal(card.craftMeta.facilityType, "Forge");
  assert.equal(context.hasToolChecks, true);
  app.unknownFilterState = 1;
  assert.equal((await app._prepareContext()).prospectiveCount, 1);
});

test("recipe browsing snapshots materials once and uses indexed outputs without loading full documents", async () => {
  setup();
  game.settings.get = () => "[]";
  let reads = 0;
  const resolutions = [];
  globalThis.fromUuid = async uuid => {
    resolutions.push(uuid);
    return { documentName: "Item", uuid, name: "Live name", img: "live.webp" };
  };
  const materials = Array.from({ length: 60 }, (_, i) => ({ id: `m${i}`, materialId: `m${i}`, name: `Material ${i}`, rarity: "common", tags: [`tag-${i % 10}`] }));
  const recipes = Array.from({ length: 30 }, (_, i) => ({
    id: `r${i}`, name: `Recipe ${i}`, packId: "test", category: "weapon", rarity: "common", tags: [], craft: {},
    output: { type: "foundry-item", uuid: `Compendium.test.items.Item.${i}`, label: `Output ${i}`, img: "indexed.webp" },
    requirementGroups: [{ requirements: [{ quantity: 1, match: { rarity: "common" } }] }]
  }));
  const app = new RecipeBrowserApp({
    crafterContext: { availableCharacters: () => [], resolve: () => null }, markedRecipes: { list: () => [] },
    recipes: { all: () => recipes, search: () => recipes, packs: () => [{ id: "test" }] },
    materials: { all: () => { reads++; return materials; }, get: id => materials.find(material => material.id === id) },
    recipePlanner: { plan: () => ({ requirementGroups: [] }) }, craftingEnvironment: { facilityOptions: () => ({ types: [] }) }
  });
  const first = await app._prepareContext();
  assert.equal(reads, 1);
  assert.deepEqual(resolutions, []);
  const tags = first.ingredientTagGroups.flatMap(group => group.options);
  assert.equal(tags.length, 10);
  assert.ok(tags.every(tag => tag.count === 30));
  assert.equal(first.recipeGroups[0].recipes[0].outputDocumentUuid, recipes[0].output.uuid);

  // The snapshot belongs to this render: catalog edits cannot leave stale facets.
  materials.forEach(material => { material.tags = ["changed"]; });
  recipes[0].output.uuid = "Item.world";
  delete recipes[1].output.img;
  const second = await app._prepareContext();
  assert.equal(reads, 2);
  assert.deepEqual(new Set(resolutions), new Set(["Item.world", recipes[1].output.uuid]));
  const changedTags = second.ingredientTagGroups.flatMap(group => group.options);
  assert.deepEqual(changedTags.map(tag => [tag.id, tag.count]), [["changed", 30]]);
  assert.equal(second.recipeGroups[0].recipes.find(recipe => recipe.id === "r0").output.label, "Live name");
});
