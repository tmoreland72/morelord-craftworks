import { canonicalFacilityRule, craftingFacilityToolNames, defaultFacilityRuleForTool, facilityAssignmentsAreSet, facilityChoicesForSelection, facilityRuleForTool, getCraftingFacilityOptions, getCraftingFacilityRules } from "../crafting/crafting-environment-service.mjs";
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
import { EntitlementService } from "../services/entitlement-service.mjs";
import {
  getGatherProfiles
} from "../acquisition/gather-profiles.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
import { contentPackPresentation } from "./content-pack-presentation.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CraftworksSettingsApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  static craftworks = null;

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-settings",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"],
    position: {
      width: 980,
      height: 860
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
          !pack.premium
            ? true
            : requiredFeatures.length
            ? requiredFeatures.every(feature => EntitlementService.hasFeature(feature))
            : false
        );
        const enabled = state?.configured ?? Boolean(
          game.settings.get(MODULE_ID, getContentPackSettingKey(pack.id))
        );

        return {
          ...pack,
          ...contentPackPresentation(pack, game.modules),
          active: state?.active ?? (enabled && hasAccess),
          enabled,
          canEnable: hasAccess,
          accessRequired: !hasAccess
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

    const lastContentSync =
      String(
        getSetting(
          SETTINGS.CONTENT_SYNC_LAST_AT
        ) ?? ""
      );

    const contentSyncStatus = {
      lastAt:
        lastContentSync || null,
      lastAtLabel:
        lastContentSync
          ? new Date(
              lastContentSync
            ).toLocaleString()
          : "Never",
      needsSync:
        Boolean(
          craftworks?.contentSync
            ?.needsSync?.()
        )
    };

    return foundry.utils.mergeObject(context, {
      core,
      contentSyncStatus,
      facilityRules: craftingFacilityToolNames(
        (craftworks?.recipes.all() ?? []).map(recipe => recipe.craft?.tool)
      ).map(tool => {
        const selected = canonicalFacilityRule(facilityRuleForTool(getCraftingFacilityRules(), tool));
        const options = craftworks?.craftingEnvironment?.facilityOptions?.()
          ?? getCraftingFacilityOptions(craftworks?.craftingEnvironment?.locationApi);
        return { tool, selected, choices: facilityChoicesForSelection(options.choices ?? [], selected) };
      }),

      packs,
      groups,

      materials: {
        usePartyRecipient: getSetting(SETTINGS.USE_PARTY_RECIPIENT),
        partyActorUuid: getSetting(SETTINGS.PARTY_ACTOR_UUID),
        showRecipesForPreferredToolProficiency: getSetting(
          SETTINGS.SHOW_RECIPES_FOR_PREFERRED_TOOL_PROFICIENCY
        ),

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
    const craftworks = this.constructor.craftworks;

    this.element.querySelector("[data-action='save']")
      ?.addEventListener("click", event => this.#save(event));
    this.element.querySelector("[data-action='assign-facility-defaults']")
      ?.addEventListener("click", event => this.#assignFacilityDefaults(event));
    this.element.querySelector("[data-action='clear-facility-assignments']")
      ?.addEventListener("click", event => this.#clearFacilityAssignments(event));

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

    this.element
      .querySelector(
        "[data-action='sync-content']"
      )
      ?.addEventListener(
        "click",
        async event => {
          event.preventDefault();

          const target =
            event.currentTarget;

          target.disabled = true;

          const originalHtml =
            target.innerHTML;

          target.innerHTML =
            '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Syncing…';

          try {
            const result =
              await craftworks
                .syncContent({
                  reason:
                    "settings"
                });

            ui.notifications.info(
              "Craftworks sync complete: "
              + `${result.materialCreates} material(s) created, `
              + `${result.materialUpdates} updated, `
              + `${result.materialDeletes} removed, `
              + `${result.recipeCount ?? 0} recipe(s) indexed.`
            );

            await this.render({
              force: true
            });
          } catch (error) {
            console.error(
              "Morelord Craftworks | Manual content synchronization failed.",
              error
            );

            ui.notifications.error(
              `Craftworks sync failed: ${error.message}`
            );
          } finally {
            if (target?.isConnected) {
              target.disabled = false;
              target.innerHTML =
                originalHtml;
            }
          }
        }
      );
  }

  #facilitySelects() {
    return [...(this.element?.querySelectorAll("select[name^='facility:']") ?? [])];
  }

  async #confirmFacilityOverwrite(title, message) {
    const confirm = foundry.applications?.api?.DialogV2?.confirm;
    if (typeof confirm !== "function") return globalThis.confirm?.(message) !== false;
    return confirm({
      classes: ["ml-window", "ml-craftworks-module"],
      window: { title },
      content: `<div><div class="ml-app ml-app-shell ml-dialog-shell"><p>${message}</p></div></div>`
    });
  }

  async #assignFacilityDefaults(event) {
    event.preventDefault();
    const selects = this.#facilitySelects();
    const overwrites = selects.some(select => {
      const tool = String(select.name ?? "").slice("facility:".length);
      return defaultFacilityRuleForTool(tool) && String(select.value ?? "").trim();
    });
    if (overwrites) {
      const confirmed = await this.#confirmFacilityOverwrite(
        "Assign Defaults",
        "Replace the facility assignments that are already set with the defaults?"
      );
      if (!confirmed) return;
    }
    for (const select of selects) {
      const tool = String(select.name ?? "").slice("facility:".length);
      const next = defaultFacilityRuleForTool(tool);
      if (next) select.value = next;
    }
  }

  async #clearFacilityAssignments(event) {
    event.preventDefault();
    const selects = this.#facilitySelects();
    if (facilityAssignmentsAreSet(selects.map(select => select.value))) {
      const confirmed = await this.#confirmFacilityOverwrite(
        "Clear All",
        "Clear every facility assignment that is already set?"
      );
      if (!confirmed) return;
    }
    for (const select of selects) select.value = "";
  }

  async #save(event) {
    event.preventDefault();
    if (this.saving) return;

    const form = this.element.querySelector("form");
    if (!form) return;
    this.saving = true;
    const button = event.currentTarget;
    button.disabled = true;
    let saved = false;
    try {

      const data = new FormData(form);
      const bool = name => data.has(name);
      const number = name => Number(data.get(name) ?? 0);
      const string = name => String(data.get(name) ?? "");

      const updates = [
        [SETTINGS.USE_PARTY_RECIPIENT, bool("usePartyRecipient")],
        [SETTINGS.PARTY_ACTOR_UUID, string("partyActorUuid")],
        [
          SETTINGS.SHOW_RECIPES_FOR_PREFERRED_TOOL_PROFICIENCY,
          bool("showRecipesForPreferredToolProficiency")
        ],

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
      const facilityRules = Object.fromEntries([...data.entries()].filter(([name]) => name.startsWith("facility:")).map(([name, value]) => [name.slice(9), canonicalFacilityRule(value)]));
      await game.settings.set(MODULE_ID, SETTINGS.CRAFTING_FACILITY_RULES, JSON.stringify(facilityRules));

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

      saved = true;
      await this.constructor.craftworks.contentSync?.running;
      await this.constructor.craftworks.syncContent({ reason: "settings-save" });
      ui.notifications.info("Morelord Craftworks settings saved and compendiums synchronized.");
      await this.close();
    } catch (error) {
      console.error("Morelord Craftworks | Settings save/sync failed.", error);
      ui.notifications.error(saved
        ? `Settings saved, but compendium sync failed: ${error.message}. Retry Sync with Compendiums.`
        : `Could not save all Craftworks settings: ${error.message}`);
    } finally {
      this.saving = false;
      if (button.isConnected) button.disabled = false;
    }
  }
}
