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
const { CraftworksSettingsApp } = await import("../scripts/ui/craftworks-settings-app.mjs");
const { getContentPackManifest } = await import("../data/packs/manifests.mjs");

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

test("pack cards count loaded recipes from each book and add up to the dashboard total", async () => {
  const resolver = new Dnd5eCompendiumItemResolver();
  index(resolver, "Player's Handbook", ["Splint Armor", "Dart", "Robe"]);
  index(resolver, "Dungeon Master's Guide", ["Dart"]);
  index(resolver, "SRD 5.2", ["Robe", "Splint Armor", "Spell Scroll, 2nd Level", "Arrows"]);
  index(resolver, "SRD 5.1", ["Robes", "Piton", "Arrow"]);
  index(resolver, "Monsters of Drakkenheim", ["Amulet of Incineration"]);

  const contentPacks = { isEnabled: () => true, describe: () => null };
  const recipes = new RecipeRegistry({
    materialRegistry: { get: () => null },
    contentPacks,
    dnd5eItemResolver: resolver
  });
  await recipes.loadStandardSeed();

  const loaded = recipes.all();
  const phb = loaded.filter(recipe => recipe.packId === "phb");
  const dmg = loaded.filter(recipe => recipe.packId === "dmg");
  assert.ok(phb.some(recipe => recipe.name === "Splint"));
  assert.ok(phb.some(recipe => recipe.name === "10 x Dart"));
  assert.ok(dmg.some(recipe => recipe.name === "10 x Dart"));
  assert.equal(dmg.some(recipe => recipe.name === "Splint"), false);
  assert.ok(phb.length > dmg.length);

  CraftworksSettingsApp.craftworks = {
    contentPacks,
    recipes,
    craftingEnvironment: { facilityOptions: () => ({ types: [] }) }
  };
  const context = await new CraftworksSettingsApp()._prepareContext({});
  const counts = new Map(context.packs.map(pack => [pack.id, pack.counts.recipes]));

  assert.equal(counts.get("phb"), phb.length);
  assert.equal(counts.get("dmg"), dmg.length);
  assert.notEqual(counts.get("phb"), counts.get("dmg"));
  assert.notEqual(counts.get("phb"), getContentPackManifest("phb").recipes.length);
  assert.notEqual(counts.get("dmg"), getContentPackManifest("dmg").recipes.length);

  const cardTotal = [...counts.values()].reduce((sum, count) => sum + count, 0);
  // The dashboard Recipes tile uses recipes.all() for the GM.
  assert.equal(cardTotal, loaded.length);
  assert.equal(cardTotal, recipes.all().length);
});
