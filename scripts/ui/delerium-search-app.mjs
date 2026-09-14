import { listCharacterActors } from "../../../morelord-core/scripts/ui/actor-participation.js";
import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
import { DeleriumSearchResultsApp } from "./delerium-search-results-app.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class DeleriumSearchApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(craftworks, options = {}) { super(options); this.craftworks = craftworks; this.session = null; this.selectedZone = null; this.selectedCharacterUuids = null; }
  static DEFAULT_OPTIONS = { id: "morelord-craftworks-delerium-search", classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"], position: { width: 800, height: "auto" }, window: { title: `${MODULE_TITLE} — Delerium Search`, resizable: true } };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/delerium-search-gm.hbs" } };
  setSession(session) { this.session = session; return this.render(); }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const characters = listCharacterActors();
    if (this.selectedZone === null) {
      let defaults = {};
      try { defaults = JSON.parse(game.settings.get(MODULE_ID, "deleriumSearchDefaults") || "{}"); } catch { /* Use normal defaults if an old setting is invalid. */ }
      this.selectedZone = ["outer", "inner"].includes(defaults?.zoneId) ? defaults.zoneId : "outer";
      if (Array.isArray(defaults?.characterUuids)) this.selectedCharacterUuids = new Set(defaults.characterUuids.filter(uuid => characters.some(actor => actor.uuid === uuid)));
    }
    if (this.selectedCharacterUuids === null) this.selectedCharacterUuids = new Set(characters.filter(actor => this.#activeUserForActor(actor)).map(actor => actor.uuid));
    const skills = this.craftworks.deleriumSearch.getSkillOptions();
    return foundry.utils.mergeObject(context, {
      session: this.session,
      encounterTriggered: Boolean(this.session?.failures >= 2),
      sceneName: canvas.scene?.name ?? "",
      zones: this.craftworks.deleriumSearch.getZones().map(zone => ({ ...zone, selected: zone.id === this.selectedZone })),
      characters: characters.map(actor => { const user = this.#activeUserForActor(actor); return { uuid: actor.uuid, name: actor.name, img: actor.img, checked: this.selectedCharacterUuids.has(actor.uuid), connected: Boolean(user), userName: user?.name ?? null }; }),
      progress: this.session ? characters.filter(actor => this.session.selectedCharacterUuids?.includes(actor.uuid)).map(actor => {
        const activeUser = this.#activeUserForActor(actor);
        const participantId = activeUser?.id ?? `actor:${actor.id}`;
        const state = this.session.participants[participantId] ?? { status: "waiting" };
        return {
          participantId,
          user: activeUser?.name ?? "GM controlled",
          active: Boolean(activeUser),
          actorUuid: actor.uuid,
          actorName: actor.name,
          gmCanRoll: !activeUser && state.status === "waiting",
          skills: skills.map(skill => {
            const value = Number(actor.system?.skills?.[skill.id]?.total ?? actor.system?.skills?.[skill.id]?.mod ?? 0);
            return { ...skill, modifier: value, modifierLabel: value >= 0 ? `+${value}` : String(value) };
          }),
          ...state
        };
      }) : []
    }, { inplace: false });
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelectorAll("[data-party-finds-roll]").forEach(button => button.addEventListener("click", async () => {
      try {
        const roll = await new Roll(button.dataset.partyFindsRoll).evaluate();
        await roll.toMessage({ flavor: "Delerium Search — What the Party Finds" });
      } catch (error) { ui.notifications.error(error.message); }
    }));
    this.element.querySelector("[name='zone']")?.addEventListener("change", event => { this.selectedZone = event.currentTarget.value; });
    this.element.querySelectorAll("[name='characterUuid']").forEach(input => input.addEventListener("change", event => event.currentTarget.checked ? this.selectedCharacterUuids.add(event.currentTarget.value) : this.selectedCharacterUuids.delete(event.currentTarget.value)));
    this.element.querySelector("[data-action='save-defaults']")?.addEventListener("click", async () => {
      try {
        if (!game.user.isGM) throw new Error("Only a GM can save search defaults.");
        await game.settings.set(MODULE_ID, "deleriumSearchDefaults", JSON.stringify({ zoneId: this.selectedZone, characterUuids: [...this.selectedCharacterUuids] }));
        ui.notifications.info("Delerium Search defaults saved.");
      } catch (error) { ui.notifications.error(error.message); }
    });
    this.element.querySelector("[data-action='start']")?.addEventListener("click", () => this.#start());
    this.element.querySelector("[data-action='finalize']")?.addEventListener("click", () => this.#finalize());
    this.element.querySelectorAll("[data-action='gm-roll']")
      .forEach(button => button.addEventListener("click", event => this.#gmRoll(event)));
  }
  async #start() {
    try {
      const characters = listCharacterActors().filter(actor => actor.type === "character" && this.selectedCharacterUuids.has(actor.uuid));
      if (!characters.length) throw new Error("No player character Actors were found.");
      const connectedPlayers = [...new Set(characters.map(actor => this.#activeUserForActor(actor)).filter(Boolean))];
      this.session = this.craftworks.deleriumSearch.start(this.selectedZone);
      this.session.selectedCharacterUuids = characters.map(actor => actor.uuid);
      const deliveries = await Promise.all(connectedPlayers.map(async user => ({
        user,
        response: await this.craftworks.socket.emit(
          "delerium-search.open",
          { session: this.session },
          { targetUserId: user.id }
        )
      })));
      const failed = deliveries.filter(delivery => delivery.response?.opened !== true);
      if (failed.length) {
        this.craftworks.sessions.delete(this.session.id);
        this.session = null;
        throw new Error(
          `The Delerium Search window did not open for: ${failed.map(delivery => delivery.user.name).join(", ")}. `
          + "Have those players reload Foundry and try again."
        );
      }
      await this.render();
    } catch (error) { ui.notifications.error(error.message); }
  }
  async #gmRoll(event) {
    const button = event.currentTarget;
    const actor = button.dataset.actorUuid
      ? await fromUuid(button.dataset.actorUuid)
      : null;
    if (!actor) return ui.notifications.error("That player character could not be resolved.");
    if (this.#activeUserForActor(actor)) return ui.notifications.warn("A connected player controls this character and should make their own roll.");
    button.disabled = true;
    try {
      const skillId = button.dataset.skill;
      const roll = await this.craftworks.adapter.rollSkill(actor, skillId, {
        dc: this.session.zone.dc,
        flavor: `Search for Delerium in the ${this.session.zone.name} — DC ${this.session.zone.dc} (GM rolling for ${actor.name})`
      });
      if (roll?.cancelled) { button.disabled = false; return; }
      this.craftworks.deleriumSearch.attempt({
        sessionId: this.session.id,
        userId: button.dataset.participantId,
        actorUuid: actor.uuid,
        skillId,
        total: roll.total,
        naturalD20: roll.naturalD20
      });
      await this.render();
    } catch (error) {
      ui.notifications.error(error.message);
      button.disabled = false;
    }
  }
  async #finalize() {
    if (!this.session) return;
    try {
      const session = await this.craftworks.deleriumSearch.finalize(this.session.id);
      const players = (globalThis.MorelordCore?.users?.list() ?? game.users).filter(user => user.active && !user.isGM);
      await Promise.all(players.map(user => this.craftworks.socket.emit("delerium-search.complete", { session }, { targetUserId: user.id })));
      this.session = null;
      await this.close();
      await new DeleriumSearchResultsApp(this.craftworks, session).render({ force: true });
    } catch (error) { ui.notifications.error(error.message); }
  }

  #activeUserForActor(actor) {
    return globalThis.MorelordCore.users.activePlayerForActor(actor);
  }

}
