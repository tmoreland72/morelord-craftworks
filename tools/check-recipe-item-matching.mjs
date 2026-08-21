import assert from "node:assert/strict";
import {
  recipeItemMatches,
  spellScrollMatches
} from "../scripts/recipes/recipe-item-match-utils.mjs";
import { KIBBLES_RECIPE_SEED } from "../data/kibbles-recipes.seed.mjs";

const nativeScroll = {
  name: "Spell Scroll: Pass without Trace",
  type: "consumable",
  system: { type: { value: "scroll" } },
  flags: {}
};

const generatedScroll = {
  name: "Spell Scroll: Silence",
  type: "consumable",
  system: { type: { value: "scroll" } },
  flags: {
    "morelord-craftworks": {
      spellScrollGenerator: { spellName: "Silence" }
    }
  }
};

assert.equal(recipeItemMatches(nativeScroll, "scroll of pass without a trace"), true);
assert.equal(recipeItemMatches(generatedScroll, "scroll of silence"), true);
assert.equal(spellScrollMatches(nativeScroll, "pass without a trace"), true);
assert.equal(spellScrollMatches(generatedScroll, "silence"), true);
assert.equal(spellScrollMatches(nativeScroll, "silence"), false);
assert.equal(recipeItemMatches(nativeScroll, "scroll of silence"), false);
assert.equal(recipeItemMatches({ name: "Boots", type: "equipment" }, "boots"), true);
assert.equal(
  recipeItemMatches(
    { name: "Spell Scroll: Silence", type: "loot", system: {} },
    "scroll of silence"
  ),
  true
);

let structuredScrollRequirements = 0;
let legacyScrollRequirements = 0;

const visit = value => {
  if (!value || typeof value !== "object") return;
  if (
    value.itemType === "spellScroll"
    && typeof value.spellName === "string"
    && value.spellName.trim()
  ) structuredScrollRequirements += 1;
  if (/^scroll of\s+/i.test(String(value.itemName ?? ""))) {
    legacyScrollRequirements += 1;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(visit);
    else visit(child);
  }
};

visit(KIBBLES_RECIPE_SEED);
assert.equal(structuredScrollRequirements, 250);
assert.equal(legacyScrollRequirements, 0);

console.log("Recipe item matching checks passed.");
