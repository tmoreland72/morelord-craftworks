// Kibbles' Crafting 1.0.7, Harvesting tables. Rows are cumulative d100
// ceilings. Results are intentionally data-only so HarvestService can share
// one corpse result with every participant without rerolling per player.
const result = (materialId, quantity = "1") => ({ materialId, quantity });
const row = (max, results) => ({ max, results });

export const KIBBLES_EXOTIC_COLUMNS = Object.freeze({
  dragon: "dragonMonstrosity",
  giant: "dragonMonstrosity",
  monstrosity: "dragonMonstrosity",
  construct: "construct",
  aberration: "aberration",
  undead: "undead",
  plant: "plant"
});

export const KIBBLES_REMNANT_COLUMNS = Object.freeze({
  celestial: "celestial",
  fiend: "fiend",
  elemental: "elemental",
  undead: "incorporealUndead"
});

export const KIBBLES_EXOTIC_TABLES = [
  {
    minCR: 0, maxCR: 4, dc: 8,
    rows: [
      row(20, { construct: result("parts") }),
      row(50, { dragonMonstrosity: result("common-poisonous-reagent"), construct: result("fancy-parts"), aberration: result("common-reactive-reagent"), plant: result("common-poisonous-reagent") }),
      row(70, { dragonMonstrosity: result("common-reactive-reagent"), construct: result("fancy-parts"), aberration: result("common-curative-reagent"), plant: result("common-curative-reagent") }),
      row(80, { dragonMonstrosity: result("common-curative-reagent"), construct: result("fancy-parts"), aberration: result("common-poisonous-reagent"), plant: result("common-reactive-reagent") }),
      row(100, { dragonMonstrosity: result("common-primal-essence"), construct: result("common-arcane-essence"), aberration: result("common-psionic-essence"), undead: result("common-arcane-essence"), plant: result("common-primal-essence") })
    ]
  },
  {
    minCR: 5, maxCR: 10, dc: 10,
    rows: [
      row(30, { dragonMonstrosity: result("uncommon-reactive-reagent"), construct: result("fancy-parts"), aberration: result("common-reactive-reagent"), undead: result("common-arcane-essence"), plant: result("common-poisonous-reagent") }),
      row(60, { dragonMonstrosity: result("uncommon-poisonous-reagent"), construct: result("fancy-parts", "1d4"), aberration: result("uncommon-reactive-reagent"), undead: result("common-poisonous-reagent", "1d4"), plant: result("uncommon-poisonous-reagent") }),
      row(80, { dragonMonstrosity: result("uncommon-reactive-reagent", "1d4"), construct: result("fancy-parts", "1d6"), aberration: result("uncommon-curative-reagent"), undead: result("uncommon-poisonous-reagent", "1d4"), plant: result("uncommon-curative-reagent", "1d4") }),
      row(90, { dragonMonstrosity: result("uncommon-primal-essence"), construct: result("uncommon-arcane-essence"), aberration: result("uncommon-arcane-essence"), undead: result("uncommon-divine-essence"), plant: result("uncommon-primal-essence") }),
      row(100, { dragonMonstrosity: result("uncommon-primal-essence"), construct: result("uncommon-arcane-essence"), aberration: result("uncommon-psionic-essence"), undead: result("uncommon-arcane-essence"), plant: result("uncommon-primal-essence") })
    ]
  },
  {
    minCR: 11, maxCR: 16, dc: 12,
    rows: [
      row(30, { dragonMonstrosity: result("uncommon-reactive-reagent"), construct: result("esoteric-parts"), aberration: result("uncommon-reactive-reagent"), undead: result("uncommon-poisonous-reagent"), plant: result("uncommon-poisonous-reagent") }),
      row(60, { dragonMonstrosity: result("uncommon-primal-essence"), construct: result("esoteric-parts", "1d4"), aberration: result("uncommon-psionic-essence"), undead: result("uncommon-arcane-essence"), plant: result("uncommon-primal-essence") }),
      row(70, { dragonMonstrosity: result("rare-reactive-reagent"), construct: result("uncommon-arcane-essence"), aberration: result("rare-reactive-reagent"), undead: result("rare-poisonous-reagent"), plant: result("rare-curative-reagent") }),
      row(80, { dragonMonstrosity: result("rare-poisonous-reagent"), construct: result("uncommon-arcane-essence"), aberration: result("rare-poisonous-reagent"), undead: result("uncommon-arcane-essence"), plant: result("rare-poisonous-reagent") }),
      row(90, { dragonMonstrosity: result("rare-primal-essence"), construct: result("rare-arcane-essence"), aberration: result("rare-arcane-essence"), undead: result("rare-divine-essence"), plant: result("rare-primal-essence") }),
      row(99, { dragonMonstrosity: result("rare-primal-essence"), construct: result("rare-arcane-essence"), aberration: result("rare-psionic-essence"), undead: result("rare-arcane-essence"), plant: result("rare-primal-essence") }),
      row(100, { dragonMonstrosity: result("very-rare-primal-essence"), construct: result("very-rare-arcane-essence"), aberration: result("very-rare-psionic-essence"), undead: result("very-rare-arcane-essence"), plant: result("very-rare-primal-essence") })
    ]
  },
  {
    minCR: 17, maxCR: Infinity, dc: 15,
    rows: [
      row(30, { dragonMonstrosity: result("rare-reactive-reagent", "1d4"), construct: result("esoteric-parts", "1d4"), aberration: result("rare-reactive-reagent", "1d4"), undead: result("rare-poisonous-reagent", "1d4"), plant: result("rare-poisonous-reagent", "1d4") }),
      row(50, { dragonMonstrosity: result("rare-primal-essence"), construct: result("rare-arcane-essence"), aberration: result("rare-psionic-essence"), undead: result("rare-arcane-essence"), plant: result("rare-primal-essence") }),
      row(89, { dragonMonstrosity: result("very-rare-primal-essence"), construct: result("very-rare-arcane-essence"), aberration: result("very-rare-arcane-essence"), undead: result("very-rare-arcane-essence"), plant: result("very-rare-primal-essence") }),
      row(94, { dragonMonstrosity: result("legendary-primal-essence"), construct: result("legendary-arcane-essence"), aberration: result("legendary-arcane-essence"), undead: result("legendary-divine-essence"), plant: result("legendary-primal-essence") }),
      row(100, { dragonMonstrosity: result("legendary-primal-essence"), construct: result("legendary-arcane-essence"), aberration: result("legendary-psionic-essence"), undead: result("legendary-arcane-essence"), plant: result("legendary-primal-essence") })
    ]
  }
];

