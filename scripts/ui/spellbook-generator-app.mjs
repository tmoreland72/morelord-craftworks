import { MODULE_TITLE } from "../constants.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";

const {
  ApplicationV2,
  HandlebarsApplicationMixin
} = foundry.applications.api;

export class SpellbookGeneratorApp
  extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {

  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.counts = Object.fromEntries(
      Array.from(
        { length: 10 },
        (_, level) => [level, 0]
      )
    );
    this.result = [];
    this.bookName = "Recovered Spellbook";
  }

  static DEFAULT_OPTIONS = {
    id:
      "morelord-craftworks-spellbook-generator",
    classes: [
      "morelord-craftworks",
      "mcw-window",
      "mcw-spellbook-generator-window"
    ],
    position: {
      width: 680,
      height: 760
    },
    window: {
      title:
        `${MODULE_TITLE} — Spellbook Generator`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template:
        "modules/morelord-craftworks/templates/spellbook-generator.hbs"
    }
  };

  async _prepareContext(options) {
    const context =
      await super._prepareContext(options);

    const service =
      this.craftworks.spellbookGenerator;

    const availableCounts =
      service?.hasAccess
        ? await service.availableCounts()
        : {};

    const partyInfo =
      await this.craftworks.materialService
        .getPartyRecipientInfo();

    const actors =
      game.actors
        .filter(
          actor =>
            actor.type === "character"
            || actor.type === "group"
        )
        .map(actor => ({
          uuid: actor.uuid,
          name: actor.name,
          selected: actor.uuid === partyInfo.actorUuid
        }))
        .sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );

    const levels =
      Array.from(
        { length: 10 },
        (_, level) => ({
          level,
          label:
            level === 0
              ? "Cantrips"
              : `Level ${level}`,
          count:
            Number(this.counts[level] ?? 0),
          available:
            Number(
              availableCounts[level] ?? 0
            )
        })
      );

    const resultGroups =
      this.#groupResult();

    return foundry.utils.mergeObject(
      context,
      {
        hasAccess:
          Boolean(service?.hasAccess),
        bookName: this.bookName,
        levels,
        result:
          this.result,
        hasResult:
          this.result.length > 0,
        resultGroups,
        partyInfo,
        actors
      },
      { inplace: false }
    );
  }

  async _onRender(context, options) {
    await super._onRender(
      context,
      options
    );

    this.element
      .querySelectorAll(
        "[data-spellbook-level]"
      )
      .forEach(input =>
        input.addEventListener(
          "change",
          event => {
            const level =
              Number(
                event.currentTarget
                  .dataset.spellbookLevel
              );

            this.counts[level] =
              Math.max(
                0,
                Math.floor(
                  Number(
                    event.currentTarget.value
                    ?? 0
                  )
                )
              );

            this.result = [];
          }
        )
      );

    this.element
      .querySelector(
        "[name='spellbook-name']"
      )
      ?.addEventListener(
        "change",
        event => {
          this.bookName =
            String(
              event.currentTarget.value
              ?? ""
            ).trim()
            || "Recovered Spellbook";
        }
      );

    this.element
      .querySelector(
        "[data-action='generate-spellbook']"
      )
      ?.addEventListener(
        "click",
        event =>
          this.#generate(event)
      );

    this.element
      .querySelector(
        "[data-action='reroll-spellbook']"
      )
      ?.addEventListener(
        "click",
        event =>
          this.#generate(event)
      );

    this.element
      .querySelector(
        "[data-action='award-spellbook']"
      )
      ?.addEventListener(
        "click",
        event =>
          this.#award(event)
      );

    this.element
      .querySelectorAll(
        ".mcw-spellbook-spell-open[data-spell-uuid]"
      )
      .forEach(button =>
        button.addEventListener(
          "click",
          async event => {
            event.preventDefault();
            event.stopPropagation();

            const uuid =
              event.currentTarget
                .dataset.spellUuid;

            const spell =
              uuid
                ? await fromUuid(uuid)
                : null;

            spell?.sheet?.render(true);
          }
        )
      );
  }

  async #generate(event) {
    event.preventDefault();

    const form =
      this.element.querySelector(
        ".mcw-spellbook-generator"
      );

    if (form) {
      for (
        const input of form.querySelectorAll(
          "[data-spellbook-level]"
        )
      ) {
        const level =
          Number(
            input.dataset.spellbookLevel
          );

        this.counts[level] =
          Math.max(
            0,
            Math.floor(
              Number(input.value ?? 0)
            )
          );
      }
    }

    const requested =
      Object.values(this.counts)
        .reduce(
          (sum, value) =>
            sum + Number(value ?? 0),
          0
        );

    if (!requested) {
      ui.notifications.warn(
        "Choose at least one spell before generating the spellbook."
      );
      return;
    }

    try {
      this.result =
        await this.craftworks
          .spellbookGenerator
          .generate(this.counts);

      await this.render({
        force: true
      });
    } catch (error) {
      ui.notifications.error(
        error.message
      );
    }
  }

  async #award(event) {
    event.preventDefault();

    if (!this.result.length) {
      ui.notifications.warn(
        "Generate a spellbook before creating it."
      );
      return;
    }

    const fallbackActorUuid =
      this.element.querySelector(
        "[name='recipient']"
      )?.value
      ?? null;

    if (!fallbackActorUuid) {
      ui.notifications.warn(
        "Choose a recipient."
      );
      return;
    }

    this.bookName =
      String(
        this.element.querySelector(
          "[name='spellbook-name']"
        )?.value
        ?? this.bookName
      ).trim()
      || "Recovered Spellbook";

    try {
      const created =
        await this.craftworks
          .spellbookGenerator
          .createAndAward({
            name: this.bookName,
            spells: this.result,
            fallbackActorUuid
          });

      ui.notifications.info(
        `${created.item.name} added to ${created.recipient.name}.`
      );

      await this.close();
    } catch (error) {
      ui.notifications.error(
        error.message
      );
    }
  }

  #groupResult() {
    const groups = new Map();

    for (const spell of this.result) {
      const level =
        Number(spell.level ?? 0);

      if (!groups.has(level)) {
        groups.set(level, []);
      }

      groups.get(level).push(spell);
    }

    return [...groups.entries()]
      .sort(([a], [b]) => a - b)
      .map(([level, spells]) => ({
        level,
        label:
          level === 0
            ? "Cantrips"
            : `Level ${level}`,
        spells
      }));
  }
}
