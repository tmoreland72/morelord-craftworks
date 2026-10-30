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
export function parseFacilityRule(value) {
  const text = String(value ?? "").trim();
  if (!text) return { type: "", specialty: "" };
  const splitAt = text.indexOf(":");
  if (splitAt > 0) {
    const type = text.slice(0, splitAt).trim();
    const specialty = text.slice(splitAt + 1).trim();
    if (type && specialty && !isUnrestrictedSpecialty(specialty)) return { type, specialty };
  }
  return { type: text, specialty: "" };
}

export function facilityRuleValue(type, specialty = "") {
  const typeId = String(type ?? "").trim();
  const key = String(specialty ?? "").trim();
  if (!typeId) return "";
  if (!key || isUnrestrictedSpecialty(key)) return typeId;
  return `${typeId}:${key}`;
}

export function recipeFacilityEnvironment(recipe, rules = getCraftingFacilityRules()) {
  const drakkenheim = recipe?.packId === "monsters-of-drakkenheim" || recipe?.source?.contentPackId === "monsters-of-drakkenheim";
  const rule = drakkenheim
    ? { type: "workshop", specialty: "" }
    : parseFacilityRule(facilityRuleForTool(rules, recipe?.craft?.tool ?? ""));
  const rarity = String(recipe?.output?.rarity ?? recipe?.rarity ?? "common").replace(/[^a-z]/gi, "").toLowerCase();
  const tier = rarity === "veryrare" ? "veryRare" : VALID_TIERS.has(rarity) ? rarity : "common";
  return normalizeCraftEnvironment({
    facility: rule.type ? { type: rule.type, tier, specialty: rule.specialty } : null
  });
}

function specialtyGroupsForType(type, locationApi) {
  const id = String(type?.id ?? "").trim();
  if (locationApi && typeof locationApi.buildSpecialtyOptions === "function") {
    try {
      const built = locationApi.buildSpecialtyOptions(id);
      const groups = (built?.groups ?? [])
        .map(group => ({
          label: String(group?.label ?? "").trim(),
          options: (group?.options ?? [])
            .map(option => ({
              value: String(option?.value ?? "").trim(),
              label: String(option?.label ?? option?.value ?? "").trim()
            }))
            .filter(option => option.value)
        }))
        .filter(group => group.options.length);
      if (groups.length) return groups;
    } catch {
      // Fall back to the workshop list Craftworks already knows.
    }
  }
  if (id === "workshop") {
    return [{ label: "", options: WORKSHOP_TOOLS.map(([value, label]) => ({ value, label })) }];
  }
  return [];
}

export function getCraftingFacilityOptions(locationApi = null) {
  const types = (locationApi?.listCapabilities?.() ?? []).map(type => ({
    id: String(type.id),
    name: String(type.name ?? type.id),
    icon: String(type.icon ?? "fa-solid fa-location-dot"),
    supportsSpecialty: type.supportsSpecialty === true
  }));
  const tiers = locationApi?.capabilityTiers ?? Array.from(VALID_TIERS);
  const choices = [];
  for (const type of types) {
    const groups = specialtyGroupsForType(type, locationApi);
    if (!groups.length) {
      choices.push({ group: "", options: [{ value: type.id, label: type.name }] });
      continue;
    }
    const own = [{ value: type.id, label: type.name }];
    const labeled = [];
    for (const group of groups) {
      const options = group.options.map(option => ({
        value: facilityRuleValue(type.id, option.value),
        label: `${type.name}: ${option.label}`
      }));
      if (!group.label) own.push(...options);
      else labeled.push({ group: `${type.name}: ${group.label}`, options });
    }
    choices.push({ group: type.name, options: own });
    choices.push(...labeled);
  }

  return { types, tiers: Array.from(tiers, String), choices };
}

