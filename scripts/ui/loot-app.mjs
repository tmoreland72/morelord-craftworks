import { MODULE_TITLE } from "../constants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class LootApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = null;
    this.preflightCreatures = null;
    this.selectedPreflightCreatureUuids = new Set();
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-loot",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 760, height: 760 },
    window: { title: `${MODULE_TITLE} — Encounter Loot`, resizable: true }
  };

  static PARTS = {
    content: { template: "modules/morelord-craftworks/templates/loot-gm.hbs" }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const actors = game.actors
      .filter(actor =>
        actor.type === "character"
        || actor.type === "group"
      )
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.name,
        img: actor.img
      }));

    if (!this.session) {
      const previousUuids = new Set(
        (this.preflightCreatures ?? []).map(creature => creature.tokenUuid)
      );
      this.preflightCreatures = this.craftworks.loot.getDeadCreatureSummary();
      const currentUuids = new Set(
        this.preflightCreatures.map(creature => creature.tokenUuid)
      );

      for (const creature of this.preflightCreatures) {
        if (!previousUuids.has(creature.tokenUuid)) {
          this.selectedPreflightCreatureUuids.add(creature.tokenUuid);
        }
      }
      for (const uuid of Array.from(this.selectedPreflightCreatureUuids)) {
        if (!currentUuids.has(uuid)) this.selectedPreflightCreatureUuids.delete(uuid);
      }
    }

    const allCreatures = this.session?.creatures ?? this.preflightCreatures ?? [];
    const creatures = [];
    let resolvedCount = 0;

    for (const creature of allCreatures) {
      const resolved = await this.craftworks.loot.isLootResolved(creature.tokenUuid);
      if (resolved) {
        resolvedCount += 1;
        this.selectedPreflightCreatureUuids.delete(creature.tokenUuid);
      }
      creatures.push({
        ...creature,
        resolved,
        selectedForLoot:
          !resolved
          && this.selectedPreflightCreatureUuids.has(creature.tokenUuid)
      });
    }

    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();
    for (const actor of actors) actor.selected = actor.uuid === partyInfo.actorUuid;

    return foundry.utils.mergeObject(context, {
      session: this.session,
      creatures,
      resolvedCount,
      actors,
      partyInfo
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='roll']")
      ?.addEventListener("click", () => this.#roll());

    this.element.querySelector("[data-action='award']")
      ?.addEventListener("click", () => this.#award());

    this.element.querySelector("[data-action='finish']")
      ?.addEventListener("click", () => this.#finish());

    this.element.querySelector("[data-action='reset-loot']")
      ?.addEventListener("click", () => this.#resetLoot());

    this.element.querySelector("[data-action='reroll-loot']")
      ?.addEventListener("click", () => this.#rerollLoot());

    this.element.querySelectorAll("[data-loot-creature-select]")
      .forEach(input => input.addEventListener("change", event => {
        const uuid = event.currentTarget.dataset.tokenUuid;
        if (!uuid) return;
        if (event.currentTarget.checked) this.selectedPreflightCreatureUuids.add(uuid);
        else this.selectedPreflightCreatureUuids.delete(uuid);
      }));

    this.element.querySelector("[data-action='select-all-loot-creatures']")
      ?.addEventListener("click", event => {
        event.preventDefault();
        this.element.querySelectorAll("[data-loot-creature-select]:not(:disabled)").forEach(input => {
          input.checked = true;
          if (input.dataset.tokenUuid) this.selectedPreflightCreatureUuids.add(input.dataset.tokenUuid);
        });
      });

    this.element.querySelector("[data-action='clear-all-loot-creatures']")
      ?.addEventListener("click", event => {
        event.preventDefault();
        this.element.querySelectorAll("[data-loot-creature-select]").forEach(input => {
          input.checked = false;
        });
        this.selectedPreflightCreatureUuids.clear();
      });
  }

  async #roll() {
    try {
      const selectedUuids = new Set(
        Array.from(this.element.querySelectorAll("[data-loot-creature-select]:checked:not(:disabled)"))
          .map(input => input.dataset.tokenUuid)
          .filter(Boolean)
      );
      const creatureContexts = (this.preflightCreatures ?? [])
        .filter(creature => selectedUuids.has(creature.tokenUuid));

      if (!creatureContexts.length) {
        throw new Error("Select at least one defeated NPC token to loot.");
      }

      this.selectedPreflightCreatureUuids = selectedUuids;
      this.session = await this.craftworks.loot.start({ creatureContexts });
      await this.craftworks.loot.roll(this.session.id);
      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #award() {
    const actorUuid = this.element.querySelector("[name='recipient']")?.value ?? null;
    if (!actorUuid) return ui.notifications.warn("Choose a recipient for the encounter loot.");

    try {
      const result = await this.craftworks.loot.award(this.session.id, actorUuid);

      const materialSummary = result.materials.map(m => `${m.name} ×${m.quantity}`).join(", ");
      const parts = [];
      if (materialSummary) parts.push(materialSummary);
      if (result.potions?.length) parts.push(`${result.potions.length} potion${result.potions.length === 1 ? "" : "s"}`);
      if (result.spellScrolls?.length) parts.push(`${result.spellScrolls.length} spell scroll${result.spellScrolls.length === 1 ? "" : "s"}`);
      if (result.coinTotalCopper > 0) parts.push(result.coinLabel);
      if (result.special?.itemName) parts.push(result.special.itemName);

      ui.notifications.info(`Encounter loot sent to ${result.recipientName}: ${parts.join("; ") || "nothing"}.`);

      await this.craftworks.socket.emit("loot.complete", {
        found: result.found,
        materials: result.materials,
        potions: result.potions,
        spellScrolls: result.spellScrolls,
        coinLabel: result.coinLabel,
        coinTotalCopper: result.coinTotalCopper,
        special: result.special,
        actorName: result.recipientName
      });

      await this.#finish();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #resetLoot() {
    try {
      const count = await this.craftworks.loot.resetSceneLooting();
      ui.notifications.info(`Reset encounter-loot records for ${count} dead creature token${count === 1 ? "" : "s"} on this scene.`);
      this.session = null;
      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #rerollLoot() {
    if (!this.session) return;
    try {
      await this.craftworks.loot.reroll(this.session.id);
      ui.notifications.info("Encounter loot rerolled.");
      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #finish() {
    if (this.session) this.craftworks.loot.finalize(this.session.id);
    await this.close();
  }
}
