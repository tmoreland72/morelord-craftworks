import { MODULE_TITLE } from "../constants.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HarvestPlayerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, session, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = session;
    this.states = {};
    this.focusedCreatureTokenUuid = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-harvest-player",
    classes: ["morelord-craftworks", "mcw-window"],
    position: {
      width: 680,
      height: 760
    },
    window: {
      title: `${MODULE_TITLE} — Harvest`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/harvest-player.hbs"
    }
  };

  setSession(session) {
    this.session = session;
    return this.render();
  }

  async setState(creatureTokenUuid, state) {
    this.states[creatureTokenUuid] = state;
    this.focusedCreatureTokenUuid = creatureTokenUuid;
    await this.render();
    this.#focusCreature(creatureTokenUuid);
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.craftworks.adapter.getActorForUser(game.user);

    const creatures = [];
    for (const creature of this.session.creatures) {
      const priorHarvest = actor
        ? await this.craftworks.harvest.getHarvestRecord(creature.tokenUuid, actor.uuid)
        : null;
      creatures.push({
        ...creature,
        state: this.states[creature.tokenUuid] ?? null,
        alreadyHarvested: Boolean(priorHarvest)
      });
    }

    return foundry.utils.mergeObject(context, {
      session: this.session,
      actor: actor ? { name: actor.name, img: actor.img, uuid: actor.uuid } : null,
      skills: this.craftworks.harvest.getSkillOptions(),
      creatures
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelectorAll("[data-action='roll']")
      .forEach(button => button.addEventListener("click", event => this.#roll(event)));

    this.element.querySelectorAll("[data-action='claim']")
      .forEach(button => button.addEventListener("click", event => this.#claim(event)));

    this.element.querySelectorAll("[data-action='close']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();
        await this.close();
      }));

    if (this.focusedCreatureTokenUuid) {
      this.#focusCreature(this.focusedCreatureTokenUuid);
    }
  }

  async #roll(event) {
    const button = event.currentTarget;
    const creatureTokenUuid = button.dataset.creature;
    const skillId = button.dataset.skill;
    const creature = this.session.creatures.find(c => c.tokenUuid === creatureTokenUuid);
    const actor = this.craftworks.adapter.getActorForUser(game.user);

    if (!actor) {
      return ui.notifications.error("Select a token you own or configure a user character first.");
    }

    if (await this.craftworks.harvest.hasHarvested(creatureTokenUuid, actor.uuid)) {
      return ui.notifications.warn(`${actor.name} has already attempted to harvest this creature.`);
    }

    button.disabled = true;
    try {
      const roll = await this.craftworks.adapter.rollSkill(actor, skillId, {
        dc: creature.dc,
        flavor: `Harvest ${creature.name} — DC ${creature.dc}`
      });

      this.states[creatureTokenUuid] = {
        status: "pending",
        total: roll.total,
        skillId
      };
      this.focusedCreatureTokenUuid = creatureTokenUuid;
      await this.render();
      this.#focusCreature(creatureTokenUuid);

      await this.craftworks.socket.emit("harvest.attempt", {
        sessionId: this.session.id,
        creatureTokenUuid,
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

  #focusCreature(creatureTokenUuid) {
    if (!creatureTokenUuid || !this.element) return;

    requestAnimationFrame(() => {
      const selector = `[data-creature-token="${CSS.escape(creatureTokenUuid)}"]`;
      const card = this.element.querySelector(selector);
      card?.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
  }

  async #claim(event) {
    const button = event.currentTarget;
    button.disabled = true;

    await this.craftworks.socket.emit("harvest.claim", {
      sessionId: this.session.id,
      creatureTokenUuid: button.dataset.creature,
      userId: game.user.id,
      materialId: button.dataset.material
    });
  }
}
