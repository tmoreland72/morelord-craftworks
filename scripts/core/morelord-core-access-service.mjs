import { EntitlementService } from "../services/entitlement-service.mjs";

const PREMIUM_TIERS = new Set(["premium", "tools-premium", "tools_premium", "champion"]);

export class MorelordCoreAccessService {
  async refresh({ quiet = true } = {}) {
    await EntitlementService.refresh({ quiet });
    return this.snapshot();
  }

  openAccount() {
    EntitlementService.openAccount();
  }

  hasEntitlement(entitlementId) {
    const entitlements = EntitlementService.getEntitlements();
    const values = entitlements?.entitlements ?? [];
    const target = String(entitlementId ?? "").trim().toLowerCase();
    return Array.from(values ?? []).some(value => {
      const id = typeof value === "string" ? value : value?.id ?? value?.key ?? value?.slug;
      return String(id ?? "").trim().toLowerCase() === target;
    });
  }

  hasFeature(featureId) {
    return EntitlementService.hasFeature(featureId);
  }

  hasPremiumAccess() {
    return PREMIUM_TIERS.has(String(EntitlementService.getTier() ?? "").toLowerCase());
  }

  hasAccess(pack) {
    const features = Array.isArray(pack?.requiredFeatures) ? pack.requiredFeatures : [];
    if (features.length) return features.every(feature => this.hasFeature(feature));

    const entitlements = Array.isArray(pack?.requiredEntitlements) ? pack.requiredEntitlements : [];
    if (entitlements.length) return entitlements.every(id => this.hasEntitlement(id));

    if (!pack?.premium) return true;
    return this.hasPremiumAccess();
  }

  snapshot() {
    const status = EntitlementService.status();
    const tier = String(status.tier ?? "standard").toLowerCase();
    return {
      available: status.coreActive,
      coreActive: status.coreActive,
      connected: status.connected,
      premium: PREMIUM_TIERS.has(tier),
      tier,
      tierLabel: tier === "champion" ? "Tools Champion" : tier === "premium" ? "Tools Premium" : "Standard",
      validatedAt: status.validatedAt,
      validatedAtLabel: status.validatedAt ? new Date(status.validatedAt).toLocaleString() : null,
      expiresAt: status.expiresAt,
      entitlements: Array.from(EntitlementService.getEntitlements()?.entitlements ?? []),
      features: []
    };
  }
}
