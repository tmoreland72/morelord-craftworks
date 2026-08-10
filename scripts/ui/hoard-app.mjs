import { MODULE_TITLE } from "../constants.mjs";
import { HOARD_PROFILES } from "../acquisition/hoard-profiles.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HoardApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.result = null;
    this.profileId = "0-4";
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-hoard",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 720, height: 700 },
    window: {
      title: `${MODULE_TITLE} — Hoard`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/hoard-gm.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();

    const actors = game.actors
      .filter(actor => actor.type === "character")
      .map(actor => ({ uuid: actor.uuid, name: actor.name, img: actor.img }));

    return foundry.utils.mergeObject(context, {
      result: this.result,
      profileId: this.profileId,
      profiles: Object.values(HOARD_PROFILES).map(profile => ({
        ...profile,
        selected: profile.id === this.profileId
      })),
      partyInfo,
      actors
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[name='profile']")
      ?.addEventListener("change", event => {
        this.profileId = event.currentTarget.value;
      });

    this.element.querySelector("[data-action='roll']")
      ?.addEventListener("click", () => this.#roll());

    this.element.querySelector("[data-action='reroll']")
      ?.addEventListener("click", () => this.#roll());

    this.element.querySelector("[data-action='award']")
      ?.addEventListener("click", () => this.#award());
  }

  async #roll() {
    try {
      this.result = await this.craftworks.hoard.roll(this.profileId);
      await this.render();
    } catch (err) {
      console.error("Morelord Craftworks | Hoard roll failed.", err);
      ui.notifications.error(err.message);
    }
  }

  async #award() {
    let actorUuid = null;
    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();

    if (!partyInfo.enabled || !partyInfo.valid) {
      actorUuid = this.element.querySelector("[name='recipient']")?.value ?? null;
      if (!actorUuid) return ui.notifications.warn("Choose a character to carry the hoard.");
    }

    try {
      const awarded = await this.craftworks.hoard.award(this.result, actorUuid);
      const parts = [];

      if (awarded.materials?.length) {
        parts.push(awarded.materials.map(m => `${m.name} ×${m.quantity}`).join(", "));
      }
      if (awarded.coinCopper > 0) parts.push(awarded.coinLabel);
      if (awarded.special?.items?.length) {
        parts.push(awarded.special.items.map(item => item.itemName).join(", "));
      }

      ui.notifications.info(`Hoard sent to ${awarded.recipientName}: ${parts.join("; ") || "nothing"}.`);
      await this.close();
    } catch (err) {
      console.error("Morelord Craftworks | Hoard award failed.", err);
      ui.notifications.error(err.message);
    }
  }
}
