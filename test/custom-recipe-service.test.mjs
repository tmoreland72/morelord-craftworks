import test from "node:test";
import assert from "node:assert/strict";

import { CustomRecipeService } from "../scripts/recipes/custom-recipe-service.mjs";

function recipe(id = "portable-sword") {
  return {
    id, name: "Portable Sword",
    output: { type: "foundry-item", uuid: "Compendium.test.items.Item.sword", label: "Sword" },
    requirementGroups: [{ id: "default", requirements: [
      { quantity: 2, match: { materialId: "iron" } }
    ] }]
  };
}

function environment(initial = []) {
  const rows = initial.map((entry, index) => ({
    _id: String(index + 1), name: entry.name,
    flags: { "morelord-craftworks": { customRecipe: structuredClone(entry) } }
  }));
  const pack = {
    collection: "world.morelord-craftworks-custom-recipes",
    async getIndex() { return rows; }
  };
  globalThis.foundry = { utils: {
    deepClone: structuredClone,
    getProperty: (object, path) => path.split(".").reduce((value, key) => value?.[key], object)
  } };
  globalThis.game = { user: { isGM: true }, packs: new Map([[pack.collection, pack]]) };
  globalThis.CONFIG = { JournalEntry: { documentClass: class {
    static async createDocuments(documents) {
      for (const document of documents) rows.push({ _id: String(rows.length + 1), ...structuredClone(document) });
    }
    static async updateDocuments(documents) {
      for (const document of documents) Object.assign(rows.find(row => row._id === document._id), structuredClone(document));
    }
    static async deleteDocuments(ids) {
      for (const id of ids) rows.splice(rows.findIndex(row => row._id === id), 1);
    }
  } } };
  return { rows };
}

test("custom recipe exports are versioned and portable", () => {
  environment();
  const payload = JSON.parse(new CustomRecipeService().export(recipe()));
  assert.equal(payload.schema, "morelord-craftworks.custom-recipes");
  assert.equal(payload.version, 1);
  assert.equal(payload.recipes[0].id, "custom-compendium-test-items-item-sword");
});

test("custom recipes preserve AND groups with OR material choices and validate every choice", () => {
  environment();
  const entry = recipe();
  entry.requirementGroups[0].requirements.push({ type: "alternatives", alternatives: [
    { quantity: 1, match: { materialId: "spine" } },
    { quantity: 1, match: { materialId: "ribs" } }
  ] });
  const service = new CustomRecipeService();
  assert.deepEqual(JSON.parse(service.export(entry)).recipes[0].requirementGroups, entry.requirementGroups);
  entry.requirementGroups[0].requirements[1].alternatives[1].quantity = 0;
  assert.throws(() => service.export(entry), /invalid material/);
  entry.requirementGroups[0].requirements[1].alternatives = [];
  assert.throws(() => service.export(entry), /at least one material choice/);
});

test("import identifies conflicts by output UUID and supports skip and replace", async () => {
  environment([recipe("custom-compendium-test-items-item-sword")]);
  const service = new CustomRecipeService();
  const json = service.export(recipe());
  assert.equal((await service.import(json, { conflict: "skip" })).skipped, 1);
  assert.equal((await service.import(json, { conflict: "replace" })).replaced, 1);
  assert.equal((await service.all()).length, 1);
});

test("standard and Drakkenheim custom recipes enforce separate material sources", () => {
  environment();
  const materials = new Map([
    ["iron", { materialId: "iron", packId: "standard-core" }],
    ["ratling-gland", { materialId: "ratling-gland", packId: "monsters-of-drakkenheim" }]
  ]);
  const service = new CustomRecipeService({ materialRegistry: { get: id => materials.get(id) } });
  const standardWithDrakkenheim = recipe();
  standardWithDrakkenheim.requirementGroups[0].requirements[0].match.materialId = "ratling-gland";
  assert.throws(() => service.export(standardWithDrakkenheim), /cannot use Drakkenheim/);

  const drakkenheimWithStandard = recipe();
  drakkenheimWithStandard.source = { contentPackId: "monsters-of-drakkenheim" };
  assert.throws(() => service.export(drakkenheimWithStandard), /only Drakkenheim/);
});
