import { SRD_52_RECIPES } from "../srd-5.2-recipes.mjs";
import { SRD_51_RECIPES } from "../srd-5.1-recipes.mjs";
import { PHB_RECIPES } from "../phb-recipes.mjs";
import { MONSTERS_OF_DRAKKENHEIM_RECIPES } from "../monsters-of-drakkenheim-recipes.mjs";

import { STANDARD_HARVEST_PROFILES } from "./standard/harvest.mjs";
import { STANDARD_GATHERING_PROFILES } from "./standard/gathering.mjs";
import { STANDARD_LOOT_TIERS } from "./standard/loot.mjs";
import { STANDARD_ENCOUNTER_LOOT_PROFILES } from "./standard/encounter-loot.mjs";

import { SRD_52_HARVEST_PROFILES } from "./srd-5.2/harvest.mjs";
import { SRD_52_GATHERING_PROFILES } from "./srd-5.2/gathering.mjs";
import { SRD_52_LOOT_TIERS } from "./srd-5.2/loot.mjs";
import { SRD_52_ENCOUNTER_LOOT_PROFILES } from "./srd-5.2/encounter-loot.mjs";

import { SRD_51_HARVEST_PROFILES } from "./srd-5.1/harvest.mjs";
import { SRD_51_GATHERING_PROFILES } from "./srd-5.1/gathering.mjs";
import { SRD_51_LOOT_TIERS } from "./srd-5.1/loot.mjs";
import { SRD_51_ENCOUNTER_LOOT_PROFILES } from "./srd-5.1/encounter-loot.mjs";

import { PHB_HARVEST_PROFILES } from "./phb/harvest.mjs";
import { PHB_GATHERING_PROFILES } from "./phb/gathering.mjs";
import { PHB_LOOT_TIERS } from "./phb/loot.mjs";
import { PHB_ENCOUNTER_LOOT_PROFILES } from "./phb/encounter-loot.mjs";

import { DRAKKENHEIM_HARVEST_PROFILES } from "./monsters-of-drakkenheim/harvest.mjs";
import { DRAKKENHEIM_GATHERING_PROFILES } from "./monsters-of-drakkenheim/gathering.mjs";
import { DRAKKENHEIM_LOOT_TIERS } from "./monsters-of-drakkenheim/loot.mjs";
import { DRAKKENHEIM_ENCOUNTER_LOOT_PROFILES } from "./monsters-of-drakkenheim/encounter-loot.mjs";

export const CONTENT_PACK_MANIFESTS = [
  {
    id: "standard-core",
    priority: 0,
    materials: {
      seedPath: "data/standard-materials.seed.json",
      entries: []
    },
    recipes: [],
    harvestProfiles: STANDARD_HARVEST_PROFILES,
    gatheringProfiles: STANDARD_GATHERING_PROFILES,
    lootTiers: STANDARD_LOOT_TIERS,
    encounterLootProfiles: STANDARD_ENCOUNTER_LOOT_PROFILES
  },
  {
    id: "srd-5.2",
    priority: 10,
    materials: { seedPath: null, entries: [] },
    recipes: SRD_52_RECIPES,
    harvestProfiles: SRD_52_HARVEST_PROFILES,
    gatheringProfiles: SRD_52_GATHERING_PROFILES,
    lootTiers: SRD_52_LOOT_TIERS,
    encounterLootProfiles: SRD_52_ENCOUNTER_LOOT_PROFILES
  },
  {
    id: "srd-5.1",
    priority: 20,
    materials: { seedPath: null, entries: [] },
    recipes: SRD_51_RECIPES,
    harvestProfiles: SRD_51_HARVEST_PROFILES,
    gatheringProfiles: SRD_51_GATHERING_PROFILES,
    lootTiers: SRD_51_LOOT_TIERS,
    encounterLootProfiles: SRD_51_ENCOUNTER_LOOT_PROFILES
  },
  {
    id: "phb",
    priority: 100,
    materials: { seedPath: null, entries: [] },
    recipes: PHB_RECIPES,
    harvestProfiles: PHB_HARVEST_PROFILES,
    gatheringProfiles: PHB_GATHERING_PROFILES,
    lootTiers: PHB_LOOT_TIERS,
    encounterLootProfiles: PHB_ENCOUNTER_LOOT_PROFILES
  },
  {
    id: "monsters-of-drakkenheim",
    priority: 110,
    materials: { seedPath: null, entries: [] },
    recipes: MONSTERS_OF_DRAKKENHEIM_RECIPES,
    harvestProfiles: DRAKKENHEIM_HARVEST_PROFILES,
    gatheringProfiles: DRAKKENHEIM_GATHERING_PROFILES,
    lootTiers: DRAKKENHEIM_LOOT_TIERS,
    encounterLootProfiles: DRAKKENHEIM_ENCOUNTER_LOOT_PROFILES
  }
];

export function getContentPackManifest(packId) {
  return CONTENT_PACK_MANIFESTS.find(manifest => manifest.id === packId) ?? null;
}


export function sortContentPackManifests(manifests = CONTENT_PACK_MANIFESTS) {
  return [...manifests].sort(
    (a, b) => Number(a.priority ?? 0) - Number(b.priority ?? 0)
  );
}

export function getManifestCollection(manifest, field) {
  const value = manifest?.[field];
  return Array.isArray(value) ? value : [];
}