export function facilityChoicesForSelection(choices, selected = "") {
  const wanted = String(selected ?? "");
  const parsed = parseFacilityRule(wanted);
  const known = choices.some(choice => choice.options.some(option => option.value === wanted));
  const withCurrent = known || !parsed.type ? choices : [
    ...choices,
    {
      group: "",
      options: [{
        value: wanted,
        label: parsed.specialty ? `${parsed.type}: ${parsed.specialty}` : parsed.type
      }]
    }
  ];
  return withCurrent.map(choice => ({
    group: choice.group,
    options: choice.options.map(option => ({ ...option, selected: option.value === wanted }))
  }));
}

export function normalizeCraftEnvironment(raw = {}) {
  const facilityType = String(raw.facility?.type ?? raw.facilityType ?? "").trim() || null;
  const facilityTier = String(raw.facility?.tier ?? raw.facilityTier ?? "common").trim();
  const specialty = String(raw.facility?.specialty ?? raw.facilitySpecialty ?? "").trim();
  if (facilityType && !VALID_TIERS.has(facilityTier)) {
    throw new Error(`Unknown crafting facility tier: ${facilityTier}.`);
  }
  const assigned = specialty && !isUnrestrictedSpecialty(specialty) ? specialty : "";
  return {
    facility: facilityType ? {
      type: facilityType,
      tier: facilityTier,
      ...(assigned ? { specialty: assigned } : {})
    } : null,
    portable: raw.portable == null ? !facilityType : raw.portable === true,
    camp: raw.camp === true,
    settlement: raw.settlement === true
  };
}

const TIER_ORDER = ["common", "uncommon", "rare", "veryRare", "legendary", "artifact"];

// Tool ids Core stores on a Workshop specialty. Smith's Tools and Alchemist's
// Supplies are absent: Core maps those to Forge and Alchemist.
const WORKSHOP_TOOLS = [
  ["brewer", "Brewer's Supplies"],
  ["calligrapher", "Calligrapher's Supplies"],
  ["carpenter", "Carpenter's Tools"],
  ["cartographer", "Cartographer's Tools"],
  ["cobbler", "Cobbler's Tools"],
  ["cook", "Cook's Utensils"],
  ["glassblower", "Glassblower's Tools"],
  ["jeweler", "Jeweler's Tools"],
  ["leatherworker", "Leatherworker's Tools"],
  ["mason", "Mason's Tools"],
  ["painter", "Painter's Supplies"],
  ["potter", "Potter's Tools"],
  ["tinker", "Tinker's Tools"],
  ["weaver", "Weaver's Tools"],
  ["woodcarver", "Woodcarver's Tools"]
];
const WORKSHOP_TOOL_LABELS = new Map(WORKSHOP_TOOLS);

