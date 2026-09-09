import { MODULE_TITLE } from "../constants.mjs";
import { CustomRecipeEditorApp } from "./custom-recipe-editor-app.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CustomRecipeApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(craftworks, options = {}) {
    super(options); this.craftworks = craftworks;
    this.initialDrakkenheim = Boolean(options.drakkenheim); this.editor = null;
  }
  static DEFAULT_OPTIONS = { id: "morelord-craftworks-recipe-manager",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window"],
    position: { width: 760, height: 720 }, window: { title: `${MODULE_TITLE} — Recipe Manager`, resizable: true } };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/custom-recipe.hbs" } };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const rows = await Promise.all((await this.craftworks.customRecipes.all()).map(async recipe => ({
      ...recipe, outputLabel: recipe.output?.label ?? "Unknown Item",
      outputResolved: Boolean(await fromUuid(recipe.output?.uuid)),
      missingMaterials: (recipe.requirementGroups ?? []).flatMap(group => group.requirements ?? [])
        .filter(requirement => !this.craftworks.materials.get(requirement.match?.materialId)).length,
      drakkenheim: recipe.source?.contentPackId === "monsters-of-drakkenheim"
    })));
    return foundry.utils.mergeObject(context, { recipes: rows, hasRecipes: rows.length > 0,
      drakkenheimAvailable: this.craftworks.contentPacks.isEnabled("monsters-of-drakkenheim") }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    const click = (selector, fn) => this.element.querySelector(selector)?.addEventListener("click", fn);
    click("[data-action='new']", event => this.#launchEditor(event, null, false));
    click("[data-action='new-drakkenheim']", event => this.#launchEditor(event, null, true));
    click("[data-action='export-all']", () => this.#exportAll());
    click("[data-action='import']", () => this.element.querySelector("[data-import-file]")?.click());
    this.element.querySelector("[data-import-file]")?.addEventListener("change", event => this.#import(event));
    this.element.querySelectorAll("[data-edit-recipe]").forEach(button => button.addEventListener("click", async event => {
      const recipe = (await this.craftworks.customRecipes.all()).find(row => row.id === event.currentTarget.dataset.editRecipe);
      if (recipe) await this.#openEditor(recipe, recipe.source?.contentPackId === "monsters-of-drakkenheim");
    }));
    this.element.querySelectorAll("[data-export-recipe]").forEach(button => button.addEventListener("click", async event => {
      const recipe = (await this.craftworks.customRecipes.all()).find(row => row.id === event.currentTarget.dataset.exportRecipe);
      if (recipe) foundry.utils.saveDataToFile(this.craftworks.customRecipes.export(recipe), "application/json", `${recipe.id}.json`);
    }));
    this.element.querySelectorAll("[data-delete-recipe]").forEach(button => button.addEventListener("click", event => this.#delete(event.currentTarget.dataset.deleteRecipe)));
    if (this.initialDrakkenheim) { this.initialDrakkenheim = false; queueMicrotask(() => this.#openEditor(null, true)); }
  }

  async #openEditor(recipe, drakkenheim) {
    const existing = foundry.applications.instances.get("morelord-craftworks-recipe-editor");
    if (existing?.rendered) await existing.close();
    if (this.editor?.rendered) await this.editor.close();
    this.editor = new CustomRecipeEditorApp(this.craftworks, { recipe, drakkenheim,
      onSaved: async () => this.render({ force: true }) });
    const rendered = await this.editor.render({ force: true });
    this.editor.bringToFront();
    return rendered;
  }
  async #launchEditor(event, recipe, drakkenheim) {
    event?.preventDefault();
    try { return await this.#openEditor(recipe, drakkenheim); }
    catch (error) {
      console.error("Morelord Craftworks | Recipe Editor failed to open.", error);
      ui.notifications.error(`Recipe Editor failed to open: ${error.message}`);
      return null;
    }
  }
  async #delete(id) {
    if (!await foundry.applications.api.DialogV2.confirm({ window: { title: "Delete Custom Recipe" }, content: "<p>Delete this custom recipe?</p>" })) return;
    await this.craftworks.customRecipes.delete(id); await this.craftworks.recipes.loadStandardSeed(); await this.render({ force: true });
  }
  async #exportAll() {
    const recipes = await this.craftworks.customRecipes.all();
    if (!recipes.length) return ui.notifications.warn("There are no custom recipes to export.");
    foundry.utils.saveDataToFile(this.craftworks.customRecipes.export(recipes), "application/json", "craftworks-custom-recipes.json");
  }
  async #import(event) {
    const file = event.currentTarget.files?.[0]; if (!file) return;
    try {
      const conflict = await foundry.applications.api.DialogV2.prompt({
        window: { title: "Import Custom Recipes" },
        content: `<div class="ml-dialog-shell"><label>When an output Item already has a recipe<select name="conflict"><option value="skip">Skip existing recipe</option><option value="replace">Replace existing recipe</option></select></label></div>`,
        ok: { label: "Import", callback: (_event, _button, dialog) => dialog.element.querySelector("[name='conflict']")?.value ?? "skip" },
        rejectClose: false
      });
      if (!conflict) return;
      const s = await this.craftworks.customRecipes.import(await file.text(), { conflict });
      await this.craftworks.recipes.loadStandardSeed();
      ui.notifications.info(`Import complete: ${s.created} created, ${s.replaced} replaced, ${s.skipped} skipped.`);
      await this.render({ force: true });
    } catch (error) { ui.notifications.error(error.message); } finally { event.currentTarget.value = ""; }
  }
}
