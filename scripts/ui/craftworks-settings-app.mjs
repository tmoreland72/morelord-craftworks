import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";
import {
  SETTINGS,
  getSetting,
  getGatherDcOverrides,
  setGatherDcOverrides
} from "../core/settings.mjs";
import {
  CONTENT_PACKS,
  getContentPackSettingKey
} from "../../data/content-packs.mjs";
import { getContentPackManifest } from "../../data/packs/manifests.mjs";
import { EntitlementService } from "../services/entitlement-service.mjs";
import {
  getGatherProfiles
} from "../acquisition/gather-profiles.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CraftworksSettingsApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static craftworks = null;

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-settings",
    classes: ["morelord-craftworks", "mcw-window"],
    position: {
      width: 820,
      height: 820
    },
    window: {
      title: `${MODULE_TITLE} — Settings`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/craftworks-settings.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const craftworks = this.constructor.craftworks;

    // Match Marketplace: settings entitlement state talks directly to Core and
    // does not depend on the rest of Craftworks having completed startup.
    await EntitlementService.refresh({ quiet: true });
    const entitlementStatus = EntitlementService.status();
    const tier = String(entitlementStatus.tier ?? "standard").toLowerCase();
    const core = {
      ...entitlementStatus,
      available: entitlementStatus.coreActive,
      tierLabel: tier === "champion"
        ? "Tools Champion"
        : tier === "premium"
          ? "Tools Premium"
          : "Standard",
      validatedAtLabel: entitlementStatus.validatedAt
        ? new Date(entitlementStatus.validatedAt).toLocaleString()
        : null
    };

    const groups = game.actors
      .filter(actor => actor.type === "group")
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.name,
        selected: actor.uuid === getSetting(SETTINGS.PARTY_ACTOR_UUID)
      }))
      .sort((a,b) => a.name.localeCompare(b.name));

    const packs = [...CONTENT_PACKS]
      .sort((a,b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))
      .map(pack => {
        const state = craftworks?.contentPacks?.describe(pack.id);
        const requiredFeatures = Array.isArray(pack.requiredFeatures) ? pack.requiredFeatures : [];
        const hasAccess = state?.hasAccess ?? (
          requiredFeatures.length
            ? requiredFeatures.every(feature => EntitlementService.hasFeature(feature))
            : !pack.premium
        );
        const enabled = state?.configured ?? Boolean(
          game.settings.get(MODULE_ID, getContentPackSettingKey(pack.id))
        );

        const manifest = craftworks?.contentPacks?.manifest(pack.id) ?? getContentPackManifest(pack.id);

        return {
          ...pack,
          active: state?.active ?? (enabled && hasAccess),
          enabled,
          canEnable: hasAccess,
          counts: {
            materials: manifest?.materials?.entries?.length ?? (
              manifest?.materials?.seedPath ? "seed" : 0
            ),
            recipes: manifest?.recipes?.length ?? 0,
            harvest: manifest?.harvestProfiles?.length ?? 0,
            gathering: manifest?.gatheringProfiles?.length ?? 0,
            loot: manifest?.lootTiers?.length ?? 0,
            encounter: manifest?.encounterLootProfiles?.length ?? 0
          },
          requiredFeature:
            Array.isArray(pack.requiredFeatures)
              ? pack.requiredFeatures[0] ?? null
              : null,
          statusLabel: hasAccess
            ? (pack.premium ? "Premium" : "Available")
            : "Access Required"
        };
      });

    const gatherOverrides = getGatherDcOverrides();
    const activeGatherPackIds = new Set(
      packs
        .filter(pack => pack.active)
        .map(pack => pack.id)
    );

    const gatherTerrains = getGatherProfiles({
      activePackIds: [...activeGatherPackIds]
    })
      .map(profile => {
        const hasOverride = Object.prototype.hasOwnProperty.call(
          gatherOverrides,
          profile.id
        );

        const sourcePack = packs.find(
          pack => pack.id === profile.packId
        );

        return {
          id: profile.id,
          name: profile.name,
          packId: profile.packId,
          packLabel:
            sourcePack?.shortLabel
            ?? sourcePack?.label
            ?? profile.packId,
          defaultDc: Number(profile.dc ?? 10),
          dc: hasOverride
            ? Number(gatherOverrides[profile.id])
            : Number(profile.dc ?? 10),
          overridden: hasOverride
        };
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name)
        || a.packLabel.localeCompare(b.packLabel)
      );

    return foundry.utils.mergeObject(context, {
      core,

      packs,
      groups,

      materials: {
        usePartyRecipient: getSetting(SETTINGS.USE_PARTY_RECIPIENT),
        partyActorUuid: getSetting(SETTINGS.PARTY_ACTOR_UUID),

        harvestDcModifier: getSetting(SETTINGS.HARVEST_DC_MODIFIER),
        harvestChoicesMin: getSetting(SETTINGS.HARVEST_CHOICES_MIN),
        harvestChoicesMax: getSetting(SETTINGS.HARVEST_CHOICES_MAX),
        harvestRareBias: getSetting(SETTINGS.HARVEST_RARE_BIAS),
        harvestNat20DoubleClaim: getSetting(
          SETTINGS.HARVEST_NAT20_DOUBLE_CLAIM
        ),

        gatherDcModifier: getSetting(SETTINGS.GATHER_DC_MODIFIER),
        gatherTerrains,
        gatherQuantityMultiplier: getSetting(SETTINGS.GATHER_QUANTITY_MULTIPLIER),
        gatherRareBias: getSetting(SETTINGS.GATHER_RARE_BIAS),

        lootEnableMaterials: getSetting(SETTINGS.LOOT_ENABLE_MATERIALS),
        lootEnableCoin: getSetting(SETTINGS.LOOT_ENABLE_COIN),
        lootEnableSpecial: getSetting(SETTINGS.LOOT_ENABLE_SPECIAL),
        lootMaterialChanceModifier: getSetting(SETTINGS.LOOT_MATERIAL_CHANCE_MODIFIER),
        lootCoinChanceModifier: getSetting(SETTINGS.LOOT_COIN_CHANCE_MODIFIER),
        lootSpecialChanceModifier: getSetting(SETTINGS.LOOT_SPECIAL_CHANCE_MODIFIER),
        lootMaterialQuantityMultiplier: getSetting(SETTINGS.LOOT_MATERIAL_QUANTITY_MULTIPLIER),
        lootCoinMultiplier: getSetting(SETTINGS.LOOT_COIN_MULTIPLIER)
      },

      recipeCount: craftworks?.recipes?.all()?.length ?? 0,
      premiumCraftingAvailable:
        EntitlementService.hasFeature("craftworks.advanced-crafting")
    }, { inplace:false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='save']")
      ?.addEventListener("click", event => this.#save(event));

    this.element.querySelector("[data-action='manage-account']")
      ?.addEventListener("click", event => {
        event.preventDefault();
        EntitlementService.openAccount();
      });

    this.element.querySelector("[data-action='refresh-core']")
      ?.addEventListener("click", async event => {
        event.preventDefault();
        const target = event.currentTarget;
        target.disabled = true;

        try {
          await EntitlementService.refresh({ quiet: false });
          await this.render({ force: true });
        } finally {
          target.disabled = false;
        }
      });
  }

  async #save(event) {
    event.preventDefault();

    const form = this.element.querySelector("form");
    if (!form) return;

    const data = new FormData(form);
    const bool = name => data.has(name);
    const number = name => Number(data.get(name) ?? 0);
    const string = name => String(data.get(name) ?? "");

    const updates = [
      [SETTINGS.USE_PARTY_RECIPIENT, bool("usePartyRecipient")],
      [SETTINGS.PARTY_ACTOR_UUID, string("partyActorUuid")],

      [SETTINGS.HARVEST_DC_MODIFIER, number("harvestDcModifier")],
      [SETTINGS.HARVEST_CHOICES_MIN, number("harvestChoicesMin")],
      [SETTINGS.HARVEST_CHOICES_MAX, number("harvestChoicesMax")],
      [SETTINGS.HARVEST_RARE_BIAS, number("harvestRareBias")],
      [
        SETTINGS.HARVEST_NAT20_DOUBLE_CLAIM,
        bool("harvestNat20DoubleClaim")
      ],

      [SETTINGS.GATHER_DC_MODIFIER, number("gatherDcModifier")],
      [SETTINGS.GATHER_QUANTITY_MULTIPLIER, number("gatherQuantityMultiplier")],
      [SETTINGS.GATHER_RARE_BIAS, number("gatherRareBias")],

      [SETTINGS.LOOT_ENABLE_MATERIALS, bool("lootEnableMaterials")],
      [SETTINGS.LOOT_ENABLE_COIN, bool("lootEnableCoin")],
      [SETTINGS.LOOT_ENABLE_SPECIAL, bool("lootEnableSpecial")],
      [SETTINGS.LOOT_MATERIAL_CHANCE_MODIFIER, number("lootMaterialChanceModifier")],
      [SETTINGS.LOOT_COIN_CHANCE_MODIFIER, number("lootCoinChanceModifier")],
      [SETTINGS.LOOT_SPECIAL_CHANCE_MODIFIER, number("lootSpecialChanceModifier")],
      [SETTINGS.LOOT_MATERIAL_QUANTITY_MULTIPLIER, number("lootMaterialQuantityMultiplier")],
      [SETTINGS.LOOT_COIN_MULTIPLIER, number("lootCoinMultiplier")]
    ];

    for (const [key, value] of updates) {
      await game.settings.set(MODULE_ID, key, value);
    }

    const gatherDcOverrides = {};

    for (const [name, value] of data.entries()) {
      if (!String(name).startsWith("gatherDc:")) continue;

      const profileId = String(name).slice("gatherDc:".length);
      const numeric = Number(value);

      if (!profileId || !Number.isFinite(numeric)) continue;

      gatherDcOverrides[profileId] = Math.max(
        1,
        Math.round(numeric)
      );
    }

    await setGatherDcOverrides(gatherDcOverrides);

    for (const pack of CONTENT_PACKS) {
      const key = getContentPackSettingKey(pack.id);
      const requiredFeatures = Array.isArray(pack.requiredFeatures)
        ? pack.requiredFeatures
        : [];
      const hasAccess = requiredFeatures.length
        ? requiredFeatures.every(feature => EntitlementService.hasFeature(feature))
        : !pack.premium;

      const requested = bool(`pack:${pack.id}`);
      const enabled = pack.premium && !hasAccess ? false : requested;

      await game.settings.set(MODULE_ID, key, enabled);
    }

    ui.notifications.info("Morelord Craftworks settings saved.");
    await this.close();
  }
}
