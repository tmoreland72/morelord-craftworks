import { MODULE_ID } from "../constants.mjs";

const MODE_SETTINGS = Object.freeze({
  harvest: "partyHarvest",
  gather: "partyGather",
  loot: "partyLoot"
});

export class RecipientService {
  isPartyEnabled(mode) {
    const setting = MODE_SETTINGS[mode];
    if (!setting) return false;
    return Boolean(game.settings.get(MODULE_ID, setting));
  }

  get configuredUuid() {
    return String(game.settings.get(MODULE_ID, "partyActorUuid") ?? "").trim();
  }

  getGroupActors() {
    return game.actors
      .filter(actor => actor.type === "group")
      .map(actor => ({
        actor,
        uuid: actor.uuid,
        name: actor.name,
        members: this.getMemberCount(actor),
        isPrimary: this.#isPrimaryParty(actor)
      }))
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.name.localeCompare(b.name));
  }

  getMemberCount(actor) {
    const members = actor?.system?.members;
    if (!members) return 0;
    if (typeof members.size === "number") return members.size;
    if (typeof members.length === "number") return members.length;
    if (Array.isArray(members)) return members.length;
    if (typeof members === "object") return Object.keys(members).length;
    return 0;
  }

  async getConfiguredPartyActor({ mode = null, notify = false } = {}) {
    if (mode && !this.isPartyEnabled(mode)) return null;

    const uuid = this.configuredUuid;
    if (!uuid) {
      if (notify) ui.notifications.warn("Craftworks party collection is enabled, but no Party actor is configured.");
      return null;
    }

    const actor = await fromUuid(uuid);
    if (!actor || actor.documentName !== "Actor" || actor.type !== "group") {
      if (notify) ui.notifications.warn("The configured Craftworks Party actor is missing or is not a Group actor.");
      return null;
    }

    if (this.getMemberCount(actor) < 1) {
      if (notify) ui.notifications.warn(`Craftworks Party actor "${actor.name}" has no members. Falling back to the normal recipient.`);
      return null;
    }

    return actor;
  }

  async resolve(mode, fallbackActor, { notify = false } = {}) {
    const party = await this.getConfiguredPartyActor({ mode, notify });
    return party ?? fallbackActor;
  }

  async getStatus(mode) {
    const enabled = this.isPartyEnabled(mode);
    if (!enabled) return { enabled: false, valid: false, actor: null, memberCount: 0 };

    const actor = await this.getConfiguredPartyActor({ mode });
    return {
      enabled: true,
      valid: Boolean(actor),
      actor,
      memberCount: actor ? this.getMemberCount(actor) : 0
    };
  }

  #isPrimaryParty(actor) {
    if (game.system.id !== "dnd5e") return false;

    try {
      const primary = game.settings.get("dnd5e", "primaryParty");
      if (!primary) return false;

      const candidates = new Set([
        primary?.uuid,
        primary?.actorUuid,
        primary?.actor?.uuid,
        primary?.id,
        primary?._id,
        primary?.actor?.id,
        typeof primary === "string" ? primary : null
      ].filter(Boolean));

      return candidates.has(actor.uuid) || candidates.has(actor.id);
    } catch {
      return false;
    }
  }
}
