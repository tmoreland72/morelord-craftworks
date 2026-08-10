const CORE_MODULE_ID = "morelord-core";

const PREMIUM_TIERS = new Set([
  "premium",
  "tools-premium",
  "tools_premium",
  "champion"
]);

export class MorelordCoreAccessService {
  constructor() {
    this.entitlements = new Set();
    this.features = new Set();
    this.available = false;
    this.premium = false;
    this.tier = null;
    this.source = "unavailable";
    this.details = [];
  }

  async refresh() {
    this.entitlements.clear();
    this.features.clear();
    this.available = false;
    this.premium = false;
    this.tier = null;
    this.source = "unavailable";
    this.details = [];

    const coreModule = game.modules.get(CORE_MODULE_ID);
    if (!coreModule?.active) {
      this.details.push("Morelord Core is not active.");
      return this.snapshot();
    }

    this.available = true;

    const candidates = [
      ["module.api", coreModule.api],
      ["globalThis.MorelordCore", globalThis.MorelordCore],
      ["globalThis.morelordCore", globalThis.morelordCore]
    ].filter(([, value]) => value);

    if (!candidates.length) {
      this.source = "core-active-no-public-api";
      this.details.push("Morelord Core is active but no public API object was found.");
      return this.snapshot();
    }

    for (const [label, api] of candidates) {
      await this.#inspectApi(api, label);

      if (this.premium || this.entitlements.size || this.features.size || this.tier) {
        this.source = label;
        break;
      }
    }

    if (this.hasEntitlement("premium-modules")) {
      this.premium = true;
    }

    if (this.#tierIsPremium(this.tier)) {
      this.premium = true;
    }

    if (this.hasFeature("premium-modules")
      || this.hasFeature("premium")
      || this.hasFeature("tools-premium")
      || this.hasFeature("champion")) {
      this.premium = true;
    }

    if (!this.source || this.source === "unavailable") {
      this.source = "morelord-core";
    }

    return this.snapshot();
  }

  hasEntitlement(entitlementId) {
    const id = this.#normalize(entitlementId);
    return id ? this.entitlements.has(id) : false;
  }

  hasFeature(featureId) {
    const id = this.#normalize(featureId);
    return id ? this.features.has(id) : false;
  }

  hasPremiumAccess() {
    return Boolean(this.premium);
  }

  hasAccess(pack) {
    if (!pack?.premium) return true;

    const required = Array.isArray(pack.requiredEntitlements)
      ? pack.requiredEntitlements
      : [];

    if (required.length && required.every(id => this.hasEntitlement(id))) {
      return true;
    }

    // Morelord Core already represents account/install access through tiers.
    // Premium and Champion both satisfy Craftworks Premium.
    return this.hasPremiumAccess();
  }

  snapshot() {
    return {
      available: this.available,
      source: this.source,
      premium: this.premium,
      tier: this.tier,
      entitlements: Array.from(this.entitlements),
      features: Array.from(this.features),
      details: [...this.details]
    };
  }

  async #inspectApi(api, label) {
    if (!api) return;

    this.details.push(`Inspecting ${label}.`);

    // Explicit entitlement APIs.
    for (const method of ["getEntitlements", "entitlementsForUser"]) {
      if (typeof api[method] === "function") {
        try {
          const value = await api[method]();
          this.#consumeValue(value, `${label}.${method}()`);
        } catch (err) {
          this.details.push(`${label}.${method}() failed: ${err?.message ?? String(err)}`);
        }
      }
    }

    if (typeof api.hasEntitlement === "function") {
      for (const id of ["premium-modules", "champion-access"]) {
        try {
          if (await api.hasEntitlement(id)) this.entitlements.add(id);
        } catch {}
      }
    }

    // Explicit feature/access APIs used by Core-style modules.
    for (const method of [
      "getAccess",
      "getAccessState",
      "getMembership",
      "getAccount",
      "getStatus",
      "getInstallation",
      "getInstallationStatus",
      "getLicense",
      "getValidation"
    ]) {
      if (typeof api[method] === "function") {
        try {
          const value = await api[method]();
          this.#consumeValue(value, `${label}.${method}()`);
        } catch {
          // Some installation APIs require a product id; ignore no-arg failure.
        }
      }
    }

    for (const method of ["hasFeature", "featureEnabled", "isFeatureEnabled"]) {
      if (typeof api[method] === "function") {
        for (const id of ["premium-modules", "premium", "tools-premium", "champion"]) {
          try {
            if (await api[method](id)) this.features.add(id);
          } catch {}
        }
      }
    }

