import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";
import { SETTINGS } from "../core/settings.mjs";
import { getMorelordCoreService } from "../core/morelord-core-api.mjs";
import { participantsByUser } from "../acquisition/harvest-participants.mjs";

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
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window", "ml-craftworks-harvest-modern"],
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
    const gatherRecords = this.craftworks.gather.getSceneGatherRecords();
    const characters = game.actors.filter(actor => actor.type === "character");
    if (this.selectedCharacterUuids === null) {
      const stored = String(game.settings.get(MODULE_ID, SETTINGS.GATHER_SELECTED_CHARACTER_UUIDS) ?? "");
      let selectedUuids = null;
      if (stored) {
        try { selectedUuids = JSON.parse(stored); } catch { selectedUuids = null; }
      }
      if (Array.isArray(selectedUuids)) {
        const available = new Set(characters.map(actor => actor.uuid));
        selectedUuids = selectedUuids.filter(uuid => available.has(uuid));
        if (!selectedUuids.length) selectedUuids = null;
      }
      const defaults = getMorelordCoreService("ui")?.participation
        ?.listCharacterChoices({ selectedUuids })
        ?? characters.map(actor => ({
          uuid: actor.uuid,
          checked: selectedUuids ? selectedUuids.includes(actor.uuid) : actor.hasPlayerOwner
        }));
      this.selectedCharacterUuids = new Set(
        defaults.filter(entry => entry.checked).map(entry => entry.uuid)
      );
    }
    const choices = getMorelordCoreService("ui")?.participation
      ?.listCharacterChoices({ selectedUuids: [...this.selectedCharacterUuids] })
      ?? characters.map(actor => ({ uuid: actor.uuid, name: actor.name, img: actor.img }));
    const sessionParticipants = participantsByUser(this.session?.gatherActorsByUser);

    return foundry.utils.mergeObject(context, {
      session: this.session,
      sceneName: canvas.scene?.name ?? "",
      gatherRecordCount: Object.keys(gatherRecords).length,
      characters: choices.map(choice => {
        const actor = characters.find(entry => entry.uuid === choice.uuid);
        const user = this.#activeUserForActor(actor);
        return {
          uuid: choice.uuid,
          name: choice.name,
          img: choice.img,
          checked: this.selectedCharacterUuids.has(choice.uuid),
          connected: Boolean(user),
          userName: user?.name ?? null
        };
      }),
      terrains: this.craftworks.gather.getProfiles().map(profile => ({
        ...profile,
        selected: profile.id === this.selectedTerrain
      })),
      progress: this.session ? sessionParticipants.map(participant => {
        const state = this.session.participants?.[participant.actorUuid];
        const actor = characters.find(entry => entry.uuid === participant.actorUuid);
        return {
          user: actor?.name ?? game.users.get(participant.userId)?.name ?? "Unknown",
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
      const gatherActorsByUser = {};
      for (const actor of selectedCharacters) {
        const user = this.#activeUserForActor(actor);
        if (user) (gatherActorsByUser[user.id] ??= []).push(actor.uuid);
      }
      const players = Object.keys(gatherActorsByUser).map(id => game.users.get(id)).filter(Boolean);
      if (!players.length) throw new Error("None of the selected player characters has a connected player.");

      this.session = this.craftworks.gather.start(this.selectedTerrain, { gatherActorsByUser });
      this.session.selectedCharacterUuids = selectedCharacters.map(actor => actor.uuid);
      await game.settings.set(
        MODULE_ID,
        SETTINGS.GATHER_SELECTED_CHARACTER_UUIDS,
        JSON.stringify([...this.selectedCharacterUuids])
      );

      await Promise.all(Object.entries(gatherActorsByUser).flatMap(([userId, actorUuids]) =>
        actorUuids.map(actorUuid => this.craftworks.socket.emit(
          "gather.open",
          { session: this.session, actorUuid },
          { targetUserId: userId }
        ))
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

  #activeUserForActor(actor) {
    if (!actor) return null;
    return game.users.find(user =>
      user.active
      && !user.isGM
      && (user.character?.uuid === actor.uuid || actor.testUserPermission(user, "OWNER"))
    ) ?? null;
  }
}
