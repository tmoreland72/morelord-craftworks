import { MODULE_TITLE } from "../constants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class GatherPlayerApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, session, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = session;
    this.gatherState = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-gather-player",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 560, height: "auto" },
    window: { title: `${MODULE_TITLE} — Gathering`, resizable: true }
  };

  static PARTS = {
    content: { template: "modules/morelord-craftworks/templates/gather-player.hbs" }
  };

  setState(state) {
    this.gatherState = state;
    return this.render();
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.craftworks.adapter.getActorForUser(game.user);
    const priorGather = actor
      ? this.craftworks.gather.getGatherRecord(this.session.sceneId, actor.uuid)
      : null;

    return foundry.utils.mergeObject(context, {
      session: this.session,
      actor: actor ? { name: actor.name, img: actor.img, uuid: actor.uuid } : null,
      skills: this.craftworks.gather.getSkillOptions(),
      state: this.gatherState,
      alreadyGathered: Boolean(priorGather),
      priorGather
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelectorAll("[data-action='roll']")
      .forEach(button => button.addEventListener("click", event => this.#roll(event)));

    this.element.querySelector("[data-action='decline']")
      ?.addEventListener("click", event => this.#decline(event));

    this.element.querySelector("[data-action='close']")
      ?.addEventListener("click", () => this.close());
  }

  async #roll(event) {
    const button = event.currentTarget;
    const actor = this.craftworks.adapter.getActorForUser(game.user);
    if (!actor) return ui.notifications.error("Select a token you own or configure a user character first.");

    if (this.craftworks.gather.hasGathered(this.session.sceneId, actor.uuid)) {
      return ui.notifications.warn(`${actor.name} has already gathered on this scene.`);
    }

    button.disabled = true;
    try {
      const skillId = button.dataset.skill;
      const roll = await this.craftworks.adapter.rollSkill(actor, skillId, {
        dc: this.session.terrain.dc,
        flavor: `Gather in ${this.session.terrain.name} — DC ${this.session.terrain.dc}`
      });

      if (roll?.cancelled) {
        button.disabled = false;
        return;
      }

      await this.craftworks.socket.emit("gather.attempt", {
        sessionId: this.session.id,
        userId: game.user.id,
        actorUuid: actor.uuid,
        skillId,
        total: roll.total
      });
    } catch (err) {
      ui.notifications.error(err.message);
      button.disabled = false;
    }
  }

  async #decline(event) {
    event.currentTarget.disabled = true;
    const actor = this.craftworks.adapter.getActorForUser(game.user);
    await this.craftworks.socket.emit("gather.decline", {
      sessionId: this.session.id,
      userId: game.user.id,
      actorUuid: actor?.uuid ?? null
    });
  }
}