export const KIBBLES_REMNANT_TABLES = [
  { minCR: 0, maxCR: 4, rows: [
    row(50, {}),
    row(70, { elemental: result("common-reactive-reagent") }),
    row(80, { celestial: result("common-curative-reagent"), fiend: result("common-reactive-reagent"), elemental: result("common-reactive-reagent"), incorporealUndead: result("common-poisonous-reagent") }),
    row(95, { celestial: result("common-divine-essence"), fiend: result("common-arcane-essence"), elemental: result("common-primal-essence"), incorporealUndead: result("common-divine-essence") }),
    row(100, { celestial: result("common-divine-essence"), fiend: result("common-divine-essence"), elemental: result("common-primal-essence"), incorporealUndead: result("common-arcane-essence") })
  ]},
  { minCR: 5, maxCR: 10, rows: [
    row(20, {}),
    row(50, { celestial: result("common-curative-reagent"), fiend: result("common-reactive-reagent"), elemental: result("common-reactive-reagent"), incorporealUndead: result("common-poisonous-reagent") }),
    row(80, { celestial: result("uncommon-curative-reagent"), fiend: result("uncommon-reactive-reagent"), elemental: result("uncommon-reactive-reagent"), incorporealUndead: result("uncommon-poisonous-reagent") }),
    row(90, { celestial: result("common-divine-essence"), fiend: result("common-arcane-essence"), elemental: result("common-primal-essence"), incorporealUndead: result("common-arcane-essence") }),
    row(100, { celestial: result("uncommon-divine-essence"), fiend: result("uncommon-arcane-essence"), elemental: result("uncommon-primal-essence"), incorporealUndead: result("uncommon-arcane-essence") })
  ]},
  { minCR: 11, maxCR: 16, rows: [
    row(20, { celestial: result("uncommon-curative-reagent"), fiend: result("uncommon-reactive-reagent"), elemental: result("uncommon-reactive-reagent"), incorporealUndead: result("uncommon-poisonous-reagent") }),
    row(50, { celestial: result("uncommon-divine-essence"), fiend: result("uncommon-arcane-essence"), elemental: result("uncommon-primal-essence"), incorporealUndead: result("uncommon-arcane-essence") }),
    row(80, { celestial: result("rare-curative-reagent"), fiend: result("rare-reactive-reagent"), elemental: result("rare-reactive-reagent"), incorporealUndead: result("rare-poisonous-reagent") }),
    row(100, { celestial: result("rare-divine-essence"), fiend: result("rare-arcane-essence"), elemental: result("rare-primal-essence"), incorporealUndead: result("rare-arcane-essence") })
  ]},
  { minCR: 17, maxCR: Infinity, rows: [
    row(20, { celestial: result("rare-curative-reagent"), fiend: result("rare-reactive-reagent"), elemental: result("rare-reactive-reagent"), incorporealUndead: result("rare-poisonous-reagent") }),
    row(50, { celestial: result("rare-divine-essence"), fiend: result("rare-arcane-essence"), elemental: result("rare-primal-essence"), incorporealUndead: result("rare-arcane-essence") }),
    row(69, { celestial: result("very-rare-curative-reagent"), fiend: result("very-rare-reactive-reagent"), elemental: result("very-rare-reactive-reagent"), incorporealUndead: result("very-rare-poisonous-reagent") }),
    row(89, { celestial: result("very-rare-divine-essence"), fiend: result("very-rare-arcane-essence"), elemental: result("very-rare-primal-essence"), incorporealUndead: result("very-rare-arcane-essence") }),
    row(100, { celestial: result("legendary-divine-essence"), fiend: result("legendary-arcane-essence"), elemental: result("legendary-primal-essence"), incorporealUndead: result("legendary-arcane-essence") })
  ]}
];

