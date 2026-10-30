import { getMorelordCoreService } from "../core/morelord-core-api.mjs";

const VALID_TIERS = new Set(["common", "uncommon", "rare", "veryRare", "legendary", "artifact"]);

export const CRAFTING_FACILITY_RULES = "craftingFacilityRules";
export const ARTISAN_TOOLS = ["Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", "Carpenter's Tools", "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies", "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools"];

// D&D 2024 calls this Smith's Tools. Saved facility rules and world recipes
// may still store the older name.
const LEGACY_ARTISAN_TOOL_KEYS = new Map([
  ["blacksmithstools", "Smith's Tools"]
]);

export function canonicalArtisanToolName(name) {
  const text = String(name ?? "").trim();
  if (!text) return "";
  const key = text.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
  return LEGACY_ARTISAN_TOOL_KEYS.get(key) ?? text;
}

export function facilityRuleForTool(rules, tool) {
  const source = rules && typeof rules === "object" && !Array.isArray(rules) ? rules : {};
  const canonical = canonicalArtisanToolName(tool);
  if (!canonical) return "";
  const direct = source[canonical];
  if (direct) return String(direct);
  for (const [key, value] of Object.entries(source)) {
    if (value && canonicalArtisanToolName(key) === canonical) return String(value);
  }
  return "";
}

export function craftingFacilityToolNames(recipeTools = []) {
  return [...new Set([
    ...ARTISAN_TOOLS,
    ...[...recipeTools].map(name => canonicalArtisanToolName(name)).filter(Boolean)
  ])].sort();
}

export function getCraftingFacilityRules() {
  try {
    const rules = JSON.parse(game.settings.get("morelord-craftworks", CRAFTING_FACILITY_RULES) || "{}");
    return rules && typeof rules === "object" && !Array.isArray(rules) ? rules : {};
  }
  catch { return {}; }
}
export function recipeFacilityEnvironment(recipe, rules = getCraftingFacilityRules()) {
  const drakkenheim = recipe?.packId === "monsters-of-drakkenheim" || recipe?.source?.contentPackId === "monsters-of-drakkenheim";
  const type = drakkenheim ? "workshop" : facilityRuleForTool(rules, recipe?.craft?.tool ?? "");
  const rarity = String(recipe?.output?.rarity ?? recipe?.rarity ?? "common").replace(/[^a-z]/gi, "").toLowerCase();
  const tier = rarity === "veryrare" ? "veryRare" : VALID_TIERS.has(rarity) ? rarity : "common";
  return normalizeCraftEnvironment({ facility: type ? { type, tier } : null });
}

export function getCraftingFacilityOptions(locationApi = null) {
  const types = locationApi?.listCapabilities?.() ?? [];
  const tiers = locationApi?.capabilityTiers ?? Array.from(VALID_TIERS);

  return {
    types: types.map(type => ({
      id: String(type.id),
      name: String(type.name ?? type.id),
      icon: String(type.icon ?? "fa-solid fa-location-dot"),
      supportsSpecialty: type.supportsSpecialty === true
    })),
    tiers: Array.from(tiers, String)
  };
}

export function normalizeCraftEnvironment(raw = {}) {
  const facilityType = String(raw.facility?.type ?? raw.facilityType ?? "").trim() || null;
  const facilityTier = String(raw.facility?.tier ?? raw.facilityTier ?? "common").trim();
  if (facilityType && !VALID_TIERS.has(facilityTier)) {
    throw new Error(`Unknown crafting facility tier: ${facilityTier}.`);
  }
  return {
    facility: facilityType ? { type: facilityType, tier: facilityTier } : null,
    portable: raw.portable == null ? !facilityType : raw.portable === true,
    camp: raw.camp === true,
    settlement: raw.settlement === true
  };
}

const TIER_ORDER = ["common", "uncommon", "rare", "veryRare", "legendary", "artifact"];

