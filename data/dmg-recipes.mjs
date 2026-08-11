import { KIBBLES_RECIPE_SEED } from "./kibbles-recipes.seed.mjs";

/**
 * Dungeon Master's Guide recipe candidates.
 *
 * Kibbles remains authoritative for tool, ability, DC, crafting time,
 * value, and material requirements.
 *
 * RecipeRegistry resolves each candidate against the exact 2024
 * Dungeon Master's Guide Equipment compendium at runtime. Candidates
 * whose finished output is not present there are excluded from the DMG pack.
 */
export const DMG_RECIPES = KIBBLES_RECIPE_SEED
  .filter(recipe => recipe?.output?.type === "catalog-item")
  .map(recipe => ({
    ...recipe,
    packId: "dmg",
    id: `dmg-${recipe.id}`
  }));
