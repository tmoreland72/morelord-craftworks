import { assert } from "../../../morelord-core/scripts/testing/in-game.js";

export const diagnosticsChecks = [{ id: "craftworks.diagnostics", run() {
  const api = game.modules.get("morelord-craftworks").api;
  const report = game.modules.get("morelord-core").api.getDiagnostics();
  assert(report.report.schemaVersion === 2, "Core must export schema 2.");
  const detail = report.moduleDiagnostics["morelord-craftworks"];
  assert(detail && !detail.unavailable, "Craftworks diagnostics must be available.");
  assert(detail.catalog.materials === api.materials.all().length, "Material count must reflect the live registry.");
  assert(detail.catalog.recipes === api.recipes.all().length, "Recipe count must reflect the live registry.");
  assert(detail.contentPacks.every(pack => pack.effectiveEnabled === api.contentPacks.isEnabled(pack.id)), "Pack access must reflect live settings and entitlements.");
  assert(detail.sync.recentAttempts.length <= 10 && detail.drakkenheim.recentHarvests.length <= 20, "Outcome histories must be bounded.");
  const serialized = JSON.stringify(detail);
  for (const key of ["actorUuid", "tokenUuid", "biography", "stack", "contentSyncSignature"]) {
    assert(!serialized.includes(`"${key}"`), `Private field ${key} must not be exported.`);
  }
} }];
