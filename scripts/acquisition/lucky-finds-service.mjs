const TABLE_PACK = "drakkenheim-core.tables";
const MAGIC_ITEMS = "drakkenheim-monsters.items";

export const isLuckyFindTable = table => /^lucky finds?$/i.test(String(table?.name ?? "").trim());

// Keep existing links and inline rolls intact; only enrich plain dice expressions.
export function clickableFindDice(text) {
  return String(text).split(/(@(?:UUID|Compendium)\[[^\]]+](?:\{[^}]*})?|\[\[[\s\S]*?]]|<[^>]*>)/g)
    .map(part => /^(?:@|\[\[|<)/.test(part) ? part.replace(/\[\[\/r\s/g, "[[/gmroll ")
      : part.replace(/\b\d*d\d+(?:\s*(?:[+\-*×x])\s*\d+)?\b/gi, formula => `[[/gmroll ${formula.replace(/[×x]/gi, "*")}]]`))
    .join("");
}

export class LuckyFindsService {
  constructor({ contentPacks, itemResolver }) {
    this.contentPacks = contentPacks;
    this.itemResolver = itemResolver;
  }

  get hasAccess() {
    return Boolean(game.user?.isGM && this.contentPacks.isEnabled("monsters-of-drakkenheim")
      && game.modules.get("drakkenheim-core")?.active && game.packs.get(TABLE_PACK));
  }

  async getTable({ worldOnly = false } = {}) {
    if (!this.hasAccess) throw new Error("Lucky Finds requires Champion access, the enabled Drakkenheim content pack, and the official Dungeons of Drakkenheim module.");
    if (worldOnly) return game.tables.find(isLuckyFindTable) ?? null;
    const pack = game.packs.get(TABLE_PACK);
    const entry = (await pack.getIndex()).find(isLuckyFindTable);
    return entry ? pack.getDocument(entry._id) : null;
  }

  async roll({ table = null } = {}) {
    if (!this.hasAccess) throw new Error("Lucky Finds is unavailable for this user or world.");
    table ??= await this.getTable();
    if (!table || !isLuckyFindTable(table) || table.documentName !== "RollTable") throw new Error("The Lucky Finds table is unavailable.");
    const { roll, results } = await table.roll();
    if (!results.length) throw new Error("Lucky Finds returned no result. Check the table's available results.");
    return { total: roll.total, tableUuid: table.uuid, results: await Promise.all(results.map(result => this.describe(result))) };
  }

  async describe(result) {
    const data = result.toObject();
    const lower = Number(data.range?.[0]);
    let text = data.description || data.name || "";
    const missing = [];
    const link = async (name, { sourceBook = "Dungeon Master's Guide", exact = false } = {}) => {
      const item = exact ? await this.itemResolver.resolve(name, { sourceBook })
        : await this.itemResolver.resolveAny(name, { preferredSourceBook: sourceBook });
      if (!item) { missing.push(name); return name; }
      return `@UUID[${item.uuid}]{${item.name}}`;
    };
    if (lower === 8) text = text.replace(/sets of tools/i, "artisan tools");
    if (lower === 10) text = text.replace(/@(?:UUID|Compendium)\[[^\]]+]\{Potions? of Healing}/i, await link("Potion of Healing"));
    if (lower === 12) text = text.replace(/art objects worth 25 gp each/i, await link("Art Object (25 GP)", { exact: true }));
    if (lower === 15) text = text.replace(/(?:<em>)?restorative ointment(?:<\/em>)?/i, await link("Keoghtom's Ointment")).replace(/\bpon\b/, "upon");
    if (lower === 18) text = text.replace(/(?:<em>)?potions of greater healing(?:<\/em>)?/i, await link("Potion of Greater Healing"));
    if (lower === 19) text = text.replace(/a piece of artwork worth 250 gp/i, await link("Art Object (250 GP)", { exact: true }));
    // Delerium must use the MoD Magic Items pack, never similarly named materials.
    const magicPack = game.packs.get(MAGIC_ITEMS);
    const magicIndex = /delerium/i.test(text) && magicPack ? await magicPack.getIndex() : [];
    text = text.replace(/@(?:UUID|Compendium)\[[^\]]+]\{(delerium\s+(?:chips?|fragments?|shards?|crystals?|geodes?))}/gi, "$1");
    text = text.replace(/\bdelerium\s+(chips?|fragments?|shards?|crystals?|geodes?)\b/gi, (label, kind) => {
      const name = `Delerium ${kind.replace(/s$/i, "")}`;
      const entry = magicIndex.find(item => item.name.toLowerCase() === name.toLowerCase());
      if (!entry) { missing.push(name); return label; }
      return `@UUID[Compendium.${MAGIC_ITEMS}.Item.${entry._id}]{${label}}`;
    });
    return { text: clickableFindDice(text), scrollRarity: lower === 20 ? "rare" : lower === 11 ? "uncommon" : null,
      artisanTools: lower === 8, missing };
  }
}
