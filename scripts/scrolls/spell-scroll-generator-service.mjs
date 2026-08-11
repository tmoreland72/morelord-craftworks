import { AwardChatCardService } from "../core/award-chat-card-service.mjs";
export class SpellScrollGeneratorService {
  constructor({
    coreAccess = null,
    sourceFilter = null,
    adapter = null,
    recipientResolver = null,
    dnd5eItemResolver = null
  } = {}) {
    this.coreAccess = coreAccess;
    this.sourceFilter = sourceFilter;
    this.adapter = adapter;
    this.recipientResolver = recipientResolver;
    this.dnd5eItemResolver = dnd5eItemResolver;
  }

  get premiumFeatureId() {
    return "spell-scroll-generator";
  }

  get hasAccess() {
    if (!this.coreAccess) return true;
    return Boolean(
      this.coreAccess.hasFeature?.(this.premiumFeatureId)
      || this.coreAccess.hasPremiumAccess?.()
    );
  }

  async availableSpells({ level = null } = {}) {
    const spells = [];
    const seen = new Set();

    const eligiblePacks = Array.from(game.packs ?? [])
      .filter(pack =>
        pack.documentName === "Item"
        && this.#packEnabled(pack)
        && (
          !this.sourceFilter
          || this.sourceFilter.isPackEnabled(pack)
        )
      );

    const packs = this.sourceFilter
      ? this.sourceFilter.sortPacks(eligiblePacks)
      : eligiblePacks;

    for (const pack of packs) {

      let index;
      try {
        index = await pack.getIndex({
          fields: ["name", "img", "type", "system.level"]
        });
      } catch (error) {
        console.warn(
          `Morelord Craftworks | Unable to index spell pack ${pack.collection}.`,
          error
        );
        continue;
      }

      for (const row of index) {
        if (row.type !== "spell") continue;

        const spellLevel = Number(
          foundry.utils.getProperty(row, "system.level")
          ?? 0
        );

        if (
          level != null
          && Number(level) !== spellLevel
        ) continue;

        const key = `${spellLevel}|${String(row.name).toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);

        spells.push({
          name: row.name,
          img: row.img ?? "icons/svg/book.svg",
          level: spellLevel,
          uuid: `Compendium.${pack.collection}.Item.${row._id}`,
          packId: pack.collection,
          sourceLabel:
            this.sourceFilter?.sourceLabelForPack(pack)
            ?? pack.metadata?.label
            ?? pack.title
            ?? pack.collection,
          packLabel:
            this.sourceFilter?.sourceLabelForPack(pack)
            ?? pack.metadata?.label
            ?? pack.title
            ?? pack.collection
        });
      }
    }

    return spells.sort((a, b) =>
      a.level - b.level
      || a.name.localeCompare(b.name)
    );
  }

  async randomSpell(level) {
    const spells = await this.availableSpells({ level });
    if (!spells.length) return null;

    return spells[
      Math.floor(Math.random() * spells.length)
    ];
  }

  async createAndAwardScroll({
    spellUuid,
    level,
    fallbackActorUuid = null
  } = {}) {
    if (!this.hasAccess) {
      throw new Error(
        "Spell Scroll Generator requires premium access."
      );
    }

    const spell = spellUuid
      ? await fromUuid(spellUuid)
      : null;

    if (!spell || spell.documentName !== "Item" || spell.type !== "spell") {
      throw new Error(
        "The selected spell could not be resolved."
      );
    }

    const fallback = fallbackActorUuid
      ? await fromUuid(fallbackActorUuid)
      : null;

    const recipient = await this.recipientResolver?.resolve(
      fallback
    );

    if (!recipient) {
      throw new Error(
        "No valid recipient is available for the spell scroll."
      );
    }

    const scrollTemplate = await this.#resolveScrollTemplate(level);

    if (!scrollTemplate) {
      throw new Error(
        `No enabled D&D5e source provides a spell scroll template for ${
          Number(level) === 0 ? "Cantrip" : `Level ${Number(level)}`
        }.`
      );
    }

    const data = scrollTemplate.toObject();
    delete data._id;

    data.name = `Spell Scroll: ${spell.name}`;

    const spellSourceLabel =
      this.sourceFilter?.sourceLabelForPack(
        spell.pack
      )
      ?? spell.pack
      ?? "World";

    foundry.utils.setProperty(
      data,
      "flags.morelord-craftworks.spellScrollGenerator",
      {
        spellUuid: spell.uuid,
        spellName: spell.name,
        spellLevel: Number(level),
        sourcePackId: spell.pack ?? null,
        sourceLabel: spellSourceLabel,
        scrollTemplateUuid: scrollTemplate.uuid
      }
    );

    const existingDescription = String(
      foundry.utils.getProperty(
        data,
        "system.description.value"
      ) ?? ""
    );

    const spellLink = `@UUID[${spell.uuid}]{${spell.name}}`;

    foundry.utils.setProperty(
      data,
      "system.description.value",
      `
        <p><strong>Contained Spell:</strong> ${spellLink}</p>
        <p><strong>Source:</strong> ${spellSourceLabel}</p>
        ${existingDescription}
      `
    );

    // Preserve the official scroll's mechanics, pricing, uses, and image while
    // giving the resulting Item the actual selected spell identity.
    const ItemClass = CONFIG.Item.documentClass ?? Item;
    const temporary = new ItemClass(data);

    const created = await this.adapter.addItemToActor(
      recipient,
      temporary,
      1
    );

    await AwardChatCardService.post({
      recipient,
      items: [{
        document: created,
        uuid: created.uuid,
        quantity: 1,
        rarity: created.system?.rarity
      }],
      title: "Spell Scroll Received",
      subtitle: spell.name
    });

    return {
      item: created,
      recipient,
      spell,
      sourceLabel: spellSourceLabel,
      scrollTemplate
    };
  }

  async #resolveScrollTemplate(level) {
    const numericLevel = Number(level ?? 0);
    const names = numericLevel === 0
      ? [
          "Spell Scroll, Cantrip",
          "Spell Scroll (Cantrip)"
        ]
      : [
          `Spell Scroll, Level ${numericLevel}`,
          `Spell Scroll (${numericLevel}${
            numericLevel === 1
              ? "st"
              : numericLevel === 2
                ? "nd"
                : numericLevel === 3
                  ? "rd"
                  : "th"
          } Level)`
        ];

    const eligiblePacks = Array.from(game.packs ?? [])
      .filter(pack =>
        pack.documentName === "Item"
        && this.#packEnabled(pack)
        && (
          !this.sourceFilter
          || this.sourceFilter.isPackEnabled(pack)
        )
      );

    const packs = this.sourceFilter
      ? this.sourceFilter.sortPacks(eligiblePacks)
      : eligiblePacks;

    for (const pack of packs) {

      let index;

      try {
        index = await pack.getIndex({
          fields: ["name", "img", "type"]
        });
      } catch {
        continue;
      }

      for (const name of names) {
        const target = this.#normalizeName(name);
        const row = index.find(entry =>
          this.#normalizeName(entry.name) === target
        );

        if (!row) continue;

        const item = await pack.getDocument(row._id);
        if (item?.documentName === "Item") return item;
      }
    }

    return null;
  }

  #normalizeName(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  #packEnabled(pack) {
    // Foundry only exposes packs that are available to the world. Avoid
    // hidden/private packs and let active module/system compendiums participate.
    return pack.visible !== false;
  }
}
