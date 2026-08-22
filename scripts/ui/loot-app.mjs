import { MODULE_TITLE } from "../constants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
import {
  addCustomItem,
  coinEditorValues,
  deleteSelectedResultItems,
  searchItemsByName,
  updateResultCoins
} from "./result-item-editor.mjs";

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
    this.itemSearchQuery = "";
    this.itemSearchResults = [];
    this.itemSearchTimer = null;
    this.itemLookupOpen = false;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-loot",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"],
    position: { width: 920, height: 820 },
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
      const resolved = false;
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
      partyInfo,
      itemSearchQuery: this.itemSearchQuery,
      itemSearchResults: this.itemSearchResults,
      itemLookupOpen: this.itemLookupOpen,
      itemSearchReady: this.itemSearchQuery.trim().length >= 2,
      coinEditor: coinEditorValues(this.session?.result)
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


    this.element.querySelector("[data-action='reroll-loot']")
      ?.addEventListener("click", () => this.#rerollLoot());

    this.#activateResultEditing();

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
      if (result.customItems?.length) parts.push(result.customItems.map(item => item.name).join(", "));
      if (result.coinTotalCopper > 0) parts.push(result.coinLabel);
      if (result.special?.itemName) parts.push(result.special.itemName);

      ui.notifications.info(`Encounter loot sent to ${result.recipientName}: ${parts.join("; ") || "nothing"}.`);

      await this.craftworks.socket.emit("loot.complete", {
        found: result.found,
        materials: result.materials,
        potions: result.potions,
        spellScrolls: result.spellScrolls,
        customItems: result.customItems,
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

  #activateResultEditing() {
    this.element.querySelectorAll("[data-result-item]")
      .forEach(input => input.addEventListener("click", event => event.stopPropagation()));

    this.element.querySelectorAll("[data-coin-denomination]")
      .forEach(input => input.addEventListener("change", async () => {
        const values = Object.fromEntries(
          Array.from(this.element.querySelectorAll("[data-coin-denomination]"))
            .map(field => [field.dataset.coinDenomination, field.value])
        );
        updateResultCoins(this.session?.result, values, this.craftworks.adapter);
        await this.render();
      }));

    this.element.querySelector("[data-action='delete-result-items']")
      ?.addEventListener("click", async () => {
        const selected = Array.from(this.element.querySelectorAll("[data-result-item]:checked"))
          .map(input => input.dataset.resultItem);
        if (!selected.length) return ui.notifications.warn("Mark at least one item to delete.");
        const count = deleteSelectedResultItems(this.session?.result, selected);
        if (count) ui.notifications.info(`Removed ${count} item${count === 1 ? "" : "s"} from the encounter haul.`);
        await this.render();
      });

    this.element.querySelector("[data-action='open-item-lookup']")
      ?.addEventListener("click", async () => {
        this.itemLookupOpen = true;
        await this.render();
        this.element.querySelector("[data-item-search]")?.focus();
      });

    this.element.querySelector("[data-action='close-item-lookup']")
      ?.addEventListener("click", async () => {
        this.itemLookupOpen = false;
        this.itemSearchQuery = "";
        this.itemSearchResults = [];
        await this.render();
      });

    const search = this.element.querySelector("[data-item-search]");
    search?.addEventListener("input", event => {
      this.itemSearchQuery = event.currentTarget.value;
      clearTimeout(this.itemSearchTimer);
      this.itemSearchTimer = setTimeout(async () => {
        const query = this.itemSearchQuery;
        const results = await searchItemsByName(query, {
          sourceFilter: this.craftworks.sourceFilter
        });
        if (query !== this.itemSearchQuery) return;
        this.itemSearchResults = results;
        await this.render();
        const input = this.element.querySelector("[data-item-search]");
        input?.focus();
        input?.setSelectionRange(input.value.length, input.value.length);
      }, 250);
    });

    this.element.querySelectorAll("[data-action='add-result-item']")
      .forEach(button => button.addEventListener("click", async () => {
        const item = this.itemSearchResults.find(entry => entry.uuid === button.dataset.itemUuid);
        if (!item) return;
        addCustomItem(this.session?.result, item);
        this.itemSearchQuery = "";
        this.itemSearchResults = [];
        this.itemLookupOpen = false;
        ui.notifications.info(`Added ${item.name} to the encounter haul.`);
        await this.render();
      }));
  }

  async #finish() {
    if (this.session) this.craftworks.loot.finalize(this.session.id);
    await this.close();
  }
}
