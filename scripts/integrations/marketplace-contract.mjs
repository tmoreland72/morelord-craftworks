import { MODULE_ID } from "../constants.mjs";

/**
 * Read-only integration contract for Morelord Marketplace.
 *
 * Sellability is value-driven by Marketplace: a positive system price/value.
 * Purchasability for Craftworks materials is explicitly opt-in.
 */
export function isCraftworksItem(item) {
  return Boolean(item?.getFlag?.(MODULE_ID, "materialId"));
}

export function isCraftworksPurchasable(item) {
  if (!isCraftworksItem(item)) return null;
  return item.getFlag(MODULE_ID, "purchasable") === true;
}

export function getCraftworksMaterialId(item) {
  return item?.getFlag?.(MODULE_ID, "materialId") ?? null;
}