export const KIBBLES_BASIC_HARVEST = Object.freeze({
  tiny: null,
  sm: { dc: 12, hide: [{ materialId: "hide-scraps", quantity: "1d4" }], meat: null },
  med: { dc: 10, hide: [{ materialId: "hide", quantity: "1" }, { materialId: "medium-carapace", quantity: "1" }, { materialId: "scales", quantity: "2d6" }], meat: { materialId: "common-meat", quantity: "1" } },
  lg: { dc: 12, hide: [{ materialId: "hide", quantity: "5" }, { materialId: "large-carapace", quantity: "1" }, { materialId: "scales", quantity: "3d6" }], meat: { materialId: "common-meat", quantity: "1d4" } },
  huge: { dc: 14, hide: [{ materialId: "hide", quantity: "10" }, { materialId: "large-carapace", quantity: "2" }, { materialId: "scales", quantity: "6d6" }], meat: { materialId: "common-meat", quantity: "2d6" } },
  grg: { dc: 14, hide: [{ materialId: "hide", quantity: "15" }, { materialId: "large-carapace", quantity: "3" }, { materialId: "scales", quantity: "9d6" }], meat: { materialId: "common-meat", quantity: "3d8" } }
});

export const KIBBLES_SPECIAL_MATERIALS = Object.freeze([
  { id: "tough", minCR: 8, dcModifier: 4, materialId: "tough-hide", requires: "ac16" },
  { id: "resistant", minCR: 8, dcModifier: 5, materialId: "resistant-hide", requires: "elementalResistance" },
  { id: "dragon", minCR: 14, dcModifier: 8, materialId: "dragon-scales", requires: "dragon" }
]);

export const KIBBLES_MEAT_RARITIES = Object.freeze([
  { minCR: 21, dcModifier: 9, materialId: "legendary-meat" },
  { minCR: 17, dcModifier: 7, materialId: "very-rare-meat" },
  { minCR: 10, dcModifier: 5, materialId: "rare-meat" },
  { minCR: 5, dcModifier: 3, materialId: "uncommon-meat" }
]);
