import { materialSources } from "../materials/material-sources.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
import { createMonsterCard } from "../../../morelord-core/scripts/ui/monster-card.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const labels = { gather: "Gather", harvest: "Harvest", loot: "Loot" };

export class MaterialSourcesApp extends ScrollPreservingApplicationMixin(HandlebarsApplicationMixin(ApplicationV2)) {
  static DEFAULT_OPTIONS = {
    classes: ["ml-window", "ml-craftworks-module"],
    position: { width: 660, height: 640 },
    window: { title: "Material Sources", resizable: true }
  };

  static PARTS = { content: { template: "modules/morelord-craftworks/templates/material-sources.hbs" } };

  constructor(craftworks, material, kind) {
    super();
    this.craftworks = craftworks;
    this.material = material;
    this.kind = kind;
    this.loading = true;
    this.rows = [];
    this.notices = [];
    this.closed = false;
    this.searchStatus = "Searching available sources…";
  }

  async load() {
    if (!game.user.isGM) return;
    await this.render({ force: true });
    try {
      Object.assign(this, await materialSources(this.craftworks, this.material, this.kind, {
        onProgress: status => {
          this.searchStatus = status;
          const element = this.element?.querySelector("[data-source-search-status]");
          if (element) element.textContent = status;
        }
      }));
    } catch (error) {
      console.error("Morelord Craftworks | Material source lookup failed", error);
      this.notices.push("Source lookup failed. Close this window and try again; the source compendium may be unavailable.");
      this.failed = true;
    }
    this.loading = false;
    if (!this.closed) await this.render();
  }

  async _prepareContext() {
    return { materialName: this.material.name, sourceLabel: labels[this.kind], loading: this.loading,
      rows: this.rows, notices: this.notices, searchStatus: this.searchStatus, failed: this.failed, isGM: game.user.isGM };
  }

  async _onRender(context, options) {
    this.element.querySelectorAll("[data-source-monster]").forEach(placeholder => {
      const row = this.rows[Number(placeholder.dataset.sourceMonster)];
      const open = document.createElement("button");
      open.type = "button";
      open.className = "ml-icon-button";
      open.dataset.documentUuid = row.uuid;
      open.title = `Open ${row.name} Actor sheet`;
      open.setAttribute("aria-label", open.title);
      open.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>';
      placeholder.replaceWith(createMonsterCard({ ...row, category: row.detail }, { actions: [open] }));
    });
    await super._onRender(context, options);
    this.element.querySelector("[data-action='close-sources']")?.addEventListener("click", () => this.close());
  }

  async close(options) {
    this.closed = true;
    return super.close(options);
  }
}
