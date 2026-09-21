import test from "node:test";
import assert from "node:assert/strict";
import { getCraftworksDiagnostics } from "../scripts/core/diagnostics.mjs";

test("diagnostics distinguish pack access, missing materials, source exclusions and stale sync without exporting private data", () => {
  const settings = { contentSyncSignature: "private-signature", contentSyncLastAt: "2026-09-18T21:02:26.934Z", recipePackEnabled_monsters_of_drakkenheim: true, partyActorUuid: "private-actor", token: "private-token" };
  globalThis.game = {
    settings: { get: (_id, key) => settings[key] },
    modules: new Map([["drakkenheim-monsters", { active: true }]]),
    packs: new Map([["drakkenheim-monsters.monsters", { indexed: true, index: new Map([["private-monster", {}]]) }]])
  };
  const api = {
    materials: { all: () => [] }, recipes: { all: () => [] },
    sourceFilter: { isPackEnabled: () => false },
    coreAccess: { hasAccess: () => false }, contentPacks: { isEnabled: () => false },
    contentSync: { buildSignature: () => "changed-private-signature", diagnosticAttempts: [{ status: "failed", reason: "content-sync-failed" }] },
    harvest: { diagnosticHarvests: [{ reason: "drakkenheim-pack-unavailable", componentCount: 2 }] }
  };
  const report = getCraftworksDiagnostics(api);
  const pack = report.contentPacks.find(row => row.id === "monsters-of-drakkenheim");
  assert.equal(pack.configured, true);
  assert.equal(pack.accessGranted, false);
  assert.equal(pack.requiredModuleActive, true);
  assert.equal(pack.materialCount, 0);
  assert.equal(pack.materialCompendium.present, false);
  assert.equal(report.drakkenheim.monsterCompendium.sourceEnabled, false);
  assert.equal(report.sync.signatureMatches, false);
  assert.equal(JSON.stringify(report).includes("private-"), false);
  report.sync.recentAttempts[0].status = "changed";
  assert.equal(api.contentSync.diagnosticAttempts[0].status, "failed");
});

test("sync failures retain safe history and preserve the original error", async () => {
  globalThis.foundry = { applications: { api: { ApplicationV2: class {}, HandlebarsApplicationMixin: Base => Base } } };
  globalThis.game.user = { isGM: true };
  const { ContentSyncService } = await import("../scripts/core/content-sync-service.mjs");
  const error = new Error("private-account and actor");
  const service = new ContentSyncService({ materialInstaller: { installAll: async () => { throw error; } } });
  for (let i = 0; i < 12; i++) await assert.rejects(service.sync({ force: true }), value => value === error);
  assert.equal(service.running, null);
  assert.equal(service.diagnosticAttempts.length, 10);
  assert.equal(service.diagnosticAttempts.at(-1).status, "failed");
  assert.equal(JSON.stringify(service.diagnosticAttempts).includes("private-"), false);
});

test("harvest fallback history stays bounded and excludes creature identity", async () => {
  const { HarvestService } = await import("../scripts/acquisition/harvest-service.mjs");
  const harvest = new HarvestService({
    adapter: { getCreatureHarvestTraits: () => ({ cr: 1, creatureType: "unknown" }) },
    materialRegistry: { get: () => null },
    contentPacks: { enabled: () => [], isEnabled: () => false }
  });
  const token = { actor: { uuid: "private-actor", name: "private-name" }, document: { uuid: "private-token" } };
  for (let i = 0; i < 22; i++) assert.equal((await harvest.buildCreatureContext(token)).harvestMode, "standard");
  assert.equal(harvest.diagnosticHarvests.length, 20);
  assert.equal(harvest.diagnosticHarvests.at(-1).reason, "drakkenheim-pack-unavailable");
  assert.equal(JSON.stringify(harvest.diagnosticHarvests).includes("private-"), false);
});
