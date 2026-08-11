import { MODULE_ID } from "../constants.mjs";
import {
  SETTINGS,
  getGatherDcOverrides
} from "../core/settings.mjs";
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
  const overrides = getGatherDcOverrides();
  const profileId = String(profile?.id ?? "");
  const baseDc = Object.prototype.hasOwnProperty.call(
    overrides,
    profileId
  )
    ? Number(overrides[profileId])
    : Number(profile?.dc ?? 10);

  const modifier = Number(
    game.settings.get(
      MODULE_ID,
      SETTINGS.GATHER_DC_MODIFIER
    ) ?? 0
  );

  return Math.max(1, baseDc + modifier);
}
