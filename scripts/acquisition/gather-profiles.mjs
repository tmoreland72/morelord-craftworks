import { MODULE_ID } from "../constants.mjs";
import {
  CONTENT_PACK_MANIFESTS,
  sortContentPackManifests
} from "../../data/packs/manifests.mjs";

export function getGatherProfiles({ activePackIds = null } = {}) {
  const active = activePackIds ? new Set(activePackIds) : null;
  const resolved = new Map();

  for (const manifest of sortContentPackManifests(CONTENT_PACK_MANIFESTS)) {
    if (active && !active.has(manifest.id)) continue;

    for (const source of manifest.gatheringProfiles ?? []) {
      const profile = {
        ...source,
        packId: source.packId ?? manifest.id
      };
      resolved.set(profile.id, profile);
    }
  }

  return Array.from(resolved.values());
}

export function getGatherProfile(id, { activePackIds = null } = {}) {
  return getGatherProfiles({ activePackIds })
    .find(profile => profile.id === id) ?? null;
}

export function getGatherDC(profile) {
  const modifier = Number(game.settings.get(MODULE_ID, "gatherDcModifier") ?? 0);
  return Math.max(1, Number(profile?.dc ?? 10) + modifier);
}
