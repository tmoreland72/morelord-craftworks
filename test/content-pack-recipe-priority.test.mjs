import test from "node:test";
import assert from "node:assert/strict";

globalThis.foundry = {
  applications: {
    api: {
      ApplicationV2: class { async _prepareContext() { return {}; } async _onRender() {} },
      HandlebarsApplicationMixin: Base => Base
    }
  },
  utils: { mergeObject: (original, extra) => ({ ...original, ...extra }) }
};
globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
globalThis.game = {
  actors: [],
  modules: new Map(),
  settings: { get: () => "{}", set: async () => {} },
  user: { isGM: true }
};

const { RecipeRegistry } = await import("../scripts/recipes/recipe-registry.mjs");
const { Dnd5eCompendiumItemResolver } = await import("../scripts/recipes/dnd5e-compendium-item-resolver.mjs");

function index(resolver, sourceBook, names) {
  const entries = new Map();
  for (const name of names) {
    entries.set(resolver.normalizeName(name), {
      name,
      uuid: `Compendium.test.Item.${resolver.normalizeName(name)}`,
      img: "icons/svg/item-bag.svg",
      packId: "test",
      sourceBook,
      rarity: "common"
    });
  }
  resolver._bySourceBook.set(sourceBook, entries);
}

function registry(enabledIds) {
  const resolver = new Dnd5eCompendiumItemResolver();
  index(resolver, "Player's Handbook", ["Potion of Healing", "Splint Armor", "Arrows"]);
  index(resolver, "Dungeon Master's Guide", ["Potion of Healing", "Arrows"]);
  index(resolver, "SRD 5.2", ["Potion of Healing", "Splint Armor", "Arrows"]);
  index(resolver, "SRD 5.1", ["Potion of Healing", "Arrows"]);
  index(resolver, "Monsters of Drakkenheim", ["Amulet of Incineration"]);
  const enabled = new Set(enabledIds);
  return new RecipeRegistry({
    materialRegistry: { get: () => null },
    contentPacks: { isEnabled: id => enabled.has(id) },
    dnd5eItemResolver: resolver
  });
}

function supplied(recipes, name) {
  const matches = recipes.all().filter(recipe => recipe.name === name);
  assert.equal(matches.length, 1, name);
  return matches[0].packId;
}

const ALL = [
  "standard-core",
  "srd-5.2",
  "srd-5.1",
  "phb",
  "dmg",
  "monsters-of-drakkenheim"
];

test("a shared recipe loads once from the highest-priority enabled source", async () => {
  const recipes = registry(ALL);
  await recipes.loadStandardSeed();

  assert.equal(supplied(recipes, "Potion of Healing"), "monsters-of-drakkenheim");
  assert.equal(supplied(recipes, "10 x Arrow"), "dmg");
  assert.equal(supplied(recipes, "Splint"), "phb");
  assert.equal(supplied(recipes, "Amulet of Incineration"), "monsters-of-drakkenheim");

  const names = recipes.all().map(recipe => recipe.name);
  assert.equal(new Set(names).size, names.length);
});

test("disabling a higher-priority pack falls through to the next enabled source", async () => {
  const withoutDrakkenheim = registry(ALL.filter(id => id !== "monsters-of-drakkenheim"));
  await withoutDrakkenheim.loadStandardSeed();
  assert.equal(supplied(withoutDrakkenheim, "Potion of Healing"), "dmg");
  assert.equal(
    withoutDrakkenheim.all().some(recipe => recipe.name === "Amulet of Incineration"),
    false
  );

  const withoutDmg = registry(ALL.filter(id => id !== "dmg"));
  await withoutDmg.loadStandardSeed();
  assert.equal(supplied(withoutDmg, "10 x Arrow"), "phb");
  assert.equal(supplied(withoutDmg, "Potion of Healing"), "monsters-of-drakkenheim");

  const handbooksOff = registry(["srd-5.2", "srd-5.1", "standard-core"]);
  await handbooksOff.loadStandardSeed();
  assert.equal(supplied(handbooksOff, "10 x Arrow"), "srd-5.2");
  assert.equal(supplied(handbooksOff, "Splint"), "srd-5.2");
  assert.equal(supplied(handbooksOff, "Potion of Healing"), "srd-5.2");

  const onlySrd51 = registry(["srd-5.1"]);
  await onlySrd51.loadStandardSeed();
  assert.equal(supplied(onlySrd51, "10 x Arrow"), "srd-5.1");
  assert.equal(supplied(onlySrd51, "Potion of Healing"), "srd-5.1");
  assert.equal(onlySrd51.all().some(recipe => recipe.name === "Splint"), false);
});
