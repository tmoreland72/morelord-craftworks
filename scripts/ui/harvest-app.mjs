import { MODULE_TITLE } from "../constants.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HarvestPrototypeApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-harvest",
    classes: ["morelord-craftworks", "mcw-window"],
    position: {
      width: 760,
      height: "auto"
    },
    window: {
      title: `${MODULE_TITLE} — Harvest`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/harvest-prototype.hbs"
    }
  };

  setSession(session) {
    this.session = session;
    return this.render();
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const users = game.users
      .filter(user => !user.isGM && user.active)
      .map(user => ({ id: user.id, name: user.name }));

    const progress = this.session
      ? users.map(user => ({
          user: user.name,
          perCreature: this.session.creatures.map(creature => {
            const state = this.session.participants?.[`${user.id}:${creature.tokenUuid}`];
            return {
              creature: creature.name,
              status: state?.status ?? "waiting",
              total: state?.total ?? null,
              claimedName: state?.claimedName ?? null
            };
          })
        }))
      : [];

    const deadCreatures = this.craftworks.adapter.getDeadCreatureTokens().map(token => ({
      name: token.name,
      img: token.document.texture?.src ?? token.actor?.img
    }));

    return foundry.utils.mergeObject(context, {
      isGM: game.user.isGM,
      session: this.session,
      progress,
      deadCreatures
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='start']")
      ?.addEventListener("click", () => this.#startHarvest());

    this.element.querySelector("[data-action='finalize']")
      ?.addEventListener("click", () => this.#finalizeHarvest());

    this.element.querySelector("[data-action='reset-harvest']")
      ?.addEventListener("click", () => this.#resetHarvest());
  }

  async #startHarvest() {
    try {
      if (!this.craftworks.materials.size) {
        throw new Error(
          "No Craftworks materials are indexed. Run MorelordCraftworks.dev.installStandardMaterials() once as GM."
        );
      }

      this.session = this.craftworks.harvest.start();
      const players = game.users.filter(user => user.active && !user.isGM);
      if (!players.length) throw new Error("No active player users are connected.");

      await Promise.all(players.map(user =>
        this.craftworks.socket.emit(
          "harvest.open",
          { session: this.session },
          { targetUserId: user.id }
        )
      ));

      ui.notifications.info(
        `Harvest session sent to ${players.map(user => user.name).join(", ")}.`
      );

      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #resetHarvest() {
    try {
      const count = await this.craftworks.harvest.resetSceneHarvesting();

      // If a Harvest session is currently open, replace it with a fresh session
      // so both GM progress and all player windows return to an unattempted state.
      if (this.session?.status === "open") {
        const players = game.users.filter(user => user.active && !user.isGM);

        this.session = this.craftworks.harvest.start();

        await Promise.all(players.map(user =>
          this.craftworks.socket.emit(
            "harvest.open",
            { session: this.session },
            { targetUserId: user.id }
          )
        ));
      } else {
        this.session = null;
      }

      ui.notifications.info(
        `Reset Harvest for ${count} dead creature token${count === 1 ? "" : "s"} on this scene.`
      );

      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #finalizeHarvest() {
    if (!this.session) return;

    const session = this.craftworks.harvest.finalize(this.session.id);
    const players = game.users.filter(user => user.active && !user.isGM);

    await Promise.all(players.map(user =>
      this.craftworks.socket.emit(
        "harvest.complete",
        { sessionId: session.id },
        { targetUserId: user.id }
      )
    ));

    ui.notifications.info("Harvesting completed.");
    await this.close();
  }
}
