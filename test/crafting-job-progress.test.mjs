import test from "node:test";
import assert from "node:assert/strict";
import { CraftingJobService } from "../scripts/crafting/crafting-job-service.mjs";
import { craftCardProgress, craftingProgressSummary } from "../scripts/crafting/crafting-rules.mjs";

function crafter() {
  return {
    uuid: "Actor.crafter",
    flags: {},
    async setFlag(module, key, value) {
      (this.flags[module] ??= {})[key] = structuredClone(value);
    }
  };
}

test("displayed and stored successes never exceed the successes required", () => {
  assert.equal(craftingProgressSummary({ hoursRequired: 4, successes: 3, attempts: 3 }).successes, 2);
  assert.equal(craftingProgressSummary({ hoursRequired: 4, successes: 3, attempts: 3 }).progressHours, 4);
  assert.equal(craftingProgressSummary({ hoursRequired: 2, successes: 2, attempts: 1 }).successes, 1);
});

test("a natural 20 cannot push successes past the requirement, and awarding resets the card", async () => {
  globalThis.foundry = { utils: { deepClone: structuredClone } };
  const actor = crafter();
  const jobs = new CraftingJobService();
  await jobs.start({ recipeId: "antitoxin", crafter: actor, inventoryActorUuid: actor.uuid, hoursRequired: 4, consumedMaterials: [{ materialId: "vial", quantity: 1 }] });
  await jobs.recordAttempt("antitoxin", actor, actor.uuid, { success: false, progressDelta: 0 });
  await jobs.recordAttempt("antitoxin", actor, actor.uuid, { success: true, progressDelta: 1 });
  const finished = await jobs.recordAttempt("antitoxin", actor, actor.uuid, { success: true, progressDelta: 2 });
  assert.equal(finished.successes, 2);
  assert.equal(finished.requiredSuccesses, 2);
  assert.equal(finished.progressHours, 4);
  assert.equal(finished.currentTimeSpentHours, 6);
  assert.equal(finished.complete, true);
  assert.deepEqual(craftCardProgress(finished), {
    ...finished,
    timeSpentHours: 6
  });

  const awarded = await jobs.markOutputAwarded("antitoxin", actor, actor.uuid);
  assert.equal(awarded.successes, 0);
  assert.equal(awarded.progressHours, 0);
  assert.equal(awarded.currentTimeSpentHours, 0);
  assert.equal(awarded.outputAwarded, true);
  assert.equal(awarded.timeSpentHours, 6);
  assert.equal(awarded.history.length, 1);
  assert.equal(awarded.history[0].successes, 2);
  assert.equal(awarded.history[0].timeSpentHours, 6);
  const card = craftCardProgress(awarded);
  assert.equal(card.successes, 0);
  assert.equal(card.progressHours, 0);
  assert.equal(card.timeSpentHours, 0);

  jobs.cache.clear();
  const restored = jobs.getProgress("antitoxin", actor);
  assert.equal(restored.successes, 0);
  assert.equal(restored.timeSpentHours, 6);
  assert.equal(restored.history[0].progressHours, 4);

  await jobs.start({ recipeId: "antitoxin", crafter: actor, inventoryActorUuid: actor.uuid, hoursRequired: 4, consumedMaterials: [] });
  const next = jobs.getProgress("antitoxin", actor);
  assert.equal(next.outputAwarded, false);
  assert.equal(next.successes, 0);
  assert.equal(next.currentTimeSpentHours, 0);
  assert.equal(next.timeSpentHours, 6);
  assert.equal(next.history.length, 1);
  assert.equal(craftCardProgress(next).timeSpentHours, 0);
  const continued = await jobs.recordAttempt("antitoxin", actor, actor.uuid, { success: false, progressDelta: 0 });
  assert.equal(continued.currentTimeSpentHours, 2);
  assert.equal(continued.timeSpentHours, 8);
  assert.equal(craftCardProgress(continued).timeSpentHours, 2);
});
