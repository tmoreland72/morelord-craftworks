import { MODULE_TITLE } from "../constants.mjs";
import { POTION_CATEGORIES, POTION_RARITIES } from "../potions/potion-generator-service.mjs";
import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
import { bindGeneratorCountControls } from "./generator-count-controls.mjs";
import { AwardChatCardService } from "../core/award-chat-card-service.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class PotionGeneratorApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.counts = Object.fromEntries(POTION_RARITIES.map(rarity => [rarity.id, 0]));
    this.result = [];
    this.selectedCategories = new Set(POTION_CATEGORIES.map(category => category.id));
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-potion-generator",
    classes: ["ml-window", "ml-craftworks-module", "ml-craftworks-window", "ml-craftworks-potion-generator-window"],
    position: { width: 820, height: 820 },
    window: { title: `${MODULE_TITLE} — Potion Generator`, resizable: true }
  };

  static PARTS = {
    content: { template: "modules/morelord-craftworks/templates/potion-generator.hbs" }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const service = this.craftworks.potionGenerator;
    const availableCounts = service?.hasAccess
      ? await service.availableCounts({ categories: [...this.selectedCategories] })
      : {};
    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();
    const actors = game.actors
      .filter(actor => actor.type === "character" || actor.type === "group")
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.name,
        selected: actor.uuid === partyInfo.actorUuid
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const rarities = POTION_RARITIES.map(rarity => ({
      ...rarity,
      count: Number(this.counts[rarity.id] ?? 0),
      available: Number(availableCounts[rarity.id] ?? 0)
    }));

    const resultGroups = POTION_RARITIES.map(rarity => ({
      ...rarity,
      potions: this.result.filter(potion => potion.rarity === rarity.id)
    })).filter(group => group.potions.length);

    return foundry.utils.mergeObject(context, {
      hasAccess: Boolean(service?.hasAccess),
      rarities,
      categories: POTION_CATEGORIES.map(category => ({
        ...category,
        selected: this.selectedCategories.has(category.id)
      })),
      resultGroups,
      hasResult: this.result.length > 0,
      resultCount: this.result.length,
      partyInfo,
      actors
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelectorAll("[data-potion-rarity]").forEach(input =>
      input.addEventListener("change", event => {
        this.counts[event.currentTarget.dataset.potionRarity] = Math.max(
          0,
          Math.floor(Number(event.currentTarget.value ?? 0))
        );
        this.result = [];
      })
    );
    this.element.querySelectorAll("[data-potion-category]").forEach(input =>
      input.addEventListener("change", () => {
        this.#readCategories();
        this.result = [];
        this.render({ force: true });
      })
    );
    bindGeneratorCountControls(this.element, {
      inputSelector: "[data-potion-rarity]"
    });

    this.element.querySelector("[data-action='generate-potions']")
      ?.addEventListener("click", event => this.#generate(event));
    this.element.querySelector("[data-action='reroll-potions']")
      ?.addEventListener("click", event => this.#generate(event));
    this.element.querySelector("[data-action='award-potions']")
      ?.addEventListener("click", event => this.#award(event));
    this.element.querySelector("[data-action='share-potions']")
      ?.addEventListener("click", event => this.#share(event));

    this.element.querySelectorAll("[data-potion-uuid]").forEach(button =>
      button.addEventListener("click", async event => {
        const item = await fromUuid(event.currentTarget.dataset.potionUuid);
        item?.sheet?.render(true);
      })
    );
  }

  #readCounts() {
    this.element.querySelectorAll("[data-potion-rarity]").forEach(input => {
      this.counts[input.dataset.potionRarity] = Math.max(0, Math.floor(Number(input.value ?? 0)));
    });
  }

  #readCategories() {
    const inputs = [
      ...this.element.querySelectorAll("[data-potion-category]")
    ];
    if (!inputs.length) return;

    this.selectedCategories = new Set(
      inputs
        .filter(input => input.checked)
        .map(input => input.dataset.potionCategory)
    );
  }

  async #generate(event) {
    event.preventDefault();
    this.#readCounts();
    this.#readCategories();
    if (!this.selectedCategories.size) {
      ui.notifications.warn("Choose at least one potion category.");
      return;
    }
    if (!Object.values(this.counts).some(value => value > 0)) {
      ui.notifications.warn("Choose at least one potion before generating results.");
      return;
    }

    try {
      this.result = await this.craftworks.potionGenerator.generate(this.counts, {
        categories: [...this.selectedCategories]
      });
      await this.render({ force: true });
    } catch (error) {
      ui.notifications.error(error.message);
    }
  }

  async #award(event) {
    event.preventDefault();
    if (!this.result.length) {
      ui.notifications.warn("Generate potions before awarding them.");
      return;
    }

    const fallbackActorUuid = this.element.querySelector("[name='recipient']")?.value ?? null;
    if (!fallbackActorUuid) {
      ui.notifications.warn("Choose a recipient.");
      return;
    }

    try {
      const result = await this.craftworks.potionGenerator.createAndAward({
        potions: this.result,
        fallbackActorUuid
      });
      ui.notifications.info(`${this.result.length} potion(s) added to ${result.recipient.name}.`);
      await this.close();
    } catch (error) {
      ui.notifications.error(error.message);
    }
  }

  async #share(event) {
    event.preventDefault();
    if (!this.result.length) return ui.notifications.warn("Generate potions before sharing them.");
    try {
      await AwardChatCardService.post({
        items: this.result.map(potion => ({ ...potion, linkUuid: potion.uuid, quantity: 1 })),
        title: "Available Potions",
        subtitle: `${this.result.length} randomly generated potion${this.result.length === 1 ? "" : "s"}`,
        icon: "fa-solid fa-flask"
      });
      ui.notifications.info("Potion results displayed in chat.");
    } catch (error) {
      ui.notifications.error(`Could not display potion results: ${error.message}`);
    }
  }
}
