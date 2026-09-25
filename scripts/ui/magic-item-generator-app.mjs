import { MODULE_TITLE } from "../constants.mjs";
import { MAGIC_ITEM_CATEGORIES, MAGIC_ITEM_RARITIES } from "../items/magic-item-generator-service.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
import { RecipePickerApp } from "./recipe-picker-app.mjs";
import { AwardChatCardService } from "../core/award-chat-card-service.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class MagicItemGeneratorApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-magic-item-generator",
    classes: ["ml-window", "ml-craftworks-module"],
    position: { width: 820, height: 820 },
    window: { title: `${MODULE_TITLE} — Magic Item Generator`, resizable: true }
  };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/magic-item-generator.hbs" } };

  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.selectedRarity = "uncommon";
    this.selectedCategories = new Set(MAGIC_ITEM_CATEGORIES.map(category => category.id));
    this.result = [];
    this.hasDraft = false;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const service = this.craftworks.magicItemGenerator;
    const items = service.hasAccess ? await service.availableItems({ categories: [...this.selectedCategories] }) : [];
    return { ...context, hasAccess: service.hasAccess,
      hasDraft: this.hasDraft, hasItems: Boolean(this.result.length),
      categories: MAGIC_ITEM_CATEGORIES.map(category => ({ ...category, selected: this.selectedCategories.has(category.id) })),
      rarities: MAGIC_ITEM_RARITIES.map(rarity => ({ ...rarity, selected: rarity.id === this.selectedRarity,
        available: items.filter(item => item.rarity === rarity.id).length })),
      results: this.result.map((item, index) => ({ ...item, index,
        rarityLabel: MAGIC_ITEM_RARITIES.find(rarity => rarity.id === item.rarity)?.label,
        categoryLabel: MAGIC_ITEM_CATEGORIES.find(category => category.id === item.category)?.label })) };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelector("[name='magicRarity']")?.addEventListener("change", event => { this.selectedRarity = event.target.value; });
    this.element.querySelector("[data-action='add-item']")?.addEventListener("click", () => this.#addItem());
    this.element.querySelectorAll("[data-magic-category]").forEach(input => input.addEventListener("change", async () => {
      this.selectedCategories = new Set([...this.element.querySelectorAll("[data-magic-category]")]
        .filter(input => input.checked).map(input => input.dataset.magicCategory));
      await this.render({ force: true });
    }));
    this.element.querySelectorAll("[data-remove-stock]").forEach(button => button.addEventListener("click", async () => {
      this.result.splice(Number(button.dataset.removeStock), 1);
      await this.render({ force: true });
    }));
    this.element.querySelector("[data-action='edit-options']")?.addEventListener("click", async () => {
      this.hasDraft = false;
      await this.render({ force: true });
    });
    for (const action of ["generate-stock", "reroll-stock", "share-stock"]) {
      this.element.querySelector(`[data-action='${action}']`)?.addEventListener("click", async event => {
        const button = event.currentTarget;
        button.disabled = true;
        try {
          if (!game.user.isGM || !this.craftworks.magicItemGenerator.hasAccess) throw new Error("Magic Item Generator requires GM and premium access.");
          if (action === "share-stock") {
            if (!this.result.length) throw new Error("Generate magic items before sharing results.");
            await AwardChatCardService.post({
              items: this.result,
              title: "Generated Magic Items",
              subtitle: "Random magic item selection", icon: "fa-solid fa-wand-magic-sparkles"
            });
            ui.notifications.info("Magic items displayed in chat.");
          } else {
            if (!this.selectedCategories.size) throw new Error("Choose at least one magic item category.");
            this.result = await this.craftworks.magicItemGenerator.generate({ [this.selectedRarity]: 1 }, {
              categories: [...this.selectedCategories]
            });
            this.hasDraft = true;
            await this.render({ force: true });
          }
        } catch (error) { ui.notifications.error(error.message); }
        finally { button.disabled = false; }
      });
    }
  }
  async #addItem() {
    try {
      const items = await this.craftworks.magicItemGenerator.availableItems();
      await new RecipePickerApp(this.craftworks, {
        kind: "item", title: "Add Magic Item",
        catalog: items.filter(item => !this.result.some(result => result.uuid === item.uuid)).map(item => ({ ...item, id: item.uuid })),
        onSelect: async row => {
          this.result.push({ ...items.find(item => item.uuid === row.uuid), quantity: 1 });
          await this.render({ force: true });
        }
      }).render({ force: true });
    } catch (error) { ui.notifications.error(error.message); }
  }
}
