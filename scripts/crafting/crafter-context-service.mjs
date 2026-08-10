export class CrafterContextService {
  availableCharacters() {
    return game.actors
      .filter(actor => actor.type === "character")
      .filter(actor =>
        game.user.isGM
        || actor.testUserPermission(game.user, "OWNER")
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  resolve() {
    const characters = this.availableCharacters();
    const allowed = new Set(
      characters.map(actor => actor.uuid)
    );

    const controlled = canvas.tokens?.controlled
      ?.map(token => token.actor)
      ?.find(actor =>
        actor?.type === "character"
        && allowed.has(actor.uuid)
      );

    if (controlled) return controlled;

    const assigned = game.user.character;
    if (
      assigned?.type === "character"
      && allowed.has(assigned.uuid)
    ) {
      return assigned;
    }

    if (characters.length === 1) {
      return characters[0];
    }

    return null;
  }
}
