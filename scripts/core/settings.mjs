import { MODULE_ID } from "../constants.mjs";
import {
  CONTENT_PACKS,
  getContentPackSettingKey
} from "../../data/content-packs.mjs";
import { CraftworksSettingsApp } from "../ui/craftworks-settings-app.mjs";

const SETTINGS = Object.freeze({
  HARVEST_DC_MODIFIER: "harvestDcModifier",
  HARVEST_CHOICES_MIN: "harvestChoicesMin",
  HARVEST_CHOICES_MAX: "harvestChoicesMax",
  HARVEST_RARE_BIAS: "harvestRareBias",

  GATHER_DC_MODIFIER: "gatherDcModifier",
  GATHER_QUANTITY_MULTIPLIER: "gatherQuantityMultiplier",
  GATHER_RARE_BIAS: "gatherRareBias",

  LOOT_ENABLE_MATERIALS: "lootEnableMaterials",
  LOOT_ENABLE_COIN: "lootEnableCoin",
  LOOT_ENABLE_SPECIAL: "lootEnableSpecial",
  LOOT_MATERIAL_CHANCE_MODIFIER: "lootMaterialChanceModifier",
  LOOT_COIN_CHANCE_MODIFIER: "lootCoinChanceModifier",
  LOOT_SPECIAL_CHANCE_MODIFIER: "lootSpecialChanceModifier",
  LOOT_MATERIAL_QUANTITY_MULTIPLIER: "lootMaterialQuantityMultiplier",
  LOOT_COIN_MULTIPLIER: "lootCoinMultiplier",

  USE_PARTY_RECIPIENT: "usePartyRecipient",
  PARTY_ACTOR_UUID: "partyActorUuid"
});

export function registerSettings() {
  game.settings.registerMenu(MODULE_ID, "configure", {
    name: "Craftworks Settings",
    label: "Configure Craftworks",
    hint: "Configure Content Packs, Materials, Recipes, and Crafting for this world.",
    icon: "fa-solid fa-hammer",
    type: CraftworksSettingsApp,
    restricted: true
  });

  registerContentPackSettings();

  registerBoolean(
    SETTINGS.USE_PARTY_RECIPIENT,
    "Use Party Actor for Acquired Materials",
    false
  );

  registerString(
    SETTINGS.PARTY_ACTOR_UUID,
    "Party Recipient Actor",
    ""
  );

  registerNumber(SETTINGS.HARVEST_DC_MODIFIER, "Harvest DC Modifier", 0);
  registerNumber(SETTINGS.HARVEST_CHOICES_MIN, "Minimum Harvest Choices", 3);
  registerNumber(SETTINGS.HARVEST_CHOICES_MAX, "Maximum Harvest Choices", 6);
  registerNumber(SETTINGS.HARVEST_RARE_BIAS, "Harvest Rare Result Bias (%)", 0);

  registerNumber(SETTINGS.GATHER_DC_MODIFIER, "Gathering DC Modifier", 0);
  registerNumber(SETTINGS.GATHER_QUANTITY_MULTIPLIER, "Gathering Quantity Multiplier", 1);
  registerNumber(SETTINGS.GATHER_RARE_BIAS, "Gathering Rare Result Bias (%)", 0);

  registerBoolean(SETTINGS.LOOT_ENABLE_MATERIALS, "Encounter Loot: Materials", true);
  registerBoolean(SETTINGS.LOOT_ENABLE_COIN, "Encounter Loot: Coin", true);
  registerBoolean(SETTINGS.LOOT_ENABLE_SPECIAL, "Encounter Loot: Special Treasure", true);
  registerNumber(SETTINGS.LOOT_MATERIAL_CHANCE_MODIFIER, "Encounter Loot: Material Chance Modifier (%)", 0);
  registerNumber(SETTINGS.LOOT_COIN_CHANCE_MODIFIER, "Encounter Loot: Coin Chance Modifier (%)", 0);
  registerNumber(SETTINGS.LOOT_SPECIAL_CHANCE_MODIFIER, "Encounter Loot: Special Chance Modifier (%)", 0);
  registerNumber(SETTINGS.LOOT_MATERIAL_QUANTITY_MULTIPLIER, "Encounter Loot: Material Quantity Multiplier", 1);
  registerNumber(SETTINGS.LOOT_COIN_MULTIPLIER, "Encounter Loot: Coin Multiplier", 1);
}

/**
 * Retained for compatibility with existing ready() startup code.
 * Party Actor selection is now managed entirely inside Craftworks Settings.
 */
export function exposePartyActorSetting() {}

function registerContentPackSettings() {
  for (const pack of [...CONTENT_PACKS].sort((a,b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))) {
    game.settings.register(MODULE_ID, getContentPackSettingKey(pack.id), {
      name: `Recipe Pack: ${pack.label}`,
      hint: pack.description,
      scope: "world",
      config: false,
      type: Boolean,
      default: Boolean(pack.enabledByDefault)
    });
  }
}

export function isContentPackEnabled(packId) {
  const pack = CONTENT_PACKS.find(entry => entry.id === packId);
  if (!pack) return false;

  try {
    return Boolean(
      game.settings.get(MODULE_ID, getContentPackSettingKey(pack.id))
    );
  } catch {
    return Boolean(pack.enabledByDefault);
  }
}

function registerNumber(key, name, defaultValue) {
  game.settings.register(MODULE_ID, key, {
    name,
    scope: "world",
    config: false,
    type: Number,
    default: defaultValue
  });
}

function registerBoolean(key, name, defaultValue) {
  game.settings.register(MODULE_ID, key, {
    name,
    scope: "world",
    config: false,
    type: Boolean,
    default: defaultValue
  });
}

function registerString(key, name, defaultValue) {
  game.settings.register(MODULE_ID, key, {
    name,
    scope: "world",
    config: false,
    type: String,
    default: defaultValue
  });
}

export function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}

export { SETTINGS };

export const isRecipePackEnabled = isContentPackEnabled;
