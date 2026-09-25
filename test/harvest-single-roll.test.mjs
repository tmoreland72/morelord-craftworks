import test from "node:test";
import assert from "node:assert/strict";
import { AcquisitionSessionManager } from "../scripts/acquisition/session-manager.mjs";
globalThis.foundry = { applications: { api: { ApplicationV2: class {}, HandlebarsApplicationMixin: Base => Base } } };
const { HarvestService } = await import("../scripts/acquisition/harvest-service.mjs");

test("one authoritative Harvest total resolves every DC, preserves nat20 bonus, ignores bypass and duplicate submissions", async () => {
  globalThis.foundry = { utils: { deepClone: structuredClone, randomID: () => "session" } };
  globalThis.canvas = { scene: { id: "test" } };
  globalThis.game = { user: { id: "gm" }, settings: { get: (_module, key) => key === "harvestNat20DoubleClaim" } };
  const records = new Map();
  globalThis.fromUuid = async uuid => ({ getFlag: () => records.get(uuid), setFlag: async (_m, _k, value) => records.set(uuid, value) });
  const materials = new Map([1, 2].map(n => [`m${n}`, { materialId: `m${n}`, name: `Material ${n}` }]));
  const sessions = new AcquisitionSessionManager();
  const service = new HarvestService({ sessions, materialRegistry: materials });
  const creatures = [10, 25].map(dc => ({ tokenUuid: `Token.${dc}`, dc, harvestMode: "drakkenheim",
    components: [...materials.values()].map(m => ({ ...m, id: `${dc}-${m.materialId}`, matched: true })) }));
  const session = await service.start({ creatureContexts: creatures, harvestActorsByUser: { player: ["Actor.hero"] },
    skipSkillChecks: [{ userId: "player", actorUuid: "Actor.hero" }] });
  assert.deepEqual(session.participants, {});
  const args = { sessionId: session.id, userId: "player", actorUuid: "Actor.hero", skillId: "sur", total: 20, naturalD20: 20 };
  await Promise.all([service.recordBatchAttempt(args), service.recordBatchAttempt({ ...args, total: 99 })]);
  const states = Object.values(session.participants);
  assert.deepEqual(states.map(s => s.total), [20, 20]);
  assert.deepEqual(states.map(s => s.status), ["awaiting-claim", "failed"]);
  assert.equal(states[0].claimsAllowed, 2);
  assert.equal(records.get("Token.25")["Actor.hero"].total, 20);
  await service.recordBatchAttempt({ ...args, total: 99 });
  assert.deepEqual(Object.values(session.participants), states);
  await assert.rejects(service.recordAttempt({ ...args, creatureTokenUuid: "Token.10" }), /already attempted/);
});
