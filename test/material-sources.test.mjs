import test from "node:test";
import assert from "node:assert/strict";

globalThis.foundry = { applications: { api: { ApplicationV2: class {}, HandlebarsApplicationMixin: Base => Base } } };
const { materialSources, kibblesMaterialSources, activeMaterialAcquisition, materialAcquisition } = await import("../scripts/materials/material-sources.mjs");
const { standardMaterialAcquisition } = await import("../data/packs/standard/acquisition.mjs");
const { STANDARD_LOOT_TIERS } = await import("../data/packs/standard/loot.mjs");
const { MATERIAL_IMAGE_REPAIRS, materialImage } = await import("../scripts/materials/material-images.mjs");
const { readFile } = await import("node:fs/promises");
const { getLootMaterialIds } = await import("../scripts/acquisition/loot-profiles.mjs");
const { RecipeRegistry } = await import("../scripts/recipes/recipe-registry.mjs");
const { DrakkenheimMonsterDataService: monsters } = await import("../scripts/integrations/drakkenheim-monster-data-service.mjs");
const { DrakkenheimMaterialMatchService: matcher } = await import("../scripts/integrations/drakkenheim-material-match-service.mjs");
const craftworks = { materials: { all: () => [] }, contentPacks: {
  isEnabled: () => true,
  enabled: () => [{ id: "standard-core" }, { id: "monsters-of-drakkenheim" }],
  get: id => ({ label: id === "standard-core" ? "Craftworks Standard" : "Monsters of Drakkenheim" })
} };

test("Loot badge eligibility follows resolved active loot tables, not catalog flags", () => {
  const ids = getLootMaterialIds({ activePackIds: ["standard-core"] });
  assert(ids.has("hide-scraps"));
  assert(ids.has("adamant-ingot"));
  assert.equal(getLootMaterialIds({ activePackIds: [] }).size, 0);
});

test("Standard catalog acquisition flags agree with implemented rules", async () => {
  const seed = JSON.parse(await readFile(new URL("../data/standard-materials.seed.json", import.meta.url), "utf8"));
  for (const material of seed) assert.deepEqual(material.acquisition, standardMaterialAcquisition(material.materialId), material.name);
  const available = activeMaterialAcquisition(craftworks);
  const boiled = seed.find(material => material.materialId === "boiled-leather");
  assert.equal(materialAcquisition({ ...boiled, acquisition: { harvestable: true } }, available).harvestable, false);
  const supplies = seed.find(material => material.materialId === "common-supplies");
  assert(supplies);
  assert.equal(materialAcquisition({ ...supplies, acquisition: { gatherable: true } }, available).gatherable, false);
  assert.equal(materialAcquisition({ materialId: "hide", packId: "standard-core" }, available).harvestable, true);
  assert.equal(materialAcquisition({ materialId: "common-branch", packId: "standard-core" }, available).gatherable, true);
  const disabled = activeMaterialAcquisition({ contentPacks: { enabled: () => [] } });
  assert.deepEqual(materialAcquisition({ materialId: "hide", packId: "standard-core" }, disabled), { gatherable: false, harvestable: false, lootable: false });
});

test("expanded loot covers every Standard material, respects rarity bands and preserves original quantities", async () => {
  const seed = JSON.parse(await readFile(new URL("../data/standard-materials.seed.json", import.meta.url), "utf8"));
  const expected = { trivial: "0-4", common: "0-4", uncommon: "5-10", rare: "11-16", "very-rare": "17+", veryRare: "17+", legendary: "17+" };
  for (const material of seed) {
    const tier = STANDARD_LOOT_TIERS.find(tier => tier.id === expected[material.rarity]);
    assert(tier.results.some(result => result.materialId === material.materialId && result.weight > 0), material.name);
  }
  for (const tier of STANDARD_LOOT_TIERS) assert.equal(new Set(tier.results.map(result => result.materialId)).size, tier.results.length, tier.id);
  assert(!STANDARD_LOOT_TIERS[0].results.some(result => result.materialId === "legendary-meat"));
  assert.deepEqual(STANDARD_LOOT_TIERS[0].results.find(result => result.materialId === "hide-scraps"), { materialId: "hide-scraps", weight: 22, min: 1, max: 2 });
});

test("known broken material images are repaired without replacing custom artwork", () => {
  for (const [bad, good] of Object.entries(MATERIAL_IMAGE_REPAIRS)) assert.equal(materialImage(bad), good);
  assert.equal(materialImage("worlds/dev1/custom.webp"), "worlds/dev1/custom.webp");
  assert.equal(materialImage(null), "icons/svg/item-bag.svg");
});

