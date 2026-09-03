import test from "node:test";
import assert from "node:assert/strict";

import {
  harvestParticipantKey,
  harvestParticipantsByUser,
  participantsByUser
} from "../scripts/acquisition/harvest-participants.mjs";

test("one user can participate in Harvest as multiple independent characters", () => {
  const participants = harvestParticipantsByUser({
    player1: ["Actor.hero", "Actor.sidekick"]
  });

  assert.deepEqual(participants, [
    { userId: "player1", actorUuid: "Actor.hero" },
    { userId: "player1", actorUuid: "Actor.sidekick" }
  ]);
  assert.notEqual(
    harvestParticipantKey("Actor.hero", "Scene.scene.Token.monster"),
    harvestParticipantKey("Actor.sidekick", "Scene.scene.Token.monster")
  );
});

test("Gather can route multiple character windows through the shared participant mapping", () => {
  assert.deepEqual(participantsByUser({ player1: ["Actor.one", "Actor.two"] }), [
    { userId: "player1", actorUuid: "Actor.one" },
    { userId: "player1", actorUuid: "Actor.two" }
  ]);
});

test("legacy single-character participant mappings remain readable", () => {
  assert.deepEqual(
    harvestParticipantsByUser({ player1: "Actor.hero" }),
    [{ userId: "player1", actorUuid: "Actor.hero" }]
  );
});
