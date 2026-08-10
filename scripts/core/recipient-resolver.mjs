import { MODULE_ID } from "../constants.mjs";

export class RecipientResolver {
  isPartyEnabled() {
    return Boolean(game.settings.get(MODULE_ID, "usePartyRecipient"));
  }

  getConfiguredPartyUuid() {
    return String(game.settings.get(MODULE_ID, "partyActorUuid") ?? "");
  }

  getEligiblePartyActors() {
    return game.actors
      .filter(actor => actor.type === "group")
      .filter(actor => this.#memberCount(actor) > 0);
  }

  async getPartyActor() {
    if (!this.isPartyEnabled()) return null;

    const configured = this.getConfiguredPartyUuid();
    if (configured) {
      const actor = await fromUuid(configured);
      if (actor?.type === "group" && this.#memberCount(actor) > 0) return actor;
    }

    // Friendly default: when exactly one populated Group actor exists, use it.
    const eligible = this.getEligiblePartyActors();
    return eligible.length === 1 ? eligible[0] : null;
  }

  async resolve(fallbackActor = null) {
    if (!this.isPartyEnabled()) return fallbackActor;

    const party = await this.getPartyActor();
    if (party) return party;

    throw new Error(
      "Party Recipient is enabled, but no populated Party/Group actor is configured. Choose one in Morelord Craftworks settings."
    );
  }

  async describe() {
    if (!this.isPartyEnabled()) {
      return {
        enabled: false,
        valid: false,
        actor: null,
        actorUuid: null,
        actorName: null,
        memberCount: 0
      };
    }

    const actor = await this.getPartyActor();
    return {
      enabled: true,
      valid: Boolean(actor),
      actor,
      actorUuid: actor?.uuid ?? null,
      actorName: actor?.name ?? null,
      memberCount: actor ? this.#memberCount(actor) : 0
    };
  }

  #memberCount(actor) {
    const members = actor?.system?.members;
    if (Array.isArray(members)) return members.length;
    if (members?.size != null) return Number(members.size);
    if (members && typeof members === "object") return Object.keys(members).length;
    return 0;
  }
}
