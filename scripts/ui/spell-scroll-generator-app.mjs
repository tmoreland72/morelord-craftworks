import { MODULE_TITLE } from "../constants.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } =
  foundry.applications.api;

export class SpellScrollGeneratorApp
  extends HandlebarsApplicationMixin(ApplicationV2) {

  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.level = 0;
    this.result = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-spell-scroll-generator",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 560, height: 500 },
    window: {
      title: `${MODULE_TITLE} — Spell Scroll Generator`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template:
        "modules/morelord-craftworks/templates/spell-scroll-generator.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const service = this.craftworks.spellScrollGenerator;

    const spells = service?.hasAccess
      ? await service.availableSpells({ level: this.level })
      : [];

    return foundry.utils.mergeObject(context, {
      hasAccess: Boolean(service?.hasAccess),
      level: this.level,
      levels: Array.from({ length: 10 }, (_, level) => ({
        value: level,
        label: level === 0 ? "Cantrip" : `Level ${level}`,
        selected: level === this.level
      })),
      spellCount: spells.length,
      result: this.result
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[name='scroll-level']")
      ?.addEventListener("change", event => {
        this.level = Number(event.currentTarget.value ?? 0);
        this.result = null;
        this.render();
      });

    this.element.querySelector("[data-action='generate-scroll']")
      ?.addEventListener("click", async event => {
        event.preventDefault();

        const service = this.craftworks.spellScrollGenerator;
        if (!service?.hasAccess) return;

        this.result = await service.randomSpell(this.level);

        if (!this.result) {
          ui.notifications.warn(
            `No enabled spell compendium contains a ${
              this.level === 0 ? "cantrip" : `level ${this.level} spell`
            }.`
          );
        }

        this.render();
      });

    this.element.querySelector("[data-spell-uuid]")
      ?.addEventListener("click", async event => {
        const uuid = event.currentTarget.dataset.spellUuid;
        const document = uuid ? await fromUuid(uuid) : null;
        document?.sheet?.render(true);
      });
  }
}
