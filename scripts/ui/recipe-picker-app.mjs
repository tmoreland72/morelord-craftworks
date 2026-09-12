import { MODULE_TITLE } from "../constants.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const CRAFTABLE_ITEM_TYPES = ["equipment", "consumable", "container", "tool", "weapon"];
const FILTER_KEYS = ["source", "type", "rarity", "category"];

export class RecipePickerApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(craftworks, { kind, drakkenheim = false, onSelect, catalog = null, title = null, filterLabels = {} } = {}) {
    super();
    this.craftworks = craftworks; this.kind = kind; this.drakkenheim = drakkenheim; this.onSelect = onSelect;
    this.search = ""; this.included = Object.fromEntries(FILTER_KEYS.map(key => [key, new Set()]));
    this.excluded = Object.fromEntries(FILTER_KEYS.map(key => [key, new Set()]));
    this.pickerTitle = title; this.filterLabels = filterLabels; this.customCatalog = catalog !== null;
    this.page = 1; this.catalog = catalog; this.searchTimer = null; this.restoreSearchFocus = false;
  }
  static DEFAULT_OPTIONS = { id: "morelord-craftworks-recipe-picker", classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"],
    position: { width: 1000, height: 780 }, window: { title: `${MODULE_TITLE} — Select`, resizable: true } };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/recipe-picker.hbs" } };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    this.catalog ??= this.kind === "material" ? this.#materials() : await this.#items();
    const filtered = this.catalog.filter(row => {
      if (this.search && !`${row.name} ${row.sourceLabel} ${row.type} ${row.rarity} ${row.category}`.toLowerCase().includes(this.search.toLowerCase())) return false;
      return FILTER_KEYS.every(key => this.#matches(key, key === "source" ? row.sourceLabel : row[key]));
    });
    const pageSize = 40, pages = Math.max(1, Math.ceil(filtered.length / pageSize)); this.page = Math.min(this.page, pages);
    const facets = key => {
      const fixed = key === "type" && this.kind !== "material" && !this.customCatalog ? CRAFTABLE_ITEM_TYPES : [];
      const values = [...new Set([...fixed, ...this.catalog.map(row => key === "source" ? row.sourceLabel : row[key]).filter(Boolean)])];
      values.sort(key === "rarity" ? (a, b) => this.#rarityRank(a) - this.#rarityRank(b) || String(a).localeCompare(String(b)) : undefined);
      return values.map(value => ({
        value, label: key === "source" ? value : this.#label(value), included: this.included[key].has(value), excluded: this.excluded[key].has(value),
        count: this.catalog.filter(row => (key === "source" ? row.sourceLabel : row[key]) === value).length
      }));
    };
    return foundry.utils.mergeObject(context, { title: this.pickerTitle ?? (this.kind === "material" ? "Select Material" : "Select Output Item"), materialMode: this.kind === "material" || this.customCatalog,
      typeLabel: this.filterLabels.type ?? "Type", rarityLabel: this.filterLabels.rarity ?? "Rarity", categoryLabel: this.filterLabels.category ?? "Category",
      search: this.search, sources: facets("source"), types: facets("type"), rarities: facets("rarity"), categories: facets("category"),
      rows: filtered.slice((this.page - 1) * pageSize, this.page * pageSize), resultCount: filtered.length, page: this.page, pages,
      previousPage: Math.max(1, this.page - 1), nextPage: Math.min(pages, this.page + 1), hasPrevious: this.page > 1, hasNext: this.page < pages
    }, { inplace: false });
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    const searchInput = this.element.querySelector("[name='search']");
    if (searchInput && this.restoreSearchFocus) { searchInput.focus(); searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length); this.restoreSearchFocus = false; }
    searchInput?.addEventListener("input", event => {
      this.search = String(event.currentTarget.value ?? ""); this.page = 1; this.restoreSearchFocus = true; clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => this.render({ force: true }), 180);
    });
    this.element.querySelectorAll("[data-tristate-filter]").forEach(button => button.addEventListener("click", () => {
      const key = button.dataset.filterGroup, value = button.dataset.filterValue;
      if (this.included[key].delete(value)) this.excluded[key].add(value); else if (!this.excluded[key].delete(value)) this.included[key].add(value);
      this.page = 1; this.render({ force: true });
    }));
    this.element.querySelector("[data-action='clear-filters']")?.addEventListener("click", () => {
      this.search = ""; for (const key of FILTER_KEYS) { this.included[key].clear(); this.excluded[key].clear(); }
      this.page = 1; this.render({ force: true });
    });
    this.element.querySelectorAll("[data-page]").forEach(button => button.addEventListener("click", () => { this.page = Number(button.dataset.page); this.render({ force: true }); }));
    this.element.querySelectorAll("[data-select-row]").forEach(button => button.addEventListener("click", async () => {
      const row = this.catalog.find(entry => entry.id === button.dataset.selectRow);
      if (row) { await this.onSelect?.(foundry.utils.deepClone(row)); await this.close(); }
    }));
    this.element.querySelectorAll("[data-open-document]").forEach(element => element.addEventListener("click", async event => {
      if (event.target.closest("button")) return;
      event.preventDefault();
      try {
        const document = await fromUuid(element.dataset.openDocument);
        if (!document) throw new Error("Document not found");
        document.sheet?.render(true);
      } catch { ui.notifications.warn("The source Item could not be opened."); }
    }));
  }
  #matches(key, rawValue) { const value = String(rawValue ?? ""); return !this.excluded[key].has(value) && (!this.included[key].size || this.included[key].has(value)); }
  #rarityRank(value) {
    const order = ["common", "uncommon", "rare", "veryrare", "legendary", "artifact"];
    const rank = order.indexOf(String(value).toLowerCase().replace(/[^a-z]/g, ""));
    return rank < 0 ? order.length : rank;
  }
  #label(value) { return String(value).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()); }
  #materials() {
    return this.craftworks.materials.all().filter(row => this.drakkenheim ? row.packId === "monsters-of-drakkenheim" : row.packId !== "monsters-of-drakkenheim")
      .map(row => ({ id: row.materialId, name: row.name, img: row.img, uuid: row.uuid, type: row.stage ?? "material", rarity: row.rarity ?? "", category: row.category ?? "", sourceLabel: this.craftworks.contentPacks.get(row.packId)?.label ?? row.packId }));
  }
  async #items() {
    const rows = [];
    for (const pack of this.craftworks.sourceFilter.enabledPacks({ documentName: "Item" }).filter(pack => pack.visible !== false)) {
      let index; try { index = await pack.getIndex({ fields: ["img", "type", "system.rarity", "system.source"] }); } catch { continue; }
      for (const item of index) {
        if (!CRAFTABLE_ITEM_TYPES.includes(item.type)) continue;
        const sourceLabel = await this.craftworks.sourceFilter.sourceLabelForCompendiumItem(item, { pack });
        rows.push({ id: `${pack.collection}.${item._id}`, uuid: item.uuid ?? `Compendium.${pack.collection}.Item.${item._id}`, name: item.name, img: item.img,
          type: item.type, rarity: String(item.system?.rarity ?? ""), category: "", sourceLabel });
      }
    }
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }
}
