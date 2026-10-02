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
    rollMode: "session",
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

test("GM skip opens all component choices without a roll or nat20 bonus and cannot be supplied by players", async () => {
  globalThis.foundry = { utils: { deepClone: structuredClone, randomID: () => "skip-session" } };
  globalThis.canvas = { scene: { id: "test" } };
  globalThis.game = { user: { id: "gm", isGM: true }, settings: { get: () => true } };
  const records = new Map();
  globalThis.fromUuid = async uuid => ({ getFlag: () => records.get(uuid), setFlag: async (_m, _k, value) => records.set(uuid, value) });
  records.set("Token.used", { "Actor.hero": { status: "claimed" } });
  const materials = new Map([1, 2].map(n => [`m${n}`, { materialId: `m${n}`, name: `Material ${n}` }]));
  const sessions = new AcquisitionSessionManager();
  const service = new HarvestService({ sessions, materialRegistry: materials });
  const creatures = ["drakkenheim", "kibbles"].map(harvestMode => ({ tokenUuid: `Token.${harvestMode}`, dc: 1000, harvestMode,
    components: [...materials.values()].map(m => ({ ...m, id: `${harvestMode}-${m.materialId}`, matched: true, harvestDc: 2000 })) }));
  creatures.push({ ...creatures[0], tokenUuid: "Token.used" }, { ...creatures[0], tokenUuid: "Token.empty", components: [] });
  const options = { creatureContexts: creatures, harvestActorsByUser: { player: ["Actor.hero"], gm: ["Actor.offline"] }, skipSkillChecks: true };
  const session = await service.start(options);
  assert.equal(session.skipSkillChecks, true);
  assert.deepEqual(session.harvestRolls, {});
  for (const actorUuid of ["Actor.hero", "Actor.offline"]) {
    for (const creature of creatures.slice(0, 2)) {
      const state = service.getParticipant(session.id, actorUuid, creature.tokenUuid);
      assert.equal(state.status, "awaiting-claim");
      assert.equal(state.choices.length, 2);
      assert.equal(state.claimsAllowed, 1);
      assert.equal(state.total, null);
      assert.equal(state.naturalD20, null);
    }
  }
  assert.equal(service.getParticipant(session.id, "Actor.hero", "Token.used").status, "previously-harvested");
  assert.equal(records.get("Token.empty")["Actor.hero"].status, "no-results");
  const snapshot = JSON.stringify(session.participants);
  await service.recordBatchAttempt({ sessionId: session.id, userId: "player", actorUuid: "Actor.hero", total: 9999, naturalD20: 20 });
  assert.equal(JSON.stringify(session.participants), snapshot);
  game.user.isGM = false;
  await assert.rejects(service.start(options), /Only the GM/);
});


