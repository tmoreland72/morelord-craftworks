import { KIBBLES_RECIPE_SEED } from "./kibbles-recipes.seed.mjs";

/**
 * Player's Handbook recipe candidates.
 *
 * Kibbles remains authoritative for tool, ability, DC, crafting time,
 * value, and material requirements.
 *
 * RecipeRegistry resolves each candidate against the exact 2024
 * Player's Handbook Equipment compendium at runtime. Candidates whose
 * finished output is not present there are excluded from the PHB pack.
 */
export const PHB_RECIPES = KIBBLES_RECIPE_SEED
  .filter(recipe => recipe?.output?.type === "catalog-item")
  .map(recipe => ({
    ...recipe,
    packId: "phb",
    id: `phb-${recipe.id}`
  }));
