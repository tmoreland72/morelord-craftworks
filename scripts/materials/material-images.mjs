// Repair known invalid built-in paths in previously synchronized catalog Items.
export const MATERIAL_IMAGE_REPAIRS = Object.freeze({
  "icons/commodities/stone/ore-pile-black.webp": "icons/commodities/stone/ore-pile-iron-black.webp",
  "icons/commodities/stone/ore-pile-silver.webp": "icons/commodities/stone/ore-chunk-silver-gray.webp",
  "icons/containers/bags/sack-ornate-gold.webp": "icons/containers/bags/satchel-leather-gold-brown.webp",
  "icons/commodities/metal/ingot-dark.webp": "icons/commodities/metal/ingot-steel-cube.webp",
  "icons/creatures/tentacles/tentacle-octopus-white.webp": "icons/commodities/biological/tentacle-purple-white.webp"
});

export function materialImage(path) {
  return MATERIAL_IMAGE_REPAIRS[path] ?? path ?? "icons/svg/item-bag.svg";
}

/** Repair only known broken paths on Craftworks-owned world catalog Items. */
export async function repairCatalogImages(pack, index) {
  if (!game.user.isGM || !/^world\.morelord-craftworks-(?:standard-materials|materials-[a-z0-9-]+)$/.test(pack.collection)) return 0;
  const updates = Array.from(index).filter(row => row.flags?.["morelord-craftworks"]?.materialId && MATERIAL_IMAGE_REPAIRS[row.img])
    .map(row => ({ _id: row._id, img: materialImage(row.img) }));
  if (!updates.length) return 0;
  const locked = pack.locked;
  try {
    if (locked) await pack.configure({ locked: false });
    await (CONFIG.Item.documentClass ?? Item).updateDocuments(updates, { pack: pack.collection });
    return updates.length;
  } finally {
    if (locked) await pack.configure({ locked: true });
  }
}
