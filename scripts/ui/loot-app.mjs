import { MODULE_TITLE } from "../constants.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class LootApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.session = null;
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-loot",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 760, height: 760 },
    window: { title: `${MODULE_TITLE} — Encounter Loot`, resizable: true }
  };

  static PARTS = {
    content: { template: "modules/morelord-craftworks/templates/loot-gm.hbs" }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const actors = game.actors
      .filter(actor => actor.type === "character")
      .map(actor => ({ uuid: actor.uuid, name: actor.name, img: actor.img }));

    const allCreatures = this.session?.creatures ?? this.craftworks.loot.getDeadCreatureSummary();
    const creatures = [];
    let resolvedCount = 0;

    for (const creature of allCreatures) {
      const resolved = await this.craftworks.loot.isLootResolved(creature.tokenUuid);
      if (resolved) resolvedCount += 1;
      creatures.push({ ...creature, resolved });
    }

    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();

    return foundry.utils.mergeObject(context, {
      session: this.session,
      creatures,
      resolvedCount,
      actors,
      partyInfo
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[data-action='roll']")
      ?.addEventListener("click", () => this.#roll());

    this.element.querySelector("[data-action='award']")
      ?.addEventListener("click", () => this.#award());

    this.element.querySelector("[data-action='finish']")
      ?.addEventListener("click", () => this.#finish());

    this.element.querySelector("[data-action='reset-loot']")
      ?.addEventListener("click", () => this.#resetLoot());
  }

  async #roll() {
    try {
      this.session = await this.craftworks.loot.start();
      await this.craftworks.loot.roll(this.session.id);
      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #award() {
    let actorUuid = null;

    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();
    if (!partyInfo.enabled || !partyInfo.valid) {
      actorUuid = this.element.querySelector("[name='recipient']")?.value ?? null;
      if (!actorUuid) return ui.notifications.warn("Choose a character to carry the encounter loot.");
    }

    try {
      const result = await this.craftworks.loot.award(this.session.id, actorUuid);

      const materialSummary = result.materials.map(m => `${m.name} ×${m.quantity}`).join(", ");
      const parts = [];
      if (materialSummary) parts.push(materialSummary);
      if (result.coinTotalCopper > 0) parts.push(result.coinLabel);
      if (result.special?.itemName) parts.push(result.special.itemName);

      ui.notifications.info(`Encounter loot sent to ${result.recipientName}: ${parts.join("; ") || "nothing"}.`);

      await this.craftworks.socket.emit("loot.complete", {
        found: result.found,
        materials: result.materials,
        coinLabel: result.coinLabel,
        coinTotalCopper: result.coinTotalCopper,
        special: result.special,
        actorName: result.recipientName
      });

      await this.#finish();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #resetLoot() {
    try {
      const count = await this.craftworks.loot.resetSceneLooting();
      ui.notifications.info(`Reset encounter-loot records for ${count} dead creature token${count === 1 ? "" : "s"} on this scene.`);
      this.session = null;
      await this.render();
    } catch (err) {
      ui.notifications.error(err.message);
    }
  }

  async #finish() {
    if (this.session) this.craftworks.loot.finalize(this.session.id);
    await this.close();
  }
}
