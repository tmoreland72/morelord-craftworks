/**
 * Monster Manual harvesting profiles.
 *
 * The Monster Manual supplies the creatures. Kibbles' Compendium of Crafting
 * supplies the harvesting categories and material progression.
 *
 * Craftworks currently presents several weighted claim choices after a
 * successful harvest check, so the Kibbles d100 result bands are represented
 * here as weighted material pools with the same creature-type/CR progression.
 */

const BASIC_ORGANIC = [
  { materialId: "hide", minCR: 0, weight: 30 },
  { materialId: "hide-scraps", minCR: 0, weight: 24 },
  { materialId: "rawhide-leather", minCR: 0, weight: 18 }
];

const DRAGON_MONSTROSITY_GIANT = [
  ...BASIC_ORGANIC,
  { materialId: "common-reactive-reagent", minCR: 0, weight: 24 },
  { materialId: "common-poisonous-reagent", minCR: 0, weight: 16 },
  { materialId: "common-curative-reagent", minCR: 0, weight: 14 },
  { materialId: "common-primal-essence", minCR: 0, weight: 14 },

  { materialId: "uncommon-reactive-reagent", minCR: 5, weight: 20 },
  { materialId: "uncommon-poisonous-reagent", minCR: 5, weight: 14 },
  { materialId: "uncommon-curative-reagent", minCR: 5, weight: 14 },
  { materialId: "uncommon-primal-essence", minCR: 5, weight: 14 },

  { materialId: "rare-reactive-reagent", minCR: 11, weight: 12 },
  { materialId: "rare-poisonous-reagent", minCR: 11, weight: 10 },
  { materialId: "rare-primal-essence", minCR: 11, weight: 10 },

  { materialId: "very-rare-primal-essence", minCR: 17, weight: 6 }
];

const CONSTRUCT = [
  { materialId: "parts", minCR: 0, weight: 28 },
  { materialId: "fancy-parts", minCR: 0, weight: 18 },
  { materialId: "common-reactive-reagent", minCR: 0, weight: 18 },
  { materialId: "common-arcane-essence", minCR: 0, weight: 12 },

  { materialId: "uncommon-reactive-reagent", minCR: 5, weight: 16 },
  { materialId: "uncommon-arcane-essence", minCR: 5, weight: 14 },

  { materialId: "esoteric-parts", minCR: 11, weight: 14 },
  { materialId: "rare-reactive-reagent", minCR: 11, weight: 10 },
  { materialId: "rare-arcane-essence", minCR: 11, weight: 10 },

  { materialId: "very-rare-arcane-essence", minCR: 17, weight: 6 }
];

const ABERRATION = [
  { materialId: "common-reactive-reagent", minCR: 0, weight: 20 },
  { materialId: "common-poisonous-reagent", minCR: 0, weight: 18 },
  { materialId: "common-psionic-essence", minCR: 0, weight: 16 },
  { materialId: "common-arcane-essence", minCR: 0, weight: 12 },

  { materialId: "uncommon-reactive-reagent", minCR: 5, weight: 16 },
  { materialId: "uncommon-poisonous-reagent", minCR: 5, weight: 14 },
  { materialId: "uncommon-psionic-essence", minCR: 5, weight: 14 },
  { materialId: "uncommon-arcane-essence", minCR: 5, weight: 12 },

  { materialId: "rare-reactive-reagent", minCR: 11, weight: 10 },
  { materialId: "rare-poisonous-reagent", minCR: 11, weight: 10 },
  { materialId: "rare-psionic-essence", minCR: 11, weight: 10 },
  { materialId: "rare-arcane-essence", minCR: 11, weight: 8 },

  { materialId: "very-rare-psionic-essence", minCR: 17, weight: 6 }
];

const PLANT = [
  { materialId: "common-curative-reagent", minCR: 0, weight: 24 },
  { materialId: "common-poisonous-reagent", minCR: 0, weight: 20 },
  { materialId: "common-reactive-reagent", minCR: 0, weight: 14 },
  { materialId: "common-primal-essence", minCR: 0, weight: 14 },

  { materialId: "uncommon-curative-reagent", minCR: 5, weight: 18 },
  { materialId: "uncommon-poisonous-reagent", minCR: 5, weight: 16 },
  { materialId: "uncommon-reactive-reagent", minCR: 5, weight: 12 },
  { materialId: "uncommon-primal-essence", minCR: 5, weight: 14 },

  { materialId: "rare-poisonous-reagent", minCR: 11, weight: 10 },
  { materialId: "rare-primal-essence", minCR: 11, weight: 10 },

  { materialId: "very-rare-primal-essence", minCR: 17, weight: 6 }
];

