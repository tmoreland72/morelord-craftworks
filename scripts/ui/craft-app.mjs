import { MODULE_TITLE } from "../constants.mjs";
import { CraftCompletionApp } from "./craft-completion-app.mjs";
import {
  isRecipeHidden,
  isRecipeKnownToActor
} from "../core/settings.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const {
  ApplicationV2,
  HandlebarsApplicationMixin
} = foundry.applications.api;

function requirementFallbackImg(match) {
  if (match?.itemType === "spellScroll") {
    return "icons/sundries/scrolls/scroll-bound-sealed-red.webp";
  }
  if (match?.equipmentType) {
    return "icons/equipment/chest/breastplate-layered-steel-grey.webp";
  }
  if (match?.weaponType) {
    return "icons/weapons/swords/sword-guard-steel.webp";
  }
  if (match?.lootTypes?.length) {
    return "icons/commodities/gems/gem-faceted-round-white.webp";
  }
  if (match?.itemName) {
    return "icons/svg/hazard.svg";
  }
  return "icons/containers/bags/pouch-leather-simple-tan.webp";
}

export class CraftApp
  extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {

  constructor(craftworks, options = {}) {
    const {
      recipeId = null,
      crafterActorUuid = null,
      inventoryActorUuid = null,
      ...applicationOptions
    } = options;
    super(applicationOptions);
    this.craftworks = craftworks;
    this.focusRecipeId = recipeId ? String(recipeId) : null;
    this.crafterActorUuid = crafterActorUuid;
    this.inventoryActorUuid = inventoryActorUuid;
    this.sessionLog = [];
    this.search = "";
    this.categoryFilter = "all";
    this.statusFilter = "all";
    this.searchRenderTimer = null;
    this.restoreSearchFocus = false;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-craft",
    classes: [
      "ml-window",
      "ml-craftworks-module",
      "ml-craftworks-window",
      "ml-craftworks-craft-window"
    ],
    position: {
      width: 1240,
      height: 860
    },
    window: {
      title: `${MODULE_TITLE} — Craft`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template:
        "modules/morelord-craftworks/templates/craft.hbs"
    }
  };

  async _onClose(options) {
    if (this.searchRenderTimer) {
      clearTimeout(this.searchRenderTimer);
      this.searchRenderTimer = null;
    }
    await super._onClose(options);
  }

  async _prepareContext(options) {
    const context =
      await super._prepareContext(options);

    const crafterActors =
      this.craftworks.crafterContext
        .availableCharacters();

    if (!this.crafterActorUuid) {
      const resolved =
        this.craftworks.crafterContext.resolve();

      if (resolved) {
        this.crafterActorUuid = resolved.uuid;
      } else if (
        !game.user.isGM
        && crafterActors.length === 1
      ) {
        this.crafterActorUuid =
          crafterActors[0].uuid;
      }
    }

    let crafter =
      this.crafterActorUuid
        ? await fromUuid(this.crafterActorUuid)
        : null;

    if (
      crafter
      && !crafterActors.some(
        actor => actor.uuid === crafter.uuid
      )
    ) {
      crafter = null;
      this.crafterActorUuid = null;
    }

    const inventoryActors =
      this.craftworks.crafterContext.availableInventoryActors(crafter);

    if (!crafter) {
      return foundry.utils.mergeObject(
        context,
        {
          hasCrafter: false,
          crafterActorUuid:
            this.crafterActorUuid,
          crafterActors:
            crafterActors.map(actor => ({
              uuid: actor.uuid,
              name: actor.name,
              selected: false
            })),
          inventoryActors:
            inventoryActors.map(actor => ({
              uuid: actor.uuid,
              name: actor.name,
              type: actor.type,
              selected: false
            })),
          sessionLog: this.sessionLog,
          hasSessionLog:
            this.sessionLog.length > 0,
          canChooseCrafter:
            game.user.isGM
            || crafterActors.length > 1
        },
        { inplace: false }
      );
    }

    if (
      !this.inventoryActorUuid
      || !inventoryActors.some(
        actor => actor.uuid === this.inventoryActorUuid
      )
    ) {
      this.inventoryActorUuid = crafter.uuid;
    }

    const inventoryActor =
      this.inventoryActorUuid
        ? await fromUuid(this.inventoryActorUuid)
        : null;

    const activeJobs =
      this.craftworks.craftingJobs.list(
        crafter,
        { activeOnly: true }
      );

    const markedIds =
      this.craftworks.markedRecipes.list(crafter);

    const activeJobsByRecipe = new Map(
      activeJobs.map(job => [job.recipeId, job])
    );
    const queuedRecipeIds = [...new Set([
      ...markedIds,
      ...activeJobs.map(job => job.recipeId)
    ])];
    const allRecipes = queuedRecipeIds
      .map(recipeId => this.craftworks.recipes.get(recipeId, { includeDisabled: true }))
      .filter(Boolean)
      .filter(recipe => !this.focusRecipeId || recipe.id === this.focusRecipeId)
      .filter(recipe =>
        game.user.isGM
        || activeJobsByRecipe.has(recipe.id)
        || isRecipeKnownToActor(
          recipe,
          crafter,
          this.craftworks.toolInspector
        )
      );
    const allCards = await Promise.all(
      allRecipes.map(recipe => {
        const job = activeJobsByRecipe.get(recipe.id) ?? null;
        return this.#prepareRecipeCard(
          recipe,
          crafter,
          inventoryActor,
          job ? { job, forceInventoryUuid: job.inventoryActorUuid } : {}
        );
      })
    );

    for (const card of allCards) {
      card.statusKey = card.isActive
        ? "active"
        : card.readiness.ready
          ? "ready"
          : "missing";
      card.statusLabel = card.isActive
        ? (card.environment.passed ? "In Progress" : "Paused - Environment")
        : card.readiness.ready
          ? "Ready"
          : card.readiness.materialsReady && !card.environment.passed
            ? "Environment Unavailable"
          : card.requirementsKnown
            ? "Missing Materials"
            : "Ingredients Unknown";
    }

    const search = this.search.trim().toLowerCase();
    const recipes = allCards
      .filter(card => this.categoryFilter === "all" || card.category === this.categoryFilter)
      .filter(card => this.statusFilter === "all" || card.statusKey === this.statusFilter)
      .filter(card => !search || [
        card.name,
        card.output?.label,
        card.sourceLabel,
        card.category,
        card.craftMeta?.tool,
        ...(card.tags ?? [])
      ].filter(Boolean).join(" ").toLowerCase().includes(search))
      .sort((a, b) => {
        const order = { active: 0, ready: 1, missing: 2 };
        return (order[a.statusKey] - order[b.statusKey]) || a.name.localeCompare(b.name);
      });

    const categories = [...new Set(allCards.map(card => card.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b))
      .map(category => ({
        key: category,
        label: category,
        count: allCards.filter(card => card.category === category).length,
        selected: this.categoryFilter === category
      }));
    const statusOptions = [
      { key: "all", label: "All Recipes", count: allCards.length },
      { key: "active", label: "In Progress", count: allCards.filter(card => card.statusKey === "active").length },
      { key: "ready", label: "Ready to Craft", count: allCards.filter(card => card.statusKey === "ready").length },
      { key: "missing", label: "Missing Requirements", count: allCards.filter(card => card.statusKey === "missing").length }
    ].map(option => ({ ...option, selected: this.statusFilter === option.key }));

    return foundry.utils.mergeObject(
      context,
      {
        hasCrafter: true,
        crafter: {
          uuid: crafter.uuid,
          name: crafter.name,
          img: crafter.img
        },
        crafterActorUuid:
          this.crafterActorUuid,
        crafterActors:
          crafterActors.map(actor => ({
            uuid: actor.uuid,
            name: actor.name,
            selected:
              actor.uuid
              === this.crafterActorUuid
          })),
        canChooseCrafter:
          game.user.isGM
          || crafterActors.length > 1,
        inventoryActorUuid:
          this.inventoryActorUuid,
        inventoryActors:
          inventoryActors.map(actor => ({
            uuid: actor.uuid,
            name: actor.name,
            type: actor.type,
            selected:
              actor.uuid
              === this.inventoryActorUuid
          })),
        recipes,
        hasRecipes: recipes.length > 0,
        recipeCount: recipes.length,
        totalRecipeCount: allCards.length,
        search: this.search,
        categories,
        allCategoriesSelected: this.categoryFilter === "all",
        statusOptions,
        sessionLog: this.sessionLog,
        hasSessionLog:
          this.sessionLog.length > 0,
        hasActiveFilters: Boolean(this.search || this.categoryFilter !== "all" || this.statusFilter !== "all"),
        focusedRecipe: Boolean(this.focusRecipeId)
      },
      { inplace: false }
    );
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element
      .querySelector("[name='crafter-actor']")
      ?.addEventListener(
        "change",
        event => {
          this.crafterActorUuid =
            event.currentTarget.value || null;
          this.craftworks.crafterContext.select(
            this.crafterActorUuid
          );

          // Default ingredient inventory to the newly selected
          // crafter unless the current inventory selection is a Group.
          const currentInventory =
            this.inventoryActorUuid
              ? globalThis.fromUuidSync?.(
                  this.inventoryActorUuid
                )
              : null;

          if (
            !currentInventory
            || currentInventory.type !== "group"
          ) {
            this.inventoryActorUuid =
              this.crafterActorUuid;
          }

          this.render();
        }
      );

    this.element
      .querySelector("[name='inventory-actor']")
      ?.addEventListener(
        "change",
        event => {
          this.inventoryActorUuid =
            event.currentTarget.value || null;
          this.render();
        }
      );

    const searchInput = this.element.querySelector("[name='craft-search']");
    if (searchInput) {
      if (this.restoreSearchFocus) {
        searchInput.focus();
        searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
        this.restoreSearchFocus = false;
      }
      searchInput.addEventListener("input", event => {
        this.search = event.currentTarget.value;
        this.restoreSearchFocus = true;
        clearTimeout(this.searchRenderTimer);
        this.searchRenderTimer = setTimeout(() => this.render(), 180);
      });
    }

    this.element.querySelectorAll("[data-craft-category]").forEach(element => {
      element.addEventListener("click", event => {
        this.categoryFilter = event.currentTarget.dataset.craftCategory || "all";
        this.render();
      });
    });

    this.element.querySelectorAll("[data-craft-status]").forEach(element => {
      element.addEventListener("click", event => {
        this.statusFilter = event.currentTarget.dataset.craftStatus || "all";
        this.render();
      });
    });

    this.element.querySelector("[data-action='clear-craft-filters']")?.addEventListener("click", () => {
      this.search = "";
      this.categoryFilter = "all";
      this.statusFilter = "all";
      this.render();
    });

    this.element
      .querySelectorAll("[data-action='craft']")
      .forEach(element => {
        element.addEventListener(
          "click",
          () => this.#craft(
            element.dataset.recipeId
          )
        );
      });

    this.element
      .querySelectorAll("[data-action='choose-destination']")
      .forEach(element => {
        element.addEventListener(
          "click",
          () => this.#showCompletion(
            element.dataset.recipeId
          )
        );
      });

    this.element
      .querySelectorAll("[data-action='cancel-crafting']")
      .forEach(element => {
        element.addEventListener(
          "click",
          () => this.#cancel(
            element.dataset.recipeId
          )
        );
      });

    this.element
      .querySelectorAll("[data-action='unmark']")
      .forEach(element => {
        element.addEventListener(
          "click",
          () => this.#unmark(
            element.dataset.recipeId
          )
        );
      });

    this.element
      .querySelectorAll("[data-material-id]")
      .forEach(element => {
        element.addEventListener(
          "click",
          event => {
            event.stopPropagation();
            this.craftworks.openMaterials({
              materialId:
                event.currentTarget.dataset.materialId
            });
          }
        );
      });

    this.element
      .querySelectorAll("[data-output-document-uuid]")
      .forEach(element => {
        element.addEventListener(
          "click",
          async event => {
            const document = await fromUuid(
              event.currentTarget
                .dataset.outputDocumentUuid
            );
            document?.sheet?.render(true);
          }
        );
      });
  }

  #resolveRequirementMaterial(match, requirementItemMatches = new Map()) {
    if (!match) {
      return {
        materialId: null,
        img: null,
        label: null,
        rarity: null
      };
    }

    if (match.materialId) {
      const material =
        this.craftworks.materials.get(
          match.materialId
        );

      return {
        materialId:
          material?.materialId
          ?? match.materialId,
        img:
          material?.img
          ?? null,
        uuid:
          material?.uuid
          ?? null,
        label:
          material?.name
          ?? this.#friendlyRequirementLabel(
            match
          ),
        rarity:
          material?.rarity
          ?? match.rarity
          ?? null
      };
    }

    if (match.itemName) {
      const normalizedItemName = String(match.itemName)
        .trim()
        .toLowerCase();
      const material = this.craftworks.materials
        .all()
        .find(entry =>
          String(entry.name ?? "").trim().toLowerCase()
          === normalizedItemName
        );
      const item = requirementItemMatches.get(normalizedItemName);

      return {
        materialId: material?.materialId ?? null,
        img: material?.img ?? item?.img ?? null,
        uuid: material?.uuid ?? item?.uuid ?? null,
        label: material?.name ?? item?.name ?? String(match.itemName).trim(),
        rarity: material?.rarity ?? match.rarity ?? null
      };
    }

    const requiredTags =
      (match.tags ?? [])
        .map(tag =>
          String(tag).toLowerCase()
        );

    const matches =
      this.craftworks.materials
        .all()
        .filter(material => {
          if (
            match.rarity
            && String(
              material.rarity ?? ""
            ).toLowerCase()
              !== String(
                match.rarity
              ).toLowerCase()
          ) {
            return false;
          }

          if (
            match.category
            && String(
              material.category ?? ""
            ).toLowerCase()
              !== String(
                match.category
              ).toLowerCase()
          ) {
            return false;
          }

          if (
            match.stage
            && String(
              material.stage ?? ""
            ).toLowerCase()
              !== String(
                match.stage
              ).toLowerCase()
          ) {
            return false;
          }

          if (requiredTags.length) {
            const materialTags =
              new Set(
                (material.tags ?? [])
                  .map(tag =>
                    String(tag)
                      .toLowerCase()
                  )
              );

            if (
              !requiredTags.every(
                tag =>
                  materialTags.has(tag)
              )
            ) {
              return false;
            }
          }

          return true;
        });

    if (!matches.length) {
      return {
        materialId: null,
        img: null,
        label:
          this.#friendlyRequirementLabel(
            match
          ),
        rarity:
          match.rarity
          ?? null
      };
    }

    if (matches.length === 1) {
      return {
        materialId:
          matches[0].materialId,
        img:
          matches[0].img
          ?? null,
        label:
          matches[0].name
          ?? this.#friendlyRequirementLabel(
            match
          ),
        rarity:
          matches[0].rarity
          ?? match.rarity
          ?? null
      };
    }

    const images =
      [
        ...new Set(
          matches
            .map(material =>
              material.img
            )
            .filter(Boolean)
        )
      ];

    // Generic tag requirements can intentionally match several materials.
    // If they all share the same category art, show that art without linking
    // to an arbitrary specific material.
    return {
      materialId: null,
      img:
        images.length === 1
          ? images[0]
          : null,
      label:
        this.#friendlyRequirementLabel(
          match
        ),
      rarity:
        match.rarity
        ?? null
    };
  }

  #friendlyRequirementLabel(match) {
    if (!match) return "Material";

    if (match.itemType === "spellScroll" && match.spellName) {
      return `Spell Scroll: ${String(match.spellName).trim()}`;
    }
    if (match.itemType === "spellScroll" && match.spellLevel != null) {
      return `Level ${match.spellLevel} Spell Scroll`;
    }

    if (match.itemName) {
      return String(match.itemName).trim() || "Material";
    }

    if (match.equipmentType) {
      return `${String(match.equipmentType).trim()} equipment`;
    }

    if (match.weaponType) {
      return `${String(match.weaponType).trim()} Weapons`;
    }

    if (match.lootTypes?.length) {
      return `${match.lootTypes.join(" or ")} worth at least ${match.minValueGp ?? 0} gp`;
    }

    if (match.materialId) {
      return String(match.materialId)
        .trim()
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, character => character.toUpperCase())
        || "Material";
    }

    const tag =
      (match.tags ?? [])
        .map(String)
        .find(value =>
          value.startsWith(
            "drakkenheim-component-"
          )
        )
      ?? (match.tags ?? [])[0]
      ?? match.category
      ?? match.stage
      ?? null;

    if (!tag) {
      return "Material";
    }

    let value =
      String(tag)
        .replace(
          /^drakkenheim-component-/,
          ""
        )
        .replace(
          /^kibbles-/,
          ""
        )
        .replace(/[_-]+/g, " ")
        .trim();

    // The Drakkenheim taxonomy prefixes many specific components with their
    // broad category. For display, retain only the specific component when
    // one is present (e.g. fluid-sap -> Sap, hide-plates -> Plates).
    const categoryPrefixes = [
      "animus",
      "bones",
      "dust",
      "fluid",
      "hair",
      "hide",
      "natural weapons",
      "organs"
    ];

    const lower =
      value.toLowerCase();

    for (
      const prefix of
      categoryPrefixes
    ) {
      if (
        lower.startsWith(
          `${prefix} `
        )
      ) {
        value =
          value.slice(
            prefix.length + 1
          );
        break;
      }
    }

    return value
      .split(/\s+/)
      .filter(Boolean)
      .map(word =>
        word.charAt(0).toUpperCase()
        + word.slice(1)
      )
      .join(" ");
  }

  async #prepareRecipeCard(
    recipe,
    crafter,
    inventoryActor,
    {
      job = null,
      forceInventoryUuid = null
    } = {}
  ) {
    let effectiveInventory = inventoryActor;

    if (forceInventoryUuid) {
      effectiveInventory =
        await fromUuid(forceInventoryUuid)
        ?? inventoryActor;
    }

    const recipeUnknown =
      isRecipeHidden(recipe.id);

    const knownToCrafter = isRecipeKnownToActor(
      recipe,
      crafter,
      this.craftworks.toolInspector
    );

    const requirementsKnown =
      knownToCrafter
      || Boolean(job);

    const plannedReadiness =
      this.craftworks.recipePlanner.plan(
        recipe,
        effectiveInventory,
        { includePartyInventory: false }
      );

    const readiness =
      requirementsKnown
        ? plannedReadiness
        : {
            ready: false,
            status: "unknown",
            requirementGroups: []
          };

    const environment = this.craftworks.craftingEnvironment.evaluate(recipe);
    readiness.materialsReady = readiness.ready;
    readiness.ready = readiness.ready && environment.passed;

    const progress =
      this.craftworks.craftingJobs
        .getProgress(
          recipe.id,
          crafter,
          forceInventoryUuid
          ?? effectiveInventory?.uuid
        );

    const craft = recipe.craft ?? {};
    const toolStatus =
      this.craftworks.toolInspector?.inspect(
        crafter,
        craft.tool
      ) ?? {
        hasTool: false,
        proficient: false,
        qualifiesForNormalDc: false
      };

    const activeDc =
      toolStatus.qualifiesForNormalDc
        ? craft.dc
        : craft.noToolDc;

    let output = {
      ...recipe.output
    };
    let outputDocumentUuid = null;

    if (recipe.output?.type === "foundry-item") {
      const source = await fromUuid(
        recipe.output.uuid
      );

      if (source?.documentName === "Item") {
        output = {
          ...output,
          label: source.name,
          img: source.img
        };
        outputDocumentUuid = source.uuid;
      }
    }

    output.showQuantity = Number(output.quantity ?? 1) > 1;

    const sourcePack =
      this.craftworks.contentPacks?.get(
        recipe.packId
      );

    const requirementItemMatches = new Map();
    const requirementItemNames = new Set(
      (recipe.requirementGroups ?? [])
        .flatMap(group => group.requirements ?? [])
        .flatMap(requirement => [
          requirement.match?.itemName,
          ...(requirement.alternatives ?? [])
            .map(alternative => alternative.match?.itemName)
        ])
        .map(name => String(name ?? "").trim())
        .filter(Boolean)
    );

    for (const itemName of requirementItemNames) {
      const item = await this.craftworks.recipes.dnd5eItemResolver
        ?.resolveAny(itemName, { preferredSourceBook: sourcePack?.label });

      if (item) {
        requirementItemMatches.set(itemName.toLowerCase(), item);
      }
    }

    const requirementGroupRows =
      requirementsKnown
        ? recipe.requirementGroups.map(
        (group, groupIndex) => ({
          ...group,
          ready:
            readiness.requirementGroups
              ?.[groupIndex]?.ready
            ?? null,
          requirementRows:
            group.requirements.map(
              (requirement, requirementIndex) => {
                const inventory =
                  readiness.requirementGroups
                    ?.[groupIndex]
                    ?.requirements
                    ?.[requirementIndex]
                  ?? null;

                const materialView =
                  this.#resolveRequirementMaterial(
                    requirement.match,
                    requirementItemMatches
                  );

                return {
                  ...requirement,
                  materialId:
                    materialView.materialId,
                  materialImg:
                    materialView.img ?? requirementFallbackImg(requirement.match),
                  materialUuid:
                    materialView.uuid,
                  displayLabel:
                    materialView.label
                    ?? requirement.display
                    ?? "Material",
                  displayRarity:
                    materialView.rarity
                    ?? requirement.match?.rarity
                    ?? null,
                  inventory,
                  alternativeRows:
                    requirement.type
                    === "alternatives"
                      ? requirement.alternatives
                          .map(
                            (alternative, altIndex) => {
                              const altMaterialView =
                                this.#resolveRequirementMaterial(
                                  alternative.match,
                                  requirementItemMatches
                                );

                              return {
                                ...alternative,
                                materialId:
                                  altMaterialView.materialId,
                                materialImg:
                                  altMaterialView.img ?? requirementFallbackImg(alternative.match),
                                materialUuid:
                                  altMaterialView.uuid,
                                displayLabel:
                                  altMaterialView.label
                                  ?? alternative.display
                                  ?? "Material",
                                displayRarity:
                                  altMaterialView.rarity
                                  ?? alternative.match?.rarity
                                  ?? null,
                                inventory:
                                  inventory
                                    ?.alternatives
                                    ?.[altIndex]
                                  ?? null
                              };
                            }
                          )
                      : []
                };
              }
            )
        })
      )
        : [];

    return {
      ...recipe,
      output,
      outputDocumentUuid,
      isUnknown:
        recipeUnknown,
      requirementsKnown,
      sourceLabel:
        sourcePack?.label
        ?? recipe.packLabel
        ?? recipe.packId,
      craftMeta: {
        tool: craft.tool,
        checkRequired: craft.checkRequired !== false,
        check: craft.checkRequired === false
          ? "No check"
          : [
          craft.ability,
          craft.skill
            ? `(${craft.skill})`
            : null
        ].filter(Boolean).join(" "),
        activeDc: craft.checkRequired === false ? null : activeDc,
        hoursRequired:
          craft.hoursRequired,
        environment: environment.mode === "facility"
          ? `${environment.environment.facility.tier} ${environment.environment.facility.type}`
          : environment.mode.charAt(0).toUpperCase() + environment.mode.slice(1)
      },
      environment,
      readiness,
      requirementGroupRows,
      progress,
      inventoryActorName:
        effectiveInventory?.name
        ?? "Missing inventory actor",
      isCompletePending:
        Boolean(
          progress?.complete
          && !progress?.outputAwarded
        ),
      isActive:
        Boolean(
          job
          || (
            progress?.materialsConsumed
            && !progress?.outputAwarded
          )
        )
    };
  }

  async #craft(recipeId) {
    const crafter =
      await this.#selectedCrafter();

    if (!crafter) {
      ui.notifications.warn(
        "Select or assign a character before crafting."
      );
      return;
    }

    const recipe =
      this.craftworks.recipes.get(
        recipeId,
        { includeDisabled: true }
      );

    let inventoryActor =
      this.inventoryActorUuid
        ? await fromUuid(this.inventoryActorUuid)
        : crafter;

    if (!recipe || !inventoryActor) return;

    const environment = this.craftworks.craftingEnvironment.evaluate(recipe);
    if (!environment.passed) {
      ui.notifications.warn(environment.reasons[0] ?? "This recipe cannot be worked in the current environment.");
      await this.render();
      return;
    }

    let job =
      this.craftworks.craftingJobs.get(
        recipe.id,
        crafter,
        inventoryActor.uuid
      );

    if (
      !game.user.isGM
      && !job
      && !isRecipeKnownToActor(
        recipe,
        crafter,
        this.craftworks.toolInspector
      )
    ) {
      ui.notifications.warn(
        "The required ingredients for this recipe are still unknown."
      );
      return;
    }

    if (job?.outputAwarded) {
      await this.craftworks.craftingJobs.clear(
        recipe.id,
        crafter
      );
      job = null;
    }

    if (!job) {
      const readiness =
        this.craftworks.recipePlanner.plan(
          recipe,
          inventoryActor,
          { includePartyInventory: false }
        );

      if (!readiness.ready) {
        ui.notifications.warn(
          "The selected inventory no longer satisfies this recipe."
        );
        await this.render();
        return;
      }

      const plans =
        this.craftworks.craftingMaterials
          .planOptions(
            recipe,
            inventoryActor
          );

      if (!plans.length) {
        ui.notifications.warn(
          "Craftworks could not determine a valid material-consumption path."
        );
        return;
      }

      const plan = plans.length === 1
        ? plans[0]
        : await this.#chooseMaterialPlan(
            recipe,
            plans
          );

      if (!plan) return;

      const consumedMaterials =
        await this.craftworks.craftingMaterials
          .consume(
            inventoryActor,
            plan,
            { crafter }
          );

      job =
        await this.craftworks.craftingJobs.start({
          recipeId: recipe.id,
          crafter,
          inventoryActorUuid:
            inventoryActor.uuid,
          hoursRequired:
            recipe.craft?.hoursRequired,
          consumedMaterials,
          materialPlanSummary:
            plan.summary
        });
    } else if (job.inventoryActorUuid) {
      inventoryActor =
        await fromUuid(job.inventoryActorUuid)
        ?? inventoryActor;
    }

    if (recipe.craft?.checkRequired === false) {
      const progress =
        await this.craftworks.craftingJobs
          .completeWithoutCheck(
            recipe.id,
            crafter,
            inventoryActor.uuid
          );

      this.#log({
        recipe,
        text:
          `Crafting completed after ${recipe.craft?.hoursRequired ?? 8} hours `
          + `at the required workshop; no crafting check was required.`,
        kind: "success"
      });

      if (
        progress.complete
        && !progress.outputAwarded
      ) {
        await this.#showCompletion(
          recipe.id,
          progress
        );
      }

      await this.render();
      return;
    }

    const toolStatus =
      this.craftworks.toolInspector?.inspect(
        crafter,
        recipe.craft?.tool
      ) ?? {
        qualifiesForNormalDc: false
      };

    const dc =
      toolStatus.qualifiesForNormalDc
        ? recipe.craft?.dc
        : recipe.craft?.noToolDc;

    const result =
      await this.craftworks.craftingRolls.roll({
        recipe,
        crafter,
        dc,
        toolStatus
      });

    if (result?.cancelled) {
      this.#log({
        recipe,
        text:
          "Roll canceled; no crafting attempt was spent.",
        kind: "neutral"
      });
      await this.render();
      return;
    }

    const progress =
      await this.craftworks.craftingJobs
        .recordAttempt(
          recipe.id,
          crafter,
          inventoryActor.uuid,
          { success: result.success, progressDelta: result.naturalD20 === 20 ? 2 : result.naturalD20 === 1 ? -1 : (result.success ? 1 : 0) }
        );

    this.#log({
      recipe,
      text: result.naturalD20 === 20
        ? `Natural 20: 4 hours of progress. ${progress.successes} of ${progress.requiredSuccesses} successes.`
        : result.naturalD20 === 1
          ? `Natural 1: 2 hours of progress lost where applicable. ${progress.successes} of ${progress.requiredSuccesses} successes.`
          : result.success
            ? `Success: ${result.total} vs DC ${dc}. ${progress.successes} of ${progress.requiredSuccesses} successes.`
            : `Failure: ${result.total} vs DC ${dc}. 2 hours spent with no progress.`,
      kind:
        result.success
          ? "success"
          : "failure"
    });

    if (
      progress.complete
      && !progress.outputAwarded
    ) {
      await this.#showCompletion(
        recipe.id,
        progress
      );
    }

    await this.render();
  }

  async #showCompletion(
    recipeId,
    suppliedProgress = null
  ) {
    const crafter =
      await this.#selectedCrafter();

    const recipe =
      this.craftworks.recipes.get(
        recipeId,
        { includeDisabled: true }
      );

    if (!crafter || !recipe) return;

    const progress =
      suppliedProgress
      ?? this.craftworks.craftingJobs
        .getProgress(
          recipe.id,
          crafter
        );

    if (
      !progress?.complete
      || progress.outputAwarded
    ) {
      return;
    }

    const completion =
      new CraftCompletionApp(
        this.craftworks,
        {
          recipe,
          crafter,
          progress,
          onPlaced: async ({
            destination,
            awarded
          }) => {
            this.#log({
              recipe,
              kind: "complete",
              text:
                `Completed: ${awarded.quantity} × ${awarded.label} placed in ${destination.name}.`
            });
            await this.render();
          }
        }
      );

    await completion.render({
      force: true
    });
  }

  async #cancel(recipeId) {
    const crafter =
      await this.#selectedCrafter();

    if (!crafter) return;

    const job =
      this.craftworks.craftingJobs.get(
        recipeId,
        crafter
      );

    if (!job || job.outputAwarded) return;

    const inventoryActor =
      job.inventoryActorUuid
        ? await fromUuid(job.inventoryActorUuid)
        : null;

    if (
      inventoryActor
      && job.materialsConsumed
      && job.consumedMaterials?.length
    ) {
      await this.craftworks.craftingMaterials
        .refund(
          inventoryActor,
          job.consumedMaterials
        );
    }

    await this.craftworks.craftingJobs.clear(
      recipeId,
      crafter
    );

    const recipe =
      this.craftworks.recipes.get(
        recipeId,
        { includeDisabled: true }
      );

    if (recipe) {
      this.#log({
        recipe,
        kind: "neutral",
        text:
          inventoryActor
            ? `Canceled; consumed materials returned to ${inventoryActor.name}.`
            : "Canceled."
      });
    }

    await this.render();
  }

  async #unmark(recipeId) {
    const crafter =
      await this.#selectedCrafter();

    if (!crafter) return;

    const job =
      this.craftworks.craftingJobs.get(
        recipeId,
        crafter
      );

    if (
      job?.materialsConsumed
      && !job.outputAwarded
    ) {
      ui.notifications.warn(
        "Cancel the active crafting job before removing this recipe from the Craft list."
      );
      return;
    }

    await this.craftworks.markedRecipes.set(
      crafter,
      recipeId,
      false
    );

    await this.render();
  }

  async #chooseMaterialPlan(
    recipe,
    plans
  ) {
    const options = plans
      .map(
        (plan, index) => `
          <label class="ml-craftworks-crafting-plan-option">
            <input type="radio"
                   name="plan"
                   value="${index}"
                   ${index === 0 ? "checked" : ""}>
            <span>${foundry.utils.escapeHTML(plan.summary)}</span>
          </label>
        `
      )
      .join("");

    const formData =
      await foundry.applications.api
        .DialogV2.input({
          window: {
            title:
              `Choose Materials — ${recipe.name}`
          },
          content: `
            <p>More than one valid material path is available. Choose which materials to consume.</p>
            <div class="ml-craftworks-crafting-plan-options">
              ${options}
            </div>
          `,
          ok: {
            label: "Use Materials"
          }
        });

    if (!formData) return null;

    return plans[
      Number(formData.plan)
    ] ?? null;
  }

  #log({
    recipe,
    text,
    kind = "neutral"
  }) {
    this.sessionLog.unshift({
      id:
        `${Date.now()}-${Math.random()}`,
      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "numeric",
            minute: "2-digit"
          }
        ),
      recipeName: recipe.name,
      text,
      kind
    });
  }

  async #selectedCrafter() {
    if (!this.crafterActorUuid) {
      return null;
    }

    const actor =
      await fromUuid(this.crafterActorUuid);

    if (
      !actor
      || actor.type !== "character"
    ) {
      return null;
    }

    const allowed =
      this.craftworks.crafterContext
        .availableCharacters()
        .some(candidate =>
          candidate.uuid === actor.uuid
        );

    return allowed ? actor : null;
  }

}
