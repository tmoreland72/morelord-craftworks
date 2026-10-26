import test from "node:test";
import assert from "node:assert/strict";

globalThis.foundry = { applications: { api: {
  ApplicationV2: class { async _prepareContext() { return {}; } async _onRender() {} async close() {} },
  HandlebarsApplicationMixin: Base => Base
} }, utils: { mergeObject: (base, update) => ({ ...base, ...update }) } };
const { MaterialBrowserApp } = await import("../scripts/ui/material-browser-app.mjs");
const { getDrakkenheimHarvestableMaterialIds, clearDrakkenheimSourceCache } = await import("../scripts/materials/drakkenheim-source-index.mjs");
const { DrakkenheimMonsterDataService: parser } = await import("../scripts/integrations/drakkenheim-monster-data-service.mjs");
const { DrakkenheimMaterialMatchService: matcher } = await import("../scripts/integrations/drakkenheim-material-match-service.mjs");

function fixture(socket) {
  const materials = ["supported", "unsupported"].map(id => ({ materialId: id, name: id, packId: "monsters-of-drakkenheim", rarity: "rare", acquisition: { harvestable: true } }));
  const api = { socket, materials: { all: () => materials, get: id => materials.find(material => material.materialId === id) },
    contentPacks: { enabled: ({ capability }) => ["materials", "harvest"].includes(capability) ? [{ id: "monsters-of-drakkenheim", label: "Monsters of Drakkenheim" }] : [], get: () => ({ label: "Monsters of Drakkenheim" }), isEnabled: () => true },
    recipes: { recipesUsingMaterial: () => [], recipesProducingMaterial: () => [] } };
  const app = new MaterialBrowserApp(api);
  app.element = { querySelector: () => null, querySelectorAll: () => [], addEventListener() {} };
  app.rendered = false;
  globalThis.canvas = { tokens: { controlled: [] } };
  return { api, app };
}
const settled = async app => { for (let i = 0; i < 30 && app._monsterLookupPending; i++) await new Promise(resolve => setTimeout(resolve, 0)); };

test("player Harvest tags use only the GM-verified ID list, including pending and invalidated states", async () => {
  globalThis.game = { user: { isGM: false }, actors: [] };
  let release;
  const calls = [];
  const { app } = fixture({ executeAsGm: type => { calls.push(type); return new Promise(resolve => { release = resolve; }); } });
  const pending = await app._prepareContext({});
  assert(pending.checkingMonsterSources);
  assert(pending.materials.every(material => !material.acquisition.harvestable), "Stale true flags must not be shown while verification is pending.");
  await app._onRender(pending, {});
  release(["supported"]);
  await settled(app);
  const ready = await app._prepareContext({});
  assert.deepEqual(ready.materials.map(material => [material.materialId, material.acquisition.harvestable]), [["supported", true], ["unsupported", false]]);
  assert(!ready.checkingMonsterSources);
  assert.deepEqual(calls, ["materials.harvest-availability"]);
  app.refreshSourceAvailability(false);
  const invalidated = await app._prepareContext({});
  assert(invalidated.checkingMonsterSources);
  assert(invalidated.materials.every(material => !material.acquisition.harvestable));
});

test("a player never falls back to catalog flags when no GM can verify availability", async () => {
  globalThis.game = { user: { isGM: false }, actors: [] };
  const { app } = fixture({ executeAsGm: async () => { throw Error("No GM connected"); } });
  const warning = console.warn;
  console.warn = () => {};
  try {
    await app._onRender(await app._prepareContext({}), {});
    await settled(app);
    const failed = await app._prepareContext({});
    assert(failed.monsterLookupFailed);
    assert(failed.materials.every(material => !material.acquisition.harvestable));
  } finally { console.warn = warning; }
});

test("GM availability response contains IDs only; players cannot build or fetch the private index", async () => {
  clearDrakkenheimSourceCache();
  const { api } = fixture({});
  globalThis.game = { user: { isGM: true }, packs: new Map([["drakkenheim-monsters.monsters", { getDocuments: async () => [{ name: "Private monster", uuid: "Actor.private" }] }]]) };
  const previous = [parser.inspectHarvestData, matcher.matchHarvestComponents];
  parser.inspectHarvestData = async () => ({ rarity: "Rare", harvestDocuments: [{}] });
  matcher.matchHarvestComponents = async () => [{ matched: true, item: { materialId: "supported" }, component: { category: "Bones", name: "Skull" } }];
  try {
    assert.deepEqual(await getDrakkenheimHarvestableMaterialIds(api), ["supported"]);
    game.user.isGM = false;
    await assert.rejects(getDrakkenheimHarvestableMaterialIds(api), /GM-only/);
  } finally { [parser.inspectHarvestData, matcher.matchHarvestComponents] = previous; clearDrakkenheimSourceCache(); }
});
