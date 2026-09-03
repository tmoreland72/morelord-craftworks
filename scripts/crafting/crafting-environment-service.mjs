import { getMorelordCoreService } from "../core/morelord-core-api.mjs";

const VALID_TIERS = new Set(["common", "uncommon", "rare", "veryRare", "legendary"]);

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
    if (!locationApi?.evaluate && !locationApi?.evaluateRequirements) {
      return { passed: false, mode: "facility", environment, location, reasons: ["Morelord Core Location services are unavailable."] };
    }
    const requirement = { kind: "capability", ...environment.facility };
    const result = locationApi.evaluate
      ? locationApi.evaluate([requirement], { ...context, location })
      : locationApi.evaluateRequirements([requirement], { ...context, location });
    if (result.passed) return { passed: true, mode: "facility", environment, location, reasons: [] };
    return {
      passed: false,
      mode: "facility",
      environment,
      location,
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
      recipe,
      this.#activeDowntimeContext(context),
      this.locationApi
    );
  }

  facilityOptions() {
    return getCraftingFacilityOptions(this.locationApi);
  }

  #activeDowntimeContext(context) {
    if (context.location) return context;
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
