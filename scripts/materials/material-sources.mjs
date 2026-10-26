import { getGatherProfiles } from "../acquisition/gather-profiles.mjs";
import { getHarvestProfiles } from "../acquisition/harvest-profiles.mjs";
import { getLootTiers } from "../acquisition/loot-profiles.mjs";
import { KIBBLES_BASIC_HARVEST, KIBBLES_EXOTIC_COLUMNS, KIBBLES_EXOTIC_TABLES,
  KIBBLES_REMNANT_COLUMNS, KIBBLES_REMNANT_TABLES, KIBBLES_SPECIAL_MATERIALS,
  KIBBLES_MEAT_RARITIES } from "../../data/packs/standard/kibbles-harvest-tables.mjs";
import { getDrakkenheimSourceIndex, drakkenheimSourcesForMaterial } from "./drakkenheim-source-index.mjs";
import { KIBBLES_HARVEST_MATERIAL_IDS } from "../../data/packs/standard/acquisition.mjs";
import { getLootMaterialIds } from "../acquisition/loot-profiles.mjs";

export function activeMaterialAcquisition(craftworks) {
  const active = capability => craftworks.contentPacks.enabled({ capability }).map(pack => pack.id);
  const harvestPacks = active("harvest");
  const resultIds = profiles => new Set(profiles.flatMap(profile => (profile.results ?? [])
    .filter(result => Number(result.weight ?? 0) > 0).map(result => result.materialId)));
  const harvest = resultIds(getHarvestProfiles({ activePackIds: harvestPacks }));
  if (harvestPacks.includes("standard-core")) for (const id of KIBBLES_HARVEST_MATERIAL_IDS) harvest.add(id);
  return {
    gatherable: resultIds(getGatherProfiles({ activePackIds: active("gathering") })),
    harvestable: harvest,
    lootable: getLootMaterialIds({ activePackIds: active("loot") }),
    drakkenheimHarvest: harvestPacks.includes("monsters-of-drakkenheim")
  };
}

export function materialAcquisition(material, available) {
  return {
    gatherable: available.gatherable.has(material.materialId),
    harvestable: available.harvestable.has(material.materialId),
    lootable: available.lootable.has(material.materialId)
  };
}

const sizes = { sm: "Small", med: "Medium", lg: "Large", huge: "Huge", grg: "Gargantuan" };
const organic = "beast, dragon, giant, humanoid, or monstrosity";
const crRange = (min, max) => max === Infinity ? `CR ${min}+` : `CR ${min}–${max}`;

// Read the same tables as the harvest resolver without rolling or consuming a corpse result.
export function kibblesMaterialSources(materialId) {
  const rows = [];
  for (const [size, entry] of Object.entries(KIBBLES_BASIC_HARVEST)) {
    if (!entry) continue;
    for (const result of [...entry.hide, ...(entry.meat ? [entry.meat] : [])]) {
      if (result.materialId === materialId) rows.push({ name: `${sizes[size]} ${organic}`,
        detail: "Basic harvest" });
    }
    if (entry.meat && materialId === "common-fresh-ingredient") rows.push({ name: `${sizes[size]} plant`,
      detail: "Basic fresh ingredient harvest" });
  }
  for (const [columns, tables, remnant] of [
    [KIBBLES_EXOTIC_COLUMNS, KIBBLES_EXOTIC_TABLES, false],
    [KIBBLES_REMNANT_COLUMNS, KIBBLES_REMNANT_TABLES, true]
  ]) {
    for (const [type, column] of Object.entries(columns)) {
      for (const table of tables) {
        for (const row of table.rows) {
          const result = row.results[column];
          if (result?.materialId === materialId) rows.push({
            name: `${type === "undead" ? (remnant ? "Incorporeal undead" : "Corporeal undead") : type} · ${crRange(table.minCR, table.maxCR)}`,
            detail: remnant ? "Exotic remnant" : "Exotic harvest"
          });
        }
      }
    }
  }
  const requirements = { ac16: "AC 16 or higher", elementalResistance: "elemental resistance", dragon: "dragon" };
  for (const special of KIBBLES_SPECIAL_MATERIALS.filter(row => row.materialId === materialId)) {
    rows.push({ name: `${organic} · CR ${special.minCR}+ · Requires ${requirements[special.requires]}`,
      detail: "Special hide" });
  }
  KIBBLES_MEAT_RARITIES.forEach((row, index) => {
    if (row.materialId !== materialId) return;
    rows.push({ name: `Medium or larger ${organic} · ${crRange(row.minCR, index ? KIBBLES_MEAT_RARITIES[index - 1].minCR - 1 : Infinity)}`,
      detail: "Special meat" });
  });
  return uniqueSources(rows);
}

