import test from "node:test";
import assert from "node:assert/strict";
import { CraftingJobService } from "../scripts/crafting/crafting-job-service.mjs";

test("Drakkenheim completion survives reload without rolls or tracked hours", async () => {
  globalThis.foundry = { utils: { deepClone: structuredClone } };
  const crafter = { uuid: "Actor.crafter", flags: {}, async setFlag(module, key, value) { (this.flags[module] ??= {})[key] = structuredClone(value); } };
  const jobs = new CraftingJobService();
  await jobs.start({ recipeId: "drakkenheim", crafter, inventoryActorUuid: crafter.uuid, hoursRequired: 8, consumedMaterials: [] });
  const completed = await jobs.completeWithoutCheck("drakkenheim", crafter, crafter.uuid, 0);
  assert.equal(completed.complete, true);
  assert.equal(completed.timeSpentHours, 0);
  assert.equal(completed.hoursRequired, 0);
  assert.equal(completed.attempts, 0);
  jobs.cache.clear();
  const restored = jobs.getProgress("drakkenheim", crafter);
  assert.equal(restored.complete, true);
  assert.equal(restored.attempts, 0);
  assert.equal(restored.timeSpentHours, 0);
  assert.equal(restored.hoursRequired, 0);
  assert.equal(restored.outputAwarded, false);
});
