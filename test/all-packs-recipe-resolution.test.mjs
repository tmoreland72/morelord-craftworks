import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

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
const { countLoadedHiddenRecipes } = await import("../scripts/core/settings.mjs");

const ALL = [
  "standard-core",
  "srd-5.2",
  "srd-5.1",
  "phb",
  "dmg",
  "monsters-of-drakkenheim"
];

function registry({ resolver, materials = new Map(), sourceFilter = null }) {
  const enabled = new Set(ALL);
  return new RecipeRegistry({
    materialRegistry: {
      get: id => materials.get(id) ?? null,
      all: () => [...materials.values()]
    },
    contentPacks: { isEnabled: id => enabled.has(id) },
    dnd5eItemResolver: resolver ?? new Dnd5eCompendiumItemResolver({ sourceFilter })
  });
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

function counts(recipes) {
  const byPack = {};
  for (const recipe of recipes.all()) {
    byPack[recipe.packId] = (byPack[recipe.packId] ?? 0) + 1;
  }
  return { total: recipes.all().length, byPack };
}

test("a book-pack recipe still resolves Craftworks Standard materials", async () => {
  const resolver = new Dnd5eCompendiumItemResolver();
  index(resolver, "Player's Handbook", ["Splint Armor"]);
  index(resolver, "SRD 5.2", []);
  index(resolver, "SRD 5.1", []);
  index(resolver, "Dungeon Master's Guide", []);
  index(resolver, "Monsters of Drakkenheim", []);
  const recipes = registry({
    resolver,
    materials: new Map([
      ["iron-ingot", { materialId: "iron-ingot", name: "Iron Ingot", packId: "standard-core" }],
      ["armor-padding", { materialId: "armor-padding", name: "Armor Padding", packId: "standard-core" }]
    ])
  });
  await recipes.loadStandardSeed();
  const splint = recipes.all().find(recipe => recipe.name === "Splint");
  assert.equal(splint.packId, "phb");
  const labels = splint.requirementGroups.flatMap(group =>
    group.requirements.map(requirement => requirement.display)
  );
  assert.ok(labels.some(label => label.includes("Iron Ingot")));
  assert.ok(labels.some(label => label.includes("Armor Padding")));
});

test("Configure Sources does not drop recipes from an enabled Craftworks pack", async () => {
  const pack = {
    collection: "dnd5e.equipment24",
    documentName: "Item",
    async getIndex() {
      return [{
        _id: "mucus",
        name: "Crawler Mucus",
        img: "icons/svg/item-bag.svg",
        type: "consumable",
        system: { rarity: "uncommon" }
      }];
    }
  };
  globalThis.game.packs = { get: id => id === pack.collection ? pack : null };
  const recipes = registry({
    sourceFilter: { isPackEnabled: () => false }
  });
  await recipes.loadStandardSeed();
  const loaded = recipes.all().find(recipe => recipe.name === "Crawler Mucus");
  assert.equal(loaded?.packId, "srd-5.2");
  assert.equal(
    await recipes.dnd5eItemResolver.resolve("Crawler Mucus", { sourceBook: "SRD 5.2" }),
    null
  );
});

test("a rarity-field index error does not drop the SRD item book", async () => {
  const pack = {
    collection: "dnd5e.equipment24",
    documentName: "Item",
    async getIndex({ fields }) {
      if (fields.includes("system.rarities")) {
        throw new Error("system.rarities is not an indexed field");
      }
      return [{
        _id: "mucus",
        name: "Crawler Mucus",
        img: "icons/svg/item-bag.svg",
        type: "consumable",
        system: {}
      }];
    }
  };
  globalThis.game.packs = { get: id => id === pack.collection ? pack : null };
  const recipes = registry({
    sourceFilter: { isPackEnabled: () => false }
  });
  await recipes.loadStandardSeed();
  assert.equal(
    recipes.all().find(recipe => recipe.name === "Crawler Mucus")?.packId,
    "srd-5.2"
  );
});

test("the unknown-ingredient count ignores hidden ids that are not loaded", () => {
  const loaded = [{ id: "phb-splint" }, { id: "dmg-dart" }];
  const hidden = new Set([
    "phb-splint",
    ...Array.from({ length: 230 }, (_, index) => `removed-${index}`)
  ]);
  assert.equal(countLoadedHiddenRecipes(loaded, hidden), 1);
  assert.equal(countLoadedHiddenRecipes(loaded, new Set()), 0);
});

function yamlNames(root) {
  const names = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".yml") && entry.name !== "_folder.yml") {
        const text = fs.readFileSync(full, "utf8");
        const match = text.match(/^name:\s*"?(.+?)"?\s*$/m);
        if (!match) continue;
        const name = match[1].replace(/^"|"$/g, "");
        if (!name.startsWith("Activate ")) names.push(name);
      }
    }
  };
  walk(root);
  return names;
}

