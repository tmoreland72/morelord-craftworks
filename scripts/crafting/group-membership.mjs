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

/** Inventory view only: original Item documents retain their owning Actor. */
export function combinedCraftingInventory(character) {
  if (!character) return null;
  const actors = [character, ...Array.from(game.actors ?? []).filter(actor => isCharacterMemberOfGroup(character, actor))];
  return { uuid: character.uuid, type: "combined", name: actors.map(actor => actor.name).join(" + "),
    combinedActors: actors, items: actors.flatMap(actor => Array.from(actor.items ?? [])) };
}
