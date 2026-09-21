import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { researchRecipeMatches } from "../scripts/recipes/recipe-filters.mjs";
import { MONSTERS_OF_DRAKKENHEIM_RECIPES } from "../data/monsters-of-drakkenheim-recipes.mjs";
import { MM_RECIPES } from "../data/packs/mm/recipes.mjs";

test("Organ (Very Rare) researches all four recipe-browser family/rarity matches", async () => {
  const entries = JSON.parse(await readFile(new URL('../data/drakkenheim-materials.seed.json', import.meta.url), 'utf8'));
  const materials = { all: () => entries, get: id => entries.find(entry => entry.materialId === id) };
  const organ = materials.get('drakkenheim-very-rare-organ');
  const matches = [...MONSTERS_OF_DRAKKENHEIM_RECIPES, ...MM_RECIPES].filter(recipe => researchRecipeMatches(recipe, organ, materials));
  assert.deepEqual(matches.map(recipe => recipe.name).sort(), [
    'Crimson Blade', 'Inexhaustible Armor', 'Potion of Supreme Healing', 'Rejuvenation Potion'
  ]);
  assert.equal(researchRecipeMatches(matches[0], { ...organ, rarity: 'common' }, materials), false);
});