    for (const method of ["isPremium", "hasPremiumAccess"]) {
      if (typeof api[method] === "function") {
        try {
          if (await api[method]()) this.premium = true;
        } catch {}
      }
    }

    // Public state objects.
    for (const [key, value] of Object.entries(api)) {
      if (typeof value === "function") continue;
      this.#consumeValue(value, `${label}.${key}`, 0);
    }
  }

  #consumeValue(value, sourceLabel, depth = 0, seen = new WeakSet()) {
    if (value == null || depth > 5) return;

    if (typeof value === "string") {
      this.#consumeString(value, sourceLabel);
      return;
    }

    if (typeof value === "boolean") {
      return;
    }

    if (typeof value !== "object") return;

    if (seen.has(value)) return;
    seen.add(value);

    if (Array.isArray(value) || value instanceof Set) {
      for (const entry of value) {
        this.#consumeValue(entry, sourceLabel, depth + 1, seen);
      }
      return;
    }

    const entries = Object.entries(value);

    for (const [rawKey, rawValue] of entries) {
      const key = this.#normalize(rawKey);

      if (key === "tier" && typeof rawValue === "string") {
        this.#setTier(rawValue, sourceLabel);
        continue;
      }

      if (["premium", "ispremium", "premiumaccess", "haspremiumaccess"].includes(key)
        && rawValue === true) {
        this.premium = true;
        this.details.push(`Premium access detected from ${sourceLabel}.${rawKey}.`);
        continue;
      }

      if (["entitlement", "entitlements"].includes(key)) {
        this.#consumeEntitlements(rawValue, `${sourceLabel}.${rawKey}`);
        continue;
      }

      if (["feature", "features"].includes(key)) {
        this.#consumeFeatures(rawValue, `${sourceLabel}.${rawKey}`);
        continue;
      }

      // A Core installation record can expose feature:true together with
      // tier:premium/champion. Tier is authoritative; generic feature:true alone
      // is not treated as premium.
      this.#consumeValue(rawValue, `${sourceLabel}.${rawKey}`, depth + 1, seen);
    }
  }

  #consumeEntitlements(value, sourceLabel) {
    for (const id of this.#idsFromValue(value)) {
      this.entitlements.add(id);
      this.details.push(`Entitlement '${id}' detected from ${sourceLabel}.`);
    }
  }

  #consumeFeatures(value, sourceLabel) {
    if (typeof value === "boolean") return;

    for (const id of this.#idsFromValue(value)) {
      this.features.add(id);
      this.details.push(`Feature '${id}' detected from ${sourceLabel}.`);
    }
  }

  #idsFromValue(value) {
    if (!value) return [];

    if (typeof value === "string") {
      const id = this.#normalize(value);
      return id ? [id] : [];
    }

    if (Array.isArray(value) || value instanceof Set) {
      return Array.from(value)
        .map(entry => {
          if (typeof entry === "string") return this.#normalize(entry);
          if (entry && typeof entry === "object") {
            return this.#normalize(
              entry.id ?? entry.key ?? entry.slug ?? entry.entitlement ?? entry.feature
            );
          }
          return "";
        })
        .filter(Boolean);
    }

    if (typeof value === "object") {
      const direct = this.#normalize(
        value.id ?? value.key ?? value.slug ?? value.entitlement ?? value.feature
      );
      if (direct) return [direct];

      return Object.entries(value)
        .filter(([, enabled]) => enabled === true)
        .map(([id]) => this.#normalize(id))
        .filter(Boolean);
    }

    return [];
  }

  #consumeString(value, sourceLabel) {
    const normalized = this.#normalize(value);

    if (PREMIUM_TIERS.has(normalized)) {
      this.#setTier(normalized, sourceLabel);
    }

    if (normalized === "premium-modules" || normalized === "champion-access") {
      this.entitlements.add(normalized);
    }
  }

  #setTier(value, sourceLabel) {
    const tier = this.#normalize(value);
    if (!tier) return;

    if (!this.tier || this.#tierRank(tier) > this.#tierRank(this.tier)) {
      this.tier = tier;
      this.details.push(`Tier '${tier}' detected from ${sourceLabel}.`);
    }

    if (this.#tierIsPremium(tier)) this.premium = true;
  }

  #tierIsPremium(value) {
    return PREMIUM_TIERS.has(this.#normalize(value));
  }

  #tierRank(value) {
    const tier = this.#normalize(value);
    if (tier === "champion") return 30;
    if (["premium", "tools-premium", "tools_premium"].includes(tier)) return 20;
    if (tier === "free") return 10;
    return 0;
  }

  #normalize(value) {
    return String(value ?? "").trim().toLowerCase();
  }
}