const srdRoot = "/tmp/dnd5e/packs/_source";
const paidPath = "/home/ubuntu/.cursor/projects/workspace/uploads/item-names_3185.json";
const indexesReady = fs.existsSync(path.join(srdRoot, "equipment24")) && fs.existsSync(paidPath);

test("installed compendiums load 288 unique recipes, or 265 without the SRD books", { skip: indexesReady ? false : "local item indexes are not in this checkout" }, async () => {
  const paid = JSON.parse(fs.readFileSync(paidPath, "utf8"));
  const paidNames = key => (paid[key]?.names ?? []).filter(name => !String(name).startsWith("Activate "));
  const rowsFor = names => names.map((name, index) => ({
    _id: String(index),
    name,
    img: "icons/svg/item-bag.svg",
    type: "loot",
    system: { rarity: "common" }
  }));
  const collections = {
    "dnd5e.equipment24": rowsFor(yamlNames(path.join(srdRoot, "equipment24"))),
    "dnd5e.items": rowsFor(yamlNames(path.join(srdRoot, "items"))),
    "dnd5e.tradegoods": rowsFor(yamlNames(path.join(srdRoot, "tradegoods"))),
    "dnd-players-handbook.equipment": rowsFor(paidNames("dnd-players-handbook.equipment")),
    "dnd-dungeon-masters-guide.equipment": rowsFor(paidNames("dnd-dungeon-masters-guide.equipment")),
    "drakkenheim-monsters.items": rowsFor(paidNames("drakkenheim-monsters.items")),
    "drakkenheim-core.items": rowsFor(paidNames("drakkenheim-core.items")),
    "drakkenheim-scgd.items": rowsFor(paidNames("drakkenheim-scgd.items"))
  };
  const use = included => {
    globalThis.game.packs = {
      get: id => included.has(id)
        ? { collection: id, documentName: "Item", getIndex: async () => collections[id] }
        : null
    };
  };

  use(new Set(Object.keys(collections)));
  const linkedDespiteSources = registry({ sourceFilter: { isPackEnabled: () => false } });
  await linkedDespiteSources.loadStandardSeed();
  assert.deepEqual(counts(linkedDespiteSources), {
    total: 288,
    byPack: {
      "srd-5.2": 16,
      "srd-5.1": 7,
      phb: 55,
      dmg: 134,
      "monsters-of-drakkenheim": 76
    }
  });

  use(new Set([
    "dnd-players-handbook.equipment",
    "dnd-dungeon-masters-guide.equipment",
    "drakkenheim-monsters.items",
    "drakkenheim-core.items",
    "drakkenheim-scgd.items"
  ]));
  const withoutSrdBooks = registry({});
  await withoutSrdBooks.loadStandardSeed();
  assert.deepEqual(counts(withoutSrdBooks), {
    total: 265,
    byPack: {
      phb: 55,
      dmg: 134,
      "monsters-of-drakkenheim": 76
    }
  });
});
