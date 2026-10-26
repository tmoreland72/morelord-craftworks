import assert from "node:assert/strict";
import test from "node:test";
import { CONTENT_PACKS, getContentPackSettingKey } from "../data/content-packs.mjs";
import { CONTENT_PACK_MANIFESTS } from "../data/packs/manifests.mjs";

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

const { RecipeRegistry } = await import("../scripts/recipes/recipe-registry.mjs");
const { Dnd5eCompendiumItemResolver } = await import("../scripts/recipes/dnd5e-compendium-item-resolver.mjs");
const { ContentPackService } = await import("../scripts/core/content-pack-service.mjs");
const {
  ensureStandardContentEnabled,
  isContentPackEnabled,
  pruneHiddenRecipeIds
} = await import("../scripts/core/settings.mjs");

function installSettings(stored) {
  globalThis.game.settings.get = (_module, key) => {
    if (Object.prototype.hasOwnProperty.call(stored, key)) return stored[key];
    const pack = CONTENT_PACKS.find(entry => getContentPackSettingKey(entry.id) === key);
    if (pack) return Boolean(pack.enabledByDefault);
    if (key === "hiddenRecipeIds") return "[]";
    return "{}";
  };
}

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

function registry() {
  const resolver = new Dnd5eCompendiumItemResolver();
  index(resolver, "Player's Handbook", ["Splint Armor", "Potion of Healing", "Arrows"]);
  index(resolver, "Dungeon Master's Guide", ["Potion of Healing", "Arrows"]);
  index(resolver, "SRD 5.2", ["Crawler Mucus", "Splint Armor", "Potion of Healing", "Arrows"]);
  index(resolver, "SRD 5.1", ["Potion of Healing", "Arrows"]);
  index(resolver, "Monsters of Drakkenheim", ["Amulet of Incineration"]);
  return new RecipeRegistry({
    materialRegistry: { get: () => null },
    contentPacks: new ContentPackService({ coreAccess: { hasAccess: () => true } }),
    dnd5eItemResolver: resolver
  });
}

test.describe("content pack settings drive the recipe registry", { concurrency: false }, () => {
  test("stored SRD settings stay off even when those item indexes exist", async () => {
    const stored = {};
    for (const pack of CONTENT_PACKS) {
      stored[getContentPackSettingKey(pack.id)] = !pack.id.startsWith("srd-");
    }
    assert.equal(getContentPackSettingKey("srd-5.2"), "recipePackEnabled_srd_5_2");
    assert.equal(getContentPackSettingKey("srd-5.1"), "recipePackEnabled_srd_5_1");
    installSettings(stored);

    assert.equal(isContentPackEnabled("srd-5.2"), false);
    assert.equal(isContentPackEnabled("srd-5.1"), false);
    assert.equal(isContentPackEnabled("phb"), true);
    assert.equal(isContentPackEnabled("dmg"), true);
    assert.equal(isContentPackEnabled("monsters-of-drakkenheim"), true);

    const recipes = registry();
    await recipes.loadStandardSeed();
    const loaded = recipes.all();
    assert.equal(loaded.some(recipe => recipe.packId === "srd-5.2"), false);
    assert.equal(loaded.some(recipe => recipe.packId === "srd-5.1"), false);
    assert.equal(loaded.some(recipe => recipe.name === "Crawler Mucus"), false);
    assert.equal(loaded.find(recipe => recipe.name === "Splint")?.packId, "phb");
    assert.equal(loaded.find(recipe => recipe.name === "Amulet of Incineration")?.packId, "monsters-of-drakkenheim");
  });

  test("an unsaved SRD pack uses the enabled default", async () => {
    installSettings({
      [getContentPackSettingKey("standard-core")]: true,
      [getContentPackSettingKey("phb")]: false,
      [getContentPackSettingKey("dmg")]: false,
      [getContentPackSettingKey("monsters-of-drakkenheim")]: false
    });
    assert.equal(isContentPackEnabled("srd-5.2"), true);
    assert.equal(isContentPackEnabled("srd-5.1"), true);

    const recipes = registry();
    await recipes.loadStandardSeed();
    assert.equal(recipes.all().find(recipe => recipe.name === "Crawler Mucus")?.packId, "srd-5.2");
  });

  test("the standard-content bootstrap writes SRD 5.2 once and leaves a saved choice alone", async () => {
    const sets = [];
    let bootstrapped = false;
    globalThis.game.user = { isGM: true };
    globalThis.game.settings.get = (_module, key) => key === "standardContentBootstrapped" ? bootstrapped : false;
    globalThis.game.settings.set = async (_module, key, value) => {
      sets.push([key, value]);
      if (key === "standardContentBootstrapped") bootstrapped = value;
    };

    assert.equal(await ensureStandardContentEnabled(), true);
    assert.deepEqual(sets, [
      ["recipePackEnabled_standard_core", true],
      ["recipePackEnabled_srd_5_2", true],
      ["standardContentBootstrapped", true]
    ]);

    sets.length = 0;
    assert.equal(await ensureStandardContentEnabled(), false);
    assert.deepEqual(sets, []);
  });

  test("hidden ids that are not current recipes are removed", async () => {
    let hidden = JSON.stringify([
      "phb-alchemy-antitoxin",
      "removed-recipe",
      "also-gone"
    ]);
    globalThis.game.settings.get = (_module, key) => key === "hiddenRecipeIds" ? hidden : "{}";
    globalThis.game.settings.set = async (_module, key, value) => {
      if (key === "hiddenRecipeIds") hidden = value;
    };
    const ids = CONTENT_PACK_MANIFESTS.flatMap(manifest =>
      (manifest.recipes ?? []).map(recipe => recipe.id)
    );
    assert.ok(ids.includes("phb-alchemy-antitoxin"));

    const kept = await pruneHiddenRecipeIds([...ids, "custom-world-recipe"]);
    assert.equal(kept.has("phb-alchemy-antitoxin"), true);
    assert.equal(kept.has("removed-recipe"), false);
    assert.equal(kept.has("also-gone"), false);
    assert.deepEqual(JSON.parse(hidden), ["phb-alchemy-antitoxin"]);

    const again = await pruneHiddenRecipeIds(ids);
    assert.equal(again.has("phb-alchemy-antitoxin"), true);
    assert.equal(hidden, JSON.stringify(["phb-alchemy-antitoxin"]));
  });
});
