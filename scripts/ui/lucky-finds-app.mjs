import { ARTISAN_TOOLS } from "../crafting/crafting-environment-service.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
export class LuckyFindsApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  constructor(craftworks, result, options = {}) { super(options); this.craftworks = craftworks; this.result = result; }
  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-lucky-finds", classes: ["ml-window", "ml-craftworks-module"],
    position: { width: 620, height: 580 }, window: { title: "Lucky Finds", resizable: true }
  };
  static PARTS = { content: { template: "modules/morelord-craftworks/templates/lucky-finds.hbs" } };
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    if (!game.user.isGM || !this.craftworks.luckyFinds.hasAccess) throw new Error("Lucky Finds requires GM and Drakkenheim access.");
    const results = [];
    for (const result of this.result.results) {
      const tools = [];
      if (result.artisanTools) for (const name of ARTISAN_TOOLS) {
        const item = await this.craftworks.dnd5eItemResolver.resolveAny(name, { preferredSourceBook: "Player's Handbook" });
        if (item) tools.push(`@UUID[${item.uuid}]{${item.name}}`);
      }
      const enrich = text => foundry.applications.ux.TextEditor.implementation.enrichHTML(text, { secrets: true });
      results.push({ ...result, html: await enrich(result.text), toolsHtml: await enrich(tools.join(" · ")) });
    }
    return { ...context, total: this.result.total, results };
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelector('[data-action="open-documentation"]').addEventListener('click', () => game.modules.get('morelord-core').api.ui.documentation.open('morelord-craftworks'));
    this.element.querySelectorAll("[data-action='generate-scroll']").forEach(button => button.addEventListener("click", async () => {
      button.disabled = true;
      try { await this.craftworks.openSpellScrollGenerator(); }
      catch (error) { ui.notifications.error(error.message); }
      finally { if (button.isConnected) button.disabled = false; }
    }));
  }
}
