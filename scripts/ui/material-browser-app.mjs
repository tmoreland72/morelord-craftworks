import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";
import { bindMultiselectBehavior } from "./multiselect-behavior.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class MaterialBrowserApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.search = "";
    this.selectedPackIds = [];
    this.selectedRarities = [];
    this.selectedTags = [];
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
    position: { width: 920, height: 780 },
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
    this.selectedRarities = [];
    this.selectedTags = [];
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

    const rarities = Array.from(
      new Set(
        allMaterials
          .map(material =>
            String(material.rarity ?? "").toLowerCase()
          )
          .filter(Boolean)
      )
    ).sort();

    const tags = Array.from(
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

    const tagSet = new Set(tags);
    this.selectedTags =
      this.selectedTags.filter(tag =>
        tagSet.has(tag)
      );

    const matchingMaterials = this.#matchingMaterials();

    const totalMaterialCount = allMaterials.length;
    const prospectiveCount = matchingMaterials.length;
    const prospectiveCountLabel = prospectiveCount > 500
      ? "500+"
      : String(prospectiveCount);
    const hasSearchCriteria = Boolean(
      this.search.trim()
      || this.selectedPackIds.length
      || this.selectedRarities.length
      || this.selectedTags.length
    );

    const autoShowResults =
      matchingMaterials.length <= 50;

    const displayedMaterials = autoShowResults
      ? matchingMaterials
      : this.searchExecuted
        ? this.displayedMaterialIds
            .map(materialId =>
              this.craftworks.materials.get(materialId)
            )
            .filter(Boolean)
        : [];

    const materials = displayedMaterials
          .sort((a,b) => a.name.localeCompare(b.name))
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
        selected:
          this.selectedRarities.includes(rarity)
      })),
      tags: tags.map(tag => ({
        id: tag,
        label: tag
          .split("-")
          .map(part =>
            part.charAt(0).toUpperCase()
            + part.slice(1)
          )
          .join(" "),
        selected:
          this.selectedTags.includes(tag)
      })),
      packs: enabledPacks.map(pack => ({
        id: pack.id,
        label: pack.label,
        materialCount: pack.materialCount,
        selected: this.selectedPackIds.includes(pack.id)
      })),
      totalMaterialCount,
      prospectiveCount,
      prospectiveCountLabel,
      hasSearchCriteria,
      searchExecuted:
        this.searchExecuted || autoShowResults,
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
      searchInput.addEventListener("input", event => {
        this.search = event.currentTarget.value ?? "";
        this.focusMaterialId = null;
        this.#updateLiveQueryState();
      });

    }

    this.element.querySelector("[name='actor']")
      ?.addEventListener("change", event => {
        this.actorUuid = event.currentTarget.value || null;
        this.openFilterKey = null;
        this.render();
      });

    const bindMultiSelect = (
      name,
      stateKey,
      filterKey
    ) => {
      this.element.querySelectorAll(
        `[name='${name}']`
      ).forEach(element => {
        element.addEventListener("change", event => {
          const selected = new Set(
            this[stateKey]
          );

          const value =
            event.currentTarget.value;

          if (event.currentTarget.checked) {
            selected.add(value);
          } else {
            selected.delete(value);
          }

          this[stateKey] = [...selected];
          this.openFilterKey = filterKey;
          this.focusMaterialId = null;
          this.render();
        });
      });
    };

    bindMultiSelect(
      "material-pack-filter",
      "selectedPackIds",
      "material-pack"
    );

    bindMultiSelect(
      "material-rarity-filter",
      "selectedRarities",
      "material-rarity"
    );

    bindMultiSelect(
      "material-tag-filter",
      "selectedTags",
      "material-tag"
    );

    this.element.querySelector("[data-action='search-materials']")
      ?.addEventListener("click", event => {
        event.preventDefault();

        if (
          !this.search.trim()
          && !this.selectedPackIds.length
          && !this.selectedRarities.length
          && !this.selectedTags.length
        ) {
          ui.notifications.warn(
            "Set at least one material search filter before searching."
          );
          return;
        }

        clearTimeout(this._searchTimer);
        this.openFilterKey = null;
        this.displayedMaterialIds = this.#matchingMaterials()
          .map(material => material.materialId);
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
          && !this.selectedRarities.length
          && !this.selectedTags.length
        ) return;

        clearTimeout(this._searchTimer);
        this.openFilterKey = null;
        this.displayedMaterialIds = this.#matchingMaterials()
          .map(material => material.materialId);
        this.searchExecuted = true;
        this.render();
      });
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
      || this.selectedRarities.length
      || this.selectedTags.length
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