test("Craftable uses enabled material-producing recipes rather than ingredient references", () => {
  const registry = new RecipeRegistry({ contentPacks: { isEnabled: id => id === "standard-core" } });
  registry._recipes = new Map([
    ["produces", { id: "produces", packId: "standard-core", output: { type: "craftworks-material", materialId: "boiled-leather" } }],
    ["uses", { id: "uses", packId: "standard-core", output: { type: "craftworks-material", materialId: "other" }, requirementGroups: [{ requirements: [{ match: { materialId: "boiled-leather" } }] }] }],
    ["disabled", { id: "disabled", packId: "phb", output: { type: "craftworks-material", materialId: "boiled-leather" } }]
  ]);
  assert.deepEqual(registry.recipesProducingMaterial("boiled-leather").map(recipe => recipe.id), ["produces"]);
});

test("harvest requirements are deduplicated and descriptions contain only categories", () => {
  const rows = kibblesMaterialSources("common-divine-essence");
  assert.equal(rows.filter(row => row.name === "celestial · CR 0–4").length, 1);
  assert(rows.every(row => !/d100|Quantity|DC/.test(row.detail)));
  assert(kibblesMaterialSources("tough-hide").some(row => /CR 8\+.*AC 16/.test(row.name)));
  assert(kibblesMaterialSources("rare-meat").some(row => /Medium or larger.*CR 10–16/.test(row.name)));
});

test("ordinary materials never inspect or mention Drakkenheim; loot reflects real tables", async () => {
  globalThis.game = { user: { isGM: true }, packs: { get: () => { throw new Error("Unexpected monster lookup"); } } };
  const harvest = await materialSources(craftworks, { materialId: "hide", packId: "standard-core" }, "harvest");
  assert(harvest.rows.length);
  assert.doesNotMatch(JSON.stringify(harvest), /drakkenheim/i);
  const loot = await materialSources(craftworks, { materialId: "hide-scraps", packId: "standard-core" }, "loot");
  assert(loot.rows.some(row => row.name === "Any creature · CR 0–4" && row.detail === "Craftworks Standard"));
  const absent = await materialSources(craftworks, { materialId: "not-in-tables", packId: "standard-core" }, "loot");
  assert.match(absent.notices.join(" "), /does not currently drop/);
  const tagged = await materialSources(craftworks, { materialId: "not-in-tables", packId: "standard-core", category: "Leather" }, "harvest");
  assert.equal(tagged.rows.length, 0);
  assert.match(tagged.notices.join(" "), /No active harvest rule/);
});

test("Drakkenheim lookup reports progress and retains Actor UUID and form rarity without unrelated loot", async () => {
  const originals = [monsters.inspectHarvestData, monsters.parseHarvestComponents, matcher.matchHarvestComponents];
  const actor = { name: "Test monster", uuid: "Compendium.test.monsters.Actor.test" };
  globalThis.game = { user: { isGM: true }, packs: new Map([["drakkenheim-monsters.monsters", { getDocuments: async () => [actor] }]]) };
  monsters.inspectHarvestData = async () => ({ harvestDocuments: [{ html: "fixture" }], rarity: "Rare",
    rarityData: { rarities: { Adult: "Rare" } }, specialItems: [{ text: "One special item" }] });
  monsters.parseHarvestComponents = () => [{ category: "Delerium", components: ["1 shard"] }];
  matcher.matchHarvestComponents = async () => [{ matched: true, item: { materialId: "test" }, component: { category: "Organ", name: "heart" } }];
  try {
    const progress = [];
    const result = await materialSources(craftworks, { materialId: "test", rarity: "rare", packId: "monsters-of-drakkenheim" }, "harvest", { onProgress: text => progress.push(text) });
    assert(progress.some(text => /1 of 1/.test(text)));
    assert.equal(result.rows[0].uuid, actor.uuid);
    assert.equal(result.rows[0].detail, "Organ");
    assert.match(result.rows[0].requirements, /Adult: Rare/);
    assert.equal(result.rows[0].specialItems, undefined);
  } finally {
    [monsters.inspectHarvestData, monsters.parseHarvestComponents, matcher.matchHarvestComponents] = originals;
  }
});

test("source lookups reject players before reading content", async () => {
  globalThis.game = { user: { isGM: false } };
  await assert.rejects(materialSources(craftworks, {}, "harvest"), /GM-only/);
});