const UNDEAD = [
  { materialId: "common-poisonous-reagent", minCR: 0, weight: 18 },
  { materialId: "common-arcane-essence", minCR: 0, weight: 16 },
  { materialId: "common-divine-essence", minCR: 0, weight: 10 },

  { materialId: "uncommon-poisonous-reagent", minCR: 5, weight: 14 },
  { materialId: "uncommon-arcane-essence", minCR: 5, weight: 14 },
  { materialId: "uncommon-divine-essence", minCR: 5, weight: 10 },

  { materialId: "rare-poisonous-reagent", minCR: 11, weight: 10 },
  { materialId: "rare-arcane-essence", minCR: 11, weight: 10 },
  { materialId: "rare-divine-essence", minCR: 11, weight: 8 },

  { materialId: "very-rare-arcane-essence", minCR: 17, weight: 5 }
];

const CELESTIAL_REMNANTS = [
  { materialId: "common-curative-reagent", minCR: 0, weight: 18 },
  { materialId: "common-divine-essence", minCR: 0, weight: 14 },
  { materialId: "uncommon-curative-reagent", minCR: 5, weight: 14 },
  { materialId: "uncommon-divine-essence", minCR: 5, weight: 12 },
  { materialId: "rare-divine-essence", minCR: 11, weight: 8 },
  { materialId: "very-rare-divine-essence", minCR: 17, weight: 5 }
];

const FIEND_REMNANTS = [
  { materialId: "common-reactive-reagent", minCR: 0, weight: 18 },
  { materialId: "common-divine-essence", minCR: 0, weight: 10 },
  { materialId: "uncommon-reactive-reagent", minCR: 5, weight: 14 },
  { materialId: "uncommon-divine-essence", minCR: 5, weight: 10 },
  { materialId: "rare-reactive-reagent", minCR: 11, weight: 8 },
  { materialId: "rare-divine-essence", minCR: 11, weight: 8 },
  { materialId: "very-rare-divine-essence", minCR: 17, weight: 5 }
];

const FEY_ELEMENTAL_REMNANTS = [
  { materialId: "common-reactive-reagent", minCR: 0, weight: 18 },
  { materialId: "common-primal-essence", minCR: 0, weight: 14 },
  { materialId: "uncommon-reactive-reagent", minCR: 5, weight: 14 },
  { materialId: "uncommon-primal-essence", minCR: 5, weight: 12 },
  { materialId: "rare-primal-essence", minCR: 11, weight: 8 },
  { materialId: "very-rare-primal-essence", minCR: 17, weight: 5 }
];

export const MM_HARVEST_PROFILES = [
  {
    packId: "mm",
    id: "mm-beasts",
    creatureTypes: ["beast"],
    results: BASIC_ORGANIC
  },
  {
    packId: "mm",
    id: "mm-dragons-giants-monstrosities",
    creatureTypes: ["dragon", "giant", "monstrosity"],
    results: DRAGON_MONSTROSITY_GIANT
  },
  {
    packId: "mm",
    id: "mm-constructs",
    creatureTypes: ["construct"],
    results: CONSTRUCT
  },
  {
    packId: "mm",
    id: "mm-aberrations",
    creatureTypes: ["aberration"],
    results: ABERRATION
  },
  {
    packId: "mm",
    id: "mm-plants",
    creatureTypes: ["plant"],
    results: PLANT
  },
  {
    packId: "mm",
    id: "mm-undead",
    creatureTypes: ["undead"],
    results: UNDEAD
  },
  {
    packId: "mm",
    id: "mm-celestials",
    creatureTypes: ["celestial"],
    results: CELESTIAL_REMNANTS
  },
  {
    packId: "mm",
    id: "mm-fiends",
    creatureTypes: ["fiend"],
    results: FIEND_REMNANTS
  },
  {
    packId: "mm",
    id: "mm-fey-elementals",
    creatureTypes: ["fey", "elemental"],
    results: FEY_ELEMENTAL_REMNANTS
  }
];
