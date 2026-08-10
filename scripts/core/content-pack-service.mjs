import { MODULE_ID } from "../constants.mjs";
import {
  CONTENT_PACKS,
  getContentPack,
  getContentPackSettingKey
} from "../../data/content-packs.mjs";
import {
  CONTENT_PACK_MANIFESTS,
  getContentPackManifest,
  sortContentPackManifests
} from "../../data/packs/manifests.mjs";

export class ContentPackService {
  constructor({ coreAccess }) {
    this.coreAccess = coreAccess;
  }

  all() {
    return [...CONTENT_PACKS].sort(
      (a,b) => Number(a.sort ?? 0) - Number(b.sort ?? 0)
    );
  }

  get(packId) {
    return getContentPack(packId);
  }

  isEnabled(packId) {
    const pack = this.get(packId);
    if (!pack) return false;

    let configured;
    try {
      configured = Boolean(
        game.settings.get(MODULE_ID, getContentPackSettingKey(pack.id))
      );
    } catch {
      configured = Boolean(pack.enabledByDefault);
    }

    if (!configured) return false;
    return this.coreAccess?.hasAccess(pack) ?? !pack.premium;
  }

  enabled({ capability = null } = {}) {
    return this.all().filter(pack => {
      if (!this.isEnabled(pack.id)) return false;
      if (!capability) return true;
      return (pack.capabilities ?? []).includes(capability);
    });
  }



  manifest(packId) {
    return getContentPackManifest(packId);
  }

  manifests({ activeOnly = false, capability = null } = {}) {
    const packIds = new Set(
      (activeOnly ? this.enabled({ capability }) : this.all())
        .filter(pack => !capability || (pack.capabilities ?? []).includes(capability))
        .map(pack => pack.id)
    );

    return sortContentPackManifests(
      CONTENT_PACK_MANIFESTS.filter(manifest => packIds.has(manifest.id))
    );
  }

  collect(field, {
    activeOnly = true,
    capability = null,
    identity = "id",
    annotateOwner = true
  } = {}) {
    const resolved = new Map();

    for (const manifest of this.manifests({ activeOnly, capability })) {
      const entries = Array.isArray(manifest?.[field]) ? manifest[field] : [];

      for (const source of entries) {
        const entry = annotateOwner
          ? { ...source, packId: source.packId ?? manifest.id }
          : source;

        const key = entry?.[identity];
        if (!key) continue;

        // Higher-priority manifests are processed later and intentionally
        // replace the same identity from lower-priority packs.
        resolved.set(String(key), entry);
      }
    }

    return Array.from(resolved.values());
  }

  validateManifests() {
    const known = new Set(this.all().map(pack => pack.id));
    const manifestIds = new Set();

    const collectionFields = [
      "recipes",
      "harvestProfiles",
      "gatheringProfiles",
      "lootTiers",
      "encounterLootProfiles"
    ];

    for (const manifest of CONTENT_PACK_MANIFESTS) {
      if (!known.has(manifest.id)) {
        throw new Error(`Unknown Content Pack manifest '${manifest.id}'.`);
      }

      if (manifestIds.has(manifest.id)) {
        throw new Error(`Duplicate Content Pack manifest '${manifest.id}'.`);
      }
      manifestIds.add(manifest.id);

      if (!manifest.materials || typeof manifest.materials !== "object") {
        throw new Error(`Content Pack '${manifest.id}' must declare a materials source object.`);
      }

      for (const field of collectionFields) {
        if (!Array.isArray(manifest[field])) {
          throw new Error(
            `Content Pack '${manifest.id}' manifest field '${field}' must be an array.`
          );
        }
      }

      const checks = [
        ["recipes", "id"],
        ["harvestProfiles", "id"],
        ["gatheringProfiles", "id"],
        ["lootTiers", "id"],
        ["encounterLootProfiles", "id"]
      ];

      for (const [field, identity] of checks) {
        const seen = new Set();

        for (const entry of manifest[field]) {
          const key = String(entry?.[identity] ?? "").trim();
          if (!key) {
            throw new Error(
              `Content Pack '${manifest.id}' has a '${field}' entry without '${identity}'.`
            );
          }

          if (seen.has(key)) {
            throw new Error(
              `Content Pack '${manifest.id}' has duplicate ${field} id '${key}'.`
            );
          }

          seen.add(key);
        }
      }
    }

    for (const pack of this.all()) {
      if (!manifestIds.has(pack.id)) {
        throw new Error(`Content Pack '${pack.id}' has no manifest.`);
      }
    }

    return true;
  }

  materialsSource(packId) {
    const manifest = this.manifest(packId);
    if (!manifest) return null;

    return {
      packId,
      priority: Number(manifest.priority ?? 0),
      seedPath: manifest.materials?.seedPath ?? null,
      entries: Array.isArray(manifest.materials?.entries)
        ? manifest.materials.entries
        : []
    };
  }

  describe(packId) {
    const pack = this.get(packId);
    if (!pack) return null;

    const hasAccess = this.coreAccess?.hasAccess(pack) ?? !pack.premium;

    let configured;
    try {
      configured = Boolean(
        game.settings.get(MODULE_ID, getContentPackSettingKey(pack.id))
      );
    } catch {
      configured = Boolean(pack.enabledByDefault);
    }

    return {
      ...pack,
      configured,
      hasAccess,
      active: configured && hasAccess
    };
  }
}
