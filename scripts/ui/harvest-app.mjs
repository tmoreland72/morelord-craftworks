import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";
import { getMorelordCoreService } from "../core/morelord-core-api.mjs";
import { SETTINGS } from "../core/settings.mjs";
import {
  harvestParticipantKey,
  harvestParticipantsByUser
} from "../acquisition/harvest-participants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HarvestPrototypeApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = null;
    this.collapsedCreatures = new Set();
    this.preflightCreatures = null;
    this.selectedPreflightCreatureUuids = new Set();
    this.selectedCharacterUuids = null;
    this.skipSkillChecks = false;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-harvest",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window", "ml-craftworks", "ml-craftworks-harvest-modern"],
    position: {
      width: 960,
      height: 800
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

    const sessionParticipants = harvestParticipantsByUser(
      this.session?.harvestActorsByUser
    );

    const progress = this.session
      ? sessionParticipants.map(participant => ({
          userId: participant.userId,
          actorUuid: participant.actorUuid,
          user: game.actors.find(actor => actor.uuid === participant.actorUuid)?.name
            ?? game.users.get(participant.userId)?.name ?? "Unknown",
          completed: (this.session.completedParticipantIds ?? []).includes(participant.actorUuid),
          perCreature: this.session.creatures.map(creature => {
            const state = this.session.participants?.[
              harvestParticipantKey(participant.actorUuid, creature.tokenUuid)
            ];
            return {
              creature: creature.name,
              status: state?.status ?? "waiting",
              total: state?.total ?? null,
              claimedName: state?.claimedName ?? null
            };
          })
        }))
      : [];

    if (!this.session) {
      const deadTokens =
        this.craftworks.adapter
          .getDeadCreatureTokens()
          .filter(token => token.actor);

      const previousTokenUuids = new Set(
        (this.preflightCreatures ?? [])
          .map(creature => creature.tokenUuid)
      );

      const nextPreflightCreatures = [];

      for (const token of deadTokens) {
        const creature =
          await this.craftworks.harvest
            .buildCreatureContext(token);

        nextPreflightCreatures.push(creature);

        // Newly discovered defeated tokens default to selected. Existing
        // tokens retain whatever choice the GM already made in this preflight.
        if (!previousTokenUuids.has(creature.tokenUuid)) {
          this.selectedPreflightCreatureUuids.add(
            creature.tokenUuid
          );
        }
      }

      const currentTokenUuids = new Set(
        nextPreflightCreatures
          .map(creature => creature.tokenUuid)
      );

      for (
        const tokenUuid of
        Array.from(this.selectedPreflightCreatureUuids)
      ) {
        if (!currentTokenUuids.has(tokenUuid)) {
          this.selectedPreflightCreatureUuids.delete(
            tokenUuid
          );
        }
      }

      this.preflightCreatures =
        nextPreflightCreatures;
    }

    const deadCreatures =
      foundry.utils.deepClone(
        this.preflightCreatures ?? []
      ).map(creature => ({
        ...creature,
        selectedForHarvest:
          this.selectedPreflightCreatureUuids
            .has(creature.tokenUuid)
      }));

    const participation = getMorelordCoreService("ui")?.participation;
    if (this.selectedCharacterUuids === null) {
      const stored = String(game.settings.get(MODULE_ID, SETTINGS.HARVEST_SELECTED_CHARACTER_UUIDS) ?? "");
      let selectedUuids = null;
      if (stored) {
        try { selectedUuids = JSON.parse(stored); } catch { selectedUuids = null; }
      }
      if (Array.isArray(selectedUuids)) {
        const availableUuids = new Set(
          game.actors.filter(actor => actor.type === "character").map(actor => actor.uuid)
        );
        selectedUuids = selectedUuids.filter(uuid => availableUuids.has(uuid));
        if (!selectedUuids.length) selectedUuids = null;
      }
      const defaults = participation?.listCharacterChoices({ selectedUuids })
        ?? game.actors.filter(actor => actor.type === "character").map(actor => ({
          uuid: actor.uuid, name: actor.name, img: actor.img,
          checked: selectedUuids ? selectedUuids.includes(actor.uuid) : actor.hasPlayerOwner
        }));
      this.selectedCharacterUuids = new Set(defaults.filter(entry => entry.checked).map(entry => entry.uuid));
    }

    const choices = participation?.listCharacterChoices({
      selectedUuids: [...this.selectedCharacterUuids]
    }) ?? game.actors.filter(actor => actor.type === "character").map(actor => ({
      uuid: actor.uuid, name: actor.name, img: actor.img,
      checked: this.selectedCharacterUuids.has(actor.uuid)
    }));
    const playerCharacters = choices.map(choice => {
      const actor = game.actors.get(choice.uuid.split(".").pop())
        ?? game.actors.find(entry => entry.uuid === choice.uuid);
      const user = this.#activeUserForActor(actor);
      return {
        actorUuid: choice.uuid,
        actorName: choice.name,
        actorImg: choice.img,
        selected: this.selectedCharacterUuids.has(choice.uuid),
        connected: Boolean(user),
        userId: user?.id ?? "",
        userName: user?.name ?? "Offline"
      };
    });

    const claimsByCreature = new Map();

    for (const result of this.session?.results ?? []) {
      if (!claimsByCreature.has(result.creatureTokenUuid)) {
        claimsByCreature.set(result.creatureTokenUuid, new Map());
      }

      const componentClaims = claimsByCreature.get(result.creatureTokenUuid);
      const claims = componentClaims.get(result.componentId) ?? [];
      claims.push(result);
      componentClaims.set(result.componentId, claims);
    }

    const session = this.session
      ? {
          ...this.session,
          creatures: this.session.creatures.map(creature => {
            const creatureClaims =
              claimsByCreature.get(creature.tokenUuid)
              ?? new Map();

            return {
              ...creature,
              isCollapsed: this.collapsedCreatures.has(creature.tokenUuid),
              components: (creature.components ?? []).map(component => {
                const claims =
                  creatureClaims.get(component.id)
                  ?? [];
                const claim = claims[0] ?? null;
                const material = component.materialId
                  ? this.craftworks.materials.get(component.materialId)
                  : null;

                return {
                  ...component,
                  itemUuid: material?.uuid ?? null,
                  claimed: Boolean(claim),
                  claimantName:
                    claim?.actorName
                    ?? claim?.userName
                    ?? null,
                  claimRoll:
                    claim?.rollTotal
                    ?? null,
                  claimantName: claims.map(entry => entry.actorName ?? entry.userName ?? "Unknown").join(", "),
                  multipleClaims: claims.length > 1
                };
              })
            };
          })
        }
      : null;

    const claimedItems = (this.session?.results ?? [])
      .map(result => ({
        ...result,
        displayName:
          result.componentName
          ?? result.materialName
          ?? "Claimed Component",
        displayImg:
          result.materialImg
          ?? "",
        displayRarity:
          result.rarity
          ?? "Unspecified",
        displayClaimant:
          result.actorName
          ?? result.userName
          ?? "Unknown",
        displayRoll:
          result.rollTotal
          ?? "—",
        linkUuid:
          result.sourceItemUuid
          ?? result.itemUuid
          ?? null
      }))
      .sort((a, b) =>
        Number(a.claimedAt ?? 0)
        - Number(b.claimedAt ?? 0)
      );

    return foundry.utils.mergeObject(context, {
      isGM: game.user.isGM,
      session,
      progress,
      claimedItems,
      deadCreatures,
      playerCharacters,
      skipSkillChecks: this.skipSkillChecks,
      hasSpecialHarvestItems:
        deadCreatures.some(
          creature =>
            (creature.specialItems ?? [])
              .length > 0
        )
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='start']")
      ?.addEventListener("click", () => this.#startHarvest());

    this.element.querySelector("[data-action='finalize']")
      ?.addEventListener("click", () => this.#finalizeHarvest());

    this.element.querySelector("[data-action='cancel-harvest']")
      ?.addEventListener("click", () => this.#cancelHarvest());

    this.element.querySelectorAll("[data-action='reopen-harvest']")
      .forEach(button => button.addEventListener("click", event =>
        this.#reopenHarvest(event)
      ));

    this.element.querySelectorAll("[data-action='open-claimed-item']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();

        const uuid = button.dataset.uuid;
        if (!uuid) return;

        try {
          const item = await fromUuid(uuid);
          if (item?.sheet) {
            item.sheet.render(true);
          }
        } catch {
          // Keep the claimed-row display usable even if a document is no
          // longer resolvable.
        }
      }));

    this.element.querySelectorAll("[data-harvest-creature-select]")
      .forEach(input => input.addEventListener("change", event => {
        const tokenUuid =
          event.currentTarget.dataset.tokenUuid;

        if (!tokenUuid) return;

        if (event.currentTarget.checked) {
          this.selectedPreflightCreatureUuids.add(
            tokenUuid
          );
        } else {
          this.selectedPreflightCreatureUuids.delete(
            tokenUuid
          );
        }
      }));

    this.element.querySelectorAll("[data-harvest-character-select]")
      .forEach(input => input.addEventListener("change", event => {
        const uuid = event.currentTarget.value;
        if (event.currentTarget.checked) this.selectedCharacterUuids.add(uuid);
        else this.selectedCharacterUuids.delete(uuid);
      }));

    this.element.querySelector("[data-skip-skill-check]")
      ?.addEventListener("change", event => {
        this.skipSkillChecks = event.currentTarget.checked;
      });

    this.element.querySelector("[data-action='select-all-harvest-creatures']")
      ?.addEventListener("click", event => {
        event.preventDefault();

        this.element
          .querySelectorAll("[data-harvest-creature-select]")
          .forEach(input => {
            input.checked = true;
            const tokenUuid = input.dataset.tokenUuid;
            if (tokenUuid) {
              this.selectedPreflightCreatureUuids.add(
                tokenUuid
              );
            }
          });
      });

    this.element.querySelector("[data-action='clear-all-harvest-creatures']")
      ?.addEventListener("click", event => {
        event.preventDefault();

        this.element
          .querySelectorAll("[data-harvest-creature-select]")
          .forEach(input => {
            input.checked = false;
          });

        this.selectedPreflightCreatureUuids.clear();
      });

    this.element.querySelectorAll("[data-action='toggle-creature']")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();

        const id = button.dataset.creature;
        if (!id) return;

        const scroll = this.element.querySelector(".ml-craftworks-harvest-creatures");
        const scrollTop = scroll?.scrollTop ?? 0;

        if (this.collapsedCreatures.has(id)) {
          this.collapsedCreatures.delete(id);
        } else {
          this.collapsedCreatures.add(id);
        }

        await this.render();

        requestAnimationFrame(() => {
          const nextScroll = this.element.querySelector(".ml-craftworks-harvest-creatures");
          if (nextScroll) nextScroll.scrollTop = scrollTop;
        });
      }));
  }

  async #startHarvest() {
    try {
      if (!this.craftworks.materials.size) {
        throw new Error(
          "No Craftworks materials are indexed. Run MorelordCraftworks.dev.installStandardMaterials() once as GM."
        );
      }

      const selectedCharacters = game.actors.filter(actor =>
        actor.type === "character" && this.selectedCharacterUuids.has(actor.uuid)
      );
      if (!selectedCharacters.length) throw new Error("Select at least one player character.");
      const harvestActorsByUser = {};
      for (const actor of selectedCharacters) {
        const user = this.#activeUserForActor(actor);
        if (user) (harvestActorsByUser[user.id] ??= []).push(actor.uuid);
      }
      const players = Object.keys(harvestActorsByUser).map(id => game.users.get(id)).filter(Boolean);
      if (!players.length) throw new Error("None of the selected player characters has a connected player.");
      const skipSkillChecks = Object.entries(harvestActorsByUser)
        .flatMap(([userId, actorUuids]) => actorUuids
          .filter(() => this.skipSkillChecks)
          .map(actorUuid => ({ userId, actorUuid })));

      const selectedCreatureUuids =
        new Set(
          Array.from(
            this.element.querySelectorAll(
              "[data-harvest-creature-select]:checked"
            )
          ).map(input =>
            input.dataset.tokenUuid
          ).filter(Boolean)
        );

      this.selectedPreflightCreatureUuids =
        selectedCreatureUuids;

      const creatureContexts =
        (this.preflightCreatures ?? [])
          .filter(creature =>
            selectedCreatureUuids.has(
              creature.tokenUuid
            )
          );

      if (!creatureContexts.length) {
        throw new Error(
          "Select at least one creature to harvest."
        );
      }

      this.session =
        await this.craftworks.harvest.start({
          creatureContexts,
          skipSkillChecks,
          harvestActorsByUser
        });

      await game.settings.set(
        MODULE_ID,
        SETTINGS.HARVEST_SELECTED_CHARACTER_UUIDS,
        JSON.stringify([...this.selectedCharacterUuids])
      );

      await Promise.all(Object.entries(harvestActorsByUser).flatMap(([userId, actorUuids]) =>
        actorUuids.map(actorUuid => this.craftworks.socket.emit(
          "harvest.open",
          { session: this.session, actorUuid },
          { targetUserId: userId }
        ))
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

        this.session = await this.craftworks.harvest.start();

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

  async #reopenHarvest(event) {
    event.preventDefault();

    const userId = event.currentTarget.dataset.userId;
    const actorUuid = event.currentTarget.dataset.actorUuid;
    const user = userId ? game.users.get(userId) : null;

    if (!this.session?.id || !actorUuid || !user?.active) {
      ui.notifications.warn(
        "That player is no longer connected to this Harvest session."
      );
      return;
    }

    await this.craftworks.socket.emit(
      "harvest.open",
      { session: this.session, actorUuid },
      { targetUserId: user.id }
    );

    ui.notifications.info(
      `Reopened the active Harvest window for ${user.name}.`
    );
  }

  async #cancelHarvest() {
    try {
      const sessionId = this.session?.id ?? null;

      if (sessionId) {
        this.craftworks.sessions.delete(sessionId);
      }

      this.session = null;

      const players =
        game.users.filter(
          user => user.active && !user.isGM
        );

      await Promise.all(
        players.map(user =>
          this.craftworks.socket.emit(
            "harvest.cancel",
            { sessionId },
            { targetUserId: user.id }
          )
        )
      );

      ui.notifications.info(
        "Harvesting cancelled."
      );

      await this.close();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #finalizeHarvest() {
    if (!this.session) return;

    const session =
      await this.craftworks.harvest.finalize(
        this.session.id
      );
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

  #activeUserForActor(actor) {
    if (!actor) return null;
    return game.users.find(user =>
      user.active && !user.isGM && (
        user.character?.uuid === actor.uuid
        || actor.testUserPermission(user, "OWNER")
      )
    ) ?? null;
  }
}
