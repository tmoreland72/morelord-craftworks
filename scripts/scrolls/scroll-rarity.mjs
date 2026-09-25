export const SCROLL_RARITIES = [
  { id: "common", label: "Common", levels: [0, 1] },
  { id: "uncommon", label: "Uncommon", levels: [2, 3] },
  { id: "rare", label: "Rare", levels: [4, 5] },
  { id: "veryrare", label: "Very Rare", levels: [6, 7, 8] },
  { id: "legendary", label: "Legendary", levels: [9] }
];

export function scrollRarity(level) {
  return SCROLL_RARITIES.find(rarity => rarity.levels.includes(Number(level)));
}