function lookupKey(value) {
  return String(value ?? "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
}

const WORKSHOP_TOOL_KEYS = new Map();
for (const [id, label] of WORKSHOP_TOOLS) {
  WORKSHOP_TOOL_KEYS.set(lookupKey(id), id);
  WORKSHOP_TOOL_KEYS.set(lookupKey(label), id);
}

function isUnrestrictedSpecialty(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return text === "" || text === "any";
}

// Core stores specialty as an array of keys. Empty means Any. A legacy string is one key.
function normalizeSpecialtyList(value) {
  const raw = Array.isArray(value) ? value : [value];
  const keys = [];
  const seen = new Set();
  for (const entry of raw) {
    const key = String(entry ?? "").trim();
    if (!key || isUnrestrictedSpecialty(key) || seen.has(key)) continue;
    seen.add(key);
    keys.push(key);
  }
  return keys;
}

function capabilityAllowsSpecialty(capability, specialtyKey) {
  if (isUnrestrictedSpecialty(specialtyKey)) return true;
  const keys = normalizeSpecialtyList(capability?.specialty);
  if (!keys.length) return true;
  return keys.includes(String(specialtyKey).trim());
}

export function formatWorkshopSpecialty(specialty, labels = null) {
  const keys = normalizeSpecialtyList(specialty);
  if (!keys.length) return "Any";
  return keys.map(key => labels?.[key] ?? WORKSHOP_TOOL_LABELS.get(key) ?? key).join(", ");
}

function fallbackLocationAllowsSpecialty(location, type, specialtyKey) {
  const typeId = String(type ?? "").trim();
  if (!typeId || !location || typeof location !== "object") return false;
  const capabilities = Array.isArray(location.capabilities) ? location.capabilities : [];
  const matches = capabilities.filter(capability => String(capability?.type ?? "").trim() === typeId);
  if (!matches.length) return false;
  return matches.some(capability => capabilityAllowsSpecialty(capability, specialtyKey));
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

function specialtyLabel(type, key, locationApi) {
  const groups = specialtyGroupsForType({ id: type, name: type }, locationApi);
  for (const group of groups) {
    const found = group.options.find(option => option.value === key);
    if (found?.label) return found.label;
  }
  return WORKSHOP_TOOL_LABELS.get(key) ?? key;
}

export function facilityRequirementPhrase(facility, label = "") {
  const base = `${facility.tier} ${facility.type}`;
  return label ? `${base} (${label} or Any)` : base;
}

function specialtyAllowed(location, context, type, specialtyKey, tier, locationApi) {
  const capabilities = [
    ...(Array.isArray(location?.capabilities) ? location.capabilities : []),
    ...(Array.isArray(context?.capabilities) ? context.capabilities : [])
  ].filter(capability =>
    String(capability?.type ?? "").trim() === type
    && capabilityMeetsTier(capability?.tier, tier, locationApi)
  );
  const narrowed = { ...(location && typeof location === "object" ? location : {}), capabilities };
  if (typeof locationApi?.locationAllowsSpecialty === "function") {
    return locationApi.locationAllowsSpecialty(narrowed, type, specialtyKey) === true;
  }
  return fallbackLocationAllowsSpecialty(narrowed, type, specialtyKey);
}

function placeSpecialties(location, type) {
  const rows = (Array.isArray(location?.capabilities) ? location.capabilities : [])
    .filter(capability => String(capability?.type ?? "").trim() === type);
  if (!rows.length) return undefined;
  if (rows.some(capability => normalizeSpecialtyList(capability.specialty).length === 0)) return [];
  const keys = [];
  const seen = new Set();
  for (const capability of rows) {
    for (const key of normalizeSpecialtyList(capability.specialty)) {
      if (seen.has(key)) continue;
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
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
    const specialtyLocation = {
      ...(location && typeof location === "object" ? location : {}),
      capabilities: [
        ...(Array.isArray(location?.capabilities) ? location.capabilities : []),
        ...(Array.isArray(context?.capabilities) ? context.capabilities : [])
      ]
    };
    const assignedKey = String(environment.facility.specialty ?? "").trim();
    const label = assignedKey ? specialtyLabel(environment.facility.type, assignedKey, locationApi) : "";
    const place = assignedKey ? placeSpecialties(specialtyLocation, environment.facility.type) : undefined;
    const labels = {};
    for (const key of place ?? []) labels[key] = specialtyLabel(environment.facility.type, key, locationApi);
    const facilitySpecialty = assignedKey
      ? { key: assignedKey, label, ...(place === undefined ? {} : { place, labels }) }
      : null;
    const phrase = `Requires ${facilityRequirementPhrase(environment.facility, label)}.`;
    if (!locationApi?.evaluate && !locationApi?.evaluateRequirements) {
      return { passed: false, mode: "facility", environment, location, facilitySpecialty, workshopSpecialty: facilitySpecialty, reasons: ["Morelord Core Location services are unavailable."] };
    }
    if (locationApi.capabilityTiers && !Array.from(locationApi.capabilityTiers).includes(environment.facility.tier)) {
      return { passed: false, mode: "facility", environment, location, facilitySpecialty, workshopSpecialty: facilitySpecialty, reasons: [`No ${environment.facility.tier} facility tier is available in Core.`] };
    }
    // Type and tier only. A named specialty is checked afterward so Any still qualifies.
    const requirement = { kind: "capability", type: environment.facility.type, tier: environment.facility.tier };
    const result = locationApi.evaluate
      ? locationApi.evaluate([requirement], { ...context, location })
      : locationApi.evaluateRequirements([requirement], { ...context, location });
    if (result.passed && assignedKey && !specialtyAllowed(location, context, environment.facility.type, assignedKey, environment.facility.tier, locationApi)) {
      return {
        passed: false,
        mode: "facility",
        environment,
        location,
        facilitySpecialty,
        workshopSpecialty: facilitySpecialty,
        reasons: [phrase],
        evaluation: result
      };
    }
    if (result.passed) return { passed: true, mode: "facility", environment, location, facilitySpecialty, workshopSpecialty: facilitySpecialty, reasons: [] };
    return {
      passed: false,
      mode: "facility",
      environment,
      location,
      facilitySpecialty,
      workshopSpecialty: facilitySpecialty,
      reasons: [phrase],
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

  facilitySpecialty(recipe) {
    const facility = recipe?.craft?.environment?.facility;
    const key = String(facility?.specialty ?? "").trim();
    if (!key || isUnrestrictedSpecialty(key)) return null;
    const label = specialtyLabel(facility.type, key, this.locationApi);
    const place = placeSpecialties(this.#viewedLocation(), facility.type);
    const labels = {};
    for (const entry of place ?? []) labels[entry] = specialtyLabel(facility.type, entry, this.locationApi);
    return place === undefined ? { key, label } : { key, label, place, labels };
  }

  workshopSpecialty(recipe) {
    return this.facilitySpecialty(recipe);
  }

  #viewedLocation() {
    const api = this.locationApi;
    if (!api) return null;
    try {
      if (typeof api.activeContext === "function") {
        const resolved = this.#locationFromActiveContext(api.activeContext(globalThis.game?.user));
        if (resolved !== undefined) return resolved;
      }
    } catch {
      // Older Core builds fall through to the scene location.
    }
    return this.#sceneLocation();
  }

  // An explicit Downtime session location wins. No Location is Core's virtual
  // On the Road result; use the viewed scene's associated location instead.
  #locationFromActiveContext(active) {
    if (!active || typeof active !== "object") return undefined;
    if (active.source === "downtime") return active.location ?? null;
    if (active.source === "road") return this.#sceneLocation() ?? active.location ?? null;
    if (Object.hasOwn(active, "location")) return active.location ?? null;
    return undefined;
  }

  #sceneLocation() {
    const api = this.locationApi;
    if (!api) return null;
    try {
      const viewed = globalThis.game?.user?.viewedScene;
      if (viewed && typeof api.forScene === "function") {
        const associated = api.forScene(viewed);
        if (associated) return associated;
      }
    } catch {
      // Fall through to the active scene.
    }
    try {
      return typeof api.current === "function" ? api.current() ?? null : null;
    } catch {
      return null;
    }
  }

  #activeDowntimeContext(context) {
    if (context.location) return context;
    if (typeof this.locationApi?.activeContext === "function") {
      try {
        const active = this.locationApi.activeContext(game.user);
        const location = this.#locationFromActiveContext(active);
        if (location !== undefined) return { ...context, location };
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
      if (session.locationId) {
        return {
          ...context,
          location: this.locationApi?.get?.(session.locationId) ?? null,
          downtimeSession: session
        };
      }
      const sceneLocation = this.#sceneLocation();
      if (sceneLocation) return { ...context, location: sceneLocation, downtimeSession: session };
      return {
        ...context,
        location: {
          id: "road",
          name: "On the Road",
          settlementType: "road",
          capabilities: [],
          metadata: { virtual: true }
        },
        downtimeSession: session
      };
    } catch {
      return context;
    }
  }
}
