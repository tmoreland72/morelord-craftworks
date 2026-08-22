import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class PartyRecipientSettingsApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-party-recipient-settings",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"],
    position: { width: 580, height: "auto" },
    window: {
      title: `${MODULE_TITLE} — Party Collection`,
      resizable: false
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/party-recipient-settings.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const service = game.modules.get(MODULE_ID)?.api?.recipients;

    const selectedUuid = String(game.settings.get(MODULE_ID, "partyActorUuid") ?? "");
    const groups = service?.getGroupActors?.() ?? [];

    return foundry.utils.mergeObject(context, {
      partyHarvest: Boolean(game.settings.get(MODULE_ID, "partyHarvest")),
      partyGather: Boolean(game.settings.get(MODULE_ID, "partyGather")),
      partyLoot: Boolean(game.settings.get(MODULE_ID, "partyLoot")),
      selectedUuid,
      groups: groups.map(group => ({
        uuid: group.uuid,
        name: group.name,
        members: group.members,
        isPrimary: group.isPrimary,
        selected: group.uuid === selectedUuid
      }))
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelector("[data-action='save']")
      ?.addEventListener("click", () => this.#save());
  }

  async #save() {
    const partyHarvest = Boolean(this.element.querySelector("[name='partyHarvest']")?.checked);
    const partyGather = Boolean(this.element.querySelector("[name='partyGather']")?.checked);
    const partyLoot = Boolean(this.element.querySelector("[name='partyLoot']")?.checked);
    const actorUuid = String(this.element.querySelector("[name='partyActorUuid']")?.value ?? "");

    if ((partyHarvest || partyGather || partyLoot) && !actorUuid) {
      return ui.notifications.warn("Choose a Party actor before enabling party collection.");
    }

    await game.settings.set(MODULE_ID, "partyActorUuid", actorUuid);
    await game.settings.set(MODULE_ID, "partyHarvest", partyHarvest);
    await game.settings.set(MODULE_ID, "partyGather", partyGather);
    await game.settings.set(MODULE_ID, "partyLoot", partyLoot);

    ui.notifications.info("Craftworks party collection settings saved.");
    await this.close();
  }
}
