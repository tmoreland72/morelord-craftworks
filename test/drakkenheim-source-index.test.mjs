import test from "node:test";
import assert from "node:assert/strict";
import { matchingDrakkenheimSources, getDrakkenheimSourceIndex, clearDrakkenheimSourceCache, registerDrakkenheimSourceCacheHooks } from "../scripts/materials/drakkenheim-source-index.mjs";
import { DrakkenheimMonsterDataService as parser } from "../scripts/integrations/drakkenheim-monster-data-service.mjs";
import { DrakkenheimMaterialMatchService as matcher } from "../scripts/integrations/drakkenheim-material-match-service.mjs";

test("broad legendary aberration bones include published skull/spine sources without broadening specific components", () => {
  const material = { materialId: "drakkenheim-legendary-bones-aberration", name: "Bones - Aberration (Legendary)", rarity: "legendary" };
  const skull = { matched: true, component: { category: "Bones", name: "Skull" }, item: { materialId: "drakkenheim-legendary-bones-skull-from-aberration" } };
  const spine = { matched: true, component: { category: "Bones", name: "Spine" }, item: { materialId: "drakkenheim-legendary-bones-spine-from-aberration" } };
  const entry = { actor: { name: "The World Ender", system: { details: { type: { value: "aberration" } } } }, data: { rarity: "Legendary" }, matches: [skull, spine] };
  assert.deepEqual(matchingDrakkenheimSources(material, entry), [skull, spine]);
  assert.deepEqual(matchingDrakkenheimSources(material, { ...entry, actor: { system: { details: { type: { value: "dragon" } } } } }), []);
  assert.deepEqual(matchingDrakkenheimSources(material, { ...entry, data: { rarity: "Very Rare" } }), []);
  assert.deepEqual(matchingDrakkenheimSources(material, { ...entry, matches: [{ ...skull, component: { category: "Organs", name: "Heart" } }] }), []);
  const specific = { ...material, materialId: skull.item.materialId, name: "Bones - Skull from Aberration (Legendary)" };
  assert.deepEqual(matchingDrakkenheimSources(specific, entry), [skull]);
  assert.deepEqual(matchingDrakkenheimSources(specific, { ...entry, matches: [spine] }), []);
  assert.deepEqual(matchingDrakkenheimSources({ ...material, materialId: "generic-skull", name: "Bones - Skull (Legendary)" }, entry), [skull]);
  assert.deepEqual(matchingDrakkenheimSources(material, { ...entry, data: { rarity: null } }), []);
  assert.deepEqual(matchingDrakkenheimSources({ ...material, name: "Bones - Skull (Legendary)", materialId: "generic-skull" },
    { ...entry, actor: { ...entry.actor, name: "Skull Beast" }, matches: [spine] }), []);
});

test("unsupported dragon horns and Very Rare ratling claws stay unavailable; source aliases include page and subtype", () => {
  const claws = { component: { category: "Natural Weapons", name: "Claws" }, matched: false };
  const dragon = { actor: { name: "Delerium Dragon Wyrmling", system: { details: { type: { value: "dragon" } } } }, data: { rarity: "Uncommon" }, matches: [claws] };
  assert.deepEqual(matchingDrakkenheimSources({ materialId: "horns", name: "Natural Weapon - Horns from a Dragon (Common)", rarity: "common" }, dragon), []);
  const ratling = { actor: { name: "Warlock of the Rat God", system: { details: { type: { value: "monstrosity" } } } },
    data: { rarity: "Uncommon", harvestDocuments: [{ document: { name: "Ratlings" } }] }, matches: [claws] };
  const material = { materialId: "claws", name: "Natural Weapon - Claws from a Ratling (Very Rare)", rarity: "very-rare" };
  assert.deepEqual(matchingDrakkenheimSources(material, ratling), []);
  assert.deepEqual(matchingDrakkenheimSources({ ...material, rarity: "uncommon" }, ratling), [claws]);
  assert.deepEqual(matchingDrakkenheimSources({ ...material, rarity: "uncommon" }, { ...ratling, data: { rarity: "Uncommon" }, actor: { ...ratling.actor, system: { details: { type: { value: "monstrosity", subtype: "Ratling" } } } } }), [claws]);
});

test("concurrent material searches share one index; catalog changes, hooks, and restart clearing invalidate it", async () => {
  clearDrakkenheimSourceCache();
  let calls = 0, inspected = 0;
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let materials = [{ materialId: "fixture" }];
  const pack = { getDocuments: async () => { calls++; await gate; return [{ name: "Monster", uuid: "Actor.test" }]; } };
  const api = { materials: { all: () => materials }, contentPacks: { isEnabled: () => true } };
  globalThis.game = { user: { isGM: true }, packs: new Map([["drakkenheim-monsters.monsters", pack]]) };
  const originalInspect = parser.inspectHarvestData, originalMatch = matcher.matchHarvestComponents;
  parser.inspectHarvestData = async () => { inspected++; return { harvestDocuments: [{}] }; };
  matcher.matchHarvestComponents = async () => [];
  try {
    const first = getDrakkenheimSourceIndex(api), second = getDrakkenheimSourceIndex(api);
    release();
    assert.equal(await first, await second);
    await getDrakkenheimSourceIndex(api);
    assert.equal(calls, 1);
    assert.equal(inspected, 1);
    materials = [{ materialId: "fixture" }];
    await getDrakkenheimSourceIndex(api);
    assert.equal(calls, 2);
    const hooks = new Map();
    globalThis.Hooks = { on: (name, handler) => hooks.set(name, handler) };
    registerDrakkenheimSourceCacheHooks();
    hooks.get("updateActor")({ pack: "unrelated.monsters" });
    await getDrakkenheimSourceIndex(api);
    assert.equal(calls, 2);
    hooks.get("updateJournalEntryPage")({ parent: { pack: "drakkenheim-monsters.guide" } });
    await getDrakkenheimSourceIndex(api);
    assert.equal(calls, 3);
    clearDrakkenheimSourceCache();
    await getDrakkenheimSourceIndex(api);
    assert.equal(calls, 4);
  } finally { parser.inspectHarvestData = originalInspect; matcher.matchHarvestComponents = originalMatch; clearDrakkenheimSourceCache(); }
});

test("failed index loads are retried rather than cached as empty results", async () => {
  clearDrakkenheimSourceCache();
  let calls = 0;
  const api = { materials: { all: () => [] }, contentPacks: { isEnabled: () => true } };
  globalThis.game = { user: { isGM: true }, packs: new Map([["drakkenheim-monsters.monsters", { getDocuments: async () => { if (++calls === 1) throw Error("unavailable"); return []; } }]]) };
  await assert.rejects(getDrakkenheimSourceIndex(api), /unavailable/);
  assert.deepEqual((await getDrakkenheimSourceIndex(api)).entries, []);
  assert.equal(calls, 2);
});
