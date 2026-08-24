import { MODULE_ID } from "../constants.mjs";

const SCROLL_REQUIREMENT = /^scroll of\s+(.+)$/i;
const SPELL_SCROLL_NAME = /^(?:spell scroll|scroll of spell)\s*:\s*(.+)$/i;

export function normalizeRecipeItemName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function recipeItemMatches(item, requiredName) {
  const required = normalizeRecipeItemName(requiredName);
  if (!required) return false;

  const itemName = normalizeRecipeItemName(item?.name);
  if (itemName === required) return true;

  const scroll = required.match(SCROLL_REQUIREMENT);
  if (!scroll) return false;

  const requiredSpell = normalizeSpellName(scroll[1]);
  const generatedSpell = normalizeSpellName(
    item?.flags?.[MODULE_ID]?.spellScrollGenerator?.spellName
  );
  if (generatedSpell) return generatedSpell === requiredSpell;

  // D&D5e's native Item.createScrollFromSpell names generated scrolls
  // "Spell Scroll: <spell name>". The prefix is localized, so treat any
  // recognized scroll consumable ending in ": <spell name>" the same way.
  const nativeSpell = itemName.match(SPELL_SCROLL_NAME)?.[1]
    ?? (isNativeSpellScroll(item) ? itemName.split(":").slice(1).join(":") : "");

  return normalizeSpellName(nativeSpell) === requiredSpell;
}

export function spellScrollMatches(item, requiredSpellName) {
  const requiredSpell = normalizeSpellName(requiredSpellName);
  if (!requiredSpell) return false;

  const generatedSpell = normalizeSpellName(
    item?.flags?.[MODULE_ID]?.spellScrollGenerator?.spellName
  );
  if (generatedSpell) return generatedSpell === requiredSpell;

  const itemName = normalizeRecipeItemName(item?.name);
  const nativeSpell = itemName.match(SPELL_SCROLL_NAME)?.[1]
    ?? (isNativeSpellScroll(item) ? itemName.split(":").slice(1).join(":") : "");

  return normalizeSpellName(nativeSpell) === requiredSpell;
}

export function spellScrollLevelMatches(item, requiredLevel) {
  if (!isNativeSpellScroll(item)) return false;
  const level = Number(
    item?.flags?.[MODULE_ID]?.spellScrollGenerator?.spellLevel
    ?? item?.system?.spell?.level
    ?? item?.system?.level
  );
  return Number.isFinite(level) && level === Number(requiredLevel);
}

export function equipmentTypeMatches(item, requiredEquipmentType) {
  if (normalizeRecipeItemName(item?.type) !== "equipment") return false;
  const required = normalizeRecipeItemName(requiredEquipmentType);
  if (!required) return false;

  const candidates = [
    item?.system?.type?.value,
    item?.system?.type?.subtype,
    item?.system?.type,
    item?.system?.equipmentType,
    item?.system?.armor?.type
  ]
    .filter(value => typeof value === "string")
    .map(normalizeRecipeItemName);

  if (required === "armor") {
    return candidates.some(value => [
      "armor",
      "light",
      "medium",
      "heavy",
      "light armor",
      "medium armor",
      "heavy armor"
    ].includes(value));
  }

  return candidates.includes(required);
}

export function weaponTypeMatches(item, requiredWeaponType) {
  if (normalizeRecipeItemName(item?.type) !== "weapon") return false;
  const required = normalizeRecipeItemName(requiredWeaponType);
  if (!required) return false;

  const candidates = [
    item?.system?.type?.value,
    item?.system?.type?.subtype,
    item?.system?.type,
    item?.system?.weaponType
  ]
    .filter(value => typeof value === "string")
    .map(normalizeRecipeItemName);

  if (required === "simple") {
    return candidates.some(value =>
      value === "simple"
      || value === "simplem"
      || value === "simpler"
      || value.startsWith("simple ")
    );
  }

  return candidates.includes(required);
}

export function valuedLootMatches(item, requiredLootTypes, minimumValueGp = 0) {
  if (normalizeRecipeItemName(item?.type) !== "loot") return false;

  const aliases = {
    gem: "gemstone",
    gems: "gemstone",
    gemstone: "gemstone",
    art: "art object",
    artobject: "art object",
    "art object": "art object"
  };
  const normalizeLootType = value => {
    const normalized = normalizeRecipeItemName(value);
    return aliases[normalized.replace(/\s+/g, "")] ?? aliases[normalized] ?? normalized;
  };
  const allowed = new Set((requiredLootTypes ?? []).map(normalizeLootType));
  const actual = normalizeLootType(
    item?.system?.type?.value
    ?? item?.system?.type
    ?? item?.system?.lootType
  );
  if (!allowed.size || !allowed.has(actual)) return false;

  const price = item?.system?.price ?? item?.system?.value ?? {};
  const amount = Number(typeof price === "object" ? price.value : price);
  const denomination = normalizeRecipeItemName(
    typeof price === "object" ? price.denomination ?? "gp" : "gp"
  );
  const gpMultiplier = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 }[denomination] ?? 1;
  const valueGp = Number.isFinite(amount) ? amount * gpMultiplier : 0;
  return valueGp >= Math.max(0, Number(minimumValueGp ?? 0));
}

function normalizeSpellName(value) {
  return normalizeRecipeItemName(value)
    .split(" ")
    .filter(word => !["a", "an", "the"].includes(word))
    .join(" ");
}

function isNativeSpellScroll(item) {
  if (item?.type !== "consumable") return false;

  const consumableType = normalizeRecipeItemName(
    item?.system?.type?.value ?? item?.system?.type
  );

  return consumableType === "scroll"
    || consumableType === "spellscroll"
    || consumableType === "spell scroll";
}
