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
  user: { isGM: true },
  packs: { get: () => null }
};

const { RecipeRegistry, recipeItemKey } = await import("../scripts/recipes/recipe-registry.mjs");
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

function registry(resolver, enabledIds) {
  const enabled = new Set(enabledIds);
  return new RecipeRegistry({
    materialRegistry: { get: () => null },
    contentPacks: { isEnabled: id => enabled.has(id) },
    dnd5eItemResolver: resolver
  });
}

const ALL = [
  "standard-core",
  "srd-5.2",
  "srd-5.1",
  "phb",
  "dmg",
  "monsters-of-drakkenheim"
];

const DMG_RENAMES = [
  "Carrion Crawler Mucus",
  "Quiver of Ehlonna",
  "Quaal's Feather Token (Bird)",
  "Quaal's Feather Token (Swan Boat)",
  "Quaal's Feather Token (Whip)",
  "Quaal's Feather Token",
  "Heward's Handy Haversack",
  "Daern's Instant Fortress",
  "Keoghtom's Ointment",
  "Belt of Giant Strength (stone)",
  "Belt of Giant Strength (storm)",
  "Belt of Giant Strength",
  "Saddle of the Cavalier",
  "Spell Scroll"
];

const SRD_SHORT_NAMES = [
  "Crawler Mucus",
  "Efficient Quiver",
  "Feather Token (Bird)",
  "Feather Token (Swan Boat)",
  "Feather Token (Whip)",
  "Handy Haversack",
  "Instant Fortress",
  "Restorative Ointment",
  "Belt of Stone Giant Strength",
  "Belt of Storm Giant Strength",
  "Saddle, Exotic",
  "Saddle, Pack",
  "Saddlebag",
  "Merchant’s Scale",
  "Spell Scroll, Cantrip"
];

function renamedResolver() {
  const resolver = new Dnd5eCompendiumItemResolver();
  index(resolver, "Player's Handbook", ["Quiver", "Spell Scroll, Cantrip", "Spell Scroll, Level 1"]);
  index(resolver, "Dungeon Master's Guide", DMG_RENAMES);
  index(resolver, "SRD 5.2", SRD_SHORT_NAMES);
  index(resolver, "SRD 5.1", SRD_SHORT_NAMES);
  index(resolver, "Monsters of Drakkenheim", ["Spell Scroll"]);
  return resolver;
}

function one(recipes, name) {
  const matches = recipes.all().filter(recipe => recipe.name === name);
  assert.equal(matches.length, 1, name);
  return matches[0];
}

test("renamed SRD items load once from the Dungeon Master's Guide", async () => {
  const resolver = renamedResolver();
  const recipes = registry(resolver, ALL);
  await recipes.loadStandardSeed();

  const expected = [
    ["Crawler Mucus", "Carrion Crawler Mucus"],
    ["Efficient Quiver", "Quiver of Ehlonna"],
    ["Feather Token (Bird)", "Quaal's Feather Token (Bird)"],
    ["Feather Token (Swan Boat)", "Quaal's Feather Token (Swan Boat)"],
    ["Feather Token (Whip)", "Quaal's Feather Token (Whip)"],
    ["Handy Haversack", "Heward's Handy Haversack"],
    ["Instant Fortress", "Daern's Instant Fortress"],
    ["Restorative Ointment", "Keoghtom's Ointment"],
    ["Belt of Stone Giant Strength", "Belt of Giant Strength (stone)"],
    ["Belt of Storm Giant Strength", "Belt of Giant Strength (storm)"]
  ];

  for (const [recipeName, itemName] of expected) {
    const recipe = one(recipes, recipeName);
    assert.equal(recipe.packId, "dmg", recipeName);
    assert.equal(recipe.output.label, itemName, recipeName);
  }

  assert.equal(one(recipes, "Saddle, Exotic").packId, "srd-5.2");
  assert.equal(one(recipes, "Saddle, Pack").packId, "srd-5.2");
  assert.equal(one(recipes, "Saddlebag").packId, "srd-5.2");
  assert.equal(one(recipes, "Merchant’s Scale").packId, "srd-5.2");
  assert.equal(
    recipes.all().some(recipe => recipe.output.label === "Saddle of the Cavalier"),
    false
  );
  assert.equal(
    recipes.all().some(recipe => recipe.output.label === "Quiver"),
    false
  );
});

