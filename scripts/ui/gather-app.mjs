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
    this.selectedCharacterUuids = null;
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
    const characters = game.actors.filter(actor => actor.type === "character");
    if (this.selectedCharacterUuids === null) {
      this.selectedCharacterUuids = new Set(characters.map(actor => actor.uuid));
    }

    return foundry.utils.mergeObject(context, {
      session: this.session,
      sceneName: canvas.scene?.name ?? "",
      gatherRecordCount: Object.keys(gatherRecords).length,
      characters: characters.map(actor => {
        const user = this.#activeUserForActor(actor);
        return {
          uuid: actor.uuid,
          name: actor.name,
          img: actor.img,
          checked: this.selectedCharacterUuids.has(actor.uuid),
          connected: Boolean(user),
          userName: user?.name ?? null
        };
      }),
      terrains: this.craftworks.gather.getProfiles().map(profile => ({
        ...profile,
        selected: profile.id === this.selectedTerrain
      })),
      progress: this.session ? players.filter(user => {
        const actor = this.#characterForUser(user);
        return !this.session.selectedCharacterUuids
          || this.session.selectedCharacterUuids.includes(actor?.uuid);
      }).map(user => {
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

    this.element.querySelectorAll("[name='characterUuid']")
      .forEach(input => input.addEventListener("change", event => {
        const uuid = event.currentTarget.value;
        if (event.currentTarget.checked) this.selectedCharacterUuids.add(uuid);
        else this.selectedCharacterUuids.delete(uuid);
      }));

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

      const selectedCharacters = game.actors.filter(actor =>
        actor.type === "character"
        && this.selectedCharacterUuids.has(actor.uuid)
      );
      if (!selectedCharacters.length) throw new Error("Select at least one player character.");
      const players = [...new Set(
        selectedCharacters
          .map(actor => this.#activeUserForActor(actor))
          .filter(Boolean)
      )];
      if (!players.length) throw new Error("None of the selected player characters has a connected player.");

      this.session = this.craftworks.gather.start(this.selectedTerrain);
      this.session.selectedCharacterUuids = selectedCharacters.map(actor => actor.uuid);

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

  #activeUserForActor(actor) {
    if (!actor) return null;
    return game.users.find(user =>
      user.active
      && !user.isGM
      && this.#characterForUser(user)?.id === actor.id
    ) ?? null;
  }

  #characterForUser(user) {
    if (!user) return null;
    if (user.character) return user.character;
    return game.actors.find(actor =>
      actor.type === "character"
      && Number(actor.ownership?.[user.id] ?? 0) >= 3
    ) ?? null;
  }
}
