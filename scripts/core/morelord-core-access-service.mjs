import { EntitlementService } from "../services/entitlement-service.mjs";

const PREMIUM_TIERS = new Set(["premium", "tools-premium", "tools_premium", "champion"]);

export class MorelordCoreAccessService {
  async refresh({ quiet = true } = {}) {
    // Morelord Core may persist refreshed entitlement state in world settings.
    // Player clients initialize this service too, but cannot update world
    // settings, so they must consume Core's current snapshot without forcing
    // a refresh. The connected GM remains the authority for persistence.
    if (!game.user?.isGM) return this.snapshot();

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
    // Standard content is available locally and must not require a connected
    // Morelord account. Entitlement checks apply only to premium packs.
    if (!pack?.premium) return true;

    const features = Array.isArray(pack?.requiredFeatures) ? pack.requiredFeatures : [];
    if (features.length) return features.every(feature => this.hasFeature(feature));

    const entitlements = Array.isArray(pack?.requiredEntitlements) ? pack.requiredEntitlements : [];
    if (entitlements.length) return entitlements.every(id => this.hasEntitlement(id));

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
