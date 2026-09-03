import test from "node:test";
import assert from "node:assert/strict";

import {
  harvestParticipantKey,
  harvestParticipantsByUser
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

test("legacy single-character participant mappings remain readable", () => {
  assert.deepEqual(
    harvestParticipantsByUser({ player1: "Actor.hero" }),
    [{ userId: "player1", actorUuid: "Actor.hero" }]
  );
});
