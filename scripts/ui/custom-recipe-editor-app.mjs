import { ARTISAN_TOOLS } from "../crafting/crafting-environment-service.mjs";
import { MODULE_TITLE } from "../constants.mjs";
import { RecipePickerApp } from "./recipe-picker-app.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CustomRecipeEditorApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(craftworks, { recipe = null, drakkenheim = false, onSaved = null } = {}) {
    super(); this.craftworks = craftworks; this.originalId = recipe?.id ?? null;
    this.drakkenheim = Boolean(drakkenheim); this.onSaved = onSaved; this.picker = null;
    this.output = recipe ? { uuid: recipe.output.uuid, name: recipe.output.label, img: recipe.output.img, rarity: recipe.output.rarity ?? recipe.rarity, type: recipe.output.itemType ?? recipe.category } : null;
    this.draft = { description: recipe?.description ?? "", tool: recipe?.craft?.tool ?? "", ability: recipe?.craft?.ability ?? "Intelligence", dc: recipe?.craft?.dc ?? 13,

      hoursRequired: recipe?.craft?.hoursRequired ?? 2, outputQuantity: recipe?.output?.quantity ?? 1 };
    this.groups = recipe?.requirementGroups?.length
      ? recipe.requirementGroups.flatMap((variant, variantIndex) => (variant.requirements ?? []).map(requirement => ({
          variantIndex,
          requirements: (requirement.type === "alternatives" ? requirement.alternatives : [requirement]).map(choice => ({
            materialId: choice.match?.materialId, quantity: Number(choice.quantity ?? 1)
          }))
        })))
      : [{ variantIndex: 0, requirements: [] }];
  }
  static DEFAULT_OPTIONS = { id: "morelord-craftworks-recipe-editor",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"], position: { width: 860, height: 820 },
    window: { title: `${MODULE_TITLE} — Recipe Editor`, resizable: true } };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/custom-recipe-editor.hbs" } };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const tools = this.#tools();
    return foundry.utils.mergeObject(context, { editing: Boolean(this.originalId), drakkenheim: this.drakkenheim,
      form: this.draft, output: this.output, tools: tools.map(row => ({ ...row, selected: row.label === this.draft.tool })),
      abilities: ["Intelligence", "Wisdom", "Dexterity", "Strength", "Charisma", "Constitution"].map(value => ({ value, selected: value === this.draft.ability })),
      groups: this.groups.map((group, index) => ({ ...group, groupIndex: index, number: index + 1, showOr: index > 0, variantStart: index > 0 && group.variantIndex !== this.groups[index - 1].variantIndex,
        materials: group.requirements.map((row, materialIndex) => ({ ...row, groupIndex: index, materialIndex,
          ...(this.craftworks.materials.get(row.materialId) ?? { name: row.materialId, img: "icons/svg/hazard.svg" }) })) }))
    }, { inplace: false });
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelector("[data-action='select-output']")?.addEventListener("click", () => this.#pickOutput());
    this.element.querySelector("[data-action='add-and-group']")?.addEventListener("click", () => { this.#capture(); this.groups.push({ variantIndex: this.groups.at(-1)?.variantIndex ?? 0, requirements: [] }); this.render({ force: true }); });
    this.element.querySelector("[data-action='save']")?.addEventListener("click", event => this.#save(event));
    this.element.querySelectorAll("[data-add-material]").forEach(button => button.addEventListener("click", () => this.#pickMaterial(Number(button.dataset.addMaterial))));
    this.element.querySelectorAll("[data-remove-group]").forEach(button => button.addEventListener("click", () => { this.#capture(); this.groups.splice(Number(button.dataset.removeGroup), 1); this.render({ force: true }); }));
    this.element.querySelectorAll("[data-remove-material]").forEach(button => button.addEventListener("click", () => {
      this.#capture(); this.groups[Number(button.dataset.group)].requirements.splice(Number(button.dataset.removeMaterial), 1); this.render({ force: true });
    }));
  }
  async #pickOutput() {
    this.#capture(); if (this.picker?.rendered) await this.picker.close();
    this.picker = new RecipePickerApp(this.craftworks, { kind: "item", onSelect: async row => { this.output = row; await this.render({ force: true }); } });
    return this.picker.render({ force: true });
  }
  async #pickMaterial(groupIndex) {
    this.#capture(); if (this.picker?.rendered) await this.picker.close();
    this.picker = new RecipePickerApp(this.craftworks, { kind: "material", drakkenheim: this.drakkenheim, onSelect: async row => {
      const group = this.groups[groupIndex];
      if (!group.requirements.some(entry => entry.materialId === row.id)) group.requirements.push({ materialId: row.id, quantity: 1 });
      await this.render({ force: true });
    } });
    return this.picker.render({ force: true });
  }
  #capture() {
    const form = this.element.querySelector("form"); if (!form) return;
    const data = new FormData(form);
    for (const key of Object.keys(this.draft)) this.draft[key] = String(data.get(key) ?? "");
    for (const input of form.querySelectorAll("[data-material-quantity]")) {
      const [group, material] = input.dataset.materialQuantity.split(":");
      if (this.groups[Number(group)]?.requirements[Number(material)]) this.groups[Number(group)].requirements[Number(material)].quantity = Math.max(1, Math.floor(Number(input.value ?? 1)));
    }
  }
  async #save(event) {
    event.preventDefault(); this.#capture();
    if (!this.output?.uuid) return ui.notifications.warn("Select the item to be crafted.");
    if (!this.groups.length || this.groups.some(group => !group.requirements.length)) return ui.notifications.warn("Every required group needs at least one material choice.");
    const id = this.#recipeId(this.output.uuid);
    const recipe = { id, name: this.output.name, description: this.draft.description.trim(), category: this.output.type, rarity: this.output.rarity ?? null,
      kind: "crafting", tags: ["custom", this.drakkenheim ? "drakkenheim" : "standard"],
      source: { title: "World Custom Recipe", contentPackId: this.drakkenheim ? "monsters-of-drakkenheim" : null },
      craft: { tool: this.draft.tool || null, ability: this.draft.ability || null, dc: this.drakkenheim ? null : Math.max(1, Number(this.draft.dc ?? 13)), checkRequired: !this.drakkenheim,
        hoursRequired: this.drakkenheim ? 0 : Math.max(2, Math.ceil(Number(this.draft.hoursRequired ?? 2) / 2) * 2) },
      requirementGroups: [...new Set(this.groups.map(group => group.variantIndex))].map(variantIndex => ({
        id: `option-${variantIndex + 1}`,
        requirements: this.groups.filter(group => group.variantIndex === variantIndex).map(group => {
          const choices = group.requirements.map(row => ({ quantity: row.quantity, sameMaterial: false, match: { materialId: row.materialId } }));
          return choices.length === 1 ? choices[0] : { type: "alternatives", alternatives: choices };
        })
      })),
      output: { type: "foundry-item", uuid: this.output.uuid, rarity: this.output.rarity ?? null, quantity: Math.max(1, Math.floor(Number(this.draft.outputQuantity ?? 1))), label: this.output.name, img: this.output.img ?? "", itemType: this.output.type } };
    try {
      await this.craftworks.customRecipes.save(recipe, { previousId: this.originalId });
      await this.craftworks.recipes.loadStandardSeed(); this.originalId = id;
      ui.notifications.info(`Saved custom recipe: ${recipe.name}.`); await this.onSaved?.(); await this.close();
    } catch (error) { ui.notifications.error(error.message); }
  }
  #tools() {
    const fallback = [...ARTISAN_TOOLS];
    if (this.draft.tool && !fallback.includes(this.draft.tool)) fallback.push(this.draft.tool);
    return fallback.sort().map(label => ({ label }));
  }
  #recipeId(uuid) { return `custom-${String(uuid).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`; }
}
