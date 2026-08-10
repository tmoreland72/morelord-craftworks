import { MODULE_TITLE } from "../constants.mjs";
import {
  getHiddenRecipeIds,
  setHiddenRecipeIds
} from "../core/settings.mjs";
import { bindMultiselectBehavior } from "./multiselect-behavior.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RecipeBrowserApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.search = "";
    this.selectedPackIds = [];
    this.selectedCategories = [];
    this.actorUuid = null;
    this.crafterUuid = null;
    this.searchRenderTimer = null;
    this.restoreSearchFocus = false;
    this.searchExecuted = false;
    this.displayedRecipeIds = [];
    this.searchSelectionStart = null;
    this.searchSelectionEnd = null;
    this.selectedIngredientRarities = [];
    this.selectedIngredientTags = [];
    this.onlyCraftable = false;
    this.openFilterKey = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-recipes",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 900, height: 780 },
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
    const crafter =
      this.craftworks.crafterContext.resolve();

    this.actorUuid = null;
    this.crafterUuid = crafter?.uuid ?? null;
    this.onlyCraftable = false;

    const markedRecipeIds = new Set(
      this.craftworks.markedRecipes.list(crafter)
    );

    const effectiveRecipePacks = this.craftworks.recipes
      .packs({ includeDisabled: false })
      .filter(pack => Number(pack.recipeCount ?? 0) > 0);

    const validPackIds = new Set(
      effectiveRecipePacks.map(pack => pack.id)
    );

    this.selectedPackIds = this.selectedPackIds
      .filter(packId => validPackIds.has(packId));

    const ingredientRarities = this.#ingredientRarities();
    const ingredientTags = this.#ingredientTags();

    const raritySet = new Set(ingredientRarities);
    this.selectedIngredientRarities =
      this.selectedIngredientRarities.filter(rarity =>
        raritySet.has(rarity)
      );

    const tagSet = new Set(ingredientTags);
    this.selectedIngredientTags =
      this.selectedIngredientTags.filter(tag =>
        tagSet.has(tag)
      );

    const matchingRecipes = this.#matchingRecipes(actor);

    const hiddenRecipeIds = getHiddenRecipeIds();

    const totalRecipeCount = game.user.isGM
      ? this.craftworks.recipes.all().length
      : this.craftworks.recipes.all()
          .filter(recipe =>
            !hiddenRecipeIds.has(recipe.id)
          )
          .length;
    const prospectiveCount = matchingRecipes.length;
    const prospectiveCountLabel = prospectiveCount > 500
      ? "500+"
      : String(prospectiveCount);
    const hasSearchCriteria = Boolean(
      this.search.trim()
      || this.selectedPackIds.length
      || this.selectedCategories.length
      || this.selectedIngredientRarities.length
      || this.selectedIngredientTags.length
    );

    const autoShowResults =
      matchingRecipes.length <= 50;

    const recipes = autoShowResults
      ? matchingRecipes
      : this.searchExecuted
        ? this.displayedRecipeIds
            .map(recipeId =>
              this.craftworks.recipes.get(
                recipeId,
                { includeDisabled: true }
              )
            )
            .filter(Boolean)
        : [];

    const preparedRecipes = await Promise.all(recipes.map(async recipe => {
      const readiness = this.craftworks.recipePlanner.plan(recipe, actor);
      const craft = recipe.craft ?? {};
      const checkParts = [
        craft.ability,
        craft.skill ? `(${craft.skill})` : null
      ].filter(Boolean);

      const toolStatus = {
        hasTool: null,
        proficient: null,
        qualifiesForNormalDc: null
      };

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

      const sourcePack = this.craftworks.contentPacks?.get(recipe.packId);

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
        isHidden: hiddenRecipeIds.has(recipe.id),
        visibilityAction:
          hiddenRecipeIds.has(recipe.id)
            ? "show"
            : "hide",
        visibilityLabel:
          hiddenRecipeIds.has(recipe.id)
            ? "Show"
            : "Hide",
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
        requirementGroupRows: recipe.requirementGroups.map((group, groupIndex) => ({
          ...group,
          ready: readiness.requirementGroups?.[groupIndex]?.ready ?? null,
          requirementRows: group.requirements.map((requirement, requirementIndex) => {
            const inventory =
              readiness.requirementGroups?.[groupIndex]?.requirements?.[requirementIndex]
              ?? null;
            const materialId = requirement.match?.materialId ?? null;
            const material = materialId
              ? this.craftworks.materials.get(materialId)
              : null;

            return {
              ...requirement,
              materialId,
              materialImg: material?.img ?? null,
              tooltip: requirement.display,
              inventory,
              alternativeRows: requirement.type === "alternatives"
                ? requirement.alternatives.map((alternative, altIndex) => {
                    const altMaterialId = alternative.match?.materialId ?? null;
                    const altMaterial = altMaterialId
                      ? this.craftworks.materials.get(altMaterialId)
                      : null;

                    return {
                      ...alternative,
                      materialId: altMaterialId,
                      materialImg: altMaterial?.img ?? null,
                      tooltip: alternative.display,
                      inventory: inventory?.alternatives?.[altIndex] ?? null
                    };
                  })
                : []
            };
          })
        }))
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

    return foundry.utils.mergeObject(context, {
      search: this.search,
      crafterName: crafter?.name ?? null,
      canMarkRecipes: Boolean(crafter),
      selectedPackIds: this.selectedPackIds,
      selectedCategories: this.selectedCategories,
      selectedIngredientRarities: this.selectedIngredientRarities,
      selectedIngredientTags: this.selectedIngredientTags,
      onlyCraftable: this.onlyCraftable,
      canFilterCraftable: Boolean(actor),

      packFilterLabel: this.selectedPackIds.length
        ? `${this.selectedPackIds.length} selected`
        : "All Content Packs",
      categoryFilterLabel: this.selectedCategories.length
        ? `${this.selectedCategories.length} selected`
        : "All Categories",
      rarityFilterLabel: this.selectedIngredientRarities.length
        ? `${this.selectedIngredientRarities.length} selected`
        : "All Rarities",
      tagFilterLabel: this.selectedIngredientTags.length
        ? `${this.selectedIngredientTags.length} selected`
        : "All Ingredient Tags",

      packFilterOpen: this.openFilterKey === "recipe-pack",
      categoryFilterOpen: this.openFilterKey === "recipe-category",
      rarityFilterOpen: this.openFilterKey === "ingredient-rarity",
      tagFilterOpen: this.openFilterKey === "ingredient-tag",

      ingredientRarities: ingredientRarities.map(rarity => ({
        id: rarity,
        label: rarity.charAt(0).toUpperCase() + rarity.slice(1),
        selected: this.selectedIngredientRarities.includes(rarity)
      })),

      ingredientTags: ingredientTags.map(tag => ({
        id: tag,
        label: tag
          .split("-")
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
        selected: this.selectedIngredientTags.includes(tag)
      })),

      categories: Array.from(
        new Set(
          this.craftworks.recipes.all()
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
          selected: this.selectedCategories.includes(category)
        })),

      packs: effectiveRecipePacks.map(pack => ({
        ...pack,
        selected: this.selectedPackIds.includes(pack.id)
      })),
      hasEnabledRecipes: this.craftworks.recipes.all().length > 0,
      totalRecipeCount,
      prospectiveCount,
      prospectiveCountLabel,
      hasSearchCriteria,
      searchExecuted:
        this.searchExecuted || autoShowResults,
      autoShowResults,
      recipeGroups,
      hasRecipes: preparedRecipes.length > 0,
      canManageRecipeVisibility: game.user.isGM,
      hiddenRecipeCount: hiddenRecipeIds.size
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    bindMultiselectBehavior(this);

    const searchInput = this.element.querySelector("[name='search']");

    if (searchInput) {
      searchInput.addEventListener("input", event => {
        this.search = event.currentTarget.value ?? "";
        this.#updateLiveQueryState();
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
        this.openFilterKey = null;
        this.render();
      });

    const bindMultiSelect = (name, stateKey, filterKey) => {
      this.element.querySelectorAll(`[name='${name}']`)
        .forEach(element => {
          element.addEventListener("change", event => {
            const value = event.currentTarget.value;
            const selected = new Set(this[stateKey]);

            if (event.currentTarget.checked) selected.add(value);
            else selected.delete(value);

            this[stateKey] = [...selected];
            this.openFilterKey = filterKey;
            this.render();
          });
        });
    };

    bindMultiSelect(
      "recipe-pack-filter",
      "selectedPackIds",
      "recipe-pack"
    );

    bindMultiSelect(
      "recipe-category-filter",
      "selectedCategories",
      "recipe-category"
    );

    bindMultiSelect(
      "ingredient-rarity-filter",
      "selectedIngredientRarities",
      "ingredient-rarity"
    );

    bindMultiSelect(
      "ingredient-tag-filter",
      "selectedIngredientTags",
      "ingredient-tag"
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

    this.element.querySelector("[data-action='search-recipes']")
      ?.addEventListener("click", event => {
        event.preventDefault();

        if (
          !this.search.trim()
          && !this.selectedPackIds.length
          && !this.selectedCategories.length
          && !this.selectedIngredientRarities.length
          && !this.selectedIngredientTags.length
          && !this.onlyCraftable
        ) {
          ui.notifications.warn(
            "Set at least one recipe search filter before searching."
          );
          return;
        }

        if (this.searchRenderTimer) {
          clearTimeout(this.searchRenderTimer);
          this.searchRenderTimer = null;
        }

        this.restoreSearchFocus = false;
        this.openFilterKey = null;
        this.displayedRecipeIds = this.#matchingRecipes(
          this.#currentInventoryActor()
        ).map(recipe => recipe.id);
        this.searchExecuted = true;
        this.render();
      });

    this.element.querySelector("[name='search']")
      ?.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        event.preventDefault();

        if (
          !this.search.trim()
          && !this.selectedPackIds.length
          && !this.selectedCategories.length
          && !this.selectedIngredientRarities.length
          && !this.selectedIngredientTags.length
          && !this.onlyCraftable
        ) return;

        if (this.searchRenderTimer) {
          clearTimeout(this.searchRenderTimer);
          this.searchRenderTimer = null;
        }

        this.restoreSearchFocus = false;
        this.openFilterKey = null;
        this.displayedRecipeIds = this.#matchingRecipes(
          this.#currentInventoryActor()
        ).map(recipe => recipe.id);
        this.searchExecuted = true;
        this.render();
      });

    this.element.querySelector("[data-action='hide-all-recipes']")
      ?.addEventListener("click", async event => {
        event.preventDefault();

        if (!game.user.isGM) return;

        this.openFilterKey = null;

        await setHiddenRecipeIds(
          this.craftworks.recipes.all()
            .map(recipe => recipe.id)
        );

        ui.notifications.info(
          "All recipes are hidden from players."
        );

        await this.render();
      });

    this.element.querySelector("[data-action='unhide-all-recipes']")
      ?.addEventListener("click", async event => {
        event.preventDefault();

        if (!game.user.isGM) return;

        this.openFilterKey = null;
        await setHiddenRecipeIds([]);

        ui.notifications.info(
          "All recipes are visible to players."
        );

        await this.render();
      });

    this.element.querySelectorAll("[data-recipe-visibility]")
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
          await this.render();
        });
      });

    this.element.querySelectorAll("[data-action='toggle-mark-recipe']")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          const crafter =
            this.craftworks.crafterContext.resolve();

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

  #ingredientMaterialsForRecipe(recipe) {
    const materialIds = new Set();

    for (const group of recipe.requirementGroups ?? []) {
      for (const requirement of group.requirements ?? []) {
        if (requirement.match?.materialId) {
          materialIds.add(requirement.match.materialId);
        }

        for (const alternative of requirement.alternatives ?? []) {
          if (alternative.match?.materialId) {
            materialIds.add(alternative.match.materialId);
          }
        }
      }
    }

    return Array.from(materialIds)
      .map(materialId =>
        this.craftworks.materials.get(materialId)
      )
      .filter(Boolean);
  }

  #ingredientRarities() {
    return Array.from(
      new Set(
        this.craftworks.recipes.all()
          .flatMap(recipe =>
            this.#ingredientMaterialsForRecipe(recipe)
              .map(material =>
                String(material.rarity ?? "").toLowerCase()
              )
          )
          .filter(Boolean)
      )
    ).sort();
  }

  #ingredientTags() {
    return Array.from(
      new Set(
        this.craftworks.recipes.all()
          .flatMap(recipe =>
            this.#ingredientMaterialsForRecipe(recipe)
              .flatMap(material => material.tags ?? [])
              .map(tag => String(tag).toLowerCase())
          )
          .filter(Boolean)
      )
    ).sort();
  }

  #matchingRecipes(actor = this.#currentInventoryActor()) {
    let recipes = this.craftworks.recipes.search(this.search);

    if (!game.user.isGM) {
      const hidden = getHiddenRecipeIds();
      recipes = recipes.filter(recipe =>
        !hidden.has(recipe.id)
      );
    }

    if (this.selectedPackIds.length) {
      const selected = new Set(this.selectedPackIds);
      recipes = recipes.filter(recipe =>
        selected.has(recipe.packId)
      );
    }

    if (this.selectedCategories.length) {
      const selected = new Set(this.selectedCategories);
      recipes = recipes.filter(recipe =>
        selected.has(recipe.category)
      );
    }

    if (this.selectedIngredientRarities.length) {
      const selected = new Set(
        this.selectedIngredientRarities
      );

      recipes = recipes.filter(recipe =>
        this.#ingredientMaterialsForRecipe(recipe)
          .some(material =>
            selected.has(
              String(material.rarity ?? "").toLowerCase()
            )
          )
      );
    }

    if (this.selectedIngredientTags.length) {
      const selected = new Set(
        this.selectedIngredientTags
      );

      recipes = recipes.filter(recipe =>
        this.#ingredientMaterialsForRecipe(recipe)
          .some(material =>
            (material.tags ?? []).some(tag =>
              selected.has(String(tag).toLowerCase())
            )
          )
      );
    }

    if (this.onlyCraftable) {
      recipes = actor
        ? recipes.filter(recipe =>
            this.craftworks.recipePlanner.plan(
              recipe,
              actor
            ).ready
          )
        : [];
    }

    return recipes;
  }

  #updateLiveQueryState() {
    const recipes = this.#matchingRecipes();

    const hasCriteria = Boolean(
      this.search.trim()
      || this.selectedPackIds.length
      || this.selectedCategories.length
      || this.selectedIngredientRarities.length
      || this.selectedIngredientTags.length
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
        inventoryActor
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

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: crafter }),
          content:
            `<strong>${this.#escapeHtml(recipe.name)} complete!</strong><br>`
            + `${this.#escapeHtml(crafter.name)} crafted `
            + `${awarded.quantity} × ${this.#escapeHtml(awarded.label)}.`
        });
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
      <label class="mcw-crafting-plan-option">
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
        <div class="mcw-crafting-plan-options">
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
      && this.craftworks.recipePlanner.plan(recipe, inventoryActor).ready
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
