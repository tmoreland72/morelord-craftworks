import { MODULE_ID, MODULE_TITLE } from "../constants.mjs";
import {
  SETTINGS,
  getSetting
} from "../core/settings.mjs";
import {
  CONTENT_PACKS,
  getContentPackSettingKey
} from "../../data/content-packs.mjs";

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

    await craftworks?.coreAccess?.refresh();

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
        const hasAccess = state?.hasAccess ?? (craftworks?.coreAccess?.hasAccess(pack) ?? !pack.premium);
        const enabled = state?.configured ?? Boolean(
          game.settings.get(MODULE_ID, getContentPackSettingKey(pack.id))
        );

        const manifest = craftworks?.contentPacks?.manifest(pack.id);

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
          statusLabel: pack.premium
            ? (hasAccess ? "Premium" : "Premium — Access Required")
            : "Free"
        };
      });

    return foundry.utils.mergeObject(context, {
      core: craftworks?.coreAccess?.snapshot() ?? {
        available:false,
        entitlements:[]
      },

      packs,
      groups,

      materials: {
        usePartyRecipient: getSetting(SETTINGS.USE_PARTY_RECIPIENT),
        partyActorUuid: getSetting(SETTINGS.PARTY_ACTOR_UUID),

        harvestDcModifier: getSetting(SETTINGS.HARVEST_DC_MODIFIER),
        harvestChoicesMin: getSetting(SETTINGS.HARVEST_CHOICES_MIN),
        harvestChoicesMax: getSetting(SETTINGS.HARVEST_CHOICES_MAX),
        harvestRareBias: getSetting(SETTINGS.HARVEST_RARE_BIAS),

        gatherDcModifier: getSetting(SETTINGS.GATHER_DC_MODIFIER),
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
        craftworks?.coreAccess?.hasPremiumAccess() ?? false
    }, { inplace:false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='save']")
      ?.addEventListener("click", event => this.#save(event));

    this.element.querySelector("[data-action='refresh-core']")
      ?.addEventListener("click", async event => {
        event.preventDefault();
        await this.constructor.craftworks?.coreAccess?.refresh();
        await this.render();
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

    for (const pack of CONTENT_PACKS) {
      const key = getContentPackSettingKey(pack.id);
      const hasAccess =
        this.constructor.craftworks?.coreAccess?.hasAccess(pack)
        ?? !pack.premium;

      const requested = bool(`pack:${pack.id}`);
      const enabled = pack.premium && !hasAccess ? false : requested;

      await game.settings.set(MODULE_ID, key, enabled);
    }

    ui.notifications.info("Morelord Craftworks settings saved.");
    await this.render();
  }
}
