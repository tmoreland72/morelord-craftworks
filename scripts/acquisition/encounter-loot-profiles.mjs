import {
  CONTENT_PACK_MANIFESTS,
  sortContentPackManifests
} from "../../data/packs/manifests.mjs";

export function getEncounterLootProfiles({ activePackIds = null } = {}) {
  const active = activePackIds ? new Set(activePackIds) : null;
  const resolved = new Map();

  for (const manifest of sortContentPackManifests(CONTENT_PACK_MANIFESTS)) {
    if (active && !active.has(manifest.id)) continue;

    for (const source of manifest.encounterLootProfiles ?? []) {
      const profile = {
        ...source,
        packId: source.packId ?? manifest.id
      };
      resolved.set(profile.id, profile);
    }
  }

  return Array.from(resolved.values());
}

export function getEncounterLootProfile(cr, { activePackIds = null } = {}) {
  const profiles = getEncounterLootProfiles({ activePackIds });
  const value = Math.max(0, Number(cr ?? 0));

  return profiles.find(
    profile => value >= profile.minCR && value <= profile.maxCR
  ) ?? null;
}
