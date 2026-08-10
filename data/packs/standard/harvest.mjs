const ESSENCE_RESULTS = [
  { materialId: "common-primal-essence", minCR: 0, weight: 30 },
  { materialId: "uncommon-primal-essence", minCR: 5, weight: 16 },
  { materialId: "rare-primal-essence", minCR: 11, weight: 8 }
];

const ORGANIC_RESULTS = [
  { materialId: "hide", minCR: 0, weight: 28 },
  { materialId: "hide-scraps", minCR: 0, weight: 24 },
  { materialId: "rawhide-leather", minCR: 0, weight: 14 },
  ...ESSENCE_RESULTS
];

const REACTIVE_RESULTS = [
  { materialId: "common-reactive-reagent", minCR: 0, weight: 28 },
  { materialId: "common-curative-reagent", minCR: 0, weight: 18 },
  ...ESSENCE_RESULTS
];

const TOXIC_RESULTS = [
  { materialId: "common-poisonous-reagent", minCR: 0, weight: 28 },
  { materialId: "common-reactive-reagent", minCR: 0, weight: 20 },
  ...ESSENCE_RESULTS
];

const CONSTRUCT_RESULTS = [
  { materialId: "metal-scraps", minCR: 0, weight: 30 },
  { materialId: "parts", minCR: 0, weight: 24 },
  { materialId: "common-reactive-reagent", minCR: 0, weight: 14 },
  ...ESSENCE_RESULTS
];

const PLANT_RESULTS = [
  { materialId: "common-branch", minCR: 0, weight: 30 },
  { materialId: "quality-branch", minCR: 5, weight: 16 },
  { materialId: "common-curative-reagent", minCR: 0, weight: 18 },
  { materialId: "common-poisonous-reagent", minCR: 0, weight: 12 },
  ...ESSENCE_RESULTS
];

export const STANDARD_HARVEST_PROFILES = [
  {
    packId: "standard-core",
    id: "organic-creatures",
    creatureTypes: ["beast", "giant", "humanoid", "monstrosity"],
    results: ORGANIC_RESULTS
  },
  {
    packId: "standard-core",
    id: "aberrant-creatures",
    creatureTypes: ["aberration", "ooze"],
    results: TOXIC_RESULTS
  },
  {
    packId: "standard-core",
    id: "magical-creatures",
    creatureTypes: ["celestial", "dragon", "elemental", "fey", "fiend"],
    results: REACTIVE_RESULTS
  },
  {
    packId: "standard-core",
    id: "construct-creatures",
    creatureTypes: ["construct"],
    results: CONSTRUCT_RESULTS
  },
  {
    packId: "standard-core",
    id: "plant-creatures",
    creatureTypes: ["plant"],
    results: PLANT_RESULTS
  },
  {
    packId: "standard-core",
    id: "undead-creatures",
    creatureTypes: ["undead"],
    results: TOXIC_RESULTS
  }
];

/**
 * Return a type-specific Harvest profile.
 *
 * Unknown/custom creature types deliberately fall back to a generic magical
 * component pool so a valid successful Harvest check can still produce
 * claimable Standard materials.
 */
