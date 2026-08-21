import { MODULE_TITLE } from "../constants.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class DeleriumSearchPlayerApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(craftworks, session, options = {}) { super(options); this.craftworks = craftworks; this.session = session; this.searchState = null; }
  static DEFAULT_OPTIONS = { id: "morelord-craftworks-delerium-search-player", classes: ["morelord-craftworks", "mcw-window"], position: { width: 680, height: "auto" }, window: { title: `${MODULE_TITLE} — Delerium Search`, resizable: true } };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/delerium-search-player.hbs" } };
  setState(state) { this.searchState = state; return this.render(); }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.craftworks.adapter.getActorForUser(game.user);
    const skills = this.craftworks.deleriumSearch.getSkillOptions().map(skill => {
      const value = Number(actor?.system?.skills?.[skill.id]?.total ?? actor?.system?.skills?.[skill.id]?.mod ?? 0);
      return { ...skill, modifier: value, modifierLabel: value >= 0 ? `+${value}` : String(value) };
    });
    return foundry.utils.mergeObject(context, { session: this.session, actor: actor ? { name: actor.name, img: actor.img, uuid: actor.uuid } : null, skills, state: this.searchState }, { inplace: false });
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelectorAll("[data-action='roll']").forEach(button => button.addEventListener("click", event => this.#roll(event)));
    this.element.querySelector("[data-action='decline']")?.addEventListener("click", event => this.#decline(event));
    this.element.querySelector("[data-action='close']")?.addEventListener("click", () => this.close());
  }
  async #roll(event) {
    const button = event.currentTarget;
    const actor = this.craftworks.adapter.getActorForUser(game.user);
    if (!actor) return ui.notifications.error("Select a token you own or configure a user character first.");
    button.disabled = true;
    try {
      const skillId = button.dataset.skill;
      const roll = await this.craftworks.adapter.rollSkill(actor, skillId, { dc: this.session.zone.dc, flavor: `Search for Delerium in the ${this.session.zone.name} — DC ${this.session.zone.dc}` });
      if (roll?.cancelled) { button.disabled = false; return; }
      await this.craftworks.socket.emit("delerium-search.attempt", { sessionId: this.session.id, userId: game.user.id, actorUuid: actor.uuid, skillId, total: roll.total, naturalD20: roll.naturalD20 });
    } catch (error) { ui.notifications.error(error.message); button.disabled = false; }
  }
  async #decline(event) {
    event.currentTarget.disabled = true;
    const actor = this.craftworks.adapter.getActorForUser(game.user);
    await this.craftworks.socket.emit("delerium-search.decline", { sessionId: this.session.id, userId: game.user.id, actorUuid: actor?.uuid ?? null });
  }
}
