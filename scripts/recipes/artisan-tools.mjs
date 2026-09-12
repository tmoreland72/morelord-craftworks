export function normalizeArtisanTool(value) {
  return String(value ?? "").toLowerCase()
    .replace(/[’']s\b/g, "")
    .replace(/[’']/g, "")
    .replace(/\bblacksmith\b/g, "smith")
    .replace(/\b(tools?|supplies)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

export function resolveArtisanToolId(name, status = {}) {
  if (!name) return null;
  const tools = globalThis.CONFIG?.DND5E?.tools ?? {};
  for (const id of [status?.toolId, status?.matchedToolId]) {
    if (id && tools[id]) return id;
  }
  const needle = normalizeArtisanTool(name);
  for (const [id, config] of Object.entries(tools)) {
    const labels = [id, config?.label, config?.name,
      globalThis.game?.dnd5e?.utils?.keyLabel?.(id, { trait: "tool" })];
    if (typeof config === "string") labels.push(config);
    if (labels.filter(value => typeof value === "string").some(label =>
      normalizeArtisanTool(globalThis.game?.i18n?.localize?.(label) ?? label) === needle
    )) return id;
  }
  const item = status?.matchedItemUuid && globalThis.fromUuidSync?.(status.matchedItemUuid);
  return [item?.system?.tool, item?.system?.type?.value, item?.system?.identifier]
    .find(id => typeof id === "string" && tools[id]) ?? null;
}
