export const HOARD_PROFILES = Object.freeze({
  "0-4": {
    id: "0-4",
    label: "Challenge 0–4",
    coinGp: { min: 40, max: 180 },
    materialRolls: { min: 1, max: 3 },
    potionRolls: { min: 1, max: 2 },
    spellScrollRolls: { min: 1, max: 1 },
    representativeCR: 2,
    specialChance: 18
  },
  "5-10": {
    id: "5-10",
    label: "Challenge 5–10",
    coinGp: { min: 250, max: 900 },
    materialRolls: { min: 2, max: 4 },
    potionRolls: { min: 2, max: 3 },
    spellScrollRolls: { min: 1, max: 2 },
    representativeCR: 7,
    specialChance: 35
  },
  "11-16": {
    id: "11-16",
    label: "Challenge 11–16",
    coinGp: { min: 1200, max: 4500 },
    materialRolls: { min: 3, max: 5 },
    potionRolls: { min: 3, max: 5 },
    spellScrollRolls: { min: 2, max: 3 },
    representativeCR: 13,
    specialChance: 55
  },
  "17+": {
    id: "17+",
    label: "Challenge 17+",
    coinGp: { min: 5000, max: 18000 },
    materialRolls: { min: 4, max: 6 },
    potionRolls: { min: 4, max: 6 },
    spellScrollRolls: { min: 3, max: 4 },
    representativeCR: 18,
    specialChance: 75
  }
});

export function getHoardProfile(id) {
  return HOARD_PROFILES[id] ?? HOARD_PROFILES["0-4"];
}
