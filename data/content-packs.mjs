export const CONTENT_PACKS = [
  {
    id: "standard-core",
    label: "Craftworks Standard",
    shortLabel: "Standard",
    rulesVersion: "system-agnostic",
    description: "Shared Kibbles-defined crafting materials and Craftworks acquisition/reference infrastructure.",
    premium: false,
    requiredEntitlements: [],
    requiredFeatures: ["craftworks.standard"],
    enabledByDefault: true,
    sort: 0,
    capabilities: ["materials", "harvest", "gathering", "loot"]
  },
  {
    id: "srd-5.2",
    label: "SRD 5.2",
    shortLabel: "SRD 5.2",
    rulesVersion: "2024",
    description: "Kibbles crafting recipes whose finished output exists in the D&D5e SRD 5.2 Equipment compendium.",
    premium: false,
    requiredEntitlements: [],
    requiredFeatures: ["craftworks.content-srd52"],
    enabledByDefault: true,
    sort: 10,
    capabilities: ["materials", "recipes", "harvest", "gathering", "loot"]
  },
  {
    id: "srd-5.1",
    label: "SRD 5.1",
    shortLabel: "SRD 5.1",
    rulesVersion: "2014",
    description: "Kibbles crafting recipes whose finished output exists in the D&D5e SRD 5.1 Items/Trade Goods compendiums.",
    premium: false,
    requiredEntitlements: [],
    enabledByDefault: false,
    sort: 20,
    capabilities: ["materials", "recipes", "harvest", "gathering", "loot"]
  },
  {
    id: "phb",
    label: "Player's Handbook",
    shortLabel: "PHB",
    rulesVersion: "2024",
    description: "Kibbles crafting recipes whose finished output exists in the 2024 D&D Player's Handbook Equipment compendium.",
    premium: true,
    requiredEntitlements: [],
    requiredFeatures: ["craftworks.content-phb"],
    enabledByDefault: false,
    sort: 100,
    capabilities: ["materials", "recipes", "harvest", "gathering", "loot", "crafting"]
  },
  {
    id: "dmg",
    label: "Dungeon Master's Guide",
    shortLabel: "DMG",
    rulesVersion: "2024",
    description: "Kibbles crafting recipes whose finished output exists in the 2024 D&D Dungeon Master's Guide Equipment compendium.",
    premium: true,
    requiredEntitlements: [],
    requiredFeatures: ["craftworks.content-dmg"],
    enabledByDefault: false,
    sort: 105,
    capabilities: ["materials", "recipes", "harvest", "gathering", "loot", "crafting"]
  },
  {
    id: "monsters-of-drakkenheim",
    label: "Monsters of Drakkenheim",
    shortLabel: "Drakkenheim",
    rulesVersion: "2024",
    description: "Premium Monsters of Drakkenheim materials, monster harvesting data, recipes, and acquisition content.",
    premium: true,
    requiredEntitlements: [],
    requiredFeatures: ["craftworks.content-mod"],
    enabledByDefault: false,
    sort: 110,
    capabilities: ["materials", "recipes", "harvest", "gathering", "loot", "crafting"]
  }
];

export function getContentPack(packId) {
  return CONTENT_PACKS.find(pack => pack.id === packId) ?? null;
}

// Keep the dev.48/dev.50 setting keys so existing worlds retain their choices.
export function getContentPackSettingKey(packId) {
  return `recipePackEnabled_${String(packId)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")}`;
}

// Compatibility aliases for existing recipe code and third-party callers.
export const RECIPE_PACKS = CONTENT_PACKS;
export const getRecipePack = getContentPack;
export const getRecipePackSettingKey = getContentPackSettingKey;
