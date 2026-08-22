import { MODULE_TITLE } from "../constants.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class SpellScrollGeneratorApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.counts = Object.fromEntries(Array.from({ length: 10 }, (_, level) => [level, 0]));
    this.result = [];
    this.selectedSchools = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-spell-scroll-generator",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window", "ml-craftworks-generator-window", "ml-craftworks-spell-scroll-generator-window"],
    position: { width: 820, height: 820 },
    window: { title: `${MODULE_TITLE} — Spell Scroll Generator`, resizable: true }
  };

  static PARTS = {
    content: { template: "modules/morelord-craftworks/templates/spell-scroll-generator.hbs" }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const service = this.craftworks.spellScrollGenerator;
    const allSpells = service?.hasAccess ? await service.availableSpells() : [];
    const schools = this.#schoolOptions(allSpells);
    this.selectedSchools ??= new Set(schools.map(school => school.id));
    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();
    const actors = game.actors
      .filter(actor => actor.type === "character" || actor.type === "group")
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.name,
        selected: actor.uuid === partyInfo.actorUuid
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const levels = Array.from({ length: 10 }, (_, level) => ({
      level,
      label: level === 0 ? "Cantrips" : `Level ${level}`,
      count: Number(this.counts[level] ?? 0),
      available: allSpells.filter(spell => Number(spell.level ?? 0) === level).length
    }));
    const resultGroups = levels.map(entry => ({
      ...entry,
      spells: this.result.filter(spell => Number(spell.level ?? 0) === entry.level)
    })).filter(group => group.spells.length);

    return foundry.utils.mergeObject(context, {
      hasAccess: Boolean(service?.hasAccess),
      levels,
      schools: schools.map(school => ({ ...school, selected: this.selectedSchools.has(school.id) })),
      resultGroups,
      resultCount: this.result.length,
      hasResult: this.result.length > 0,
      partyInfo,
      actors
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelectorAll("[data-scroll-level]").forEach(input =>
      input.addEventListener("change", event => {
        this.counts[Number(event.currentTarget.dataset.scrollLevel)] = Math.max(0, Math.floor(Number(event.currentTarget.value ?? 0)));
        this.result = [];
      })
    );
    this.element.querySelectorAll("[data-spell-school]").forEach(input =>
      input.addEventListener("change", () => {
        this.#readSchools();
        this.result = [];
        this.render({ force: true });
      })
    );
    this.element.querySelector("[data-action='generate-scrolls']")
      ?.addEventListener("click", event => this.#generate(event));
    this.element.querySelector("[data-action='reroll-scrolls']")
      ?.addEventListener("click", event => this.#generate(event));
    this.element.querySelector("[data-action='award-scrolls']")
      ?.addEventListener("click", event => this.#award(event));
    this.element.querySelectorAll("[data-spell-uuid]").forEach(button =>
      button.addEventListener("click", async event => {
        const document = await fromUuid(event.currentTarget.dataset.spellUuid);
        document?.sheet?.render(true);
      })
    );
  }

  #readCounts() {
    this.element.querySelectorAll("[data-scroll-level]").forEach(input => {
      this.counts[Number(input.dataset.scrollLevel)] = Math.max(0, Math.floor(Number(input.value ?? 0)));
    });
  }

  #readSchools() {
    this.selectedSchools = new Set(
      [...this.element.querySelectorAll("[data-spell-school]:checked")]
        .map(input => input.dataset.spellSchool)
    );
  }

  #schoolOptions(spells) {
    const labels = CONFIG.DND5E?.spellSchools ?? {};
    return [...new Set(spells.map(spell => spell.school).filter(Boolean))]
      .map(id => ({ id, label: game.i18n?.localize(labels[id]?.label ?? labels[id] ?? id) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  async #generate(event) {
    event.preventDefault();
    this.#readCounts();
    this.#readSchools();
    if (!this.selectedSchools.size) {
      ui.notifications.warn("Choose at least one school of magic.");
      return;
    }
    if (!Object.values(this.counts).some(value => value > 0)) {
      ui.notifications.warn("Choose at least one spell scroll before generating results.");
      return;
    }
    try {
      this.result = await this.craftworks.spellScrollGenerator.generate(this.counts, {
        schools: [...this.selectedSchools]
      });
      await this.render({ force: true });
    } catch (error) {
      ui.notifications.error(error.message);
    }
  }

  async #award(event) {
    event.preventDefault();
    if (!this.result.length) {
      ui.notifications.warn("Generate spell scrolls before awarding them.");
      return;
    }
    const fallbackActorUuid = this.element.querySelector("[name='recipient']")?.value ?? null;
    if (!fallbackActorUuid) {
      ui.notifications.warn("Choose a recipient.");
      return;
    }
    try {
      const awarded = await this.craftworks.spellScrollGenerator.createAndAwardScrolls({
        spells: this.result,
        fallbackActorUuid
      });
      ui.notifications.info(`${this.result.length} spell scroll(s) added to ${awarded.recipient.name}.`);
      await this.close();
    } catch (error) {
      console.error("Morelord Craftworks | Spell scroll award failed.", error);
      ui.notifications.error(error.message);
    }
  }
}
