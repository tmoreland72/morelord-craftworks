export function isCharacterMemberOfGroup(character, group) {
  if (!character || character.type !== "character" || group?.type !== "group") return false;
  const identifiers = new Set([character.id, character.uuid].filter(Boolean).map(String));
  return Array.from(group.system?.members ?? []).some(member => {
    const values = [
      member,
      member?.id,
      member?._id,
      member?.uuid,
      member?.actorId,
      member?.actorUuid,
      member?.actor?.id,
      member?.actor?.uuid
    ].filter(value => typeof value === "string").map(String);
    return values.some(value => identifiers.has(value));
  });
}