test("a renamed item falls through to SRD when the Dungeon Master's Guide is off", async () => {
  const resolver = renamedResolver();
  const recipes = registry(resolver, ALL.filter(id => id !== "dmg"));
  await recipes.loadStandardSeed();

  for (const name of [
    "Feather Token (Bird)",
    "Feather Token (Swan Boat)",
    "Feather Token (Whip)",
    "Handy Haversack",
    "Instant Fortress",
    "Crawler Mucus",
    "Efficient Quiver"
  ]) {
    const recipe = one(recipes, name);
    assert.equal(recipe.packId, "srd-5.2", name);
    assert.equal(recipe.output.label, name, name);
  }

  assert.equal(one(recipes, "Restorative Ointment").packId, "srd-5.2");
  assert.equal(one(recipes, "Belt of Stone Giant Strength").packId, "srd-5.2");
});

test("two possessive handbook titles do not merge", async () => {
  const resolver = new Dnd5eCompendiumItemResolver();
  index(resolver, "Dungeon Master's Guide", [
    "Quaal's Feather Token (Bird)",
    "Alice's Feather Token (Bird)"
  ]);
  index(resolver, "SRD 5.2", ["Feather Token (Bird)"]);
  index(resolver, "Player's Handbook", []);
  index(resolver, "SRD 5.1", []);
  index(resolver, "Monsters of Drakkenheim", []);
  const recipes = registry(resolver, ALL);
  await recipes.loadStandardSeed();

  const recipe = one(recipes, "Feather Token (Bird)");
  assert.equal(recipe.packId, "srd-5.2");
  assert.equal(recipe.output.label, "Feather Token (Bird)");
  assert.equal(
    recipeItemKey("Quaal's Feather Token (Bird)", "long", resolver),
    "quaalsfeathertokenbird"
  );
  assert.notEqual(
    recipeItemKey("Quaal's Feather Token (Bird)", "long", resolver),
    recipeItemKey("Feather Token (Bird)", "short", resolver)
  );
});

test("a unique possessive title shares the unprefixed recipe key", async () => {
  const resolver = renamedResolver();
  assert.equal(
    recipeItemKey("Quaal's Feather Token (Bird)", "long", resolver),
    recipeItemKey("Feather Token (Bird)", "short", resolver)
  );
  assert.equal(
    recipeItemKey("Daern's Instant Fortress", "long", resolver),
    recipeItemKey("Instant Fortress", "short", resolver)
  );
  assert.equal(
    recipeItemKey("Heward's Handy Haversack", "long", resolver),
    recipeItemKey("Handy Haversack", "short", resolver)
  );
  assert.equal(
    recipeItemKey("Carrion Crawler Mucus", "long"),
    recipeItemKey("Crawler Mucus", "short")
  );

  const empty = new Dnd5eCompendiumItemResolver();
  index(empty, "Player's Handbook", []);
  index(empty, "Dungeon Master's Guide", []);
  assert.notEqual(
    recipeItemKey("Quaal's Feather Token (Bird)", "long", empty),
    recipeItemKey("Feather Token (Bird)", "short", empty)
  );
});

test("generic level spell recipes stay out of the catalog", async () => {
  const resolver = renamedResolver();
  index(resolver, "SRD 5.2", [
    ...SRD_SHORT_NAMES,
    "Spell Scroll, 1st Level",
    "Spell Scroll, 2nd Level",
    "Spell Scroll, 3rd Level",
    "Spell Scroll, 4th Level",
    "Spell Scroll, 5th Level",
    "Spell Scroll, 6th Level",
    "Spell Scroll, 7th Level",
    "Spell Scroll, 8th Level",
    "Spell Scroll, 9th Level"
  ]);
  const recipes = registry(resolver, ALL);
  await recipes.loadStandardSeed();
  const names = recipes.all().map(recipe => recipe.name);

  for (const level of ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th"]) {
    assert.equal(names.includes(`${level}-Level Spell`), false, level);
  }

  const cantrip = one(recipes, "Cantrip");
  assert.equal(cantrip.packId, "phb");
  assert.equal(cantrip.output.label, "Spell Scroll, Cantrip");

  for (const tier of [
    "Cantrip or 1st Level",
    "2nd or 3rd Level",
    "4th or 5th Level",
    "6th, 7th, or 8th Level",
    "9th Level"
  ]) {
    const recipe = one(recipes, `Spell Scroll (${tier})`);
    assert.equal(recipe.packId, "monsters-of-drakkenheim");
    assert.equal(recipe.output.label, "Spell Scroll");
  }
});