// Tool ids Core stores on a Workshop specialty. Smith's Tools and Alchemist's
// Supplies are absent: Core maps those to Forge and Alchemist.
const WORKSHOP_TOOL_KEYS = new Map([
  ["brewer", "brewer"],
  ["brewerssupplies", "brewer"],
  ["calligrapher", "calligrapher"],
  ["calligrapherssupplies", "calligrapher"],
  ["carpenter", "carpenter"],
  ["carpenterstools", "carpenter"],
  ["cartographer", "cartographer"],
  ["cartographerstools", "cartographer"],
  ["cobbler", "cobbler"],
  ["cobblerstools", "cobbler"],
  ["cook", "cook"],
  ["cooksutensils", "cook"],
  ["glassblower", "glassblower"],
  ["glassblowerstools", "glassblower"],
  ["jeweler", "jeweler"],
  ["jewelerstools", "jeweler"],
  ["leatherworker", "leatherworker"],
  ["leatherworkerstools", "leatherworker"],
  ["mason", "mason"],
  ["masonstools", "mason"],
  ["painter", "painter"],
  ["painterssupplies", "painter"],
  ["potter", "potter"],
  ["potterstools", "potter"],
  ["tinker", "tinker"],
  ["tinkerstools", "tinker"],
  ["weaver", "weaver"],
  ["weaverstools", "weaver"],
  ["woodcarver", "woodcarver"],
  ["woodcarverstools", "woodcarver"]
]);

