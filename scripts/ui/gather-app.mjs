import { MODULE_TITLE } from "../constants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class GatherApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = null;
    this.selectedTerrain = "grasslands";
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-gather",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 800, height: "auto" },
    window: { title: `${MODULE_TITLE} — Gathering`, resizable: true }
  };

  static PARTS = {
    content: { template: "modules/morelord-craftworks/templates/gather-gm.hbs" }
  };

  setSession(session) {
    this.session = session;
    return this.render();
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const players = game.users.filter(user => user.active && !user.isGM);
    const gatherRecords = this.craftworks.gather.getSceneGatherRecords();

    return foundry.utils.mergeObject(context, {
      session: this.session,
      sceneName: canvas.scene?.name ?? "",
      gatherRecordCount: Object.keys(gatherRecords).length,
      terrains: this.craftworks.gather.getProfiles().map(profile => ({
        ...profile,
        selected: profile.id === this.selectedTerrain
      })),
      progress: this.session ? players.map(user => {
        const state = this.session.participants?.[user.id];
        return {
          user: user.name,
          status: state?.status ?? "waiting",
          total: state?.total ?? null,
          result: state?.result ?? null
        };
      }) : []
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[name='terrain']")
      ?.addEventListener("change", event => {
        this.selectedTerrain = event.currentTarget.value;
      });

    this.element.querySelector("[data-action='start']")
      ?.addEventListener("click", () => this.#start());

    this.element.querySelector("[data-action='finalize']")
      ?.addEventListener("click", () => this.#finalize());

    this.element.querySelector("[data-action='reset']")
      ?.addEventListener("click", () => this.#resetScene());
  }

  async #start() {
    try {
      if (!this.craftworks.materials.size) {
        throw new Error("No Craftworks materials are indexed. Run the development material installer first.");
      }

      this.session = this.craftworks.gather.start(this.selectedTerrain);
      const players = game.users.filter(user => user.active && !user.isGM);
      if (!players.length) throw new Error("No active player users are connected.");

      await Promise.all(players.map(user =>
        this.craftworks.socket.emit(
          "gather.open",
          { session: this.session },
          { targetUserId: user.id }
        )
      ));

      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #finalize() {
    if (!this.session) return;
    const session = this.craftworks.gather.finalize(this.session.id);
    const players = game.users.filter(user => user.active && !user.isGM);

    await Promise.all(players.map(user =>
      this.craftworks.socket.emit(
        "gather.complete",
        { sessionId: session.id },
        { targetUserId: user.id }
      )
    ));

    ui.notifications.info("Gathering completed.");

    // Do not retain completed session data in a closed ApplicationV2 instance.
    this.session = null;
    await this.close();
  }

  async #resetScene() {
    try {
      await this.craftworks.gather.resetScene();
      ui.notifications.info(`Gathering availability reset for ${canvas.scene?.name ?? "the current scene"}.`);
      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }
}
