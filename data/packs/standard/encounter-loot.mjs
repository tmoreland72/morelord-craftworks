export const STANDARD_ENCOUNTER_LOOT_PROFILES = [
  {
    packId: "standard-core",
    id: "0-4",
    minCR: 0,
    maxCR: 4,
    materialChance: 65,
    coinChance: 30,
    specialChance: 2,
    coin: { minGp: 0.05, maxGp: 3 }
  },
  {
    packId: "standard-core",
    id: "5-10",
    minCR: 5,
    maxCR: 10,
    materialChance: 75,
    coinChance: 40,
    specialChance: 4,
    coin: { minGp: 2, maxGp: 20 }
  },
  {
    packId: "standard-core",
    id: "11-16",
    minCR: 11,
    maxCR: 16,
    materialChance: 85,
    coinChance: 55,
    specialChance: 7,
    coin: { minGp: 10, maxGp: 100 }
  },
  {
    packId: "standard-core",
    id: "17+",
    minCR: 17,
    maxCR: Infinity,
    materialChance: 90,
    coinChance: 70,
    specialChance: 12,
    coin: { minGp: 50, maxGp: 500 }
  }
];
