import { MODULE_ID } from "../constants.mjs";

export const CORE_MODULE_ID = "morelord-core";
export const PRODUCT_SLUG = MODULE_ID;

export class EntitlementService {
  static get coreModule() {
    return game.modules.get(CORE_MODULE_ID) ?? null;
  }

  static get api() {
    return this.coreModule?.active ? this.coreModule.api ?? null : null;
  }

  static isCoreActive() {
    return Boolean(this.api);
  }

  static isConnected() {
    return Boolean(this.api?.isConnected?.());
  }

  static getTier() {
    return this.api?.getTier?.(PRODUCT_SLUG) ?? "standard";
  }

  static hasFeature(featureKey) {
    return Boolean(this.api?.hasFeature?.(featureKey, PRODUCT_SLUG));
  }

  static getEntitlements() {
    return this.api?.getEntitlements?.(PRODUCT_SLUG) ?? null;
  }

  static async refresh({ quiet = true } = {}) {
    if (!this.api?.refresh) return null;

    try {
      return await this.api.refresh(PRODUCT_SLUG, { quiet });
    } catch (error) {
      console.error("Morelord Craftworks | Unable to refresh Craftworks entitlements", error);
      if (!quiet) {
        ui.notifications.error(
          error?.message ?? "Craftworks premium access could not be refreshed."
        );
      }
      return null;
    }
  }

  static openAccount() {
    if (this.api?.open) {
      this.api.open();
      return;
    }

    ui.notifications.warn(
      "Morelord Core must be enabled before a Morelord account can be connected."
    );
  }

  static status() {
    const entitlements = this.getEntitlements();
    return {
      coreActive: this.isCoreActive(),
      connected: this.isConnected(),
      tier: this.getTier(),
      validatedAt: entitlements?.validatedAt ?? null,
      expiresAt: entitlements?.expiresAt ?? null
    };
  }
}
