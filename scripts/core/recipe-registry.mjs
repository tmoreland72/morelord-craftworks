import { STANDARD_RECIPE_SEED } from "../../data/standard-recipes.seed.mjs";

export class RecipeRegistry {
  constructor({ materialRegistry }) {
    this.materialRegistry = materialRegistry;
    this._recipes = new Map();
  }

  async loadStandardSeed() {
    if (!Array.isArray(STANDARD_RECIPE_SEED)) {
      throw new Error("Packaged Standard recipe seed is not an array.");
    }

    this._recipes.clear();

    for (const raw of STANDARD_RECIPE_SEED) {
      const recipe = this.#normalizeRecipe(raw);
      this._recipes.set(recipe.id, recipe);
    }

    console.log(`Morelord Craftworks | Indexed ${this._recipes.size} recipe definitions.`);
    return this._recipes.size;
  }

  get(id) {
    return this._recipes.get(id) ?? null;
  }

  all() {
    return Array.from(this._recipes.values());
  }

  search(query = "") {
    const needle = String(query ?? "").trim().toLowerCase();
    if (!needle) return this.all();

    return this.all().filter(recipe => {
      const haystack = [
        recipe.id,
        recipe.name,
        recipe.category,
        recipe.kind,
        recipe.description,
        recipe.output?.label,
        ...(recipe.tags ?? []),
        ...recipe.requirements.flatMap(requirement => requirement.searchText ?? [])
      ].filter(Boolean).join(" ").toLowerCase();

      return haystack.includes(needle);
    });
  }

  recipesUsingMaterial(materialId) {
    return this.all().filter(recipe =>
      recipe.requirements.some(requirement => this.#requirementUsesMaterial(requirement, materialId))
    );
  }

  recipesProducingMaterial(materialId) {
    return this.all().filter(recipe =>
      recipe.output?.type === "craftworks-material"
      && recipe.output?.materialId === materialId
    );
  }

  #requirementUsesMaterial(requirement, materialId) {
    if (requirement.match?.materialId === materialId) return true;
    return (requirement.alternatives ?? []).some(alternative =>
      alternative.match?.materialId === materialId
    );
  }

  #normalizeRecipe(raw) {
    if (!raw?.id) throw new Error("Recipe definition is missing an id.");
    if (!raw?.name) throw new Error(`Recipe ${raw.id} is missing a name.`);
    if (!raw?.output?.type) throw new Error(`Recipe ${raw.id} is missing output.type.`);

    return {
      schemaVersion: Number(raw.schemaVersion ?? 1),
      id: String(raw.id),
      name: String(raw.name),
      description: String(raw.description ?? ""),
      category: String(raw.category ?? "general"),
      kind: String(raw.kind ?? "crafting"),
      tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
      source: raw.source ?? null,
      requirements: (raw.requirements ?? []).map((requirement, index) =>
        this.#normalizeRequirement(requirement, raw.id, index)
      ),
      output: this.#normalizeOutput(raw.output, raw.id)
    };
  }

  #normalizeRequirement(raw, recipeId, index) {
    const quantity = Math.max(1, Number(raw?.quantity ?? 1));
    const sameMaterial = Boolean(raw?.sameMaterial);

    if (Array.isArray(raw?.alternatives) && raw.alternatives.length) {
      const alternatives = raw.alternatives.map((alternative, altIndex) => {
        if (!alternative?.match) {
          throw new Error(`Recipe ${recipeId} requirement ${index} alternative ${altIndex} is missing match.`);
        }

        const normalized = {
          quantity: Math.max(1, Number(alternative.quantity ?? quantity)),
          sameMaterial: Boolean(alternative.sameMaterial ?? sameMaterial),
          match: this.#normalizeMatch(alternative.match)
        };

        return {
          ...normalized,
          display: this.#describeMatch(normalized.match, normalized.quantity, normalized.sameMaterial)
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
      throw new Error(`Recipe ${recipeId} requirement ${index} is missing match or alternatives.`);
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
      stage: raw.stage ? String(raw.stage) : null
    };
  }

  #normalizeOutput(raw, recipeId) {
    const quantity = Math.max(1, Number(raw.quantity ?? 1));

    if (raw.type === "craftworks-material") {
      if (!raw.materialId) throw new Error(`Recipe ${recipeId} Craftworks output is missing materialId.`);
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

    if (raw.type === "foundry-item") {
      if (!raw.uuid) throw new Error(`Recipe ${recipeId} Foundry Item output is missing uuid.`);

      return {
        type: "foundry-item",
        materialId: null,
        uuid: String(raw.uuid),
        quantity,
        label: String(raw.label ?? raw.name ?? "Foundry Item"),
        img: String(raw.img ?? "")
      };
    }

    throw new Error(`Recipe ${recipeId} has unsupported output type: ${raw.type}`);
  }

  #describeMatch(match, quantity, sameMaterial) {
    let label;

    if (match.materialId) {
      label = this.materialRegistry.get(match.materialId)?.name ?? match.materialId;
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
    const material = match.materialId ? this.materialRegistry.get(match.materialId) : null;

    return [
      match.materialId,
      material?.name,
      match.rarity,
      match.category,
      match.stage,
      ...(match.tags ?? [])
    ].filter(Boolean);
  }
}
