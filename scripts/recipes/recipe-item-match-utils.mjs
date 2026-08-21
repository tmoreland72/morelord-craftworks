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
