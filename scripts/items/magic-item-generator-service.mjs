import { itemRarity } from "../../../morelord-core/scripts/services/item-rarity.js";
import { generatorQuantity } from "../core/generator-quantity.mjs";

export const MAGIC_ITEM_RARITIES = [
  { id: "common", label: "Common" },
  { id: "uncommon", label: "Uncommon" },
  { id: "rare", label: "Rare" },
  { id: "veryrare", label: "Very Rare" },
  { id: "legendary", label: "Legendary" },
  { id: "artifact", label: "Artifact" }
];

export const MAGIC_ITEM_CATEGORIES = [
  { id: "weapon", label: "Weapons" },
  { id: "armor", label: "Armor & Shields" },
  { id: "potion", label: "Potions" },
  { id: "scroll", label: "Scrolls" },
  { id: "ring", label: "Rings" },
  { id: "rod", label: "Rods" },
  { id: "staff", label: "Staves" },
  { id: "wand", label: "Wands" },
  { id: "wondrous", label: "Wondrous & Other" }
];

function categoryFor(item) {
  const subtype = item.system?.type?.value;
  if (["potion", "scroll", "ring", "rod", "staff", "wand"].includes(subtype)) return subtype;
  // D&D5e models magic staves as simple melee weapons, without a staff subtype.
  if (item.type === "weapon" && /^staff\b/i.test(item.name)) return "staff";
  if (item.type === "consumable" && subtype === "ammo") return "weapon";
  if (item.type === "weapon") return "weapon";
  if (item.type === "equipment" && ["light", "medium", "heavy", "shield"].includes(subtype)) return "armor";
  return "wondrous";
}

export class MagicItemGeneratorService {
  constructor({ coreAccess = null, sourceFilter = null } = {}) {
    this.coreAccess = coreAccess;
    this.sourceFilter = sourceFilter;
  }

  get hasAccess() {
    return !this.coreAccess || Boolean(this.coreAccess.hasFeature?.("magic-item-generator")
      || this.coreAccess.hasPremiumAccess?.());
  }

  async availableItems({ categories = null } = {}) {
    const items = [];
    const seen = new Set();
    const eligible = Array.from(game.packs ?? []).filter(pack => pack.documentName === "Item"
      && pack.visible !== false && (!this.sourceFilter || this.sourceFilter.isPackEnabled(pack)));
    const packs = this.sourceFilter ? this.sourceFilter.sortPacks(eligible) : eligible;
    for (const pack of packs) {
      let index;
      try {
        index = await pack.getIndex({ fields: ["name", "img", "type", "system.type.value",
          "system.rarity", "system.rarities", "system.source"] });
      } catch (error) {
        console.warn(`Morelord Craftworks | Unable to index magic items in ${pack.collection}.`, error);
        continue;
      }
      for (const row of index) {
        if (!["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(row.type)) continue;
        const rarity = itemRarity(row.system);
        if (!MAGIC_ITEM_RARITIES.some(entry => entry.id === rarity)) continue;
        const category = categoryFor(row);
        if (categories && !categories.includes(category)) continue;
        const sourceLabel = this.sourceFilter
          ? await this.sourceFilter.sourceLabelForCompendiumItem(row, { pack })
          : pack.title ?? pack.collection;
        if (this.sourceFilter?.isSourceEnabled && !this.sourceFilter.isSourceEnabled(sourceLabel, { itemType: row.type })) continue;
        const key = `${row.name.trim().toLowerCase()}|${category}|${rarity}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push({ name: row.name, img: row.img ?? "icons/svg/item-bag.svg", type: row.type,
          rarity, category, sourceLabel, uuid: `Compendium.${pack.collection}.Item.${row._id}` });
      }
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  async generate(counts = {}, { categories = null, allowDuplicates = false } = {}) {
    if (!game.user?.isGM) throw new Error("Only the GM can use the Magic Item Generator.");
    if (!this.hasAccess) throw new Error("Magic Item Generator requires premium access.");
    const requests = MAGIC_ITEM_RARITIES.map(rarity => ({ ...rarity,
      count: Number(counts[rarity.id] ?? 0) === 0 ? 0 : generatorQuantity(counts[rarity.id]) }));
    if (!requests.some(entry => entry.count)) throw new Error("Choose at least one magic item before generating stock.");
    const items = await this.availableItems({ categories });
    const result = [];
    for (const rarity of requests) {
      if (!rarity.count) continue;
      const pool = items.filter(item => item.rarity === rarity.id);
      if (!pool.length) throw new Error(`No ${rarity.label.toLowerCase()} magic items match the selected categories and enabled sources.`);
      if (!allowDuplicates && rarity.count > pool.length) {
        throw new Error(`Only ${pool.length} distinct ${rarity.label.toLowerCase()} magic items are available. Lower the quantity or allow duplicates.`);
      }
      for (let i = 0; i < rarity.count; i++) {
        const index = Math.floor(Math.random() * pool.length);
        result.push({ ...pool[index], quantity: 1 });
        if (!allowDuplicates) pool.splice(index, 1);
      }
    }
    return result;
  }
}
