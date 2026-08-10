import { MODULE_TITLE } from "../constants.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CraftworksApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks",
    classes: ["morelord-craftworks", "mcw-window", "mcw-dashboard-window"],
    position: {
      width: 760,
      height: 680
    },
    window: {
      title: MODULE_TITLE,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/craftworks-dashboard.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const scene = canvas.scene;

    const deadCreatures = game.user.isGM
      ? this.craftworks.adapter.getDeadCreatureTokens()
      : [];

    const gatherRecords = game.user.isGM && scene
      ? this.craftworks.gather.getSceneGatherRecords(scene.id)
      : {};

    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();

    return foundry.utils.mergeObject(context, {
      isGM: game.user.isGM,
      scene: scene ? {
        id: scene.id,
        name: scene.name
      } : null,
      materialsCount: this.craftworks.materials.size,
      recipesCount: this.craftworks.recipes.all().length,
      deadCreatureCount: deadCreatures.length,
      gatherRecordCount: Object.keys(gatherRecords).length,
      spellScrollGeneratorPremium:
        Boolean(this.craftworks.spellScrollGenerator?.hasAccess),
      partyInfo
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='materials']")
      ?.addEventListener("click", () => this.craftworks.openMaterials());

    this.element.querySelector("[data-action='recipes']")
      ?.addEventListener("click", () => this.craftworks.openRecipes());

    this.element.querySelector("[data-action='harvest']")
      ?.addEventListener("click", () => this.#gmAction(() => this.craftworks.openHarvestPrototype()));

    this.element.querySelector("[data-action='gather']")
      ?.addEventListener("click", () => this.#gmAction(() => this.craftworks.openGather()));

    this.element.querySelector("[data-action='loot']")
      ?.addEventListener("click", () => this.#gmAction(() => this.craftworks.openLoot()));

    this.element.querySelector("[data-action='hoard']")
      ?.addEventListener("click", () => this.#gmAction(() => this.craftworks.openHoard()));

    this.element.querySelector("[data-action='spell-scroll-generator']")
      ?.addEventListener(
        "click",
        () => this.#gmAction(
          () => this.craftworks.openSpellScrollGenerator()
        )
      );

    this.element.querySelector("[data-action='refresh']")
      ?.addEventListener("click", () => this.render());
  }

  #gmAction(fn) {
    if (!game.user.isGM) {
      ui.notifications.warn("Only the GM can initiate acquisition.");
      return;
    }
    return fn();
  }
}