function uniqueSources(rows) {
  return [...new Map(rows.map(row => [JSON.stringify([row.uuid, row.name, row.detail]), row])).values()];
}

export async function materialSources(craftworks, material, kind, { onProgress = () => {} } = {}) {
  if (!game.user.isGM) throw new Error("Material source details are GM-only.");
  if (!["gather", "harvest", "loot"].includes(kind)) throw new Error("Unknown acquisition source.");
  const capability = { gather: "gathering", harvest: "harvest", loot: "loot" }[kind];
  const isDrakkenheim = material.packId === "monsters-of-drakkenheim";
  const activePackIds = craftworks.contentPacks.enabled({ capability }).map(pack => pack.id)
    .filter(id => isDrakkenheim || id !== "monsters-of-drakkenheim");
  const rows = [];
  const notices = [];
  const profiles = kind === "gather" ? getGatherProfiles({ activePackIds })
    : kind === "loot" ? getLootTiers({ activePackIds }) : getHarvestProfiles({ activePackIds });
  for (const profile of profiles) {
    for (const result of profile.results ?? []) {
      if (result.materialId !== material.materialId) continue;
      const name = profile.name ?? profile.label ?? profile.creatureTypes?.join(", ") ?? profile.id;
      rows.push({ name: kind === "harvest" ? `${name} · Minimum CR ${result.minCR ?? 0} · Fallback only`
        : kind === "loot" ? `Any creature · ${name}` : name,
        detail: kind === "harvest" ? "Fallback harvest" : craftworks.contentPacks.get(profile.packId)?.label ?? profile.packId });
    }
  }
  if (kind === "harvest") {
    if (!isDrakkenheim && activePackIds.includes("standard-core")) {
      rows.unshift(...kibblesMaterialSources(material.materialId));
    }
    if (isDrakkenheim && activePackIds.includes("monsters-of-drakkenheim")) {
      const index = await getDrakkenheimSourceIndex(craftworks, { onProgress });
      notices.push(...index.notices);
      for (const entry of drakkenheimSourcesForMaterial(material, index)) {
        const { actor, data, matching } = entry;
        const forms = Object.entries(data.rarityData?.rarities ?? {}).map(([form, rarity]) => `${form}: ${rarity}`).join(", ");
        rows.push({ name: actor.name, uuid: actor.uuid,
          img: actor.img, cr: craftworks.adapter?.getCreatureCR(actor) ?? actor.system?.details?.cr,
          sourceLabel: "Monsters of Drakkenheim",
          requirements: [`Rarity: ${data.rarity ?? "unresolved"}`, forms && `Forms: ${forms}`,
            `Components: ${[...new Set(matching.map(match => match.component.name))].join(", ")}`].filter(Boolean).join(" · "),
          detail: [...new Set(matching.map(match => match.component.category))].join(", ") });
      }
    }
  }
  if (kind === "harvest" && !rows.length) {
    notices.push(isDrakkenheim
      ? "Requires a monster entry whose harvest component matches this material's name/category and evaluated rarity. No matching named monster was resolved."
      : "No active harvest rule produces this material.");
  }
  if (kind === "loot" && !rows.length) notices.push("Tagged Loot in the catalog, but not included in any active material loot table. It does not currently drop through random creature loot.");
  return { rows: uniqueSources(rows), notices };
}
