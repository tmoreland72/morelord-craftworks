import { MODULE_TITLE } from "../constants.mjs";
import { isRecipeKnownToActor } from "../core/settings.mjs";
import { getMorelordCoreService } from "../core/morelord-core-api.mjs";
import { formatContentSyncSummary } from "../core/content-sync-service.mjs";

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
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window", "ml-craftworks-dashboard-window"],
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

    const projectCrafters = game.user.isGM
      ? this.craftworks.crafterContext.availableCharacters()
      : [crafter].filter(Boolean);
    let craftingProjectsCount = 0;
    let readyCraftingProjectsCount = 0;

    for (const projectCrafter of projectCrafters) {
      const activeJobs = this.craftworks.craftingJobs.list(
        projectCrafter,
        { activeOnly: true }
      );
      const activeRecipeIds = new Set(activeJobs.map(job => job.recipeId));
      const craftingProjectIds = new Set([
        ...this.craftworks.markedRecipes.list(projectCrafter),
        ...activeRecipeIds
      ]);
      const craftingProjects = [...craftingProjectIds]
        .map(recipeId =>
          this.craftworks.recipes.get(recipeId, { includeDisabled: true })
        )
        .filter(Boolean)
        .filter(recipe =>
          game.user.isGM
          || activeRecipeIds.has(recipe.id)
          || isRecipeKnownToActor(
            recipe,
            projectCrafter,
            this.craftworks.toolInspector
          )
        );

      craftingProjectsCount += craftingProjects.length;
      readyCraftingProjectsCount += craftingProjects
        .filter(recipe =>
          activeRecipeIds.has(recipe.id)
          || this.craftworks.recipePlanner.plan(recipe, projectCrafter).ready
        )
        .length;
    }

    return foundry.utils.mergeObject(context, {
      isGM: game.user.isGM,
      scene: scene ? {
        id: scene.id,
        name: scene.name
      } : null,
      materialsCount: this.craftworks.materials.size,
      recipesCount,
      craftingProjectsCount,
      readyCraftingProjectsCount,
      deadCreatureCount: deadCreatures.length,
      gatherRecordCount: Object.keys(gatherRecords).length,
      deleriumSearchAvailable: Boolean(this.craftworks.deleriumSearch?.hasAccess),
      spellScrollGeneratorPremium:
        Boolean(this.craftworks.spellScrollGenerator?.hasAccess),
      spellbookGeneratorPremium:
        Boolean(this.craftworks.spellbookGenerator?.hasAccess),
      potionGeneratorPremium:
        Boolean(this.craftworks.potionGenerator?.hasAccess),
      partyInfo,
      canOpenDocumentation: Boolean(
        getMorelordCoreService("ui")?.documentation?.open
      ),
      canRefreshContent: game.user.isGM
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
      ?.addEventListener("click", event => this.#refreshContent(event));

    this.element.querySelector("[data-action='open-documentation']")
      ?.addEventListener("click", event => {
        event.preventDefault();
        getMorelordCoreService("ui")?.documentation?.open("morelord-craftworks");
      });

    this.element.querySelector("[data-action='manage-locations']")
      ?.addEventListener("click", () => this.#openLocations());
  }

  #gmAction(fn) {
    if (!game.user.isGM) {
      ui.notifications.warn("Only the GM can initiate acquisition.");
      return;
    }
    return fn();
  }

  async #refreshContent(event) {
    const button = event.currentTarget;
    button.disabled = true;
    const originalHtml = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Refreshing…';

    try {
      const result = await this.craftworks.syncContent({ reason: "dashboard" });
      ui.notifications.info(formatContentSyncSummary(result));
      await this.render({ force: true });
    } catch (error) {
      console.error("Morelord Craftworks | Dashboard refresh failed.", error);
      ui.notifications.error(`Craftworks refresh failed: ${error.message}`);
    } finally {
      if (button?.isConnected) {
        button.disabled = false;
        button.innerHTML = originalHtml;
      }
    }
  }

  #openLocations() {
    if (!game.user.isGM) return;
    const locations = getMorelordCoreService("locations");
    if (typeof locations?.open !== "function") {
      ui.notifications.warn("Morelord Locations is unavailable. Update and enable Morelord Core.");
      return;
    }
    return locations.open();
  }
}
