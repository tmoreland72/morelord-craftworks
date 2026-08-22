import { MODULE_TITLE } from "../constants.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const ENCOUNTERS_MODULE_ID = "morelord-encounters";

export class DeleriumSearchResultsApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, session, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = session;
    this.selectedRecipientUuid = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-delerium-search-results",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"],
    position: { width: 640, height: "auto" },
    window: { title: `${MODULE_TITLE} — Search Results`, resizable: true }
  };

  static PARTS = { content: { template: "modules/morelord-craftworks/templates/delerium-search-results.hbs" } };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const party = await this.craftworks.recipientResolver.getPartyActor();
    const recipients = game.actors
      .filter(actor => actor.type === "character" || actor.type === "group")
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.type === "group" ? `${actor.name} (Group Inventory)` : actor.name,
        isParty: actor.type === "group",
        typeOrder: actor.type === "group" ? 0 : 1
      }))
      .sort((a, b) => a.typeOrder - b.typeOrder || a.name.localeCompare(b.name));

    const participantUuid = Object.values(this.session.participants).find(entry => entry.actorUuid)?.actorUuid;
    const defaultUuid = party?.uuid
      ?? (recipients.some(entry => entry.uuid === participantUuid) ? participantUuid : null)
      ?? recipients[0]?.uuid
      ?? "";
    if (!this.selectedRecipientUuid || !recipients.some(entry => entry.uuid === this.selectedRecipientUuid)) {
      this.selectedRecipientUuid = defaultUuid;
    }
    for (const recipient of recipients) recipient.selected = recipient.uuid === this.selectedRecipientUuid;
    const encountersModule = game.modules.get(ENCOUNTERS_MODULE_ID);
    const encountersInstalled = Boolean(encountersModule);
    const encountersActive = Boolean(encountersModule?.active);

    return foundry.utils.mergeObject(context, {
      session: this.session,
      hasReward: Boolean(this.session.reward),
      hasResult: Boolean(this.session.result),
      quantityRequiresRoll: Boolean(this.session.reward && this.session.reward.formula !== "1"),
      awardButtonLabel: this.session.reward?.formula === "1"
        ? "Award 1 Shard"
        : `Roll ${this.session.reward?.formula ?? ""} & Award`,
      recipients,
      canAward: Boolean(this.session.reward && !this.session.result && recipients.length),
      encounterTitle: this.session.randomEncounter ? "Random Encounter Required" : "No Random Encounter",
      encounterText: this.session.randomEncounter
        ? "Two or more characters failed their checks. Resolve a random encounter for this search."
        : "Fewer than two characters failed. This search does not trigger a random encounter.",
      encountersInstalled,
      encountersActive,
      encountersUnavailableText: encountersInstalled
        ? "Morelord Encounters is installed but not active. Enable it in Manage Modules to build this encounter."
        : "Install Morelord Encounters from Foundry's Add-on Modules screen to build this encounter automatically."
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelector("[name='recipientUuid']")?.addEventListener("change", event => {
      this.selectedRecipientUuid = event.currentTarget.value;
    });
    this.element.querySelector("[data-action='roll-award']")?.addEventListener("click", event => this.#rollAndAward(event));
    this.element.querySelector("[data-action='open-encounters']")?.addEventListener("click", event => this.#openEncounters(event));
  }

  async #rollAndAward(event) {
    const button = event.currentTarget;
    const select = this.element.querySelector("[name='recipientUuid']");
    this.selectedRecipientUuid = select?.value ?? this.selectedRecipientUuid;
    button.disabled = true;
    try {
      await this.craftworks.deleriumSearch.rollAndAward(this.session.id, this.selectedRecipientUuid);
      await this.render();
    } catch (error) {
      ui.notifications.error(error.message);
      button.disabled = false;
    }
  }

  async #openEncounters(event) {
    const button = event.currentTarget;
    const encountersModule = game.modules.get(ENCOUNTERS_MODULE_ID);
    if (!encountersModule) {
      return ui.notifications.warn("Install Morelord Encounters from Foundry's Add-on Modules screen first.");
    }
    if (!encountersModule.active) {
      return ui.notifications.warn("Enable Morelord Encounters in Manage Modules first.");
    }

    button.disabled = true;
    try {
      const api = encountersModule.api;
      const open = api?.openEncounterBuilder ?? api?.open;
      if (typeof open === "function") {
        await open.call(api);
      } else {
        const modulePath = "modules/morelord-encounters/scripts/apps/encounter-builder-dialog.mjs";
        const moduleUrl = foundry.utils.getRoute?.(modulePath) ?? `/${modulePath}`;
        const { configureEncounter } = await import(moduleUrl);
        if (typeof configureEncounter !== "function") {
          throw new Error("Morelord Encounters does not expose its encounter builder.");
        }
        await configureEncounter();
      }
    } catch (error) {
      ui.notifications.error(`Could not open Morelord Encounters: ${error.message}`);
    } finally {
      button.disabled = false;
    }
  }
}
