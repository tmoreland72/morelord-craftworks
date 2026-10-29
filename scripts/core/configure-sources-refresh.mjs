import { clearDrakkenheimSourceCache } from "../materials/drakkenheim-source-index.mjs";
import { getMorelordCoreApi } from "./morelord-core-api.mjs";

export const CONFIGURE_SOURCES_CHANGED = "morelordCoreConfigureSourcesChanged";

function openApplications(applications) {
  if (applications) return [...applications];
  const instances = globalThis.foundry?.applications?.instances;
  if (!instances) return [];
  if (typeof instances.values === "function") return [...instances.values()];
  return [...instances];
}

/**
 * Rebuild catalogs that snapshot Configure Sources, then re-render open
 * Craftworks windows. Core owns the setting; this only consumes its hook.
 */
export async function refreshAfterConfigureSourcesChange({
  itemResolver = null,
  materials = null,
  recipes = null,
  specialTreasure = null,
  applications = null,
  clearDrakkenheim = clearDrakkenheimSourceCache
} = {}) {
  await itemResolver?.refresh?.();
  await materials?.indexConfiguredPacks?.();
  await recipes?.loadStandardSeed?.();
  specialTreasure?.invalidateCache?.();
  clearDrakkenheim?.();

  for (const app of openApplications(applications)) {
    const classes = app?.options?.classes ?? [];
    if (!app?.rendered || !classes.includes("ml-craftworks-window")) continue;
    if (app.customCatalog !== true && Object.prototype.hasOwnProperty.call(app, "catalog")) {
      app.catalog = null;
    }
    try {
      const renderInBackground = getMorelordCoreApi()?.ui?.renderInBackground;
      if (typeof renderInBackground === "function") await renderInBackground(app);
      else await app.render({ force: false });
    } catch (error) {
      console.warn(
        "Morelord Craftworks | Could not refresh a window after Configure Sources changed.",
        error
      );
    }
  }
}
