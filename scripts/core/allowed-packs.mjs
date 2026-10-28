/**
 * The only Craftworks call site for compendium pack reads and compendium UUIDs.
 *
 * TODO(morelord-core): Import the shared Configure Sources helper once it is
 * exported, and delete the bridge in this file. Do not reimplement it here.
 *
 *   import {
 *     getAllowedPacks,
 *     isUuidAllowed
 *   } from "../../../morelord-core/scripts/services/dnd5e-source-filter-service.js";
 *
 * Core should also publish both functions on
 * `game.modules.get("morelord-core").api.sources`.
 * `isUuidAllowed` must return true for UUIDs that are not compendium documents.
 *
 * The helper must wrap dnd5e 6.x `CompendiumBrowserSettingsConfig.isSourceEnabled`:
 * `dnd5e.settings.packSourceConfiguration[collection]` when that entry is set,
 * otherwise `metadata.flags.dnd5e.rulesVersion` is empty or equal to
 * `dnd5e.settings.rulesVersion`. Configure Sources covers Actor and Item packs.
 * Craftworks content-pack pickers only narrow the packs this module returns.
 */

const CONFIGURED_DOCUMENT_TYPES = new Set(["Actor", "Item"]);

function coreSources() {
  return globalThis.game?.modules?.get?.("morelord-core")?.api?.sources ?? null;
}

function documentType(pack) {
  return String(pack?.documentName ?? pack?.metadata?.type ?? "");
}

function readPacks() {
  const packs = globalThis.game?.packs;
  if (!packs) return [];
  if (typeof packs.values === "function") return [...packs.values()];
  if (typeof packs[Symbol.iterator] === "function") return [...packs];
  return [];
}

function readPack(collection) {
  if (!collection) return null;
  const packs = globalThis.game?.packs;
  if (packs && typeof packs.get === "function") {
    const found = packs.get(collection);
    if (found) return found;
  }
  return readPacks().find(pack => pack?.collection === collection) ?? null;
}

export function compendiumCollection(uuid) {
  const parts = String(uuid ?? "").split(".");
  if (parts[0] !== "Compendium" || parts.length < 5) return null;
  return `${parts[1]}.${parts[2]}`;
}

function configuredPack(pack) {
  return CONFIGURED_DOCUMENT_TYPES.has(documentType(pack));
}

/**
 * Actor and Item packs wait for Core. Other document types are outside
 * dnd5e Configure Sources (that screen only lists Actor and Item packs).
 * TODO(morelord-core): this returns every Actor/Item pack when Core has not
 * exported getAllowedPacks or isUuidAllowed and has no sources.filter.
 * It does not read packSourceConfiguration.
 */
function bridgeAllows(pack) {
  if (!pack || !configuredPack(pack)) return Boolean(pack);
  const sources = coreSources();
  if (typeof sources?.filter?.isPackEnabled === "function") {
    return Boolean(sources.filter.isPackEnabled(pack));
  }
  if (
    typeof sources?.getAllowedPacks !== "function"
    && typeof sources?.isUuidAllowed !== "function"
  ) {
    return true;
  }
  return false;
}

function narrow(packs, { documentName = null, visible = null, packageName = null } = {}) {
  return packs.filter(pack => {
    if (!pack) return false;
    if (documentName && documentType(pack) !== documentName) return false;
    if (visible === true && pack.visible === false) return false;
    if (!packageName) return true;
    const owner = pack.metadata?.packageName ?? pack.metadata?.package ?? "";
    const collection = String(pack.collection ?? "");
    return owner === packageName || collection.startsWith(`${packageName}.`);
  });
}

export function getAllowedPacks(options = {}) {
  const sources = coreSources();
  if (typeof sources?.getAllowedPacks === "function") {
    return narrow([...sources.getAllowedPacks(options)], options);
  }
  // TODO(morelord-core): delete this bridge when sources.getAllowedPacks exists.
  return narrow(readPacks().filter(bridgeAllows), options);
}

export function getAllowedPack(collection) {
  const sources = coreSources();
  if (typeof sources?.getAllowedPack === "function") {
    return sources.getAllowedPack(collection) ?? null;
  }
  const pack = readPack(collection);
  if (!pack) return null;
  if (typeof sources?.getAllowedPacks === "function") {
    if (!configuredPack(pack)) return pack;
    const allowed = [...sources.getAllowedPacks({ documentName: documentType(pack) })];
    return allowed.some(candidate =>
      candidate === pack || candidate?.collection === collection
    ) ? pack : null;
  }
  return bridgeAllows(pack) ? pack : null;
}

export function isUuidAllowed(uuid) {
  const sources = coreSources();
  if (typeof sources?.isUuidAllowed === "function") {
    return Boolean(sources.isUuidAllowed(uuid));
  }
  const collection = compendiumCollection(uuid);
  if (!collection) return true;
  const pack = readPack(collection);
  if (!pack) {
    return !(sources?.getAllowedPacks || sources?.filter || sources?.isUuidAllowed);
  }
  if (typeof sources?.getAllowedPacks === "function") {
    return Boolean(getAllowedPack(collection));
  }
  return bridgeAllows(pack);
}

/** Presence is for diagnostics. `pack` is returned only when Core allows it. */
export function packAccess(collection) {
  const present = Boolean(readPack(collection));
  const pack = getAllowedPack(collection);
  return { present, allowed: Boolean(pack), pack };
}
