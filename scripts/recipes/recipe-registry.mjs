import {
  craftingSuccessesRequired,
  isValidCraftingDuration
} from "../crafting/crafting-rules.mjs";
import { CONTENT_PACKS, getContentPack } from "../../data/content-packs.mjs";
import { CONTENT_PACK_MANIFESTS } from "../../data/packs/manifests.mjs";
import { isContentPackEnabled } from "../core/settings.mjs";

export class RecipeRegistry {
  constructor({
    materialRegistry,
    coreAccess = null,
    contentPacks = null,
    dnd5eItemResolver = null
  }) {
    this.materialRegistry = materialRegistry;
    this.coreAccess = coreAccess;
    this.contentPacks = contentPacks;
    this.dnd5eItemResolver = dnd5eItemResolver;
    this._recipes = new Map();
  }

  async loadStandardSeed() {
    const sources = CONTENT_PACK_MANIFESTS.map(manifest => [
      manifest.id,
      manifest.recipes ?? []
    ]);

    this._recipes.clear();

    for (const [packId, entries] of sources) {
      if (!Array.isArray(entries)) {
        throw new Error(`Packaged recipe source '${packId}' is not an array.`);
      }

      let excludedUnmatchedStandardItems = 0;

      for (const raw of entries) {
        let preparedRaw = {
          ...raw,
          packId: raw.packId ?? packId
        };

        const exactDnd5eSourceBooks = {
          "srd-5.2": "SRD 5.2",
          "srd-5.1": "SRD 5.1",
          "phb": "Player's Handbook",
          "dmg": "Dungeon Master's Guide",
          "monsters-of-drakkenheim": "Monsters of Drakkenheim"
        };

        if (
          exactDnd5eSourceBooks[preparedRaw.packId]
          && preparedRaw.output?.type === "catalog-item"
        ) {
          const sourceBook = exactDnd5eSourceBooks[preparedRaw.packId];

          preparedRaw = await this.#resolveDnd5eCatalogOutput(
            preparedRaw,
            sourceBook
          );

          if (!preparedRaw) {
            excludedUnmatchedStandardItems += 1;
            continue;
          }
        }

        const recipe = this.#normalizeRecipe(preparedRaw);

        // Manifest order is priority order. Higher-priority content packs
        // intentionally replace lower-priority recipes with the same id.
        this._recipes.set(recipe.id, recipe);
      }

      if (excludedUnmatchedStandardItems > 0) {
        console.log(
          `Morelord Craftworks | Excluded ${excludedUnmatchedStandardItems} `
          + `${packId} Kibbles recipe candidate(s) whose output is not present in that exact D&D5e Item pack.`
        );
      }
    }

    this.#validateUniqueMaterialOutputs();

    console.log(
      `Morelord Craftworks | Indexed ${this._recipes.size} recipe definitions `
      + `across ${CONTENT_PACKS.length} recipe packs `
      + `(${this.all().length} currently enabled).`
    );

