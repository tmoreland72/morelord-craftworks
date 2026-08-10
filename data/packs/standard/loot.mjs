export const STANDARD_LOOT_TIERS = [
  {
    packId: "standard-core",
    id: "0-4",
    label: "CR 0–4",
    setting: "lootNothing04",
    results: [
      { materialId: "hide-scraps", weight: 22, min: 1, max: 2 },
      { materialId: "metal-scraps", weight: 22, min: 1, max: 2 },
      { materialId: "parts", weight: 12, min: 1, max: 1 },
      { materialId: "common-curative-reagent", weight: 12, min: 1, max: 1 },
      { materialId: "common-poisonous-reagent", weight: 10, min: 1, max: 1 },
      { materialId: "common-reactive-reagent", weight: 10, min: 1, max: 1 },
      { materialId: "common-primal-essence", weight: 12, min: 1, max: 1 }
    ]
  },
  {
    packId: "standard-core",
    id: "5-10",
    label: "CR 5–10",
    setting: "lootNothing510",
    results: [
      { materialId: "metal-scraps", weight: 20, min: 2, max: 4 },
      { materialId: "parts", weight: 18, min: 1, max: 2 },
      { materialId: "quality-branch", weight: 12, min: 1, max: 1 },
      { materialId: "common-primal-essence", weight: 20, min: 1, max: 2 },
      { materialId: "uncommon-primal-essence", weight: 20, min: 1, max: 1 },
      { materialId: "common-reactive-reagent", weight: 10, min: 1, max: 2 }
    ]
  },
  {
    packId: "standard-core",
    id: "11-16",
    label: "CR 11–16",
    setting: "lootNothing1116",
    results: [
      { materialId: "parts", weight: 15, min: 2, max: 3 },
      { materialId: "quality-branch", weight: 10, min: 1, max: 2 },
      { materialId: "uncommon-primal-essence", weight: 35, min: 1, max: 2 },
      { materialId: "rare-primal-essence", weight: 30, min: 1, max: 1 },
      { materialId: "common-reactive-reagent", weight: 10, min: 2, max: 3 }
    ]
  },
  {
    packId: "standard-core",
    id: "17+",
    label: "CR 17+",
    setting: "lootNothing17Plus",
    results: [
      { materialId: "uncommon-primal-essence", weight: 30, min: 2, max: 3 },
      { materialId: "rare-primal-essence", weight: 55, min: 1, max: 2 },
      { materialId: "parts", weight: 15, min: 3, max: 5 }
    ]
  }
];
