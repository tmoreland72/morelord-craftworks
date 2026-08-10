import { MODULE_ID } from "../constants.mjs";
import {
  CONTENT_PACK_MANIFESTS,
  sortContentPackManifests
} from "../../data/packs/manifests.mjs";

export function getLootTiers({ activePackIds = null } = {}) {
  const active = activePackIds ? new Set(activePackIds) : null;
  const resolved = new Map();

  for (const manifest of sortContentPackManifests(CONTENT_PACK_MANIFESTS)) {
    if (active && !active.has(manifest.id)) continue;

    for (const source of manifest.lootTiers ?? []) {
      const tier = {
        ...source,
        packId: source.packId ?? manifest.id
      };
      resolved.set(tier.id, tier);
    }
  }

  return Array.from(resolved.values());
}

export function getLootTier(id, { activePackIds = null } = {}) {
  return getLootTiers({ activePackIds })
    .find(tier => tier.id === id) ?? null;
}

export function getNothingChance(tier) {
  return Math.max(
    0,
    Math.min(
      100,
      Number(game.settings.get(MODULE_ID, tier?.setting) ?? 0)
    )
  );
}

export function tierForCR(cr) {
  const value = Number(cr ?? 0);
  if (value >= 17) return "17+";
  if (value >= 11) return "11-16";
  if (value >= 5) return "5-10";
  return "0-4";
}

export function tierForCreatureCR(cr, { activePackIds = null } = {}) {
  return getLootTier(tierForCR(cr), { activePackIds });
}
