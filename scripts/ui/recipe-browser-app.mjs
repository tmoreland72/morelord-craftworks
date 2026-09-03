import { MODULE_TITLE } from "../constants.mjs";
import { materialTagsSatisfy } from "../materials/material-match-utils.mjs";
import {
  getHiddenRecipeIds,
  isRecipeKnownToActor,
  setHiddenRecipeIds
} from "../core/settings.mjs";
import { bindMultiselectBehavior } from "./multiselect-behavior.mjs";
import { buildMaterialTagGroups } from "./material-filter-groups.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

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

export class RecipeBrowserApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.search = "";
    this.selectedPackIds = [];
    this.excludedPackIds = [];
    this.selectedCategories = [];
    this.excludedCategories = [];
    this.selectedTools = [];
    this.excludedTools = [];
    this.actorUuid = null;
    this.crafterUuid = null;
    this.searchRenderTimer = null;
    this.restoreSearchFocus = false;
    this.searchExecuted = false;
    this.displayedRecipeIds = [];
    this.searchSelectionStart = null;
    this.searchSelectionEnd = null;
    this.selectedRecipeRarities = [];
    this.excludedRecipeRarities = [];
    this.selectedIngredientTags = [];
    this.excludedIngredientTags = [];
    this.knownFilterState = 0;
    this.unknownFilterState = 0;
    this.onlyCraftable = false;
    this.openFilterKey = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-recipes",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"],
    position: { width: 1280, height: 840 },
    window: {
      title: `${MODULE_TITLE} — Recipes`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/recipe-browser.hbs"
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
    const context = await super._prepareContext(options);

    const actor = null;
    const crafterActors = this.craftworks.crafterContext.availableCharacters();
    let crafter = this.#currentCrafter();

    if (!crafter && crafterActors.length === 1) {
      crafter = crafterActors[0];
    }

    this.actorUuid = null;
    this.crafterUuid = crafter?.uuid ?? this.crafterUuid ?? null;
    this.onlyCraftable = false;

    const markedRecipeIds = new Set(
      this.craftworks.markedRecipes.list(crafter)
    );

    const catalogRecipes = this.craftworks.recipes.all();
    const visibleRecipes = catalogRecipes
      .filter(recipe =>
        game.user.isGM
        || isRecipeKnownToActor(
          recipe,
          crafter,
          this.craftworks.toolInspector
        )
      );
    const visibleRecipeCountByPack = new Map();
    for (const recipe of visibleRecipes) {
      visibleRecipeCountByPack.set(
        recipe.packId,
        (visibleRecipeCountByPack.get(recipe.packId) ?? 0) + 1
      );
    }

    const catalogTools = new Set(
      catalogRecipes
        .map(recipe => String(recipe.craft?.tool ?? "").trim())
        .filter(Boolean)
    );
    const visibleToolCounts = new Map();
    for (const recipe of visibleRecipes) {
      const tool = String(recipe.craft?.tool ?? "").trim();
      if (tool) {
        visibleToolCounts.set(
          tool,
          (visibleToolCounts.get(tool) ?? 0) + 1
        );
      }
    }
    const validTools = new Set(catalogTools);
    this.selectedTools = this.selectedTools.filter(tool => validTools.has(tool));
    this.excludedTools = this.excludedTools.filter(tool => validTools.has(tool));
    const toolFilters = [...catalogTools]
      .sort((a, b) => a.localeCompare(b))
      .map(tool => ({
        id: tool,
        label: tool,
        count: visibleToolCounts.get(tool) ?? 0,
        proficient: Boolean(
          crafter
          && this.craftworks.toolInspector?.inspect(crafter, tool)?.proficient
        ),
        state: this.selectedTools.includes(tool)
          ? 1
          : this.excludedTools.includes(tool)
            ? -1
            : 0,
        included: this.selectedTools.includes(tool),
        excluded: this.excludedTools.includes(tool)
      }));

    const effectiveRecipePacks = this.craftworks.recipes
      .packs({ includeDisabled: false })
      .map(pack => ({
        ...pack,
        recipeCount: visibleRecipeCountByPack.get(pack.id) ?? 0
      }));

    const validPackIds = new Set(
      effectiveRecipePacks.map(pack => pack.id)
    );

    this.selectedPackIds = this.selectedPackIds
      .filter(packId => validPackIds.has(packId));
    this.excludedPackIds = this.excludedPackIds
      .filter(packId => validPackIds.has(packId));

    const rarityFilters =
      this.#buildRarityFilters(visibleRecipes);

    const rawIngredientTags =
      this.#ingredientTags(visibleRecipes);
    const ingredientTagGroups = buildMaterialTagGroups(rawIngredientTags, {
      included: this.selectedIngredientTags,
      excluded: this.excludedIngredientTags
    });
    const ingredientTags = ingredientTagGroups
      .flatMap(group => group.options.map(option => option.id));

    const raritySet =
      new Set(
        rarityFilters.map(
          rarity => rarity.id
        )
      );

    this.selectedRecipeRarities =
      this.selectedRecipeRarities.filter(
        rarity =>
          raritySet.has(rarity)
      );

    this.excludedRecipeRarities =
      this.excludedRecipeRarities.filter(
        rarity =>
          raritySet.has(rarity)
      );

    const tagSet = new Set(ingredientTags);
    this.selectedIngredientTags =
      this.selectedIngredientTags.filter(tag =>
        tagSet.has(tag)
      );
    this.excludedIngredientTags =
      this.excludedIngredientTags.filter(tag =>
        tagSet.has(tag)
      );

    const matchingRecipes = this.#matchingRecipes(crafter);

    const hiddenRecipeIds = getHiddenRecipeIds();
    const facilityOptions = this.craftworks.craftingEnvironment.facilityOptions();
    const facilityTypeOptions = Object.fromEntries([
      ["", "No facility requirement"],
      ...facilityOptions.types.map(type => [type.id, type.name])
    ]);
    const facilityTierOptions = Object.fromEntries(
      facilityOptions.tiers.map(tier => [tier, this.#formatFacilityTier(tier)])
    );

    const totalRecipeCount =
      visibleRecipes.length;
    const prospectiveCount = matchingRecipes.length;
    const prospectiveCountLabel = String(prospectiveCount);
    const hasSearchCriteria = Boolean(
      this.search.trim()
      || this.selectedPackIds.length
      || this.excludedPackIds.length
      || this.selectedCategories.length
      || this.excludedCategories.length
      || this.selectedTools.length
      || this.excludedTools.length
      || this.selectedRecipeRarities.length
      || this.excludedRecipeRarities.length
      || this.selectedIngredientTags.length
      || this.excludedIngredientTags.length
      || this.knownFilterState !== 0
      || this.unknownFilterState !== 0
    );

    const displayLimit = 300;
    const autoShowResults = true;
    const recipes = [...matchingRecipes]
      .sort((a, b) =>
        String(a.category ?? "").localeCompare(String(b.category ?? ""))
        || a.name.localeCompare(b.name)
      )
      .slice(0, displayLimit);

    const preparedRecipes = await Promise.all(recipes.map(async recipe => {
      const readiness = this.craftworks.recipePlanner.plan(
        recipe,
        actor,
        { includePartyInventory: false }
      );
      const craft = recipe.craft ?? {};
      const checkParts = [
        craft.ability,
        craft.skill ? `(${craft.skill})` : null
      ].filter(Boolean);

      const toolStatus = {
        ...(this.craftworks.toolInspector?.inspect(
          crafter,
          craft.tool
        ) ?? {
          hasTool: null,
          proficient: null,
          qualifiesForNormalDc: null
        })
      };

      const knownToCrafter = isRecipeKnownToActor(
        recipe,
        crafter,
        this.craftworks.toolInspector
      );

      const activeDc = craft.dc;

      let resolvedOutput = recipe.output;
      let outputDocument = null;
      let outputResolutionWarning = null;

      if (recipe.output?.type === "foundry-item") {
        try {
          outputDocument = await fromUuid(recipe.output.uuid);
        } catch (error) {
          console.warn(
            `Morelord Craftworks | Unable to resolve recipe output ${recipe.output.uuid}`,
            error
          );
        }

        if (outputDocument?.documentName === "Item") {
          resolvedOutput = {
            ...recipe.output,
            label: outputDocument.name,
            img: outputDocument.img ?? recipe.output.fallbackImg ?? "",
            documentUuid: outputDocument.uuid,
            sourceBook: recipe.output.sourceBook ?? null,
            sourcePackId: recipe.output.sourcePackId ?? null
          };
        } else {
          resolvedOutput = {
            ...recipe.output,
            label: recipe.output.fallbackLabel ?? "Missing Foundry Item",
            img: recipe.output.fallbackImg ?? "",
            documentUuid: null
          };
          outputResolutionWarning =
            `The Foundry Item referenced by this recipe could not be found: ${recipe.output.uuid}`;
        }
      }

      resolvedOutput = {
        ...resolvedOutput,
        showQuantity: Number(resolvedOutput?.quantity ?? 1) > 1
      };

      const sourcePack = this.craftworks.contentPacks?.get(recipe.packId);
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

      return {
        ...recipe,
        output: resolvedOutput,
        outputDocumentUuid: outputDocument?.uuid ?? null,
        outputResolutionWarning,
        showPremiumBadge: Boolean(sourcePack?.premium),
        sourceBadgeLabel: sourcePack?.premium ? "Premium" : null,
        sourceLabel: sourcePack?.label ?? recipe.packLabel ?? recipe.packId,
        canMark: Boolean(crafter),
        isMarked: markedRecipeIds.has(recipe.id),
        markActionLabel:
          markedRecipeIds.has(recipe.id)
            ? "Marked"
            : "Mark for Crafting",
        isUnknown:
          hiddenRecipeIds.has(recipe.id),
        requirementsKnown:
          knownToCrafter,
        knowledgeAction:
          hiddenRecipeIds.has(recipe.id)
            ? "known"
            : "unknown",
        knowledgeLabel:
          hiddenRecipeIds.has(recipe.id)
            ? "Unknown"
            : "Known",
        outputTypeLabel: recipe.output?.type === "foundry-item"
          ? "Foundry Item"
          : recipe.output?.type === "catalog-item"
            ? "Crafted Item"
            : "Craftworks Material",
        craftMeta: {
          tool: craft.tool ?? null,
          check: checkParts.join(" ") || null,
          dc: craft.dc ?? null,
          noToolDc: craft.noToolDc ?? null,
          activeDc: activeDc ?? null,
          hoursRequired: craft.hoursRequired ?? null,
          requiredSuccesses: craft.requiredSuccesses ?? 0,
          facilityType: craft.environment?.facility?.type ?? "",
          facilityTier: craft.environment?.facility?.tier ?? "common",
          toolStatus: {
            hasActor: Boolean(actor),
            hasTool: toolStatus.hasTool,
            proficient: toolStatus.proficient,
            qualifiesForNormalDc: toolStatus.qualifiesForNormalDc,
            matchedItemName: toolStatus.matchedItemName ?? null,
            warningText: actor && !toolStatus.qualifiesForNormalDc
              ? "DC is higher without the recommended tool or proficiency."
              : null
          }
        },
        readiness: {
          ...readiness,
          canProcess: readiness.status === "processing"
        },
        outputMaterialId:
          recipe.output?.type === "craftworks-material"
            ? recipe.output.materialId
            : null,
        requirementGroupRows:
          knownToCrafter
            ? recipe.requirementGroups.map((group, groupIndex) => ({
          ...group,
          ready: readiness.requirementGroups?.[groupIndex]?.ready ?? null,
          requirementRows: group.requirements.map((requirement, requirementIndex) => {
            const inventory =
              readiness.requirementGroups?.[groupIndex]?.requirements?.[requirementIndex]
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
              tooltip: requirement.display,
              displayLabel:
                materialView.label
                ?? requirement.display,
              displayRarity:
                materialView.rarity
                ?? requirement.match?.rarity
                ?? null,
              inventory,
              alternativeRows: requirement.type === "alternatives"
                ? requirement.alternatives.map((alternative, altIndex) => {
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
                      tooltip: alternative.display,
                      displayLabel:
                        altMaterialView.label
                        ?? alternative.display,
                      displayRarity:
                        altMaterialView.rarity
                        ?? alternative.match?.rarity
                        ?? null,
                      inventory: inventory?.alternatives?.[altIndex] ?? null
                    };
                  })
                : []
            };
          })
        }))
            : []
      };
    }));

    const recipeGroups = Array.from(
      preparedRecipes.reduce((groups, recipe) => {
        const key = recipe.category || "general";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(recipe);
        return groups;
      }, new Map())
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, categoryRecipes]) => ({
        id: category,
        label: category
          .split("-")
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        recipes: categoryRecipes.sort((a, b) => a.name.localeCompare(b.name))
      }));
    this.markAllRecipeIds = preparedRecipes.map(recipe => recipe.id);

    return foundry.utils.mergeObject(context, {
      search: this.search,
      crafterName: crafter?.name ?? null,
      canMarkRecipes: Boolean(crafter),
      selectedPackIds: this.selectedPackIds,
      selectedCategories: this.selectedCategories,
      selectedRecipeRarities: this.selectedRecipeRarities,
      selectedIngredientTags: this.selectedIngredientTags,
      onlyCraftable: this.onlyCraftable,
      canFilterCraftable: Boolean(actor),

      packFilterLabel: this.selectedPackIds.length
        ? `${this.selectedPackIds.length} selected`
        : "All Content Packs",
      categoryFilterLabel: this.selectedCategories.length
        ? `${this.selectedCategories.length} selected`
        : "All Categories",
      rarityFilterLabel: this.selectedRecipeRarities.length
        ? `${this.selectedRecipeRarities.length} selected`
        : "All Rarities",
      tagFilterLabel: this.selectedIngredientTags.length
        ? `${this.selectedIngredientTags.length} selected`
        : "All Ingredient Tags",

      packFilterOpen: this.openFilterKey === "recipe-pack",
      categoryFilterOpen: this.openFilterKey === "recipe-category",
      rarityFilterOpen: this.openFilterKey === "ingredient-rarity",
      tagFilterOpen: this.openFilterKey === "ingredient-tag",

      // Keep both context names during the 0.2.x UI migration. Foundry can
      // retain an imported ApplicationV2 module in the browser module cache
      // while loading a newer Handlebars template from disk. Exposing both
      // names prevents the Rarity section from becoming empty in that mixed
      // runtime state.
      rarityFilters: rarityFilters.map(
        rarity => ({
          ...rarity,
          state:
            this.selectedRecipeRarities
              .includes(rarity.id)
              ? 1
              : this.excludedRecipeRarities
                  .includes(rarity.id)
                ? -1
                : 0,
          included:
            this.selectedRecipeRarities
              .includes(rarity.id),
          excluded:
            this.excludedRecipeRarities
              .includes(rarity.id)
        })
      ),
      ingredientRarities: rarityFilters.map(
        rarity => ({
          ...rarity,
          state:
            this.selectedRecipeRarities
              .includes(rarity.id)
              ? 1
              : this.excludedRecipeRarities
                  .includes(rarity.id)
                ? -1
                : 0,
          included:
            this.selectedRecipeRarities
              .includes(rarity.id),
          excluded:
            this.excludedRecipeRarities
              .includes(rarity.id)
        })
      ),

      ingredientTagGroups,

      categories: Array.from(
        new Set(
          visibleRecipes
            .map(recipe => recipe.category)
            .filter(Boolean)
        )
      )
        .sort()
        .map(category => ({
          id: category,
          label: category
            .split("-")
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" "),
          state:
            this.selectedCategories.includes(category)
              ? 1
              : this.excludedCategories.includes(category)
                ? -1
                : 0,
          included:
            this.selectedCategories.includes(category),
          excluded:
            this.excludedCategories.includes(category)
        })),

      toolFilters,

      knowledgeFilters: [
        {
          id: "known",
          label: "Known",
          state:
            this.knownFilterState,
          included:
            this.knownFilterState === 1,
          excluded:
            this.knownFilterState === -1
        },
        {
          id: "unknown",
          label: "Unknown",
          state:
            this.unknownFilterState,
          included:
            this.unknownFilterState === 1,
          excluded:
            this.unknownFilterState === -1
        }
      ],
      packs: effectiveRecipePacks.map(pack => ({
        ...pack,
        state:
          this.selectedPackIds.includes(pack.id)
            ? 1
            : this.excludedPackIds.includes(pack.id)
              ? -1
              : 0,
        included:
          this.selectedPackIds.includes(pack.id),
        excluded:
          this.excludedPackIds.includes(pack.id)
      })),
      hasEnabledRecipes: visibleRecipes.length > 0,
      totalRecipeCount,
      prospectiveCount,
      prospectiveCountLabel,
      hasSearchCriteria,
      searchExecuted:
        autoShowResults,
      autoShowResults,
      overDisplayLimit:
        prospectiveCount > displayLimit,
      displayLimit,
      recipeGroups,
      hasRecipes: preparedRecipes.length > 0,
      crafterActors: crafterActors.map(candidate => ({
        uuid: candidate.uuid,
        name: candidate.name,
        selected: candidate.uuid === crafter?.uuid
      })),
      canManageRecipeVisibility: game.user.isGM,
      canManageRecipeFacilities: game.user.isGM,
      facilityTypeOptions,
      facilityTierOptions,
      unknownRecipeCount: hiddenRecipeIds.size
    }, { inplace: false });
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

            if (!materialTagsSatisfy(requiredTags, materialTags)) {
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

    if (match.equipmentType) {
      return `${String(match.equipmentType).trim()} equipment`;
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

  async _onRender(context, options) {
    await super._onRender(context, options);

    bindMultiselectBehavior(this);

    const searchInput = this.element.querySelector("[name='search']");

    if (searchInput) {
      if (this.restoreSearchFocus) {
        searchInput.focus();
        searchInput.setSelectionRange(
          searchInput.value.length,
          searchInput.value.length
        );
        this.restoreSearchFocus = false;
      }

      searchInput.addEventListener("input", event => {
        this.search =
          event.currentTarget.value
          ?? "";
        this.restoreSearchFocus = true;
        clearTimeout(this.searchRenderTimer);
        this.searchRenderTimer = setTimeout(
          () => this.render(),
          180
        );
      });

    }

    this.element.querySelector("[name='actor']")
      ?.addEventListener("change", event => {
        this.actorUuid = event.currentTarget.value || null;
        this.openFilterKey = null;

        this.render();
      });

    this.element.querySelector("[name='crafter']")
      ?.addEventListener("change", event => {
        this.crafterUuid = event.currentTarget.value || null;
        this.craftworks.crafterContext.select(this.crafterUuid);
        this.openFilterKey = null;
        this.render();
      });

    this.element
      .querySelectorAll("[data-tristate-filter]")
      .forEach(button => {
        button.addEventListener(
          "click",
          event => {
            event.preventDefault();

            this.#cycleTriState(
              event.currentTarget
                .dataset.filterGroup,
              event.currentTarget
                .dataset.filterValue
            );

            this.displayedRecipeIds =
              this.#matchingRecipes(
                this.#currentInventoryActor()
              ).map(recipe => recipe.id);

            this.searchExecuted = true;
            this.openFilterKey = null;
            this.render();
          }
        );
      });

    this.element
      .querySelector(
        "[data-action='clear-recipe-filters']"
      )
      ?.addEventListener(
        "click",
        event => {
          event.preventDefault();
          this.#clearTriStateFilters();
          this.search = "";
          this.displayedRecipeIds = [];
          this.searchExecuted = false;
          this.render();
        }
      );

    this.element.querySelector("[name='only-craftable']")
      ?.addEventListener("change", event => {
        const requested = Boolean(event.currentTarget.checked);

        if (requested && !this.actorUuid) {
          event.currentTarget.checked = false;
          this.onlyCraftable = false;
          ui.notifications.warn(
            "Select Using Actor Inventory before filtering for craftable recipes."
          );
          return;
        }

        this.onlyCraftable = requested;
        this.openFilterKey = null;
        this.render();
      });

    this.element.querySelectorAll("[data-context-help]")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          const kind = event.currentTarget.dataset.contextHelp;

          const content = kind === "inventory"
            ? `
              <p><strong>Using Actor Inventory</strong> determines where Craftworks looks for recipe ingredients.</p>
              <p>Select a character or group actor whose inventory contains the materials that will be consumed when crafting begins.</p>
            `
            : `
              <p><strong>Using Crafter Actor</strong> determines who performs the crafting check.</p>
              <p>Craftworks uses this character's ability modifier, recommended tool possession/proficiency, crafting progress, and check result. Materials can come from a different inventory actor.</p>
            `;

          await foundry.applications.api.DialogV2.prompt({
            window: {
              title: kind === "inventory"
                ? "Using Actor Inventory"
                : "Using Crafter Actor"
            },
            content,
            ok: {
              label: "Close"
            }
          });
        });
      });

    this.element.querySelector("[data-action='mark-all-recipes-unknown']")
      ?.addEventListener("click", async event => {
        event.preventDefault();

        if (!game.user.isGM) return;

        this.openFilterKey = null;

        const hidden =
          getHiddenRecipeIds();

        const contextRecipes =
          this.#matchingRecipes(
            this.#currentInventoryActor()
          );

        for (const recipe of contextRecipes) {
          hidden.add(recipe.id);
        }

        await setHiddenRecipeIds(hidden);

        ui.notifications.info(
          `${contextRecipes.length} recipe(s) in the current context are now Unknown.`
        );

        await this.render();
      });

    this.element.querySelector("[data-action='mark-all-recipes-known']")
      ?.addEventListener("click", async event => {
        event.preventDefault();

        if (!game.user.isGM) return;

        this.openFilterKey = null;

        const hidden =
          getHiddenRecipeIds();

        const contextRecipes =
          this.#matchingRecipes(
            this.#currentInventoryActor()
          );

        for (const recipe of contextRecipes) {
          hidden.delete(recipe.id);
        }

        await setHiddenRecipeIds(hidden);

        ui.notifications.info(
          `${contextRecipes.length} recipe(s) in the current context are now Known.`
        );

        await this.render();
      });

    this.element.querySelectorAll("[data-action='toggle-recipe-knowledge']")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          if (!game.user.isGM) return;

          const recipeId =
            event.currentTarget.dataset.recipeId;

          if (!recipeId) return;

          const hidden = getHiddenRecipeIds();

          if (hidden.has(recipeId)) {
            hidden.delete(recipeId);
          } else {
            hidden.add(recipeId);
          }

          this.openFilterKey = null;
          await setHiddenRecipeIds(hidden);

          ui.notifications.info(
            hidden.has(recipeId)
              ? "Recipe marked Unknown for players."
              : "Recipe marked Known for players."
          );

          await this.render();
        });
      });

    this.element.querySelectorAll("[data-action='toggle-mark-recipe']")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          const crafter = this.#currentCrafter();

          if (!crafter) {
            ui.notifications.warn(
              "Select a character token, assign a User Character, or ensure you own only one character before marking recipes."
            );
            return;
          }

          const recipeId =
            event.currentTarget.dataset.recipeId;

          const marked =
            await this.craftworks.markedRecipes.toggle(
              crafter,
              recipeId
            );

          ui.notifications.info(
            marked
              ? `Recipe marked for crafting by ${crafter.name}.`
              : `Recipe removed from ${crafter.name}'s Craft list.`
          );

          await this.render();
        });
      });

    this.element.querySelectorAll("[data-recipe-facility-type], [data-recipe-facility-tier]")
      .forEach(select => {
        select.addEventListener("change", async event => {
          const controls = event.currentTarget.closest("[data-recipe-facility-controls]");
          const recipeId = controls?.dataset.recipeId;
          if (!recipeId || !game.user.isGM) return;
          const type = controls.querySelector("[data-recipe-facility-type]")?.value ?? "";
          const tier = controls.querySelector("[data-recipe-facility-tier]")?.value ?? "common";
          await this.craftworks.recipes.setFacilityRequirement(
            recipeId,
            type ? { type, tier } : null
          );
          ui.notifications.info(type
            ? `Facility requirement set to ${this.#formatFacilityTier(tier)} ${type}.`
            : "Facility requirement removed.");
          this.render({ force: true });
        });
      });

    this.element.querySelector("[data-action='mark-all-for-crafting']")?.addEventListener("click", async event => {
      event.preventDefault();
      const crafter = this.#currentCrafter();
      if (!crafter) return ui.notifications.warn("Select a character before marking recipes.");
      await this.craftworks.markedRecipes.addAll(crafter, this.markAllRecipeIds ?? []);
      ui.notifications.info(`Marked ${this.markAllRecipeIds?.length ?? 0} recipes for crafting by ${crafter.name}.`);
      await this.render();
    });

    this.element.querySelectorAll(".ml-craftworks-material-icon-link[data-document-uuid]")
      .forEach(button => button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();

        const uuid = event.currentTarget.dataset.documentUuid;
        if (!uuid) return;

        const item = await fromUuid(uuid);
        item?.sheet?.render(true);
      }));

    this.element.querySelectorAll("[data-material-id]")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          const materialId = event.currentTarget.dataset.materialId;
          if (!materialId) return;

          await this.craftworks.openMaterials({ materialId });
        });
      });

    this.element.querySelectorAll("[data-output-document-uuid]")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          const uuid = event.currentTarget.dataset.outputDocumentUuid;
          if (!uuid) return;

          const document = await fromUuid(uuid);
          document?.sheet?.render(true);
        });
      });


    this.element.querySelectorAll("[data-action='craft-in-process']")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          this.crafterUuid =
            event.currentTarget.dataset.crafterUuid
            || this.crafterUuid;

          this.actorUuid =
            event.currentTarget.dataset.inventoryActorUuid
            || this.actorUuid;

          await this.#rollCraftingCheck(
            event.currentTarget.dataset.recipeId
          );
        });
      });

    this.element.querySelectorAll("[data-action='craft-check']")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();
          await this.#rollCraftingCheck(event.currentTarget.dataset.recipeId);
        });
      });

    this.element.querySelectorAll("[data-action='cancel-crafting']")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();
          await this.#cancelCrafting(event.currentTarget.dataset.recipeId);
        });
      });

    this.element.querySelectorAll("[data-action='craft-again']")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();
          await this.#craftAgain(event.currentTarget.dataset.recipeId);
        });
      });
  }

  #currentInventoryActor() {
    if (!this.actorUuid) return null;

    return game.actors.find(
      actor => actor.uuid === this.actorUuid
    ) ?? null;
  }

  #formatFacilityTier(tier) {
    return String(tier ?? "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, character => character.toUpperCase());
  }

  #ingredientMaterialsForRecipe(recipe) {
    if (
      !game.user.isGM
      && !isRecipeKnownToActor(
        recipe,
        this.#currentCrafter(),
        this.craftworks.toolInspector
      )
    ) {
      return [];
    }

    const materialIds = new Set();
    const addMatches = match => {
      if (!match) return;

      if (match.materialId) {
        materialIds.add(match.materialId);
        return;
      }

      const itemName = String(match.itemName ?? "").trim().toLowerCase();
      const requiredTags = (match.tags ?? [])
        .map(tag => String(tag).toLowerCase());

      for (const material of this.craftworks.materials.all()) {
        if (
          itemName
          && String(material.name ?? "").trim().toLowerCase() !== itemName
        ) continue;
        if (
          match.rarity
          && String(material.rarity ?? "").toLowerCase()
            !== String(match.rarity).toLowerCase()
        ) continue;
        if (
          match.category
          && String(material.category ?? "").toLowerCase()
            !== String(match.category).toLowerCase()
        ) continue;
        if (
          match.stage
          && String(material.stage ?? "").toLowerCase()
            !== String(match.stage).toLowerCase()
        ) continue;

        const materialTags = new Set(
          (material.tags ?? []).map(tag => String(tag).toLowerCase())
        );
        if (!materialTagsSatisfy(requiredTags, materialTags)) continue;

        if (itemName || requiredTags.length || match.rarity || match.category || match.stage) {
          materialIds.add(material.materialId);
        }
      }
    };

    for (const group of recipe.requirementGroups ?? []) {
      for (const requirement of group.requirements ?? []) {
        addMatches(requirement.match);

        for (const alternative of requirement.alternatives ?? []) {
          addMatches(alternative.match);
        }
      }
    }

    return Array.from(materialIds)
      .map(materialId =>
        this.craftworks.materials.get(materialId)
      )
      .filter(Boolean);
  }

  #buildRarityFilters(recipes = this.craftworks.recipes.all()) {
    const standardRarities = [
      {
        id: "common",
        label: "Common"
      },
      {
        id: "uncommon",
        label: "Uncommon"
      },
      {
        id: "rare",
        label: "Rare"
      },
      {
        id: "very rare",
        label: "Very Rare"
      },
      {
        id: "legendary",
        label: "Legendary"
      },
      {
        id: "artifact",
        label: "Artifact"
      }
    ];

    const counts =
      new Map(
        standardRarities.map(
          rarity => [
            rarity.id,
            0
          ]
        )
      );

    for (
      const recipe of
      recipes
    ) {
      const rarity =
        this.#recipeRarity(recipe);

      if (!rarity) continue;

      counts.set(
        rarity,
        (counts.get(rarity) ?? 0)
        + 1
      );
    }

    const rows =
      standardRarities.map(
        rarity => ({
          ...rarity,
          count:
            counts.get(rarity.id)
            ?? 0
        })
      );

    // Preserve any non-standard public rarities supplied by a content pack.
    for (
      const [id, count] of
      counts.entries()
    ) {
      if (
        standardRarities.some(
          rarity =>
            rarity.id === id
        )
      ) {
        continue;
      }

      rows.push({
        id,
        label:
          id
            .split(" ")
            .map(part =>
              part.charAt(0)
              .toUpperCase()
              + part.slice(1)
            )
            .join(" "),
        count
      });
    }

    return rows;
  }

  #recipeRarity(recipe) {
    const direct =
      recipe?.rarity
      ?? recipe?.output?.rarity
      ?? null;

    const normalizedDirect =
      this.#normalizeRarity(
        direct
      );

    if (normalizedDirect) {
      return normalizedDirect;
    }

    // Recipe tags are public metadata and Drakkenheim recipes already carry
    // their rarity there. This fallback keeps player filtering independent of
    // hidden ingredient requirements.
    for (
      const tag of
      recipe?.tags ?? []
    ) {
      const normalizedTag =
        this.#normalizeRarity(
          tag
        );

      if (normalizedTag) {
        return normalizedTag;
      }
    }

    return null;
  }

  #normalizeRarity(value) {
    const raw =
      String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

    const aliases = new Map([
      ["common", "common"],
      ["uncommon", "uncommon"],
      ["rare", "rare"],
      ["very rare", "very rare"],
      ["veryrare", "very rare"],
      ["legendary", "legendary"],
      ["artifact", "artifact"],
      ["varies", "varies"],
      ["variable", "varies"]
    ]);

    return aliases.get(raw)
      ?? null;
  }

  #recipeRaritiesForFilter(recipe) {
    const rarity =
      this.#recipeRarity(recipe);

    return rarity
      ? [rarity]
      : [];
  }

  #ingredientTags(recipes = this.craftworks.recipes.all()) {
    return Array.from(
      new Set(
        recipes
          .flatMap(recipe =>
            this.#ingredientMaterialsForRecipe(recipe)
              .flatMap(material => material.tags ?? [])
              .map(tag => String(tag).toLowerCase())
          )
          .filter(Boolean)
      )
    ).sort();
  }

  #cycleTriState(group, value) {
    const definitions = {
      pack: [
        "selectedPackIds",
        "excludedPackIds"
      ],
      category: [
        "selectedCategories",
        "excludedCategories"
      ],
      tool: [
        "selectedTools",
        "excludedTools"
      ],
      rarity: [
        "selectedRecipeRarities",
        "excludedRecipeRarities"
      ],
      tag: [
        "selectedIngredientTags",
        "excludedIngredientTags"
      ]
    };

    if (group === "knowledge") {
      const key =
        value === "known"
          ? "knownFilterState"
          : value === "unknown"
            ? "unknownFilterState"
            : null;

      if (!key) return;

      this[key] =
        this[key] === 0
          ? 1
          : this[key] === 1
            ? -1
            : 0;

      return;
    }

    const keys =
      definitions[group];

    if (!keys || !value) return;

    const [includedKey, excludedKey] =
      keys;

    const included =
      new Set(this[includedKey]);
    const excluded =
      new Set(this[excludedKey]);

    if (included.has(value)) {
      included.delete(value);
      excluded.add(value);
    } else if (excluded.has(value)) {
      excluded.delete(value);
    } else {
      included.add(value);
    }

    this[includedKey] = [...included];
    this[excludedKey] = [...excluded];
  }

  #clearTriStateFilters() {
    this.selectedPackIds = [];
    this.excludedPackIds = [];
    this.selectedCategories = [];
    this.excludedCategories = [];
    this.selectedTools = [];
    this.excludedTools = [];
    this.selectedRecipeRarities = [];
    this.excludedRecipeRarities = [];
    this.selectedIngredientTags = [];
    this.excludedIngredientTags = [];
    this.knownFilterState = 0;
    this.unknownFilterState = 0;
  }

  #matchingRecipes(actor = this.#currentCrafter()) {
    let recipes =
      this.craftworks.recipes.search(
        this.search
      );

    if (!game.user.isGM) {
      recipes = recipes.filter(recipe =>
        isRecipeKnownToActor(
          recipe,
          actor,
          this.craftworks.toolInspector
        )
      );
    }

    if (this.selectedPackIds.length) {
      const selected = new Set(this.selectedPackIds);
      recipes = recipes.filter(recipe =>
        selected.has(recipe.packId)
      );
    }

    if (this.excludedPackIds.length) {
      const excluded = new Set(this.excludedPackIds);
      recipes = recipes.filter(recipe =>
        !excluded.has(recipe.packId)
      );
    }

    if (this.selectedCategories.length) {
      const selected = new Set(this.selectedCategories);
      recipes = recipes.filter(recipe =>
        selected.has(recipe.category)
      );
    }

    if (this.excludedCategories.length) {
      const excluded = new Set(
        this.excludedCategories
      );

      recipes = recipes.filter(recipe =>
        !excluded.has(recipe.category)
      );
    }

    if (this.selectedTools.length) {
      const selected = new Set(this.selectedTools);
      recipes = recipes.filter(recipe =>
        selected.has(String(recipe.craft?.tool ?? "").trim())
      );
    }

    if (this.excludedTools.length) {
      const excluded = new Set(this.excludedTools);
      recipes = recipes.filter(recipe =>
        !excluded.has(String(recipe.craft?.tool ?? "").trim())
      );
    }

    if (this.selectedRecipeRarities.length) {
      const selected = new Set(
        this.selectedRecipeRarities
      );

      recipes = recipes.filter(recipe =>
        this.#recipeRaritiesForFilter(recipe)
          .some(rarity => selected.has(rarity))
      );
    }

    if (this.excludedRecipeRarities.length) {
      const excluded = new Set(
        this.excludedRecipeRarities
      );

      recipes = recipes.filter(recipe =>
        !this.#recipeRaritiesForFilter(recipe)
          .some(rarity =>
            excluded.has(rarity)
          )
      );
    }

    if (this.selectedIngredientTags.length) {
      recipes = recipes.filter(recipe =>
        this.#recipeHasDistinctIngredientTags(
          recipe,
          this.selectedIngredientTags
        )
      );
    }

    if (this.excludedIngredientTags.length) {
      const excluded = new Set(
        this.excludedIngredientTags
      );

      recipes = recipes.filter(recipe =>
        !this.#ingredientMaterialsForRecipe(recipe)
          .some(material =>
            (material.tags ?? []).some(tag =>
              excluded.has(
                String(tag).toLowerCase()
              )
            )
          )
      );
    }

    const unknown =
      getHiddenRecipeIds();

    const isEffectivelyKnown = recipe => game.user.isGM
      ? !unknown.has(recipe.id)
      : isRecipeKnownToActor(
          recipe,
          actor,
          this.craftworks.toolInspector
        );

    if (
      this.knownFilterState === 1
      || this.unknownFilterState === -1
    ) {
      recipes = recipes.filter(recipe =>
        isEffectivelyKnown(recipe)
      );
    }

    if (
      this.unknownFilterState === 1
      || this.knownFilterState === -1
    ) {
      recipes = recipes.filter(recipe =>
        !isEffectivelyKnown(recipe)
      );
    }

    if (this.onlyCraftable) {
      recipes = actor
        ? recipes.filter(recipe =>
            this.craftworks.recipePlanner.plan(
              recipe,
              actor,
              { includePartyInventory: false }
            ).ready
          )
        : [];
    }

    return recipes;
  }

  #recipeHasDistinctIngredientTags(recipe, selectedTags) {
    const selected = [...new Set(
      selectedTags.map(tag => String(tag).toLowerCase())
    )];
    const slots = [];

    for (const group of recipe.requirementGroups ?? []) {
      for (const requirement of group.requirements ?? []) {
        const matches = requirement.type === "alternatives"
          ? (requirement.alternatives ?? []).map(alternative => alternative.match)
          : [requirement.match];
        const slotTags = new Set();

        for (const match of matches.filter(Boolean)) {
          for (const material of this.#materialsMatchingIngredient(match)) {
            for (const tag of material.tags ?? []) {
              slotTags.add(String(tag).toLowerCase());
            }
          }
        }

        if (slotTags.size) slots.push(slotTags);
      }
    }

    const assign = (tagIndex, usedSlots) => {
      if (tagIndex >= selected.length) return true;

      for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
        if (usedSlots.has(slotIndex) || !slots[slotIndex].has(selected[tagIndex])) {
          continue;
        }

        usedSlots.add(slotIndex);
        if (assign(tagIndex + 1, usedSlots)) return true;
        usedSlots.delete(slotIndex);
      }

      return false;
    };

    return assign(0, new Set());
  }

  #materialsMatchingIngredient(match) {
    if (!match) return [];

    if (match.materialId) {
      const material = this.craftworks.materials.get(match.materialId);
      return material ? [material] : [];
    }

    const itemName = String(match.itemName ?? "").trim().toLowerCase();
    const requiredTags = (match.tags ?? [])
      .map(tag => String(tag).toLowerCase());

    return this.craftworks.materials.all().filter(material => {
      if (
        itemName
        && String(material.name ?? "").trim().toLowerCase() !== itemName
      ) return false;
      if (
        match.rarity
        && String(material.rarity ?? "").toLowerCase()
          !== String(match.rarity).toLowerCase()
      ) return false;
      if (
        match.category
        && String(material.category ?? "").toLowerCase()
          !== String(match.category).toLowerCase()
      ) return false;
      if (
        match.stage
        && String(material.stage ?? "").toLowerCase()
          !== String(match.stage).toLowerCase()
      ) return false;

      const materialTags = new Set(
        (material.tags ?? []).map(tag => String(tag).toLowerCase())
      );

      return materialTagsSatisfy(requiredTags, materialTags);
    });
  }

  #updateLiveQueryState() {
    const recipes = this.#matchingRecipes();

    const hasCriteria = Boolean(
      this.search.trim()
      || this.selectedPackIds.length
      || this.excludedPackIds.length
      || this.selectedCategories.length
      || this.excludedCategories.length
      || this.selectedTools.length
      || this.excludedTools.length
      || this.selectedRecipeRarities.length
      || this.excludedRecipeRarities.length
      || this.selectedIngredientTags.length
      || this.excludedIngredientTags.length
      || this.knownFilterState !== 0
      || this.unknownFilterState !== 0
      || this.onlyCraftable
    );

    const countLabel = recipes.length > 500
      ? "500+"
      : String(recipes.length);

    const summary = this.element.querySelector(
      "[data-query-result-summary]"
    );

    if (summary) {
      summary.innerHTML = hasCriteria
        ? `Search will return <strong>${countLabel}</strong> record(s).`
        : "Set at least one filter to search the catalog.";
    }

    const searchButton = this.element.querySelector(
      "[data-action='search-recipes']"
    );

    if (searchButton) {
      searchButton.disabled = !hasCriteria;
      searchButton.toggleAttribute(
        "disabled",
        !hasCriteria
      );
    }
  }

  async #rollCraftingCheck(recipeId) {
    const recipe = this.craftworks.recipes.get(
      recipeId,
      { includeDisabled: true }
    );
    if (!recipe) {
      ui.notifications.warn("Craftworks could not find that recipe.");
      return;
    }

    let inventoryActor = this.actorUuid
      ? await fromUuid(this.actorUuid)
      : null;
    const crafter = this.crafterUuid
      ? await fromUuid(this.crafterUuid)
      : null;

    if (!inventoryActor || !crafter) {
      ui.notifications.warn("Select both an inventory actor and a crafter.");
      return;
    }

    let job = this.craftworks.craftingJobs.get(
      recipe.id,
      crafter,
      inventoryActor.uuid
    );

    // dev.71-dev.75 jobs tracked progress before material consumption existed.
    // Start fresh rather than silently granting unfunded crafting progress.
    if (job && !job.materialsConsumed && !job.outputAwarded) {
      await this.craftworks.craftingJobs.clear(
        recipe.id,
        crafter
      );
      job = null;
      ui.notifications.info(
        `${recipe.name}: previous test progress was cleared so materials can be consumed correctly.`
      );
    }

    if (job?.outputAwarded) {
      await this.#craftAgain(recipe.id);
      return;
    }

    if (!job) {
      const readiness = this.craftworks.recipePlanner.plan(
        recipe,
        inventoryActor,
        { includePartyInventory: false }
      );

      if (!readiness.ready) {
        ui.notifications.warn(
          "The selected inventory does not currently satisfy this recipe."
        );
        await this.render({ force: true });
        return;
      }

      const plans = this.craftworks.craftingMaterials.planOptions(
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
        : await this.#chooseMaterialPlan(recipe, plans);

      if (!plan) return;

      const consumedMaterials =
        await this.craftworks.craftingMaterials.consume(
          inventoryActor,
          plan
        );

      job = await this.craftworks.craftingJobs.start({
        recipeId: recipe.id,
        crafter,
        inventoryActorUuid: inventoryActor.uuid,
        hoursRequired: recipe.craft?.hoursRequired,
        consumedMaterials,
        materialPlanSummary: plan.summary
      });

      ui.notifications.info(
        `${recipe.name}: crafting started. Materials consumed from ${inventoryActor.name}.`
      );
    } else if (job.inventoryActorUuid) {
      const storedInventory = await fromUuid(
        job.inventoryActorUuid
      );

      if (storedInventory) {
        inventoryActor = storedInventory;
      }
    }

    const toolStatus = this.craftworks.toolInspector?.inspect(
      crafter,
      recipe.craft?.tool
    ) ?? {
      hasTool: false,
      proficient: false,
      qualifiesForNormalDc: false
    };

    const dc = toolStatus.qualifiesForNormalDc
      ? recipe.craft?.dc
      : recipe.craft?.noToolDc;

    if (dc == null) {
      ui.notifications.warn("This recipe does not define a crafting DC.");
      return;
    }

    const result = await this.craftworks.craftingRolls.roll({
      recipe,
      crafter,
      dc,
      toolStatus
    });

    if (result?.cancelled) {
      ui.notifications.info(
        `${recipe.name}: crafting roll cancelled. No crafting attempt was spent.`
      );
      await this.render();
      return;
    }

    let progress = await this.craftworks.craftingJobs.recordAttempt(
      recipe.id,
      crafter,
      inventoryActor.uuid,
      { success: result.success }
    );

    if (progress.complete && !progress.outputAwarded) {
      try {
        const awarded = await this.craftworks.craftingMaterials.awardOutput(
          inventoryActor,
          recipe
        );

        progress = await this.craftworks.craftingJobs.markOutputAwarded(
          recipe.id,
          crafter,
          inventoryActor.uuid
        );

        ui.notifications.info(
          `${recipe.name} complete: ${awarded.quantity} × ${awarded.label} added to ${inventoryActor.name}.`
        );
      } catch (error) {
        console.error(
          "Morelord Craftworks | Failed to award crafting output.",
          error
        );

        ui.notifications.error(
          `${recipe.name}: checks are complete, but the output could not be awarded. `
          + `No additional crafting roll is required.`
        );
      }
    } else if (result.success) {
      ui.notifications.info(
        `${recipe.name}: success (${progress.successes} of ${progress.requiredSuccesses}).`
      );
    } else {
      ui.notifications.warn(
        `${recipe.name}: crafting check failed; 2 hours were spent with no progress.`
      );
    }

    await this.render({ force: true });
  }

  async #chooseMaterialPlan(recipe, plans) {
    const options = plans.map((plan, index) => `
      <label class="ml-craftworks-crafting-plan-option">
        <input
          type="radio"
          name="plan"
          value="${index}"
          ${index === 0 ? "checked" : ""}
        >
        <span>${this.#escapeHtml(plan.summary)}</span>
      </label>
    `).join("");

    const formData = await foundry.applications.api.DialogV2.input({
      window: {
        title: `Choose Materials — ${recipe.name}`
      },
      content: `
        <p>More than one valid material path is available. Choose which materials to use.</p>
        <div class="ml-craftworks-crafting-plan-options">
          ${options}
        </div>
      `,
      ok: {
        label: "Use Materials"
      }
    });

    if (!formData) return null;

    const index = Number(formData.plan);
    return plans[index] ?? null;
  }

  async #cancelCrafting(recipeId) {
    const crafter = this.crafterUuid
      ? await fromUuid(this.crafterUuid)
      : null;

    if (!crafter) return;

    const job = this.craftworks.craftingJobs.get(
      recipeId,
      crafter,
      this.actorUuid
    );

    if (!job) return;

    if (job.outputAwarded) {
      ui.notifications.warn(
        "Completed crafting cannot be canceled because the output has already been awarded."
      );
      return;
    }

    const inventoryActor = job.inventoryActorUuid
      ? await fromUuid(job.inventoryActorUuid)
      : null;

    if (
      inventoryActor
      && job.materialsConsumed
      && job.consumedMaterials?.length
    ) {
      await this.craftworks.craftingMaterials.refund(
        inventoryActor,
        job.consumedMaterials
      );
    }

    await this.craftworks.craftingJobs.clear(
      recipeId,
      crafter
    );

    ui.notifications.info(
      inventoryActor
        ? `Crafting canceled. Consumed materials were returned to ${inventoryActor.name}.`
        : "Crafting canceled."
    );

    await this.render({ force: true });
  }

  async #craftAgain(recipeId) {
    const crafter = this.crafterUuid
      ? await fromUuid(this.crafterUuid)
      : null;

    if (!crafter) return;

    await this.craftworks.craftingJobs.clear(
      recipeId,
      crafter
    );

    await this.render({ force: true });

    const recipe = this.craftworks.recipes.get(recipeId);
    const inventoryActor = this.actorUuid
      ? await fromUuid(this.actorUuid)
      : null;

    if (
      recipe
      && inventoryActor
      && this.craftworks.recipePlanner.plan(
        recipe,
        inventoryActor,
        { includePartyInventory: false }
      ).ready
    ) {
      await this.#rollCraftingCheck(recipeId);
    }
  }

  #escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  #availableActors() {
    const all = game.actors
      .filter(actor => ["character", "group"].includes(actor.type))
      .filter(actor => game.user.isGM || actor.testUserPermission(game.user, "OWNER"))
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.name,
        type: actor.type
      }));

    return all.sort((a, b) => a.name.localeCompare(b.name));
  }

  #currentCrafter() {
    if (this.crafterUuid) {
      const selected = this.craftworks.crafterContext
        .availableCharacters()
        .find(actor => actor.uuid === this.crafterUuid);

      if (selected) return selected;
    }

    return this.craftworks.crafterContext.resolve();
  }

  #defaultCrafterUuid(characters) {
    const controlled = canvas.tokens?.controlled
      ?.map(token => token.actor)
      ?.find(actor =>
        actor?.type === "character"
        && characters.some(entry => entry.uuid === actor.uuid)
      );

    if (controlled) return controlled.uuid;

    const userCharacter = game.user.character;
    if (
      userCharacter?.type === "character"
      && characters.some(entry => entry.uuid === userCharacter.uuid)
    ) {
      return userCharacter.uuid;
    }

    return characters.length === 1 ? characters[0].uuid : null;
  }

  #defaultActorUuid(actors) {
    const controlled = canvas.tokens?.controlled
      ?.map(token => token.actor)
      ?.find(actor =>
        actor
        && actors.some(entry => entry.uuid === actor.uuid)
      );

    if (controlled) return controlled.uuid;

    const userCharacter = game.user.character;
    if (userCharacter && actors.some(entry => entry.uuid === userCharacter.uuid)) {
      return userCharacter.uuid;
    }

    return actors.length === 1 ? actors[0].uuid : null;
  }
}
