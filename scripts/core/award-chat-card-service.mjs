import { MODULE_TITLE } from "../constants.mjs";

/**
 * Public, recipient-grouped chat cards for anything Craftworks awards.
 *
 * Callers should pass one operation's complete award set so a Treasure Hoard
 * or Encounter Loot award produces one card rather than one card per item.
 */
export class AwardChatCardService {
  static async post({
    recipient,
    items = [],
    coinLabel = null,
    title = "Items Received",
    subtitle = null,
    speakerActor = null
  } = {}) {
    if (!recipient) return null;

    const normalizedItems = (items ?? [])
      .map(entry => this.#normalizeItem(entry))
      .filter(Boolean);

    const hasCoin = Boolean(
      String(coinLabel ?? "").trim()
    );

    if (!normalizedItems.length && !hasCoin) {
      return null;
    }

    const content = `
      <section class="mcw-award-card">
        <header class="mcw-award-card-header">
          <div class="mcw-award-card-icon">
            <i class="fa-solid fa-gift"></i>
          </div>
          <div class="mcw-award-card-heading">
            <div class="mcw-award-card-title">
              ${this.#escape(title)}
            </div>
            <div class="mcw-award-card-recipient">
              <i class="fa-solid fa-user"></i>
              ${this.#escape(recipient.name)}
            </div>
            ${
              subtitle
                ? `<div class="mcw-award-card-subtitle">${this.#escape(subtitle)}</div>`
                : ""
            }
          </div>
        </header>

        ${
          normalizedItems.length
            ? `
              <div class="mcw-award-card-items">
                ${normalizedItems.map(item => this.#renderItem(item)).join("")}
              </div>
            `
            : ""
        }

        ${
          hasCoin
            ? `
              <div class="mcw-award-card-coins">
                <i class="fa-solid fa-coins"></i>
                <span>${this.#escape(String(coinLabel))}</span>
              </div>
            `
            : ""
        }

        <footer class="mcw-award-card-footer">
          ${this.#escape(MODULE_TITLE)}
        </footer>
      </section>
    `;

    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({
        actor: speakerActor ?? recipient
      }),
      content
    });
  }

  static #normalizeItem(entry) {
    if (!entry) return null;

    const document =
      entry.document
      ?? entry.item
      ?? entry.source
      ?? null;

    const uuid =
      entry.uuid
      ?? entry.linkUuid
      ?? document?.uuid
      ?? null;

    const name =
      entry.name
      ?? entry.label
      ?? document?.name
      ?? null;

    if (!name) return null;

    const rarity =
      entry.rarity
      ?? document?.system?.rarity
      ?? null;

    return {
      uuid,
      name: String(name),
      img:
        entry.img
        ?? document?.img
        ?? "icons/svg/item-bag.svg",
      quantity: Math.max(
        1,
        Number(entry.quantity ?? 1)
      ),
      rarity:
        rarity
          ? String(rarity)
          : null
    };
  }

  static #renderItem(item) {
    const label = item.uuid
      ? `@UUID[${item.uuid}]{${this.#escape(item.name)}}`
      : this.#escape(item.name);

    return `
      <article class="mcw-award-card-item">
        <img
          class="mcw-award-card-item-image"
          src="${this.#escapeAttribute(item.img)}"
          alt="${this.#escapeAttribute(item.name)}"
        >
        <div class="mcw-award-card-item-body">
          <div class="mcw-award-card-item-name">
            ${label}
          </div>
          ${
            item.rarity
              ? `<div class="mcw-award-card-item-rarity">${this.#escape(item.rarity)}</div>`
              : ""
          }
        </div>
        <div class="mcw-award-card-item-quantity">
          ×${item.quantity}
        </div>
      </article>
    `;
  }

  static #escape(value) {
    return foundry.utils.escapeHTML(
      String(value ?? "")
    );
  }

  static #escapeAttribute(value) {
    return this.#escape(value)
      .replace(/"/g, "&quot;");
  }
}
