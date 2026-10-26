import { DrakkenheimMonsterDataService } from "../integrations/drakkenheim-monster-data-service.mjs";
import { DrakkenheimMaterialMatchService } from "../integrations/drakkenheim-material-match-service.mjs";

let indexes = new WeakMap();
let hooksRegistered = false;

export function clearDrakkenheimSourceCache() { indexes = new WeakMap(); }

export function peekDrakkenheimSourceIndex(craftworks) {
  const entry = indexes.get(craftworks.materials);
  const materials = craftworks.materials.all();
  if (!entry || entry.pack !== game.packs.get("drakkenheim-monsters.monsters")
    || materials.length !== entry.materials.length || materials.some((material, i) => material !== entry.materials[i])) return null;
  return entry.result ?? null;
}

export function drakkenheimSourcesForMaterial(material, index) {
  if (!index.sources) return [];
  let sources = index.sources.get(material.materialId);
  if (!sources) {
    sources = index.entries.map(entry => ({ ...entry, matching: matchingDrakkenheimSources(material, entry) })).filter(entry => entry.matching.length);
    index.sources.set(material.materialId, sources);
  }
  return sources;
}

export function registerDrakkenheimSourceCacheHooks(onInvalidate = () => {}) {
  if (hooksRegistered) return;
  hooksRegistered = true;
  const invalidate = document => {
    const pack = document.pack ?? document.parent?.pack;
    if (String(pack ?? "").startsWith("drakkenheim-monsters.")) {
      clearDrakkenheimSourceCache();
      onInvalidate();
    }
  };
  for (const type of ["Actor", "JournalEntry", "JournalEntryPage"]) {
    for (const action of ["create", "update", "delete"]) Hooks.on(`${action}${type}`, invalidate);
  }
}

export async function getDrakkenheimHarvestableMaterialIds(craftworks) {
  const index = await getDrakkenheimSourceIndex(craftworks);
  if (index.notices.length) throw new Error("Monster harvest availability could not be fully verified.");
  return craftworks.materials.all().filter(material => material.packId === "monsters-of-drakkenheim"
    && drakkenheimSourcesForMaterial(material, index).length > 0).map(material => material.materialId);
}

export async function getDrakkenheimSourceIndex(craftworks, { onProgress = () => {} } = {}) {
  if (!game.user.isGM) throw new Error("Material source details are GM-only.");
  if (!craftworks.contentPacks.isEnabled("monsters-of-drakkenheim")) return { entries: [], notices: ["Enable the Monsters of Drakkenheim content pack to search monster sources."] };
  const pack = game.packs.get("drakkenheim-monsters.monsters");
  if (!pack) return { entries: [], notices: ["Monsters of Drakkenheim's monster compendium is unavailable; named monster sources could not be checked."] };
  const materials = craftworks.materials.all();
  let entry = indexes.get(craftworks.materials);
  if (!entry || entry.pack !== pack || materials.length !== entry.materials.length || materials.some((material, i) => material !== entry.materials[i])) {
    entry = { pack, materials, listeners: new Set(), status: "Loading monster entries…" };
    indexes.set(craftworks.materials, entry);
    entry.promise = buildIndex(craftworks, entry).then(result => {
      entry.result = result;
      if (result.notices.length && indexes.get(craftworks.materials) === entry) indexes.delete(craftworks.materials);
      return result;
    }).catch(error => {
      if (indexes.get(craftworks.materials) === entry) indexes.delete(craftworks.materials);
      throw error;
    });
  }
  entry.listeners.add(onProgress);
  onProgress(entry.status);
  try { return await entry.promise; }
  finally { entry.listeners.delete(onProgress); }
}

async function buildIndex(craftworks, entry) {
  DrakkenheimMaterialMatchService.configure(craftworks.materials);
  const actors = await entry.pack.getDocuments();
  const entries = [];
  let failed = 0;
  for (const [index, actor] of actors.entries()) {
    entry.status = `Searching monsters: ${index + 1} of ${actors.length}`;
    for (const listener of entry.listeners) listener(entry.status);
    if (index % 10 === 0 && typeof requestAnimationFrame === "function") await new Promise(resolve => requestAnimationFrame(resolve));
    try {
      const data = await DrakkenheimMonsterDataService.inspectHarvestData(actor);
      if (!data.harvestDocuments.length) continue;
      const matches = await DrakkenheimMaterialMatchService.matchHarvestComponents(actor, data);
      entries.push({ actor, data, matches });
    } catch (error) {
      failed++;
      console.warn("Morelord Craftworks | Could not inspect monster source", actor.uuid, error);
    }
  }
  entry.status = "Monster source index ready.";
  return { entries, sources: new Map(), notices: failed ? [`${failed} monster entries could not be inspected; named sources may be incomplete.`] : [] };
}

const creatureTypes = new Set(["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"]);

export function matchingDrakkenheimSources(material, { actor, data, matches }) {
  const matcher = DrakkenheimMaterialMatchService;
  const rarity = matcher.getRarityKey(data.rarity);
  if (!rarity || rarity !== matcher.getRarityKey(material.rarity)) return [];
  const exact = matches.filter(match => match.matched && (match.item?.materialId ?? match.item?.id) === material.materialId);
  if (exact.length) return exact;
  const name = String(material.name ?? "").replace(/\s*\([^)]*\)\s*$/, "");
  const [category, ...description] = name.split(/\s+-\s+/);
  const [physical, ...from] = description.join(" ").split(/\s+from\s+/i);
  const tokens = value => matcher.tokenize(value).filter(token => !["a", "an", "the", "of"].includes(token));
  const requested = tokens(physical);
  const actorType = actor.system?.details?.type ?? {};
  const type = matcher.normalizeToken(actorType.value === "custom" ? actorType.custom : actorType.value);
  const source = tokens(from.join(" "));
  if ([...requested, ...source].some(token => creatureTypes.has(token) && token !== type)) return [];
  const actorTokens = new Set([
    ...matcher.tokenize(actor.name), ...matcher.tokenize(actorType.subtype), ...matcher.tokenize(actorType.custom),
    ...(data.harvestDocuments ?? []).flatMap(document => matcher.tokenize(document.document?.name))
  ]);
  if (source.some(token => !creatureTypes.has(token) && !actorTokens.has(token))) return [];
  const identity = requested.filter(token => !creatureTypes.has(token));
  const family = matcher.tokenize(category).join(" ");
  // Family references include specific parts, but a requested skull never matches a spine.
  return matches.filter(match => {
    if (matcher.tokenize(match.component.category).join(" ") !== family) return false;
    const available = new Set(matcher.tokenize(match.component.name));
    return identity.every(token => available.has(token));
  });
}
