import assert from "node:assert/strict";
import fs from "node:fs";
import {
  equipmentTypeMatches,
  recipeItemMatches,
  spellScrollLevelMatches,
  spellScrollMatches,
  valuedLootMatches,
  weaponTypeMatches
} from "../scripts/recipes/recipe-item-match-utils.mjs";
import { KIBBLES_RECIPE_SEED } from "../data/kibbles-recipes.seed.mjs";
import { SRD_51_RECIPES } from "../data/srd-5.1-recipes.mjs";
import { SRD_52_RECIPES } from "../data/srd-5.2-recipes.mjs";
import { CONTENT_PACKS } from "../data/content-packs.mjs";

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
assert.equal(spellScrollLevelMatches({ ...nativeScroll, system: { ...nativeScroll.system, level: 1 } }, 1), true);
assert.equal(spellScrollMatches(nativeScroll, "silence"), false);
assert.equal(recipeItemMatches(nativeScroll, "scroll of silence"), false);
assert.equal(recipeItemMatches({ name: "Boots", type: "equipment" }, "boots"), true);
assert.equal(equipmentTypeMatches({ type: "equipment", system: { type: { value: "ring" } } }, "Ring"), true);
assert.equal(equipmentTypeMatches({ type: "equipment", system: { type: { value: "armor" } } }, "Ring"), false);
assert.equal(equipmentTypeMatches({ type: "equipment", system: { type: { value: "armor" } } }, "Armor"), true);
assert.equal(weaponTypeMatches({ type: "weapon", system: { type: { value: "simpleM" } } }, "Simple"), true);
assert.equal(weaponTypeMatches({ type: "weapon", system: { type: { value: "simpleR" } } }, "Simple"), true);
assert.equal(weaponTypeMatches({ type: "weapon", system: { type: { value: "martialM" } } }, "Simple"), false);
assert.equal(valuedLootMatches({ type: "loot", system: { type: { value: "gem" }, price: { value: 250, denomination: "gp" } } }, ["Gemstone", "Art Object"], 250), true);
assert.equal(valuedLootMatches({ type: "loot", system: { type: { value: "art" }, price: { value: 249, denomination: "gp" } } }, ["Gemstone", "Art Object"], 250), false);
assert.equal(valuedLootMatches({ type: "equipment", system: { type: { value: "gem" }, price: { value: 500, denomination: "gp" } } }, ["Gemstone"], 250), false);
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
assert.ok(structuredScrollRequirements >= 250);
assert.equal(legacyScrollRequirements, 0);

const deleriumSearchPacks = CONTENT_PACKS
  .filter(pack => pack.capabilities?.includes("delerium-search"))
  .map(pack => pack.id);
assert.deepEqual(deleriumSearchPacks, ["monsters-of-drakkenheim"]);

const forbiddenUnlinkedNames = new Set([
  "ingot",
  "ingots",
  "boots",
  "piece of ammunition",
  "ring",
  "shield",
  "weapon",
  "chain (5 feet)",
  "amulet",
  "set of armor",
  "0.5 ingot",
  "requires magical forge",
  "admantine cube 100 adamantine ingots",
  "bow (short or long)",
  "leather scraps rope (20 ft.)",
  "ingots rope (20 ft.)",
  "rawhide leather rope (60 ft.)",
  "A handful of colorful gems worth 250 gp",
  "or higher 2 very rare arcane essence, or",
  "common supplies",
  "rare supplies",
  "supplies",
  "silver ingot",
  "ore",
  "mithril ore",
  "icesteel ore",
  "darksteel ore",
  "crystal lenses",
  "metal cube of mithril, adamantine, or gold",
  "uncommon meat from a creature with a",
  "swimming speed greater than its walking speed",
  "uncommon or rarer meat from a",
  "creature that is immune to fire damage",
  "unit of lumber",
  "units of lumber"
]);
const standardMaterialIds = new Set(
  JSON.parse(fs.readFileSync("data/standard-materials.seed.json", "utf8"))
    .map(material => material.materialId)
);
const newlyResolvableMaterialIds = [
  "common-supplies",
  "rare-supplies",
  "supplies",
  "silver-ingot",
  "ore",
  "mithril-ore",
  "icesteel-ore",
  "darksteel-ore",
  "crystal-lenses",
  "lumber",
  "mithril-ingot",
  "gold-ingot"
];
for (const materialId of newlyResolvableMaterialIds) {
  assert.ok(standardMaterialIds.has(materialId));
}
for (const recipes of [KIBBLES_RECIPE_SEED, SRD_51_RECIPES, SRD_52_RECIPES]) {
  const itemNames = [];
  const materialIds = [];
  const collect = value => {
    if (!value || typeof value !== "object") return;
    if (typeof value.itemName === "string") itemNames.push(value.itemName);
    if (typeof value.materialId === "string") materialIds.push(value.materialId);
    for (const child of Object.values(value)) Array.isArray(child) ? child.forEach(collect) : collect(child);
  };
  collect(recipes);
  assert.deepEqual(itemNames.filter(name => forbiddenUnlinkedNames.has(name)), []);

  if (recipes !== KIBBLES_RECIPE_SEED) {
    assert.deepEqual(
      [...new Set(materialIds)].filter(materialId => !standardMaterialIds.has(materialId)),
      []
    );
  }

  const armorOfResistance = recipes.find(recipe =>
    recipe.id?.endsWith("enchanting-armor-of-resistance")
  );
  const armorRequirement = armorOfResistance?.requirementGroups
    ?.flatMap(group => group.requirements ?? [])
    .find(requirement => requirement.match?.equipmentType === "armor");
  assert.ok(armorRequirement);
}

const malformedSpellNames = [];
const collectSpellNames = value => {
  if (!value || typeof value !== "object") return;
  if (value.itemType === "spellScroll") {
    const name = String(value.spellName ?? "");
    if (/K$/.test(name) || /,\s*or$/i.test(name)) malformedSpellNames.push(name);
  }
  for (const child of Object.values(value)) Array.isArray(child) ? child.forEach(collectSpellNames) : collectSpellNames(child);
};
for (const recipes of [KIBBLES_RECIPE_SEED, SRD_51_RECIPES, SRD_52_RECIPES]) collectSpellNames(recipes);
assert.deepEqual(malformedSpellNames, []);

console.log("Recipe item matching checks passed.");
