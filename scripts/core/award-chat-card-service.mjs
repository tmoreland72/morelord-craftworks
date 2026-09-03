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
    speakerActor = null,
    icon = "fa-solid fa-gift"
  } = {}) {
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
      <section class="ml-chat-card ml-craftworks-award-card">
        <header class="ml-craftworks-award-card-header">
          <div class="ml-craftworks-award-card-icon">
            <i class="${this.#escape(icon)}"></i>
          </div>
          <div class="ml-craftworks-award-card-heading">
            <div class="ml-craftworks-award-card-title">
              ${this.#escape(title)}
            </div>
            ${recipient ? `
              <div class="ml-craftworks-award-card-recipient">
                <i class="fa-solid fa-user"></i>
                ${this.#escape(recipient.name)}
              </div>
            ` : ""}
            ${
              subtitle
                ? `<div class="ml-craftworks-award-card-subtitle">${this.#escape(subtitle)}</div>`
                : ""
            }
          </div>
        </header>

        ${
          normalizedItems.length
            ? `
              <div class="ml-craftworks-award-card-items">
                ${normalizedItems.map(item => this.#renderItem(item)).join("")}
              </div>
            `
            : ""
        }

        ${
          hasCoin
            ? `
              <div class="ml-craftworks-award-card-coins">
                <i class="fa-solid fa-coins"></i>
                <span>${this.#escape(String(coinLabel))}</span>
              </div>
            `
            : ""
        }

        <footer class="ml-craftworks-award-card-footer">
          ${this.#escape(MODULE_TITLE)}
        </footer>
      </section>
    `;

    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({
        actor: speakerActor ?? recipient ?? null
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
    const linkAttribute = item.uuid
      ? ` data-ml-craftworks-link-target="${this.#escapeAttribute(item.uuid)}"`
      : "";
    const label = item.uuid
      ? `@UUID[${item.uuid}]{${this.#escape(item.name)}}`
      : this.#escape(item.name);

    return `
      <article class="ml-craftworks-award-card-item"${linkAttribute}>
        <img
          class="ml-craftworks-award-card-item-image"
          src="${this.#escapeAttribute(item.img)}"
          alt="${this.#escapeAttribute(item.name)}"
        >
        <div class="ml-craftworks-award-card-item-body">
          <div class="ml-craftworks-award-card-item-name">
            ${label}
          </div>
          ${
            item.rarity
              ? `<div class="ml-craftworks-award-card-item-rarity">${this.#escape(item.rarity)}</div>`
              : ""
          }
        </div>
        <div class="ml-craftworks-award-card-item-quantity">
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
