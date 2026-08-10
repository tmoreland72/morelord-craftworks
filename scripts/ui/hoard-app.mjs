import { MODULE_TITLE } from "../constants.mjs";
import { HOARD_PROFILES } from "../acquisition/hoard-profiles.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HoardApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.result = null;
    this.profileId = "0-4";
  }

  static DEFAULT_OPTIONS = {
    id: "morelord-craftworks-hoard",
    classes: ["morelord-craftworks", "mcw-window"],
    position: { width: 720, height: 700 },
    window: {
      title: `${MODULE_TITLE} — Hoard`,
      resizable: true
    }
  };

  static PARTS = {
    content: {
      template: "modules/morelord-craftworks/templates/hoard-gm.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();

    const actors = game.actors
      .filter(actor =>
        actor.type === "character"
        || actor.type === "group"
      )
      .map(actor => ({ uuid: actor.uuid, name: actor.name, img: actor.img }));

    return foundry.utils.mergeObject(context, {
      result: this.result,
      profileId: this.profileId,
      profiles: Object.values(HOARD_PROFILES).map(profile => ({
        ...profile,
        selected: profile.id === this.profileId
      })),
      partyInfo,
      actors
    }, { inplace: false });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector("[name='profile']")
      ?.addEventListener("change", event => {
        this.profileId = event.currentTarget.value;
      });

    this.element.querySelector("[data-action='roll']")
      ?.addEventListener("click", () => this.#roll());

    this.element.querySelector("[data-action='reroll']")
      ?.addEventListener("click", () => this.#roll());

    this.element.querySelector("[data-action='award']")
      ?.addEventListener("click", () => this.#award());

    this.element.querySelector("[data-action='send-chat']")
      ?.addEventListener("click", () => this.#sendToChat());


    this.element.querySelectorAll("[data-item-uuid]")
      .forEach(element => {
        element.addEventListener("click", async event => {
          event.preventDefault();
          event.stopPropagation();

          const uuid = event.currentTarget.dataset.itemUuid;
          if (!uuid) return;

          try {
            const item = await fromUuid(uuid);

            if (!item || item.documentName !== "Item") {
              ui.notifications.warn(
                "The source Item could not be opened."
              );
              return;
            }

            item.sheet?.render(true);
          } catch (error) {
            console.error(
              "Morelord Craftworks | Unable to open hoard Item.",
              error
            );
            ui.notifications.error(
              "The source Item could not be opened."
            );
          }
        });
      });
  }

  async #roll() {
    try {
      this.result = await this.craftworks.hoard.roll(this.profileId);
      await this.render();
    } catch (err) {
      console.error("Morelord Craftworks | Hoard roll failed.", err);
      ui.notifications.error(err.message);
    }
  }

  async #sendToChat() {
    if (!this.result) {
      ui.notifications.warn(
        "Generate a hoard before sending it to chat."
      );
      return;
    }

    const escape = foundry.utils.escapeHTML;

    const materialRows = [];

    for (const material of this.result.materials ?? []) {
      let item = null;

      try {
        item = await this.craftworks.materials.resolveItem(
          material.materialId
        );
      } catch {
        item = null;
      }

      const itemLink = item?.uuid
        ? `@UUID[${item.uuid}]{${material.name}}`
        : escape(material.name);

      materialRows.push(`
        <li class="mcw-chat-result">
          <img src="${escape(item?.img ?? material.img ?? "")}" alt="">
          <span>
            <strong>${itemLink}</strong>
            ×${Number(material.quantity ?? 0)}
          </span>
        </li>
      `);
    }

    const materials = materialRows.join("");

    const specialItems = (this.result.special?.items ?? [])
      .map(item => {
        const itemName = item.itemName ?? "Special Treasure";
        const itemLink = item.itemUuid
          ? `@UUID[${item.itemUuid}]{${itemName}}`
          : escape(itemName);

        return `
          <li class="mcw-chat-result">
            <img src="${escape(item.itemImg ?? "")}" alt="">
            <span>
              <strong>${itemLink}</strong>
              <small>${escape(item.sourceLabel ?? "Unknown Source")}</small>
              <small>${escape(item.tableName ?? "")}</small>
            </span>
          </li>
        `;
      })
      .join("");

    const specialText = this.result.special?.enabled
      ? this.result.special.triggered
        ? specialItems
          ? `
            <section class="mcw-chat-section">
              <h4>Special Treasure</h4>
              <ul class="mcw-chat-results">${specialItems}</ul>
            </section>
          `
          : `
            <section class="mcw-chat-section">
              <h4>Special Treasure</h4>
              <p>No awardable special Item was resolved.</p>
            </section>
          `
        : `
          <section class="mcw-chat-section">
            <h4>Special Treasure</h4>
            <p>None.</p>
          </section>
        `
      : "";

    const content = `
      <div class="mcw-chat-card mcw-hoard-chat-card">
        <header>
          <i class="fa-solid fa-vault"></i>
          <div>
            <h3>Treasure Hoard</h3>
            <span>${escape(this.result.profileLabel ?? "")}</span>
          </div>
        </header>

        ${
          this.result.coinCopper > 0
            ? `
              <section class="mcw-chat-section">
                <h4>Coin</h4>
                <p>
                  <i class="fa-solid fa-coins"></i>
                  <strong>${escape(this.result.coinLabel)}</strong>
                </p>
              </section>
            `
            : ""
        }

        ${
          materials
            ? `
              <section class="mcw-chat-section">
                <h4>Crafting Materials</h4>
                <ul class="mcw-chat-results">${materials}</ul>
              </section>
            `
            : ""
        }

        ${specialText}
      </div>
    `;

    const enrichedContent = await TextEditor.enrichHTML(
      content,
      {
        async: true,
        documents: true
      }
    );

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: enrichedContent
    });

    ui.notifications.info(
      "Treasure hoard sent to chat."
    );
  }

  async #award() {
    let actorUuid = null;
    const partyInfo = await this.craftworks.materialService.getPartyRecipientInfo();

    if (!partyInfo.enabled || !partyInfo.valid) {
      actorUuid = this.element.querySelector("[name='recipient']")?.value ?? null;
      if (!actorUuid) return ui.notifications.warn("Choose a character to carry the hoard.");
    }

    try {
      const awarded = await this.craftworks.hoard.award(this.result, actorUuid);
      const parts = [];

      if (awarded.materials?.length) {
        parts.push(awarded.materials.map(m => `${m.name} ×${m.quantity}`).join(", "));
      }
      if (awarded.coinCopper > 0) parts.push(awarded.coinLabel);
      if (awarded.special?.items?.length) {
        parts.push(awarded.special.items.map(item => item.itemName).join(", "));
      }

      ui.notifications.info(`Hoard sent to ${awarded.recipientName}: ${parts.join("; ") || "nothing"}.`);
      await this.close();
    } catch (err) {
      console.error("Morelord Craftworks | Hoard award failed.", err);
      ui.notifications.error(err.message);
    }
  }
}
