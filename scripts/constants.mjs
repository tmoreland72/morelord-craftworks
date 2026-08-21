export const MODULE_ID = "morelord-craftworks";
export const MODULE_TITLE = "Morelord Craftworks";
export const SCHEMA_VERSION = 1;

export const ACQUISITION_TYPES = Object.freeze({
  HARVEST: "harvest",
  GATHER: "gather",
  LOOT: "loot",
  PURCHASE: "purchase"
});

export const SESSION_STATUS = Object.freeze({
  OPEN: "open",
  FINALIZING: "finalizing",
  COMPLETE: "complete"
});

export const HARVEST_SKILLS_DND5E = Object.freeze([
  { id: "nat", label: "Nature" },
  { id: "med", label: "Medicine" },
  { id: "arc", label: "Arcana" }
]);

export const GATHER_SKILLS_DND5E = Object.freeze([
  { id: "sur", label: "Survival" },
  { id: "nat", label: "Nature" }
]);

export const DELERIUM_SEARCH_SKILLS_DND5E = Object.freeze([
  { id: "arc", label: "Arcana" },
  { id: "inv", label: "Investigation" },
  { id: "sur", label: "Survival" }
]);
