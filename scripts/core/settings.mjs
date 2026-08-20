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
  HARVEST_NAT20_DOUBLE_CLAIM: "harvestNat20DoubleClaim",

  GATHER_DC_MODIFIER: "gatherDcModifier",
  GATHER_DC_OVERRIDES: "gatherDcOverrides",
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
  PARTY_ACTOR_UUID: "partyActorUuid",
  HIDDEN_RECIPE_IDS: "hiddenRecipeIds",
  SHOW_RECIPES_FOR_PREFERRED_TOOL_PROFICIENCY: "showRecipesForPreferredToolProficiency",
  CONTENT_SYNC_SIGNATURE: "contentSyncSignature",
  CONTENT_SYNC_LAST_AT: "contentSyncLastAt",
  STANDARD_CONTENT_BOOTSTRAPPED: "standardContentBootstrapped"
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

  registerString(
    SETTINGS.HIDDEN_RECIPE_IDS,
    "Hidden Recipe IDs",
    "[]"
  );

  registerBoolean(
    SETTINGS.SHOW_RECIPES_FOR_PREFERRED_TOOL_PROFICIENCY,
    "Show Recipes for Preferred Tool Proficiency",
    true
  );

  registerString(
    SETTINGS.CONTENT_SYNC_SIGNATURE,
    "Content Sync Signature",
    ""
  );

  registerString(
    SETTINGS.CONTENT_SYNC_LAST_AT,
    "Content Sync Last Completed",
    ""
  );

  registerBoolean(
    SETTINGS.STANDARD_CONTENT_BOOTSTRAPPED,
    "Standard Content Bootstrapped",
    false
  );

  registerNumber(SETTINGS.HARVEST_DC_MODIFIER, "Harvest DC Modifier", 0);
  registerNumber(SETTINGS.HARVEST_CHOICES_MIN, "Minimum Harvest Choices", 3);
  registerNumber(SETTINGS.HARVEST_CHOICES_MAX, "Maximum Harvest Choices", 6);
  registerNumber(SETTINGS.HARVEST_RARE_BIAS, "Harvest Rare Result Bias (%)", 0);
  registerBoolean(
    SETTINGS.HARVEST_NAT20_DOUBLE_CLAIM,
    "Natural 20 Grants Two Harvest Claims",
    true
  );

  registerNumber(SETTINGS.GATHER_DC_MODIFIER, "Gathering DC Modifier", 0);
  registerString(SETTINGS.GATHER_DC_OVERRIDES, "Gathering Terrain DC Overrides", "{}");
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

export function getHiddenRecipeIds() {
  try {
    const raw = String(
      game.settings.get(
        MODULE_ID,
        SETTINGS.HIDDEN_RECIPE_IDS
      ) ?? "[]"
    );

    const parsed = JSON.parse(raw);
    return new Set(
      Array.isArray(parsed)
        ? parsed.map(String)
        : []
    );
  } catch {
    return new Set();
  }
}

export async function setHiddenRecipeIds(ids) {
  const normalized = Array.from(
    new Set(
      Array.from(ids ?? [])
        .map(String)
        .filter(Boolean)
    )
  ).sort();

  await game.settings.set(
    MODULE_ID,
    SETTINGS.HIDDEN_RECIPE_IDS,
    JSON.stringify(normalized)
  );

  return new Set(normalized);
}

export function isRecipeHidden(recipeId) {
  return getHiddenRecipeIds().has(String(recipeId));
}

export function isRecipeKnownToActor(recipe, actor, toolInspector) {
  if (game.user.isGM || !isRecipeHidden(recipe?.id)) return true;
  if (!actor || !recipe?.craft?.tool || !toolInspector) return false;
  if (!getSetting(SETTINGS.SHOW_RECIPES_FOR_PREFERRED_TOOL_PROFICIENCY)) return false;
  return Boolean(toolInspector.inspect(actor, recipe.craft.tool)?.proficient);
}

export function getGatherDcOverrides() {
  try {
    const raw = String(
      game.settings.get(
        MODULE_ID,
        SETTINGS.GATHER_DC_OVERRIDES
      ) ?? "{}"
    );

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const normalized = {};

    for (const [profileId, value] of Object.entries(parsed)) {
      const numeric = Number(value);
      if (!profileId || !Number.isFinite(numeric)) continue;
      normalized[String(profileId)] = Math.max(1, Math.round(numeric));
    }

    return normalized;
  } catch {
    return {};
  }
}

export async function setGatherDcOverrides(overrides = {}) {
  const normalized = {};

  for (const [profileId, value] of Object.entries(overrides ?? {})) {
    const numeric = Number(value);
    if (!profileId || !Number.isFinite(numeric)) continue;
    normalized[String(profileId)] = Math.max(1, Math.round(numeric));
  }

  await game.settings.set(
    MODULE_ID,
    SETTINGS.GATHER_DC_OVERRIDES,
    JSON.stringify(normalized)
  );

  return normalized;
}

export function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}

export async function ensureStandardContentEnabled() {
  if (!game.user.isGM) return false;

  if (getSetting(SETTINGS.STANDARD_CONTENT_BOOTSTRAPPED)) {
    return false;
  }

  for (const packId of ["standard-core", "srd-5.2"]) {
    await game.settings.set(
      MODULE_ID,
      getContentPackSettingKey(packId),
      true
    );
  }

  await game.settings.set(
    MODULE_ID,
    SETTINGS.STANDARD_CONTENT_BOOTSTRAPPED,
    true
  );

  return true;
}

export { SETTINGS };

export const isRecipePackEnabled = isContentPackEnabled;
