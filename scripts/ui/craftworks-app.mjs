import { MODULE_TITLE } from "../constants.mjs";
import { isRecipeKnownToActor } from "../core/settings.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CraftworksApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks",
    classes: ["morelord-craftworks", "mcw-window", "mcw-dashboard-window"],
    position: {
      width: 900,
      height: 780
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
    const crafter = this.craftworks.crafterContext.resolve();
    const recipesCount = this.craftworks.recipes.all()
      .filter(recipe =>
        game.user.isGM
        || isRecipeKnownToActor(
          recipe,
          crafter,
          this.craftworks.toolInspector
        )
      )
      .length;

    return foundry.utils.mergeObject(context, {
      isGM: game.user.isGM,
      scene: scene ? {
        id: scene.id,
        name: scene.name
      } : null,
      materialsCount: this.craftworks.materials.size,
      recipesCount,
      deadCreatureCount: deadCreatures.length,
      gatherRecordCount: Object.keys(gatherRecords).length,
      deleriumSearchAvailable: Boolean(this.craftworks.deleriumSearch?.hasAccess),
      spellScrollGeneratorPremium:
        Boolean(this.craftworks.spellScrollGenerator?.hasAccess),
      spellbookGeneratorPremium:
        Boolean(this.craftworks.spellbookGenerator?.hasAccess),
      potionGeneratorPremium:
        Boolean(this.craftworks.potionGenerator?.hasAccess),
      partyInfo
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='materials']")
      ?.addEventListener("click", () => this.craftworks.openMaterials());

    this.element.querySelector("[data-action='recipes']")
      ?.addEventListener("click", () => this.craftworks.openRecipes());

    this.element.querySelector("[data-action='craft']")
      ?.addEventListener("click", () => this.craftworks.openCraft());

    this.element.querySelector("[data-action='harvest']")
      ?.addEventListener("click", () => this.#gmAction(() => this.craftworks.openHarvestPrototype()));

    this.element.querySelector("[data-action='gather']")
      ?.addEventListener("click", () => this.#gmAction(() => this.craftworks.openGather()));

    this.element.querySelector("[data-action='delerium-search']")
      ?.addEventListener("click", () => this.#gmAction(() => this.craftworks.openDeleriumSearch()));

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

    this.element.querySelector("[data-action='spellbook-generator']")
      ?.addEventListener(
        "click",
        () => this.#gmAction(
          () => this.craftworks.openSpellbookGenerator()
        )
      );

    this.element.querySelector("[data-action='potion-generator']")
      ?.addEventListener(
        "click",
        () => this.#gmAction(
          () => this.craftworks.openPotionGenerator()
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