test("creature walkthrough rolls independently, skips Drakkenheim, and explicitly completes without releasing claims", async () => {
  globalThis.foundry = { utils: { deepClone: structuredClone, randomID: () => "walkthrough" } };
  globalThis.canvas = { scene: { id: "test" } };
  globalThis.game = { user: { id: "gm", isGM: true }, users: { get: id => ({ id }) }, settings: { get: () => false } };
  const records = new Map();
  const actor = { uuid: "Actor.hero", name: "Hero" };
  globalThis.fromUuid = async uuid => uuid.startsWith("Actor.") ? actor : ({ getFlag: () => records.get(uuid), setFlag: async (_m, _k, value) => records.set(uuid, value) });
  const material = { materialId: "m", name: "Material" };
  const sessions = new AcquisitionSessionManager();
  const service = new HarvestService({ sessions, materialRegistry: new Map([["m", material]]), materialService: { getRecipient: async () => actor } });
  const creatures = ["kibbles", "kibbles", "drakkenheim"].map((harvestMode, index) => ({ tokenUuid: "Token." + index, dc: 10, harvestMode,
    components: [{ id: "part-" + index, matched: true, ...material, quantity: 3 }] }));
  const session = await service.start({ creatureContexts: creatures, harvestActorsByUser: { player: [actor.uuid, "Actor.other"] } });
  const args = { sessionId: session.id, userId: "player", actorUuid: actor.uuid };
  assert.equal(service.getParticipant(session.id, actor.uuid, "Token.2").total, null);
  assert.throws(() => service.advance({ ...args, creatureTokenUuid: "Token.0", action: "next" }), /Resolve/);
  await service.recordAttempt({ ...args, creatureTokenUuid: "Token.0", skillId: "sur", total: 15 });
  await service.claim({ ...args, creatureTokenUuid: "Token.0", materialId: "m", componentId: "part-0" });
  assert.deepEqual(await service.updatePlayerCompletions(session.id), []);
  assert.equal(session.completedParticipantIds, undefined);
  service.advance({ ...args, creatureTokenUuid: "Token.0", action: "next" });
  assert.equal(session.participantProgress[actor.uuid], 1);
  assert.throws(() => service.advance({ ...args, creatureTokenUuid: "Token.0", action: "next" }), /already changed/);
  await service.recordAttempt({ ...args, creatureTokenUuid: "Token.1", skillId: "nat", total: 3 });
  assert.equal(service.getParticipant(session.id, actor.uuid, "Token.1").status, "failed");
  assert.equal(service.getParticipant(session.id, actor.uuid, "Token.1").total, 3);
  service.advance({ ...args, creatureTokenUuid: "Token.1", action: "next" });
  service.advance({ ...args, creatureTokenUuid: "Token.2", action: "done" });
  assert.deepEqual(session.completedParticipantIds, [actor.uuid]);
  assert.equal(session.results.length, 1);
  assert.equal(session.results[0].quantity, 3);
  assert.equal(service.getParticipant(session.id, actor.uuid, "Token.2").status, "skipped");
  service.advance({ ...args, creatureTokenUuid: "Token.2", action: "done" });
  assert.equal(session.completedParticipantIds.length, 1);
  await assert.rejects(service.recordAttempt({ ...args, creatureTokenUuid: "Token.2", total: 99 }), /finished/);
  await assert.rejects(service.claim({ ...args, creatureTokenUuid: "Token.2", materialId: "m" }), /cannot claim/);
  assert.throws(() => service.advance({ ...args, actorUuid: "Actor.stranger", creatureTokenUuid: "Token.0", action: "skip" }), /not part/);
  service.advance({ ...args, actorUuid: "Actor.other", creatureTokenUuid: "Token.0", action: "skip" });
  assert.deepEqual(session.completedParticipantIds, [actor.uuid, "Actor.other"]);
  assert.equal(session.results.length, 1);

  const contested = await service.start({ creatureContexts: [creatures[2]], harvestActorsByUser: { player: [actor.uuid, "Actor.other"] } });
  const claims = await Promise.allSettled([actor.uuid, "Actor.other"].map(actorUuid => service.claim({
    sessionId: contested.id, userId: "player", actorUuid, creatureTokenUuid: "Token.2", materialId: "m", componentId: "part-2"
  })));
  assert.equal(claims.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(contested.results.length, 1);

  game.settings.get = () => true;
  service.materialRegistry.set("m2", { materialId: "m2", name: "Second material" });
  const bonus = await service.start({ creatureContexts: [{ ...creatures[0], tokenUuid: "Token.bonus", components: [creatures[0].components[0],
    { id: "part-bonus", matched: true, materialId: "m2" }] }, creatures[1]], harvestActorsByUser: { player: [actor.uuid] } });
  const bonusArgs = { ...args, sessionId: bonus.id, creatureTokenUuid: "Token.bonus" };
  await service.recordAttempt({ ...bonusArgs, skillId: "sur", total: 20, naturalD20: 20 });
  await service.claim({ ...bonusArgs, materialId: "m", componentId: "part-0" });
  assert.equal(service.getParticipant(bonus.id, actor.uuid, "Token.bonus").claimsRemaining, 1);
  service.advance({ ...bonusArgs, action: "next" });
  assert.equal(service.getParticipant(bonus.id, actor.uuid, "Token.bonus").claimsRemaining, 0);
  assert.equal(bonus.results.length, 1);
});
