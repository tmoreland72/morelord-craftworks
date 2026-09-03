const PACK_ID = "monsters-of-drakkenheim";
const SOURCE = Object.freeze({
  title: "Monsters of Drakkenheim",
  section: "Appendix E: SRD Recipes",
  craftingTime: "1 day",
  checks: "None",
  difficulty: "No crafting check"
});

const PREMIUM_AND_SRD_52 = Object.freeze([
  { packId: "phb", sourceBook: "Player's Handbook" },
  { packId: "dmg", sourceBook: "Dungeon Master's Guide" },
  { packId: "srd-5.2", sourceBook: "SRD 5.2" }
]);

const POTION_SOURCES = Object.freeze([
  ...PREMIUM_AND_SRD_52,
  { packId: "srd-5.1", sourceBook: "SRD 5.1" }
]);

function component(type, rarity) {
  return {
    quantity: 1,
    sameMaterial: false,
    match: {
      tags: [`drakkenheim-component-${type}`],
      rarity
    }
  };
}

function recipe({
  id,
  name,
  rarity,
  materialsText,
  components,
  outputLabel = name,
  sourceCandidates = PREMIUM_AND_SRD_52
}) {
  return {
    schemaVersion: 1,
    packId: PACK_ID,
    id: `drakkenheim-srd-${id}`,
    name,
    description: "",
    category: "drakkenheim",
    kind: "crafting",
    tags: ["drakkenheim", "srd-recipe", rarity.toLowerCase().replace(/\s+/g, "-")],
    source: {
      ...SOURCE,
      materialsText
    },
    craft: {
      tool: null,
      ability: null,
      skill: null,
      dc: null,
      noToolDc: null,
      hoursRequired: 8,
      checkRequired: false
    },
    requirementGroups: [{
      id: "default",
      requirements: components.map(type => component(type, rarity))
    }],
    output: {
      type: "catalog-item",
      quantity: 1,
      label: outputLabel,
      img: "icons/containers/bags/sack-simple-tan.webp",
      rarity,
      valueGp: 0,
      itemType: "loot",
      sourceCandidates
    }
  };
}

const distinctMonsterText = " Each component must come from a different monster.";

const ARMOR_RECIPES = [
  ["1", "rare", ["animus", "bones", "bones-skull", "hide", "hair"], "Any Rare Animus; any Rare Bones, any Rare Skull [Bones], any Rare Hide, and any Rare Hair."],
  ["2", "Very Rare", ["animus", "bones", "natural-weapon", "hide", "hair"], "Any Very Rare Animus; any Very Rare Bones, any Very Rare Natural Weapon, any Very Rare Hide, and any Very Rare Hair."],
  ["3", "legendary", ["animus", "bones", "natural-weapon", "hide", "hair"], "Any Legendary Animus; any Legendary Bones, any Legendary Natural Weapon, any Legendary Hide, and any Legendary Hair."]
].map(([bonus, rarity, components, materialsText]) => recipe({
  id: `armor-${bonus}`,
  name: `Armor +${bonus}`,
  rarity,
  materialsText: `${materialsText}${distinctMonsterText}`,
  components,
  outputLabel: "Armor, +1, +2, or +3",
  sourceCandidates: PREMIUM_AND_SRD_52.map(candidate => ({
    ...candidate,
    name: "Armor, +1, +2, or +3"
  }))
}));

const HEALING_RECIPES = [
  ["healing", "Potion of Healing", "common"],
  ["greater-healing", "Potion of Greater Healing", "uncommon"],
  ["superior-healing", "Potion of Superior Healing", "rare"],
  ["supreme-healing", "Potion of Supreme Healing", "Very Rare"]
].map(([id, name, rarity]) => recipe({
  id: `potion-of-${id}`,
  name,
  rarity,
  materialsText: `Any ${rarity} Animus, any ${rarity} Fluid, and any ${rarity} Organ.`,
  components: ["animus", "fluid", "organ"],
  sourceCandidates: POTION_SOURCES
}));

const POTION_OF_RESISTANCE = recipe({
  id: "potion-of-resistance",
  name: "Potion of Resistance",
  rarity: "uncommon",
  materialsText: "Any Uncommon Animus, any Uncommon Elemental Fluid, any Uncommon Dust, and any Uncommon Organ.",
  components: ["animus", "fluid-elemental", "dust", "organ"],
  sourceCandidates: PREMIUM_AND_SRD_52
});

const SHIELD_RECIPES = [
  ["1", "uncommon"],
  ["2", "rare"],
  ["3", "Very Rare"]
].map(([bonus, rarity]) => recipe({
  id: `shield-${bonus}`,
  name: `Shield +${bonus}`,
  rarity,
  materialsText: `Any ${rarity} Animus; any ${rarity} Bones, any ${rarity} Natural Weapon, and any ${rarity} Hide.${distinctMonsterText}`,
  components: ["animus", "bones", "natural-weapon", "hide"],
  outputLabel: "Shield, +1, +2, or +3",
  sourceCandidates: PREMIUM_AND_SRD_52.map(candidate => ({
    ...candidate,
    name: "Shield, +1, +2, or +3"
  }))
}));

const SCROLL_RECIPES = [
  ["cantrip-1", "Cantrip or 1st Level", "common"],
  ["2-3", "2nd or 3rd Level", "uncommon"],
  ["4-5", "4th or 5th Level", "rare"],
  ["6-8", "6th, 7th, or 8th Level", "Very Rare"],
  ["9", "9th Level", "legendary"]
].map(([id, tier, rarity]) => recipe({
  id: `spell-scroll-${id}`,
  name: `Spell Scroll (${tier})`,
  rarity,
  materialsText: `Any ${rarity} Animus, any ${rarity} Fluid, and any ${rarity} Hide.`,
  components: ["animus", "fluid", "hide"],
  outputLabel: "Spell Scroll",
  sourceCandidates: PREMIUM_AND_SRD_52.map(candidate => ({
    ...candidate,
    name: "Spell Scroll"
  }))
}));

const WEAPON_RECIPES = [
  ["1", "uncommon"],
  ["2", "rare"],
  ["3", "Very Rare"]
].map(([bonus, rarity]) => recipe({
  id: `weapon-${bonus}`,
  name: `Weapon +${bonus}`,
  rarity,
  materialsText: `Any ${rarity} Animus; any ${rarity} Bones, any ${rarity} Natural Weapon, and any ${rarity} Hide.${distinctMonsterText}`,
  components: ["animus", "bones", "natural-weapon", "hide"],
  outputLabel: "Weapon, +1, +2, or +3",
  sourceCandidates: PREMIUM_AND_SRD_52.map(candidate => ({
    ...candidate,
    name: "Weapon, +1, +2, or +3"
  }))
}));

export const MM_RECIPES = [
  ...ARMOR_RECIPES,
  ...HEALING_RECIPES,
  POTION_OF_RESISTANCE,
  ...SHIELD_RECIPES,
  ...SCROLL_RECIPES,
  ...WEAPON_RECIPES
];
