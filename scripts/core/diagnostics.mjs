import { CONTENT_PACKS, getContentPackSettingKey } from "../../data/content-packs.mjs";

// Only fixed keys, booleans, counts, timestamps, and controlled outcome codes.
// Never export raw settings, sync signatures, errors, or game documents.
export function getCraftworksDiagnostics(api) {
  const setting = key => game.settings.get("morelord-craftworks", key);
  const materials = api.materials.all();
  const recipes = api.recipes.all();
  const compendium = collection => {
    const pack = game.packs.get(collection);
    return {
      present: Boolean(pack),
      sourceEnabled: pack ? api.sourceFilter.isPackEnabled(pack) : null,
      indexed: pack ? Boolean(pack.indexed) : null,
      indexCount: pack?.index?.size ?? null
    };
  };
  const signature = setting("contentSyncSignature");
  return {
    schemaVersion: 1,
    scope: "Current client; recent outcomes reset on reload. Export before syncing to preserve the failing state.",
    sync: {
      signaturePresent: Boolean(signature),
      signatureMatches: signature === api.contentSync.buildSignature(),
      lastCompletedAt: setting("contentSyncLastAt") || null,
      running: Boolean(api.contentSync.running),
      recentAttempts: structuredClone(api.contentSync.diagnosticAttempts ?? [])
    },
    contentPacks: CONTENT_PACKS.map(pack => ({
      id: pack.id,
      configured: Boolean(setting(getContentPackSettingKey(pack.id))),
      accessGranted: api.coreAccess.hasAccess(pack),
      effectiveEnabled: api.contentPacks.isEnabled(pack.id),
      requiredModuleActive: pack.requiredModuleId ? Boolean(game.modules.get(pack.requiredModuleId)?.active) : null,
      materialCount: materials.filter(row => row.packId === pack.id).length,
      recipeCount: recipes.filter(row => row.packId === pack.id).length,
      materialCompendium: compendium(pack.id === "standard-core"
        ? "world.morelord-craftworks-standard-materials"
        : `world.morelord-craftworks-materials-${pack.id}`)
    })),
    catalog: { materials: materials.length, recipes: recipes.length },
    drakkenheim: {
      monsterCompendium: compendium("drakkenheim-monsters.monsters"),
      recentHarvests: structuredClone(api.harvest.diagnosticHarvests ?? [])
    },
    harvestSettings: Object.fromEntries([
      "harvestDcModifier", "harvestChoicesMin", "harvestChoicesMax",
      "harvestRareBias", "harvestNat20DoubleClaim"
    ].map(key => [key, setting(key)]))
  };
}
