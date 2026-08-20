import { MODULE_TITLE } from "../constants.mjs";
import { HOARD_PROFILES } from "../acquisition/hoard-profiles.mjs";

import { ScrollPreservingApplicationMixin } from "./scroll-preserving-application-mixin.mjs";
import {
  addCustomItem,
  coinEditorValues,
  deleteSelectedResultItems,
  searchItemsByName,
  updateResultCoins
} from "./result-item-editor.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class HoardApp extends ScrollPreservingApplicationMixin(
  HandlebarsApplicationMixin(ApplicationV2)
) {
  constructor(craftworks, options = {}) {
    super(options);
    this.craftworks = craftworks;
    this.result = null;
    this.profileId = "0-4";
    this.itemSearchQuery = "";
    this.itemSearchResults = [];
    this.itemSearchTimer = null;
    this.itemLookupOpen = false;
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
      .map(actor => ({
        uuid: actor.uuid,
        name: actor.name,
        img: actor.img,
        selected: actor.uuid === partyInfo.actorUuid
      }));

    return foundry.utils.mergeObject(context, {
      result: this.result,
      profileId: this.profileId,
      profiles: Object.values(HOARD_PROFILES).map(profile => ({
        ...profile,
        selected: profile.id === this.profileId
      })),
      partyInfo,
      actors,
      itemSearchQuery: this.itemSearchQuery,
      itemSearchResults: this.itemSearchResults,
      itemLookupOpen: this.itemLookupOpen,
      itemSearchReady: this.itemSearchQuery.trim().length >= 2,
      coinEditor: coinEditorValues(this.result)
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

    this.#activateResultEditing();


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

  #activateResultEditing() {
    this.element.querySelectorAll("[data-result-item]")
      .forEach(input => input.addEventListener("click", event => event.stopPropagation()));

    this.element.querySelectorAll("[data-coin-denomination]")
      .forEach(input => input.addEventListener("change", async () => {
        const values = Object.fromEntries(
          Array.from(this.element.querySelectorAll("[data-coin-denomination]"))
            .map(field => [field.dataset.coinDenomination, field.value])
        );
        updateResultCoins(this.result, values, this.craftworks.adapter);
        await this.render();
      }));

    this.element.querySelector("[data-action='delete-result-items']")
      ?.addEventListener("click", async () => {
        const selected = Array.from(this.element.querySelectorAll("[data-result-item]:checked"))
          .map(input => input.dataset.resultItem);
        if (!selected.length) return ui.notifications.warn("Mark at least one item to delete.");
        const count = deleteSelectedResultItems(this.result, selected);
        if (count) ui.notifications.info(`Removed ${count} item${count === 1 ? "" : "s"} from the hoard.`);
        await this.render();
      });

    this.element.querySelector("[data-action='open-item-lookup']")
      ?.addEventListener("click", async () => {
        this.itemLookupOpen = true;
        await this.render();
        this.element.querySelector("[data-item-search]")?.focus();
      });

    this.element.querySelector("[data-action='close-item-lookup']")
      ?.addEventListener("click", async () => {
        this.itemLookupOpen = false;
        this.itemSearchQuery = "";
        this.itemSearchResults = [];
        await this.render();
      });

    const search = this.element.querySelector("[data-item-search]");
    search?.addEventListener("input", event => {
      this.itemSearchQuery = event.currentTarget.value;
      clearTimeout(this.itemSearchTimer);
      this.itemSearchTimer = setTimeout(async () => {
        const query = this.itemSearchQuery;
        const results = await searchItemsByName(query, {
          sourceFilter: this.craftworks.sourceFilter
        });
        if (query !== this.itemSearchQuery) return;
        this.itemSearchResults = results;
        await this.render();
        const input = this.element.querySelector("[data-item-search]");
        input?.focus();
        input?.setSelectionRange(input.value.length, input.value.length);
      }, 250);
    });

    this.element.querySelectorAll("[data-action='add-result-item']")
      .forEach(button => button.addEventListener("click", async () => {
        const item = this.itemSearchResults.find(entry => entry.uuid === button.dataset.itemUuid);
        if (!item) return;
        addCustomItem(this.result, item);
        this.itemSearchQuery = "";
        this.itemSearchResults = [];
        this.itemLookupOpen = false;
        ui.notifications.info(`Added ${item.name} to the hoard.`);
        await this.render();
      }));
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

    const potions = (this.result.potions ?? []).map(potion => `
      <li class="mcw-chat-result"><img src="${escape(potion.img ?? "")}" alt=""><span><strong>@UUID[${potion.uuid}]{${escape(potion.name)}}</strong><small>${escape(potion.rarity ?? "")}</small></span></li>
    `).join("");

    const spellScrolls = (this.result.spellScrolls ?? []).map(spell => `
      <li class="mcw-chat-result"><img src="${escape(spell.img ?? "")}" alt=""><span><strong>@UUID[${spell.uuid}]{Spell Scroll: ${escape(spell.name)}}</strong><small>Level ${Number(spell.level ?? 0)}</small></span></li>
    `).join("");

    const customItems = (this.result.customItems ?? []).map(item => `
      <li class="mcw-chat-result"><img src="${escape(item.img ?? "")}" alt=""><span><strong>@UUID[${item.uuid}]{${escape(item.name)}}</strong><small>${escape(item.sourceLabel ?? "")}</small></span></li>
    `).join("");

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

        <section class="mcw-chat-section"><h4>Potions</h4><ul class="mcw-chat-results">${potions}</ul></section>
        <section class="mcw-chat-section"><h4>Spell Scrolls</h4><ul class="mcw-chat-results">${spellScrolls}</ul></section>
        ${customItems ? `<section class="mcw-chat-section"><h4>Added Items</h4><ul class="mcw-chat-results">${customItems}</ul></section>` : ""}

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
    const actorUuid = this.element.querySelector("[name='recipient']")?.value ?? null;
    if (!actorUuid) return ui.notifications.warn("Choose a recipient for the hoard.");

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
      if (awarded.customItems?.length) {
        parts.push(awarded.customItems.map(item => item.name).join(", "));
      }

      ui.notifications.info(`Hoard sent to ${awarded.recipientName}: ${parts.join("; ") || "nothing"}.`);
      await this.close();
    } catch (err) {
      console.error("Morelord Craftworks | Hoard award failed.", err);
      ui.notifications.error(err.message);
    }
  }
}
