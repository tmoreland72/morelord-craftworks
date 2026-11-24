import { MODULE_TITLE } from "../constants.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class DeleriumSearchPlayerApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(craftworks, session, actorUuid, options = {}) {
    const actorName = game.actors.get(actorUuid?.split(".").pop())?.name;
    super({ ...options, id: `morelord-craftworks-delerium-search-player-${actorUuid?.split(".").pop() ?? game.user.id}`,
      window: { ...options.window, title: actorName ? `${MODULE_TITLE} — Delerium Search — ${actorName}` : `${MODULE_TITLE} — Delerium Search` } });
    this.craftworks = craftworks; this.session = session; this.actorUuid = actorUuid;
    this.searchState = Object.values(session.participants ?? {}).find(state => state.actorUuid === actorUuid) ?? null;
    this.pendingRoll = null; this.rolling = false;
  }
  static DEFAULT_OPTIONS = { id: "morelord-craftworks-delerium-search-player", classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"], position: { width: 680, height: "auto" }, window: { title: `${MODULE_TITLE} — Delerium Search`, resizable: true } };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/delerium-search-player.hbs" } };
  setState(state) { this.searchState = state; return this.render(); }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = await fromUuid(this.actorUuid);
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
    const actor = await fromUuid(this.actorUuid);
    if (!actor) return ui.notifications.error("Select a token you own or configure a user character first.");
    if (this.rolling || this.searchState) return;
    this.rolling = true;
    button.disabled = true;
    try {
      const skillId = this.pendingRoll?.skillId ?? button.dataset.skill;
      if (!this.pendingRoll) {
        const result = await MorelordCore.rolls.skill(actor, skillId, { dc: this.session.zone.dc, flavor: `Search for Delerium in the ${this.session.zone.name}`, configure: true, create: false });
        if (!result || result.cancelled) return;
        this.pendingRoll = { skillId, rollData: result.roll.toJSON() };
      }
      await this.setState(await this.craftworks.submitDeleriumSearch(skillId, this.pendingRoll.rollData));
    } catch (error) { ui.notifications.error(error.message); }
    finally { this.rolling = false; if (button.isConnected) button.disabled = false; }
  }
  async #decline(event) {
    if (this.rolling || this.searchState) return;
    this.rolling = true; event.currentTarget.disabled = true;
    try { await this.setState(await this.craftworks.submitDeleriumSearch("decline")); }
    catch (error) { ui.notifications.error(error.message); }
    finally { this.rolling = false; if (event.currentTarget.isConnected) event.currentTarget.disabled = false; }
  }
}
