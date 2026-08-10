import {
  CONTENT_PACK_MANIFESTS,
  sortContentPackManifests
} from "../../data/packs/manifests.mjs";

export function getHarvestProfiles({ activePackIds = null } = {}) {
  const active = activePackIds ? new Set(activePackIds) : null;
  const resolved = new Map();

  for (const manifest of sortContentPackManifests(CONTENT_PACK_MANIFESTS)) {
    if (active && !active.has(manifest.id)) continue;

    for (const source of manifest.harvestProfiles ?? []) {
      const profile = {
        ...source,
        packId: source.packId ?? manifest.id
      };
      resolved.set(profile.id, profile);
    }
  }

  return Array.from(resolved.values());
}

export function findHarvestProfile(creatureType, { activePackIds = null } = {}) {
  const type = String(creatureType ?? "").trim().toLowerCase();
  const profiles = getHarvestProfiles({ activePackIds });

  // Reverse search gives higher-priority pack profiles first after resolution.
  const matched = [...profiles].reverse().find(profile =>
    profile.creatureTypes.includes(type)
  );

  if (matched) return matched;

  const active = activePackIds ? new Set(activePackIds) : null;
  if (active && !active.has("standard-core")) return null;

  const standard = CONTENT_PACK_MANIFESTS.find(m => m.id === "standard-core");
  const reactive = (standard?.harvestProfiles ?? [])
    .flatMap(profile => profile.results ?? [])
    .filter(result => result.materialId?.includes("reactive"));

  if (!reactive.length) return null;

  return {
    packId: "standard-core",
    id: "generic-fallback",
    creatureTypes: [type || "unknown"],
    results: reactive
  };
}