    return this._recipes.size;
  }

  packs({ includeDisabled = true } = {}) {
    return CONTENT_PACKS
      .map(pack => {
        const enabled = isContentPackEnabled(pack.id);
        return {
          ...pack,
          enabled,
          recipeCount: Array.from(this._recipes.values())
            .filter(recipe => recipe.packId === pack.id)
            .length
        };
      })
      .filter(pack => includeDisabled || pack.enabled);
  }

  isPackEnabled(packId) {
    const pack = getContentPack(packId);
    if (!pack) return false;
    if (this.contentPacks) return this.contentPacks.isEnabled(packId);
    if (!isContentPackEnabled(packId)) return false;
    return this.coreAccess?.hasAccess(pack) ?? !pack.premium;
  }

  get(recipeId, { includeDisabled = false } = {}) {
    const recipe = this._recipes.get(recipeId) ?? null;
    if (!recipe) return null;
    if (!includeDisabled && !this.isPackEnabled(recipe.packId)) return null;
    return recipe;
  }

  all({ includeDisabled = false } = {}) {
    const recipes = Array.from(this._recipes.values());

    if (includeDisabled) return recipes;

    return recipes.filter(recipe => this.isPackEnabled(recipe.packId));
  }

  search(query = "", { packId = "all" } = {}) {
    const needle = String(query ?? "").trim().toLowerCase();

    return this.all().filter(recipe => {
      if (packId !== "all" && recipe.packId !== packId) return false;
      if (!needle) return true;

      const haystack = [
        recipe.id,
        recipe.name,
        recipe.category,
        recipe.kind,
        recipe.description,
        recipe.output?.label,
        recipe.packLabel,
        recipe.rulesVersion,
        ...(recipe.tags ?? []),
        ...recipe.requirementGroups.flatMap(group =>
          group.requirements.flatMap(req => req.searchText ?? [])
        )
      ].filter(Boolean).join(" ").toLowerCase();

      return haystack.includes(needle);
    });
  }

  getByMaterial(materialId) {
    return this.all().filter(recipe =>
      this.#recipeUsesMaterial(recipe, materialId)
      || (
        recipe.output?.type === "craftworks-material"
        && recipe.output?.materialId === materialId
      )
    );
  }

  recipesProducingMaterial(materialId, { includeDisabled = false } = {}) {
    const target = String(materialId ?? "").trim();
    if (!target) return [];

    return this.all({ includeDisabled }).filter(recipe =>
      recipe.output?.type === "craftworks-material"
      && recipe.output?.materialId === target
    );
  }

  decorate(recipe) {
    return recipe;
  }

  async #resolveDnd5eCatalogOutput(raw, sourceBook) {
    const output = raw.output ?? {};
    const parsed = this.dnd5eItemResolver?.extractQuantityAndName
      ? this.dnd5eItemResolver.extractQuantityAndName(
          output.label ?? output.name ?? raw.name,
          output.quantity ?? 1
        )
      : {
          quantity: Math.max(1, Number(output.quantity ?? 1)),
          name: String(output.label ?? output.name ?? raw.name)
        };

    if (!this.dnd5eItemResolver) {
      console.warn(
        `Morelord Craftworks | No D&D5e compendium resolver is available; `
        + `excluding ${sourceBook} recipe '${raw.name}'.`
      );
      return null;
    }

    const item = await this.dnd5eItemResolver.resolve(
      parsed.name,
      { sourceBook }
    );

    if (!item) return null;

    return {
      ...raw,
      output: {
        type: "foundry-item",
        uuid: item.uuid,
        quantity: parsed.quantity,
        label: item.name,
        img: item.img,
        sourceBook,
        sourcePackId: item.packId
      }
    };
  }

  #validateUniqueMaterialOutputs() {
    const seen = new Map();

    for (const recipe of this._recipes.values()) {
      if (recipe.output?.type !== "craftworks-material") continue;

      const key = `${recipe.packId}|${recipe.output.materialId}`;
      const existing = seen.get(key);

      if (existing) {
        throw new Error(
          `Content Pack '${recipe.packId}' defines more than one recipe producing `
          + `'${recipe.output.materialId}': '${existing.name}' and '${recipe.name}'. `
          + `Use one recipe with alternative requirements instead.`
        );
      }

      seen.set(key, recipe);
    }
  }

  #recipeUsesMaterial(recipe, materialId) {
    return (recipe.requirementGroups ?? []).some(group =>
      (group.requirements ?? []).some(requirement => {
        if (requirement.match?.materialId === materialId) return true;

        return (requirement.alternatives ?? []).some(alternative =>
          alternative.match?.materialId === materialId
        );
      })
    );
  }

  #normalizeRecipe(raw) {
    if (!raw?.id) throw new Error("Recipe definition is missing an id.");
    if (!raw?.name) throw new Error(`Recipe ${raw.id} is missing a name.`);
    if (!raw?.output?.type) throw new Error(`Recipe ${raw.id} is missing output.type.`);

    const packId = String(raw.packId ?? "standard-core");
    const pack = getContentPack(packId);

    if (!pack) {
      throw new Error(`Recipe ${raw.id} references unknown recipe pack '${packId}'.`);
    }

    return {
      schemaVersion: Number(raw.schemaVersion ?? 1),
      packId,
      packLabel: pack.label,
      rulesVersion: pack.rulesVersion,
      id: String(raw.id),
      name: String(raw.name),
      description: String(raw.description ?? ""),
      category: String(raw.category ?? "general"),
      kind: String(raw.kind ?? "crafting"),
      rarity: raw.rarity
        ? String(raw.rarity)
        : raw.output?.rarity
          ? String(raw.output.rarity)
          : null,
      tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
      source: raw.source ?? null,
      craft: this.#normalizeCraft(raw.craft),
      requirementGroups: this.#normalizeRequirementGroups(raw, raw.id),
      output: this.#normalizeOutput(raw.output, raw.id)
    };
  }

  #normalizeCraft(raw) {
    if (!raw) {
      return {
        tool: null,
        ability: null,
        skill: null,
        dc: null,
        noToolDc: null,
        hoursRequired: null
      };
    }

    const dc = raw.dc == null
      ? null
      : Math.max(1, Number(raw.dc));

    const noToolDc = raw.noToolDc == null
      ? (dc == null ? null : dc + 5)
      : Math.max(1, Number(raw.noToolDc));

    const hoursRequired = raw.hoursRequired == null
      ? null
      : Number(raw.hoursRequired);

    if (
      hoursRequired != null
      && !isValidCraftingDuration(hoursRequired)
    ) {
      throw new Error(
        `Recipe crafting time must be a positive multiple of `
        + `${2} hours; received ${raw.hoursRequired}.`
      );
    }

    return {
      tool: raw.tool ? String(raw.tool) : null,
      ability: raw.ability ? String(raw.ability) : null,
      skill: raw.skill ? String(raw.skill) : null,
      dc,
      noToolDc,
      hoursRequired,
      checkRequired: raw.checkRequired !== false,
      requiredSuccesses: raw.checkRequired === false
        ? 1
        : craftingSuccessesRequired(hoursRequired)
    };
  }

  #normalizeRequirementGroups(raw, recipeId) {
    const rawGroups = Array.isArray(raw?.requirementGroups) && raw.requirementGroups.length
      ? raw.requirementGroups
      : [{ requirements: raw?.requirements ?? [] }];

    if (!rawGroups.length) {
      throw new Error(`Recipe ${recipeId} must define at least one requirement group.`);
    }

    return rawGroups.map((group, groupIndex) => {
      const requirements = Array.isArray(group?.requirements)
        ? group.requirements
        : [];

      if (!requirements.length) {
        throw new Error(
          `Recipe ${recipeId} requirement group ${groupIndex} has no requirements.`
        );
      }

      return {
        id: String(group.id ?? `group-${groupIndex + 1}`),
        requirements: requirements.map((requirement, requirementIndex) =>
          this.#normalizeRequirement(
            requirement,
            recipeId,
            `${groupIndex}.${requirementIndex}`
          )
        )
      };
    });
  }

  #normalizeRequirement(raw, recipeId, index) {
    const quantity = Math.max(1, Number(raw?.quantity ?? 1));
    const sameMaterial = Boolean(raw?.sameMaterial);

    if (Array.isArray(raw?.alternatives) && raw.alternatives.length) {
      const alternatives = raw.alternatives.map((alternative, altIndex) => {
        if (!alternative?.match) {
          throw new Error(
            `Recipe ${recipeId} requirement ${index} alternative ${altIndex} is missing match.`
          );
        }

        const normalized = {
          quantity: Math.max(1, Number(alternative.quantity ?? quantity)),
          sameMaterial: Boolean(alternative.sameMaterial ?? sameMaterial),
          match: this.#normalizeMatch(alternative.match)
        };

        return {
          ...normalized,
          display: this.#describeMatch(
            normalized.match,
            normalized.quantity,
            normalized.sameMaterial
          )
        };
      });

      return {
        type: "alternatives",
        quantity,
        sameMaterial,
        alternatives,
        display: alternatives.map(a => a.display).join(" OR "),
        searchText: alternatives.flatMap(a => this.#matchSearchText(a.match))
      };
    }

    if (!raw?.match) {
      throw new Error(
        `Recipe ${recipeId} requirement ${index} is missing match or alternatives.`
      );
    }

    const match = this.#normalizeMatch(raw.match);

    return {
      type: "match",
      quantity,
      sameMaterial,
      match,
      alternatives: [],
      display: this.#describeMatch(match, quantity, sameMaterial),
      searchText: this.#matchSearchText(match)
    };
  }

  #normalizeMatch(raw) {
    return {
      materialId: raw.materialId ? String(raw.materialId) : null,
      tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
      rarity: raw.rarity ? String(raw.rarity) : null,
      category: raw.category ? String(raw.category) : null,
      stage: raw.stage ? String(raw.stage) : null,
      itemName: raw.itemName ? String(raw.itemName) : null
    };
  }

  #normalizeOutput(raw, recipeId) {
    const quantity = Math.max(1, Number(raw.quantity ?? 1));

    if (raw.type === "craftworks-material") {
      if (!raw.materialId) {
        throw new Error(`Recipe ${recipeId} Craftworks output is missing materialId.`);
      }

      const material = this.materialRegistry.get(raw.materialId);

      return {
        type: "craftworks-material",
        materialId: String(raw.materialId),
        uuid: null,
        quantity,
        label: material?.name ?? String(raw.materialId),
        img: material?.img ?? ""
      };
    }

    if (raw.type === "catalog-item") {
      if (!raw.label && !raw.name) {
        throw new Error(`Recipe ${recipeId} catalog output is missing a label.`);
      }

      return {
        type: "catalog-item",
        materialId: null,
        uuid: null,
        quantity,
        label: String(raw.label ?? raw.name),
        img: String(raw.img ?? "icons/containers/bags/sack-simple-tan.webp"),
        rarity: raw.rarity ? String(raw.rarity) : null,
        valueGp: Math.max(0, Number(raw.valueGp ?? 0)),
        itemType: String(raw.itemType ?? "loot")
      };
    }

    if (raw.type === "foundry-item") {
      if (!raw.uuid) {
        throw new Error(`Recipe ${recipeId} Foundry Item output is missing uuid.`);
      }

      return {
        type: "foundry-item",
        materialId: null,
        uuid: String(raw.uuid),
        quantity,
        fallbackLabel: raw.label || raw.name
          ? String(raw.label ?? raw.name)
          : null,
        fallbackImg: raw.img ? String(raw.img) : null,
        label: String(raw.label ?? raw.name ?? "Foundry Item"),
        img: String(raw.img ?? ""),
        sourceBook: raw.sourceBook ? String(raw.sourceBook) : null,
        sourcePackId: raw.sourcePackId ? String(raw.sourcePackId) : null
      };
    }

    throw new Error(`Recipe ${recipeId} has unsupported output type: ${raw.type}`);
  }

  #describeMatch(match, quantity, sameMaterial) {
    let label;

    if (match.materialId) {
      label = this.materialRegistry.get(match.materialId)?.name ?? match.materialId;
    } else if (match.itemName) {
      label = match.itemName;
    } else {
      const parts = [];
      if (match.rarity) parts.push(match.rarity);
      if (match.category) parts.push(match.category);
      if (match.stage) parts.push(match.stage);
      if (match.tags?.length) parts.push(match.tags.join(" + "));
      label = parts.join(" ") || "matching material";
    }

    const same = sameMaterial && quantity > 1 ? " of the same material" : "";
    return `${quantity} × ${label}${same}`;
  }

  #matchSearchText(match) {
    const material = match.materialId
      ? this.materialRegistry.get(match.materialId)
      : null;

    return [
      match.materialId,
      material?.name,
      match.itemName,
      match.rarity,
      match.category,
      match.stage,
      ...(match.tags ?? [])
    ].filter(Boolean);
  }
}
