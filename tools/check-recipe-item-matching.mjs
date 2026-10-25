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
import { Dnd5eCompendiumItemResolver } from "../scripts/recipes/dnd5e-compendium-item-resolver.mjs";
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
assert.equal(equipmentTypeMatches({ type: "equipment", system: { type: { value: "light" } } }, "Armor"), true);
assert.equal(equipmentTypeMatches({ type: "equipment", system: { type: { value: "medium" } } }, "Armor"), true);
assert.equal(equipmentTypeMatches({ type: "equipment", system: { type: { value: "heavy" } } }, "Armor"), true);
assert.equal(equipmentTypeMatches({ type: "equipment", system: { type: { value: "shield" } } }, "Armor"), false);

const crossSourceResolver = new Dnd5eCompendiumItemResolver();
crossSourceResolver._bySourceBook.set("Player's Handbook", new Map());
crossSourceResolver._bySourceBook.set("SRD 5.2", new Map([
  [crossSourceResolver.normalizeName("Battleaxe"), {
    name: "Battleaxe",
    img: "icons/weapons/axes/axe-battle-black.webp",
    packId: "dnd5e.equipment24",
    sourceBook: "SRD 5.2"
  }]
]));
assert.equal(
  (await crossSourceResolver.resolveAny("Battleaxe", {
    preferredSourceBook: "Player's Handbook"
  }))?.img,
  "icons/weapons/axes/axe-battle-black.webp"
);
const playingCardCandidates = crossSourceResolver.candidateNames("Playing Card Set");
assert.equal(playingCardCandidates[0], "Playing Card Set");
for (const candidate of [
  "Playing Cards",
  "Playing Cards Set",
  "Gaming Set (Playing Cards)"
]) {
  assert.ok(playingCardCandidates.includes(candidate), candidate);
}
assert.ok(crossSourceResolver.candidateNames("Hat/Cap").includes("Hat"));
assert.ok(crossSourceResolver.candidateNames("Hat/Cap").includes("Cap"));
assert.ok(crossSourceResolver.candidateNames("Injector Crossbow").includes("Injector's Crossbow"));
assert.ok(crossSourceResolver.candidateNames("Figurine of Wondrous Power (Ivory Goats)").includes("Figurine of Wondrous Power"));
assert.ok(crossSourceResolver.candidateNames("Rod of the Pact Keeper +3").includes("Rod of the Pact Keeper"));
assert.ok(crossSourceResolver.candidateNames("10 x Dart").includes("Dart"));
assert.equal(
  crossSourceResolver.normalizeName("10 x Dart"),
  crossSourceResolver.normalizeName("Dart")
);
assert.ok(crossSourceResolver.candidateNames("2nd-Level Spell").includes("Spell Scroll, 2nd Level"));
assert.ok(crossSourceResolver.candidateNames("Splint").includes("Splint Armor"));
assert.ok(crossSourceResolver.candidateNames("Glass Vial").includes("Vial"));
assert.ok(crossSourceResolver.candidateNames("Blacksmith’s Tools").includes("Smith's Tools"));
assert.ok(crossSourceResolver.candidateNames("10 x Arrow").includes("Arrows"));

