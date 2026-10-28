import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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

const allowed = new Set([
  "dnd-players-handbook.equipment",
  "dnd5e.equipment24",
  "drakkenheim-scgd.items"
]);

function installSources() {
  globalThis.game = {
    actors: [],
    packs: { get: () => null },
    settings: { get: () => "{}", set: async () => {} },
    user: { isGM: true },
    modules: new Map([["morelord-core", { api: { sources: {
      getAllowedPack(collection) {
        return allowed.has(collection) ? { collection, documentName: "Item" } : null;
      },
      getAllowedPacks() {
        return [...allowed].map(collection => ({ collection, documentName: "Item" }));
      },
      isUuidAllowed(uuid) {
        const parts = String(uuid ?? "").split(".");
        if (parts[0] !== "Compendium" || parts.length < 5) return true;
        return allowed.has(`${parts[1]}.${parts[2]}`);
      }
    } } }]])
  };
}

installSources();

const { RecipeRegistry, recipeOutputAllowed } = await import("../scripts/recipes/recipe-registry.mjs");
const { Dnd5eCompendiumItemResolver } = await import("../scripts/recipes/dnd5e-compendium-item-resolver.mjs");
const { refreshAfterConfigureSourcesChange } = await import("../scripts/core/configure-sources-refresh.mjs");
const { allowedUuid } = await import("../scripts/core/allowed-packs.mjs");

const BOOKS = [
  "SRD 5.2",
  "SRD 5.1",
  "Player's Handbook",
  "Dungeon Master's Guide",
  "Monsters of Drakkenheim"
];

function catalogItem(name, collection, id, sourceBook) {
  return {
    name,
    uuid: `Compendium.${collection}.Item.${id}`,
    img: "icons/svg/item-bag.svg",
    packId: collection,
    sourceBook,
    rarity: "common"
  };
}

function resolverWith(entries) {
  const resolver = new Dnd5eCompendiumItemResolver();
  for (const book of BOOKS) resolver._bySourceBook.set(book, new Map());
  for (const entry of entries) {
    resolver._bySourceBook.get(entry.sourceBook).set(resolver.normalizeName(entry.name), entry);
  }
  return resolver;
}

function registry(resolver) {
  return new RecipeRegistry({
    materialRegistry: { get: () => null, all: () => [] },
    contentPacks: { isEnabled: () => true },
    dnd5eItemResolver: resolver
  });
}

test("a disabled output compendium drops the recipe instead of keeping a card", async () => {
  const resolver = resolverWith([
    catalogItem("Antitoxin", "dnd-players-handbook.equipment", "antitoxin", "Player's Handbook"),
    catalogItem("Antitoxin", "dnd5e.equipment24", "antitoxin", "SRD 5.2")
  ]);
  const recipes = registry(resolver);
  await recipes.loadStandardSeed();
  const loaded = recipes.all().find(recipe => recipe.name === "Antitoxin");
  assert.equal(loaded.packId, "phb");
  assert.equal(loaded.output.uuid, "Compendium.dnd-players-handbook.equipment.Item.antitoxin");

  allowed.delete("dnd-players-handbook.equipment");
  assert.equal(recipeOutputAllowed(loaded), false);
  assert.equal(recipes.all().find(recipe => recipe.name === "Antitoxin"), undefined);
  assert.equal(recipes.all({ includeDisabled: true }).some(recipe => recipe.name === "Antitoxin"), false);
  assert.equal(recipes.get(loaded.id), null);
  assert.deepEqual(recipes.search("Antitoxin"), []);

  await recipes.loadStandardSeed();
  const promoted = recipes.all().find(recipe => recipe.name === "Antitoxin");
  assert.equal(promoted.packId, "srd-5.2");
  assert.equal(promoted.output.sourcePackId, "dnd5e.equipment24");
  allowed.add("dnd-players-handbook.equipment");
});

test("a recipe item name does not fall back to another allowed pack", async () => {
  const longsword = catalogItem("Longsword", "drakkenheim-scgd.items", "longsword", "Monsters of Drakkenheim");
  const resolver = resolverWith([longsword]);
  const recipes = registry(resolver);
  await recipes.loadStandardSeed();
  assert.equal(
    recipes.all().some(recipe => recipe.output?.uuid?.includes("drakkenheim-scgd")),
    false
  );
  assert.equal(
    await resolver.resolveRecipeItem("Longsword", { sourceBook: "Player's Handbook" }),
    null
  );
  assert.equal(
    await resolver.resolveRecipeItem("Longsword", { sourceBook: "SRD 5.2" }),
    null
  );
  assert.equal(
    (await resolver.resolveAny("Longsword", { preferredSourceBook: "Player's Handbook" }))?.packId,
    "drakkenheim-scgd.items"
  );
  assert.equal(allowedUuid(longsword.uuid), longsword.uuid);
  allowed.delete("drakkenheim-scgd.items");
  assert.equal(allowedUuid(longsword.uuid), null);
  assert.equal(
    await resolver.resolveRecipeItem("Longsword", { sourceBook: "Monsters of Drakkenheim" }),
    null
  );
  allowed.add("drakkenheim-scgd.items");
});

test("Configure Sources changes refresh catalogs and open Craftworks windows", async () => {
  const calls = [];
  const window = {
    rendered: true,
    options: { classes: ["ml-craftworks-window"] },
    catalog: [{ name: "stale" }],
    async render() { calls.push("render"); }
  };
  const dialog = {
    rendered: true,
    options: { classes: ["ml-window", "ml-craftworks-module"] },
    async render() { calls.push("dialog"); }
  };
  await refreshAfterConfigureSourcesChange({
    itemResolver: { async refresh() { calls.push("resolver"); } },
    materials: { async indexConfiguredPacks() { calls.push("materials"); } },
    recipes: { async loadStandardSeed() { calls.push("recipes"); } },
    specialTreasure: { invalidateCache() { calls.push("treasure"); } },
    clearDrakkenheim() { calls.push("drakkenheim"); },
    applications: [window, dialog, { rendered: false, options: { classes: ["ml-craftworks-window"] }, async render() { calls.push("closed"); } }]
  });
  assert.deepEqual(calls, ["resolver", "materials", "recipes", "treasure", "drakkenheim", "render"]);
  assert.equal(window.catalog, null);

  const main = readFileSync(new URL("../scripts/main.mjs", import.meta.url), "utf8");
  const refresh = readFileSync(new URL("../scripts/core/configure-sources-refresh.mjs", import.meta.url), "utf8");
  const browser = readFileSync(new URL("../scripts/ui/recipe-browser-app.mjs", import.meta.url), "utf8");
  const craft = readFileSync(new URL("../scripts/ui/craft-app.mjs", import.meta.url), "utf8");
  assert.match(main, /CONFIGURE_SOURCES_CHANGED/);
  assert.match(refresh, /morelordCoreConfigureSourcesChanged/);
  assert.match(browser, /resolveRecipeItem/);
  assert.match(craft, /resolveRecipeItem/);
  assert.equal(browser.includes("resolveAny"), false);
  assert.equal(craft.includes("resolveAny"), false);
});
