import { materialTagsSatisfy } from "../materials/material-match-utils.mjs";

export function recipeMatchesFilters(recipe, { rarities = [], ingredientTags = [] } = {}, materials) {
  return (!rarities.length || rarities.includes(recipeRarity(recipe)))
    && (!ingredientTags.length || recipeHasDistinctIngredientTags(recipe, ingredientTags, materials));
}

/** Research uses the same rarity and family facets as the Recipes browser. */
export function researchRecipeMatches(recipe, component, materials) {
  const rarity = normalizeRarity(component?.rarity);
  const families = (component?.tags ?? []).filter(tag => tag.startsWith("drakkenheim-family-"));
  return Boolean(rarity && families.length
    && recipeMatchesFilters(recipe, { rarities: [rarity], ingredientTags: families }, materials));
}

export function recipeRarity(recipe) {
    const direct =
      recipe?.rarity
      ?? recipe?.output?.rarity
      ?? null;

    const normalizedDirect =
      normalizeRarity(
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
        normalizeRarity(
          tag
        );

      if (normalizedTag) {
        return normalizedTag;
      }
    }

    return null;
  }

export function normalizeRarity(value) {
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

export function recipeHasDistinctIngredientTags(recipe, selectedTags, materials) {
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
          for (const material of materialsMatchingIngredient(match, materials)) {
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

export function materialsMatchingIngredient(match, materials) {
    if (!match) return [];

    if (match.materialId) {
      const material = materials.get(match.materialId);
      return material ? [material] : [];
    }

    const itemName = String(match.itemName ?? "").trim().toLowerCase();
    const requiredTags = (match.tags ?? [])
      .map(tag => String(tag).toLowerCase());

    return materials.all().filter(material => {
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
