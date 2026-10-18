import { STANDARD_GATHERING_PROFILES } from "./gathering.mjs";
import { STANDARD_HARVEST_PROFILES } from "./harvest.mjs";
import { STANDARD_LOOT_TIERS } from "./loot.mjs";
import * as tables from "./kibbles-harvest-tables.mjs";

export const KIBBLES_HARVEST_MATERIAL_IDS = new Set([
  "common-fresh-ingredient",
  ...Object.values(tables.KIBBLES_BASIC_HARVEST).filter(Boolean).flatMap(entry => [...entry.hide, ...(entry.meat ? [entry.meat] : [])]),
  ...[...tables.KIBBLES_EXOTIC_TABLES, ...tables.KIBBLES_REMNANT_TABLES].flatMap(table => table.rows.flatMap(row => Object.values(row.results))),
  ...tables.KIBBLES_SPECIAL_MATERIALS, ...tables.KIBBLES_MEAT_RARITIES
].map(entry => typeof entry === "string" ? entry : entry.materialId));

const results = profiles => profiles.flatMap(profile => (profile.results ?? []).filter(result => Number(result.weight ?? 0) > 0).map(result => result.materialId));
export const STANDARD_ACQUISITION_IDS = {
  gatherable: new Set(results(STANDARD_GATHERING_PROFILES)),
  harvestable: new Set([...results(STANDARD_HARVEST_PROFILES), ...KIBBLES_HARVEST_MATERIAL_IDS]),
  lootable: new Set(results(STANDARD_LOOT_TIERS))
};

export function standardMaterialAcquisition(materialId) {
  return Object.fromEntries(Object.entries(STANDARD_ACQUISITION_IDS).map(([key, ids]) => [key, ids.has(materialId)]));
}
