import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";
import { bindMultiselectBehavior } from "./multiselect-behavior.mjs";
import { buildMaterialTagGroups } from "./material-filter-groups.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class MaterialBrowserApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.search = "";
    this.selectedPackIds = [];
    this.excludedPackIds = [];
    this.selectedRarities = [];
    this.excludedRarities = [];
    this.selectedTags = [];
    this.excludedTags = [];
    this.actorUuid = null;
    this.focusMaterialId = null;
    this.searchExecuted = false;
    this.displayedMaterialIds = [];
    this._searchTimer = null;
    this.restoreSearchFocus = false;
    this.searchSelectionStart = null;
    this.searchSelectionEnd = null;
    this.openFilterKey = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-material-browser",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 1080, height: 840 },
    window: {
      title: `${MODULE_TITLE} — Materials`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/material-browser.hbs"
    }
  };

  focusMaterial(materialId) {
    const material = this.craftworks.materials.get(materialId);
    if (!material) return false;

    this.focusMaterialId = material.materialId;
    this.search = material.name;
    this.selectedPackIds = material.packId
      ? [material.packId]
      : [];
    this.excludedPackIds = [];
    this.selectedRarities = [];
    this.excludedRarities = [];
    this.selectedTags = [];
    this.excludedTags = [];
    this.searchExecuted = true;
    this.displayedMaterialIds = [material.materialId];
    return true;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const actors = this.#availableActors();
    if (!this.actorUuid) {
      this.actorUuid = this.#defaultActorUuid(actors);
    }

    const actor = this.actorUuid
      ? await fromUuid(this.actorUuid)
      : null;

    if (actor && !actors.some(entry => entry.uuid === actor.uuid)) {
      this.actorUuid = null;
    }

    const inventory = this.#materialInventory(actor);
    const allMaterials = this.craftworks.materials.all();

    const materialCountsByPack = allMaterials.reduce((counts, material) => {
      counts.set(
        material.packId,
        (counts.get(material.packId) ?? 0) + 1
      );
      return counts;
    }, new Map());

    const enabledPacks = (
      this.craftworks.contentPacks
        ?.enabled({ capability: "materials" })
      ?? []
    )
      .map(pack => ({
        ...pack,
        materialCount: materialCountsByPack.get(pack.id) ?? 0
      }))
      .filter(pack => pack.materialCount > 0);

    const validPackIds = new Set(enabledPacks.map(pack => pack.id));
    this.selectedPackIds = this.selectedPackIds
      .filter(packId => validPackIds.has(packId));
    this.excludedPackIds = this.excludedPackIds
      .filter(packId => validPackIds.has(packId));

    const rarities = Array.from(
      new Set(
        allMaterials
          .map(material =>
            String(material.rarity ?? "").toLowerCase()
          )
          .filter(Boolean)
      )
    ).sort();

    const rawTags = Array.from(
      new Set(
        allMaterials
          .flatMap(material => material.tags ?? [])
          .map(tag => String(tag).toLowerCase())
          .filter(Boolean)
      )
    ).sort();

    const raritySet = new Set(rarities);
    this.selectedRarities =
      this.selectedRarities.filter(rarity =>
        raritySet.has(rarity)
      );
    this.excludedRarities =
      this.excludedRarities.filter(rarity =>
        raritySet.has(rarity)
      );

    const tagGroups = buildMaterialTagGroups(rawTags, {
      included: this.selectedTags,
      excluded: this.excludedTags
    });
    const tags = tagGroups.flatMap(group => group.options.map(option => option.id));
    const tagSet = new Set(tags);
    this.selectedTags =
      this.selectedTags.filter(tag =>
        tagSet.has(tag)
      );
    this.excludedTags =
      this.excludedTags.filter(tag =>
        tagSet.has(tag)
      );

    const matchingMaterials = this.#matchingMaterials();

    const totalMaterialCount = allMaterials.length;
    const prospectiveCount = matchingMaterials.length;
    const prospectiveCountLabel = String(prospectiveCount);
    const hasSearchCriteria = Boolean(
      this.search.trim()
      || this.selectedPackIds.length
      || this.excludedPackIds.length
      || this.selectedRarities.length
      || this.excludedRarities.length
      || this.selectedTags.length
      || this.excludedTags.length
    );

    const displayLimit = 300;
    const autoShowResults = true;
    const displayedMaterials = [...matchingMaterials]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, displayLimit);

    const materials = displayedMaterials
          .map(material => {
            const pack = this.craftworks.contentPacks?.get(material.packId);
            const quantity = inventory.get(material.materialId) ?? 0;

            return {
              ...material,
              packLabel: pack?.label ?? material.packId ?? "Unknown Pack",
              focused: material.materialId === this.focusMaterialId,
              ownedQuantity: quantity,
              owned: quantity > 0,
              priceLabel: Number(material.price?.value ?? 0) > 0
                ? `${material.price.value} ${material.price?.denomination ?? "gp"}`
                : "No value",
              usedIn: this.craftworks.recipes
                .getByMaterial(material.materialId)
                .filter(recipe =>
                  (recipe.requirementGroups ?? []).some(group =>
                    (group.requirements ?? []).some(requirement =>
                      requirement.match?.materialId === material.materialId
                      || (requirement.alternatives ?? []).some(alternative =>
                        alternative.match?.materialId === material.materialId
                      )
                    )
                  )
                )
                .map(recipe => recipe.name),
              producedBy: this.craftworks.recipes
                .getByMaterial(material.materialId)
                .filter(recipe =>
                  recipe.output?.materialId === material.materialId
                )
                .map(recipe => recipe.name)
            };
          });

    return foundry.utils.mergeObject(context, {
      search: this.search,
      selectedPackIds: this.selectedPackIds,
      actorUuid: this.actorUuid,
      actorName: actor?.name ?? null,
      actors: actors.map(entry => ({
        ...entry,
        selected: entry.uuid === this.actorUuid
      })),
      packFilterLabel: this.selectedPackIds.length
        ? `${this.selectedPackIds.length} selected`
        : "All Content Packs",
      packFilterOpen: this.openFilterKey === "material-pack",
      rarityFilterOpen:
        this.openFilterKey === "material-rarity",
      tagFilterOpen:
        this.openFilterKey === "material-tag",
      rarityFilterLabel: this.selectedRarities.length
        ? `${this.selectedRarities.length} selected`
        : "All Rarities",
      tagFilterLabel: this.selectedTags.length
        ? `${this.selectedTags.length} selected`
        : "All Tags",
      rarities: rarities.map(rarity => ({
        id: rarity,
        label: rarity
          .split("-")
          .map(part =>
            part.charAt(0).toUpperCase()
            + part.slice(1)
          )
          .join(" "),
        state:
          this.selectedRarities.includes(rarity)
            ? 1
            : this.excludedRarities.includes(rarity)
              ? -1
              : 0,
        included:
          this.selectedRarities.includes(rarity),
        excluded:
          this.excludedRarities.includes(rarity)
      })),
      tagGroups,
      packs: enabledPacks.map(pack => ({
        id: pack.id,
        label: pack.label,
        materialCount: pack.materialCount,
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
      totalMaterialCount,
      prospectiveCount,
      prospectiveCountLabel,
      hasSearchCriteria,
      searchExecuted:
        autoShowResults,
      overDisplayLimit:
        prospectiveCount > displayLimit,
      displayLimit,
      autoShowResults,
      materialCount: materials.length,
      ownedMaterialCount: materials.filter(material => material.owned).length,
      totalOwnedQuantity: materials.reduce(
        (total, material) => total + material.ownedQuantity,
        0
      ),
      materials
    }, { inplace: false });
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
        this.focusMaterialId = null;
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

    this.element
      .querySelectorAll("[data-tristate-filter]")
      .forEach(button => {
        button.addEventListener(
          "click",
          event => {
            event.preventDefault();

            const group =
              event.currentTarget
                .dataset.filterGroup;
            const value =
              event.currentTarget
                .dataset.filterValue;

            this.#cycleTriState(
              group,
              value
            );

            this.focusMaterialId = null;
            this.displayedMaterialIds =
              this.#matchingMaterials()
                .map(material =>
                  material.materialId
                );
            this.searchExecuted = true;
            this.render();
          }
        );
      });

    this.element
      .querySelector(
        "[data-action='clear-material-filters']"
      )
      ?.addEventListener(
        "click",
        event => {
          event.preventDefault();
          this.#clearTriStateFilters();
          this.search = "";
          this.displayedMaterialIds = [];
          this.searchExecuted = false;
          this.focusMaterialId = null;
          this.render();
        }
      );


  }

  #cycleTriState(group, value) {
    const definitions = {
      pack: [
        "selectedPackIds",
        "excludedPackIds"
      ],
      rarity: [
        "selectedRarities",
        "excludedRarities"
      ],
      tag: [
        "selectedTags",
        "excludedTags"
      ]
    };

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
    this.selectedRarities = [];
    this.excludedRarities = [];
    this.selectedTags = [];
    this.excludedTags = [];
  }

  #matchingMaterials() {
    const term = this.search.trim().toLowerCase();

    let materials = this.craftworks.materials.all();

    if (this.selectedPackIds.length) {
      const selected = new Set(this.selectedPackIds);
      materials = materials.filter(material =>
        selected.has(material.packId)
      );
    }

    if (this.excludedPackIds.length) {
      const excluded = new Set(this.excludedPackIds);
      materials = materials.filter(material =>
        !excluded.has(material.packId)
      );
    }

    if (this.selectedRarities.length) {
      const selected = new Set(
        this.selectedRarities
      );

      materials = materials.filter(material =>
        selected.has(
          String(material.rarity ?? "").toLowerCase()
        )
      );
    }

    if (this.excludedRarities.length) {
      const excluded = new Set(
        this.excludedRarities
      );

      materials = materials.filter(material =>
        !excluded.has(
          String(material.rarity ?? "").toLowerCase()
        )
      );
    }

    if (this.selectedTags.length) {
      const selected = new Set(
        this.selectedTags
      );

      materials = materials.filter(material =>
        (material.tags ?? []).some(tag =>
          selected.has(
            String(tag).toLowerCase()
          )
        )
      );
    }

    if (this.excludedTags.length) {
      const excluded = new Set(
        this.excludedTags
      );

      materials = materials.filter(material =>
        !(material.tags ?? []).some(tag =>
          excluded.has(
            String(tag).toLowerCase()
          )
        )
      );
    }

    if (term) {
      materials = materials.filter(material => {
        const pack = this.craftworks.contentPacks?.get(
          material.packId
        );

        return [
          material.name,
          material.category,
          material.rarity,
          material.stage,
          material.packId,
          pack?.label,
          ...(material.tags ?? [])
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      });
    }

    return materials;
  }

  #updateLiveQueryState() {
    const materials = this.#matchingMaterials();
    const term = this.search.trim().toLowerCase();

    const hasCriteria = Boolean(
      term
      || this.selectedPackIds.length
      || this.excludedPackIds.length
      || this.selectedRarities.length
      || this.excludedRarities.length
      || this.selectedTags.length
      || this.excludedTags.length
    );

    const countLabel = materials.length > 500
      ? "500+"
      : String(materials.length);

    const summary = this.element.querySelector(
      "[data-query-result-summary]"
    );

    if (summary) {
      summary.innerHTML = hasCriteria
        ? `Search will return <strong>${countLabel}</strong> record(s).`
        : "Set at least one filter to search the catalog.";
    }

    const searchButton = this.element.querySelector(
      "[data-action='search-materials']"
    );

    if (searchButton) {
      searchButton.disabled = !hasCriteria;
      searchButton.toggleAttribute(
        "disabled",
        !hasCriteria
      );
    }
  }

  #materialInventory(actor) {
    const inventory = new Map();
    if (!actor) return inventory;

    for (const item of Array.from(actor.items ?? [])) {
      const flags = item.flags?.[MODULE_ID] ?? {};
      const materialId = flags.materialId;
      if (!materialId) continue;

      const quantity = Math.max(
        0,
        Number(item.system?.quantity ?? 1)
      );

      inventory.set(
        materialId,
        (inventory.get(materialId) ?? 0) + quantity
      );
    }

    return inventory;
  }

  #availableActors() {
    return game.actors
      .filter(actor => ["character", "group"].includes(actor.type))
      .filter(actor =>
        game.user.isGM
        || actor.testUserPermission(game.user, "OWNER")
      )
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.name,
        type: actor.type
      }))
      .sort((a,b) => a.name.localeCompare(b.name));
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
    if (
      userCharacter
      && actors.some(entry => entry.uuid === userCharacter.uuid)
    ) {
      return userCharacter.uuid;
    }

    return actors.length === 1 ? actors[0].uuid : null;
  }
}
