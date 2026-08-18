export class SpellbookGeneratorService {
  constructor({
    spellScrollGenerator = null,
    adapter = null,
    recipientResolver = null
  } = {}) {
    this.spellScrollGenerator =
      spellScrollGenerator;
    this.adapter = adapter;
    this.recipientResolver =
      recipientResolver;
  }

  get hasAccess() {
    return Boolean(
      this.spellScrollGenerator?.hasAccess
    );
  }

  async availableCounts({ schools = null } = {}) {
    const spells =
      await this.spellScrollGenerator
        .availableSpells({ schools });

    const counts = {};

    for (let level = 0; level <= 9; level += 1) {
      counts[level] = 0;
    }

    for (const spell of spells) {
      const level = Number(spell.level ?? 0);
      counts[level] =
        Number(counts[level] ?? 0) + 1;
    }

    return counts;
  }

  async generate(counts = {}, { schools = null } = {}) {
    if (!this.hasAccess) {
      throw new Error(
        "Spellbook Generator requires premium access."
      );
    }

    const allSpells =
      await this.spellScrollGenerator
        .availableSpells({ schools });

    const byLevel = new Map();

    for (let level = 0; level <= 9; level += 1) {
      byLevel.set(
        level,
        allSpells.filter(
          spell =>
            Number(spell.level ?? 0) ===
            level
        )
      );
    }

    const selected = [];

    for (let level = 0; level <= 9; level += 1) {
      const requested = Math.max(
        0,
        Math.floor(
          Number(counts[level] ?? 0)
        )
      );

      if (!requested) continue;

      const pool = [
        ...(byLevel.get(level) ?? [])
      ];

      if (requested > pool.length) {
        throw new Error(
          `Requested ${requested} ${
            level === 0
              ? "cantrips"
              : `level ${level} spells`
          }, but only ${pool.length} are available from enabled spell sources.`
        );
      }

      for (
        let count = 0;
        count < requested;
        count += 1
      ) {
        const index =
          Math.floor(
            Math.random() * pool.length
          );

        const [spell] =
          pool.splice(index, 1);

        if (spell) selected.push(spell);
      }
    }

    return selected.sort(
      (a, b) =>
        Number(a.level ?? 0)
        - Number(b.level ?? 0)
        || a.name.localeCompare(b.name)
    );
  }

  async createAndAward({
    name = "Recovered Spellbook",
    spells = [],
    fallbackActorUuid = null
  } = {}) {
    if (!this.hasAccess) {
      throw new Error(
        "Spellbook Generator requires premium access."
      );
    }

    if (!spells.length) {
      throw new Error(
        "Generate at least one spell before creating a spellbook."
      );
    }

    const fallback =
      fallbackActorUuid
        ? await fromUuid(
            fallbackActorUuid
          )
        : null;

    const recipient =
      await this.recipientResolver?.resolve(
        fallback
      );

    if (!recipient) {
      throw new Error(
        "No valid recipient is available for the spellbook."
      );
    }

    const normalizedName =
      String(name ?? "").trim()
      || "Recovered Spellbook";

    const groups = new Map();

    for (const spell of spells) {
      const level =
        Number(spell.level ?? 0);

      if (!groups.has(level)) {
        groups.set(level, []);
      }

      groups.get(level).push(spell);
    }

    const sections = [];

    for (
      const [level, entries] of
      [...groups.entries()].sort(
        ([a], [b]) => a - b
      )
    ) {
      const heading =
        level === 0
          ? "Cantrips"
          : `Level ${level}`;

      const links =
        entries
          .map(
            spell =>
              `<li>@UUID[${spell.uuid}]{${spell.name}}</li>`
          )
          .join("");

      sections.push(
        `<h3>${heading}</h3><ul>${links}</ul>`
      );
    }

    const ItemClass =
      CONFIG.Item.documentClass ?? Item;

    const temporary =
      new ItemClass({
        name: normalizedName,
        type: "loot",
        img:
          "icons/sundries/books/book-symbol-lightning-silver-blue.webp",
        system: {
          description: {
            value:
              `<p>This spellbook contains the following spells.</p>${sections.join("")}`
          },
          quantity: 1,
          weight: 3,
          price: {
            value: 50,
            denomination: "gp"
          },
          rarity: ""
        },
        flags: {
          "morelord-craftworks": {
            generatedSpellbook: {
              spells:
                spells.map(spell => ({
                  uuid: spell.uuid,
                  name: spell.name,
                  level:
                    Number(spell.level ?? 0),
                  sourceLabel:
                    spell.sourceLabel
                    ?? null
                })),
              generatedAt: Date.now()
            }
          }
        }
      });

    const created =
      await this.adapter.addItemToActor(
        recipient,
        temporary,
        1
      );

    await this.#postChatCard({
      recipient,
      spellbook: created,
      spells
    });

    return {
      item: created,
      recipient,
      spells
    };
  }

  async #postChatCard({
    recipient,
    spellbook,
    spells
  }) {
    const groups = new Map();

    for (const spell of spells) {
      const level =
        Number(spell.level ?? 0);

      if (!groups.has(level)) {
        groups.set(level, []);
      }

      groups.get(level).push(spell);
    }

    const sections =
      [...groups.entries()]
        .sort(([a], [b]) => a - b)
        .map(([level, entries]) => {
          const heading =
            level === 0
              ? "Cantrips"
              : `Level ${level}`;

          const links =
            entries
              .map(
                spell =>
                  `<li>@UUID[${spell.uuid}]{${spell.name}}</li>`
              )
              .join("");

          return `
            <div class="mcw-spellbook-card-level">
              <strong>${heading}</strong>
              <ul>${links}</ul>
            </div>
          `;
        })
        .join("");

    await ChatMessage.create({
      speaker:
        ChatMessage.getSpeaker({
          actor: recipient
        }),
      content: `
        <section class="mcw-spellbook-card">
          <header>
            <img
              src="${spellbook.img}"
              alt="${foundry.utils.escapeHTML(spellbook.name)}"
            >
            <div>
              <strong>@UUID[${spellbook.uuid}]{${foundry.utils.escapeHTML(spellbook.name)}}</strong>
              <span>Received by ${foundry.utils.escapeHTML(recipient.name)}</span>
            </div>
          </header>
          <div class="mcw-spellbook-card-spells">
            ${sections}
          </div>
          <footer>Morelord Craftworks</footer>
        </section>
      `
    });
  }
}
