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

  async availableSpells({
    level = null,
    schools = null,
    respectSourceConfiguration = true,
    dedupe = true
  } = {}) {
    const spells = [];
    const seen = new Set();

    const eligiblePacks = Array.from(game.packs ?? [])
      .filter(pack =>
        pack.documentName === "Item"
        && this.#packEnabled(pack)
        && (
          !respectSourceConfiguration
          || !this.sourceFilter
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
          fields: [
            "name", "img", "type", "system.level", "system.school",
            "system.source.book", "system.source.custom"
          ]
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
        const school = String(
          foundry.utils.getProperty(row, "system.school") ?? ""
        ).trim();

        if (
          level != null
          && Number(level) !== spellLevel
        ) continue;
        if (schools?.length && !schools.includes(school)) continue;

        const sourceLabel = this.sourceFilter
          ? await this.sourceFilter.sourceLabelForCompendiumItem(row, { pack })
          : "Craftworks";
        const key = [
          spellLevel,
          String(row.name).toLowerCase(),
          dedupe ? "" : sourceLabel
        ].join("|");
        if (seen.has(key)) continue;
        seen.add(key);

        spells.push({
          name: row.name,
          img: row.img ?? "icons/svg/book.svg",
          level: spellLevel,
          school,
          uuid: `Compendium.${pack.collection}.Item.${row._id}`,
          packId: pack.collection,
          sourceLabel,
          packLabel: sourceLabel
        });
      }
    }

    return spells.sort((a, b) =>
      a.level - b.level
      || a.name.localeCompare(b.name)
    );
  }

  async randomSpell(level, { schools = null } = {}) {
    const spells = await this.availableSpells({ level, schools });
    if (!spells.length) return null;

    return spells[
      Math.floor(Math.random() * spells.length)
    ];
  }

  async generate(counts = {}, { schools = null } = {}) {
    if (!this.hasAccess) {
      throw new Error(
        "Spell Scroll Generator requires premium access."
      );
    }

    const allSpells = await this.availableSpells({ schools });
    const generated = [];

    for (let level = 0; level <= 9; level += 1) {
      const requested = Math.max(
        0,
        Math.floor(Number(counts[level] ?? 0))
      );
      if (!requested) continue;

      const pool = allSpells.filter(spell =>
        Number(spell.level ?? 0) === level
      );

      if (!pool.length) {
        throw new Error(
          `No ${level === 0 ? "cantrips" : `level ${level} spells`} match the selected schools in enabled D&D5e compendium sources.`
        );
      }

      for (let index = 0; index < requested; index += 1) {
        generated.push(foundry.utils.deepClone(
          pool[Math.floor(Math.random() * pool.length)]
        ));
      }
    }

    return generated;
  }

  async createAndAwardScroll({
    spellUuid,
    level,
    fallbackActorUuid = null,
    postChatCard = true
  } = {}) {
    if (!this.hasAccess) {
      throw new Error(
        "Spell Scroll Generator requires premium access."
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

    const { item: temporary, spell, sourceLabel: spellSourceLabel } =
      await this.createScrollItem({ spellUuid, level });

    const created = await this.adapter.addItemToActor(
      recipient,
      temporary,
      1
    );

    if (postChatCard) {
      await AwardChatCardService.post({
        recipient,
        items: [{
          document: created,
          linkUuid: spell.uuid,
          quantity: 1,
          rarity: created.system?.rarity
        }],
        title: "Spell Scroll Received",
        subtitle: spell.name
      });
    }

    return {
      item: created,
      recipient,
      spell,
      sourceLabel: spellSourceLabel
    };
  }

  async createScrollItem({ spellUuid, level } = {}) {
    const spell = spellUuid ? await fromUuid(spellUuid) : null;
    if (!spell || spell.documentName !== "Item" || spell.type !== "spell") {
      throw new Error("The selected spell could not be resolved.");
    }

    const ItemClass = CONFIG.Item.documentClass ?? Item;
    if (typeof ItemClass.createScrollFromSpell !== "function") {
      throw new Error("The installed D&D5e system cannot create spell scrolls.");
    }

    const numericLevel = Number(level ?? spell.system?.level ?? 0);
    const scroll = await ItemClass.createScrollFromSpell(spell, {}, {
      dialog: false,
      explanation: "reference",
      level: numericLevel
    });
    if (!scroll) throw new Error(`D&D5e could not create a spell scroll for ${spell.name}.`);

    const data = scroll.toObject();
    delete data._id;
    const sourcePack = spell.pack ? game.packs.get(spell.pack) : null;
    const sourceLabel = this.sourceFilter
      ? this.sourceFilter.sourceLabelForItem(spell, { pack: sourcePack })
      : "Unknown Source";
    foundry.utils.setProperty(data, "flags.morelord-craftworks.spellScrollGenerator", {
      spellUuid: spell.uuid,
      spellName: spell.name,
      spellLevel: numericLevel,
      sourcePackId: spell.pack ?? null,
      sourceLabel,
      nativeScrollBaseId: CONFIG.DND5E?.spellScrollIds?.[numericLevel] ?? null
    });

    return {
      item: new ItemClass(data),
      spell,
      sourceLabel
    };
  }

  async createAndAwardScrolls({
    spells = [],
    fallbackActorUuid = null
  } = {}) {
    if (!spells.length) {
      throw new Error(
        "Generate at least one spell scroll before awarding the results."
      );
    }

    const awarded = [];
    let recipient = null;

    for (const spell of spells) {
      const result = await this.createAndAwardScroll({
        spellUuid: spell.uuid,
        level: Number(spell.level ?? 0),
        fallbackActorUuid:
          recipient?.uuid
          ?? fallbackActorUuid,
        postChatCard: false
      });

      recipient = result.recipient;
      awarded.push(result);
    }

    await AwardChatCardService.post({
      recipient,
      items: awarded.map(result => ({
        document: result.item,
        linkUuid: result.spell.uuid,
        quantity: 1,
        rarity: result.item.system?.rarity
      })),
      title: "Spell Scrolls Received",
      subtitle: `${awarded.length} scroll${awarded.length === 1 ? "" : "s"} generated`
    });

    return { recipient, items: awarded, spells };
  }

  #packEnabled(pack) {
    // Foundry only exposes packs that are available to the world. Avoid
    // hidden/private packs and let active module/system compendiums participate.
    return pack.visible !== false;
  }
}
