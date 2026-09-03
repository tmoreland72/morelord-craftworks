export function harvestParticipantKey(actorUuid, creatureTokenUuid) {
  return JSON.stringify([
    String(actorUuid ?? ""),
    String(creatureTokenUuid ?? "")
  ]);
}

export function participantsByUser(mapping = {}) {
  return Object.entries(mapping).flatMap(([userId, actorUuids]) =>
    (Array.isArray(actorUuids) ? actorUuids : [actorUuids])
      .filter(Boolean)
      .map(actorUuid => ({ userId, actorUuid }))
  );
}

export const harvestParticipantsByUser = participantsByUser;