function lookupKey(value) {
  return String(value ?? "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isUnrestrictedSpecialty(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return text === "" || text === "any";
}

function fallbackLocationAllowsSpecialty(location, type, specialtyKey) {
  const typeId = String(type ?? "").trim();
  if (!typeId || !location || typeof location !== "object") return false;
  const capabilities = Array.isArray(location.capabilities) ? location.capabilities : [];
  const matches = capabilities.filter(capability => String(capability?.type ?? "").trim() === typeId);
  if (!matches.length) return false;
  if (isUnrestrictedSpecialty(specialtyKey)) return true;
  const requested = String(specialtyKey).trim();
  return matches.some(capability => {
    const stored = String(capability?.specialty ?? "").trim();
    return isUnrestrictedSpecialty(stored) || stored === requested;
  });
}

function capabilityMeetsTier(actual, required, locationApi) {
  if (typeof locationApi?.meetsTier === "function") return locationApi.meetsTier(actual, required) === true;
  const order = locationApi?.capabilityTiers
    ? Array.from(locationApi.capabilityTiers, String)
    : TIER_ORDER;
  const ranks = new Map(order.map((tier, index) => [tier, index]));
  const actualRank = ranks.get(String(actual ?? ""));
  const requiredRank = ranks.get(String(required ?? ""));
  if (actualRank === undefined || requiredRank === undefined) return String(actual ?? "") === String(required ?? "");
  return actualRank >= requiredRank;
}

function listedWorkshopToolKey(tool, specialties) {
  if (!Array.isArray(specialties)) return null;
  const wanted = new Set([lookupKey(tool), lookupKey(canonicalArtisanToolName(tool))].filter(Boolean));
  for (const entry of specialties) {
    const id = lookupKey(entry?.id);
    const label = lookupKey(entry?.label);
    if ((id && wanted.has(id)) || (label && wanted.has(label))) return String(entry.id);
  }
  return null;
}

function localWorkshopToolKey(tool) {
  return WORKSHOP_TOOL_KEYS.get(lookupKey(canonicalArtisanToolName(tool))) ?? null;
}

export function describeWorkshopSpecialty(tool, locationApi = null) {
  const label = canonicalArtisanToolName(tool);
  if (!label || typeof locationApi?.toolCapabilityType !== "function") return null;
  let capabilityType = null;
  try {
    capabilityType = locationApi.toolCapabilityType(label);
  } catch {
    return null;
  }
  if (capabilityType !== "workshop") return null;
  let listed = null;
  if (typeof locationApi.listWorkshopSpecialties === "function") {
    try { listed = locationApi.listWorkshopSpecialties(); }
    catch { listed = null; }
  }
  const toolKey = listedWorkshopToolKey(label, listed) ?? localWorkshopToolKey(label);
  return toolKey ? { toolKey, label } : null;
}

function workshopSpecialtyAllowed(location, context, toolKey, tier, locationApi) {
  const capabilities = [
    ...(Array.isArray(location?.capabilities) ? location.capabilities : []),
    ...(Array.isArray(context?.capabilities) ? context.capabilities : [])
  ].filter(capability =>
    String(capability?.type ?? "").trim() === "workshop"
    && capabilityMeetsTier(capability?.tier, tier, locationApi)
  );
  const narrowed = { ...(location && typeof location === "object" ? location : {}), capabilities };
  if (typeof locationApi?.locationAllowsSpecialty === "function") {
    return locationApi.locationAllowsSpecialty(narrowed, "workshop", toolKey) === true;
  }
  return fallbackLocationAllowsSpecialty(narrowed, "workshop", toolKey);
}

export function evaluateCraftingEnvironment(recipe, context = {}, locationApi = null) {
  const environment = normalizeCraftEnvironment(recipe?.craft?.environment ?? recipe?.craft ?? {});
  const location = context.location ?? locationApi?.current?.() ?? null;
  if (environment.portable) {
    return { passed: true, mode: "portable", environment, location, reasons: [] };
  }
  if (environment.camp && context.atCamp === true) {
    return { passed: true, mode: "camp", environment, location, reasons: [] };
  }
  if (environment.settlement && location && location.settlementType !== "road") {
    return { passed: true, mode: "settlement", environment, location, reasons: [] };
  }
  if (environment.facility) {
    const workshopSpecialty = environment.facility.type === "workshop"
      ? describeWorkshopSpecialty(recipe?.craft?.tool, locationApi)
      : null;
    if (!locationApi?.evaluate && !locationApi?.evaluateRequirements) {
      return { passed: false, mode: "facility", environment, location, workshopSpecialty, reasons: ["Morelord Core Location services are unavailable."] };
    }
    if (locationApi.capabilityTiers && !Array.from(locationApi.capabilityTiers).includes(environment.facility.tier)) {
      return { passed: false, mode: "facility", environment, location, workshopSpecialty, reasons: [`No ${environment.facility.tier} facility tier is available in Core.`] };
    }
    // Type and tier only. Naming a specialty here would reject a Workshop whose specialty is Any.
    const requirement = { kind: "capability", type: environment.facility.type, tier: environment.facility.tier };
    const result = locationApi.evaluate
      ? locationApi.evaluate([requirement], { ...context, location })
      : locationApi.evaluateRequirements([requirement], { ...context, location });
    if (result.passed && workshopSpecialty && !workshopSpecialtyAllowed(location, context, workshopSpecialty.toolKey, environment.facility.tier, locationApi)) {
      return {
        passed: false,
        mode: "facility",
        environment,
        location,
        workshopSpecialty,
        reasons: [`Requires ${environment.facility.tier} workshop whose specialty is ${workshopSpecialty.label} or Any.`],
        evaluation: result
      };
    }
    if (result.passed) return { passed: true, mode: "facility", environment, location, workshopSpecialty, reasons: [] };
    return {
      passed: false,
      mode: "facility",
      environment,
      location,
      workshopSpecialty,
      reasons: [`Requires ${environment.facility.tier} ${environment.facility.type}.`],
      evaluation: result
    };
  }
  return { passed: false, mode: "unavailable", environment, location, reasons: ["This recipe cannot be worked in the current environment."] };
}

export class CraftingEnvironmentService {
  get locationApi() {
    return getMorelordCoreService("locations");
  }

  evaluate(recipe, context = {}) {
    return evaluateCraftingEnvironment(
      recipe?.id ? { ...recipe, craft: { ...recipe.craft, environment: recipeFacilityEnvironment(recipe) } } : recipe,
      this.#activeDowntimeContext(context),
      this.locationApi
    );
  }

  facilityOptions() {
    return getCraftingFacilityOptions(this.locationApi);
  }

  workshopSpecialty(recipe) {
    if (recipe?.craft?.environment?.facility?.type !== "workshop") return null;
    return describeWorkshopSpecialty(recipe?.craft?.tool, this.locationApi);
  }

  #activeDowntimeContext(context) {
    if (context.location) return context;
    if (typeof this.locationApi?.activeContext === "function") {
      try {
        const active = this.locationApi.activeContext(game.user);
        if (active?.location) return { ...context, location: active.location };
        if (active?.source === "downtime" || active?.source === "road") {
          return { ...context, location: active.location ?? null };
        }
        if (active && typeof active === "object") return context;
      } catch {
        // Older or partial Core builds fall through to the local lookup.
      }
    }
    return this.#legacyDowntimeContext(context);
  }

  #legacyDowntimeContext(context) {
    try {
      const state = game.settings.get("morelord-downtime", "projectState");
      const session = Object.values(state?.sessions ?? {})
        .find(entry => entry?.status === "active");
      if (!session) return context;
      const location = session.locationId
        ? this.locationApi?.get?.(session.locationId) ?? null
        : {
            id: "road",
            name: "On the Road",
            settlementType: "road",
            capabilities: []
          };
      return { ...context, location, downtimeSession: session };
    } catch {
      return context;
    }
  }
}