const linkedNames = new Map([
  ["Dart", "Dart"],
  ["Arrows", "Arrows"],
  ["Hat", "Hat"],
  ["Splint Armor", "Splint Armor"],
  ["Vial", "Vial"],
  ["Smith's Tools", "Smith's Tools"],
  ["Spell Scroll, 2nd Level", "Spell Scroll, 2nd Level"],
  ["Robe of the Archmagi", "Robe of the Archmagi"],
  ["Dimensional Shackles", "Dimensional Shackles"],
  ["Stone of Good Luck (Luckstone)", "Stone of Good Luck (Luckstone)"],
  ["Flame Tongue", "Flame Tongue"],
  ["Boots of the Winterlands", "Boots of the Winterlands"],
  ["Helm of Comprehending Languages", "Helm of Comprehending Languages"],
  ["Cape of the Mountebank", "Cape of the Mountebank"],
  ["Chain", "Chain"],
  ["Piton", "Piton"],
  ["Spikes, Iron", "Spikes, Iron"],
  ["Exotic Saddle", "Exotic Saddle"],
  ["Calligrapher's Supplies", "Calligrapher's Supplies"],
  ["Ioun Stone of Protection", "Ioun Stone of Protection"],
  ["Brass Horn of Valhalla", "Brass Horn of Valhalla"],
  ["Iron Flask", "Iron Flask"],
  ["Robe of Useful Items", "Robe of Useful Items"],
  ["Figurine of Wondrous Power", "Figurine of Wondrous Power"],
  ["Rod of the Pact Keeper", "Rod of the Pact Keeper"],
  ["Weapon, +1, +2, or +3", "Weapon, +1, +2, or +3"],
  ["Ammunition, +1, +2, or +3", "Ammunition, +1, +2, or +3"],
  ["Robes", "Robes"]
]);
crossSourceResolver._bySourceBook.set("SRD 5.2", new Map(
  [...linkedNames.values()].map(itemName => [
    crossSourceResolver.normalizeName(itemName),
    { name: itemName, sourceBook: "SRD 5.2", packId: "dnd5e.equipment24" }
  ])
));
for (const [recipeName, itemName] of [
  ["10 x Dart", "Dart"],
  ["Hat/Cap", "Hat"],
  ["Splint", "Splint Armor"],
  ["Glass Vial", "Vial"],
  ["Blacksmith’s Tools", "Smith's Tools"],
  ["2nd-Level Spell", "Spell Scroll, 2nd Level"],
  ["Robe of the Archmage", "Robe of the Archmagi"],
  ["Dimension Shackles", "Dimensional Shackles"],
  ["Luckstone", "Stone of Good Luck (Luckstone)"],
  ["Flametongue Weapon", "Flame Tongue"],
  ["Boots of Winterlands", "Boots of the Winterlands"],
  ["Helm of Comprehending Language", "Helm of Comprehending Languages"],
  ["Cape of Mountebank", "Cape of the Mountebank"],
  ["Chain (5 ft)", "Chain"],
  ["20 x Pitons", "Piton"],
  ["Saddle, Exotic", "Exotic Saddle"],
  ["Calligrapher's Tools", "Calligrapher's Supplies"],
  ["Ioun Stone (Protection)", "Ioun Stone of Protection"],
  ["Horn of Valhalla (Brass)", "Brass Horn of Valhalla"],
  ["Iron Flask (Empty)", "Iron Flask"],
  ["Robe of Useful Items (with all patches)", "Robe of Useful Items"],
  ["Figurine of Wondrous Power (Ivory Goats)", "Figurine of Wondrous Power"],
  ["Rod of the Pact Keeper +3", "Rod of the Pact Keeper"],
  ["+2 Weapon", "Weapon, +1, +2, or +3"],
  ["+1 Ammunition", "Ammunition, +1, +2, or +3"],
  ["Robe", "Robes"],
  ["10 x Arrow", "Arrows"]
]) {
  assert.equal(
    (await crossSourceResolver.resolve(recipeName, { sourceBook: "SRD 5.2" }))?.name,
    itemName,
    recipeName
  );
}
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
assert.ok(structuredScrollRequirements >= 223);
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
const recipeBrowserTemplate = fs.readFileSync("templates/recipe-browser.hbs", "utf8");
assert.equal(
  (recipeBrowserTemplate.match(/ml-craftworks-requirement-quantity/g) ?? []).length,
  2,
  "Recipe browser must show quantities for requirements and alternatives."
);
for (const templatePath of [
  "templates/recipe-browser.hbs",
  "templates/partials/craft-card.hbs"
]) {
  const template = fs.readFileSync(templatePath, "utf8");
  assert.match(
    template,
    /#if output\.showQuantity/,
    `${templatePath} must hide output quantities of one.`
  );
}
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
