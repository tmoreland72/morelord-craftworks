import { AwardChatCardService } from "../core/award-chat-card-service.mjs";

export const POTION_RARITIES = [
  { id: "common", label: "Common" },
  { id: "uncommon", label: "Uncommon" },
  { id: "rare", label: "Rare" },
  { id: "veryRare", label: "Very Rare" },
  { id: "legendary", label: "Legendary" },
  { id: "artifact", label: "Artifact" }
];

export class PotionGeneratorService {
  constructor({ coreAccess = null, sourceFilter = null, adapter = null, recipientResolver = null } = {}) {
    this.coreAccess = coreAccess;
    this.sourceFilter = sourceFilter;
    this.adapter = adapter;
    this.recipientResolver = recipientResolver;
  }

  get premiumFeatureId() {
    return "potion-generator";
  }

  get hasAccess() {
    if (!this.coreAccess) return true;
    return Boolean(
      this.coreAccess.hasFeature?.(this.premiumFeatureId)
      || this.coreAccess.hasPremiumAccess?.()
    );
  }

  async availablePotions() {
    const potions = [];
    const eligiblePacks = Array.from(game.packs ?? [])
      .filter(pack =>
        pack.documentName === "Item"
        && pack.visible !== false
        && (!this.sourceFilter || this.sourceFilter.isPackEnabled(pack))
      );
    const packs = this.sourceFilter
      ? this.sourceFilter.sortPacks(eligiblePacks)
      : eligiblePacks;

    for (const pack of packs) {
      let index;
      try {
        index = await pack.getIndex({
          fields: [
            "name", "img", "type", "system.type.value", "system.rarity",
            "system.source.book", "system.source.custom"
          ]
        });
      } catch (error) {
        console.warn(`Morelord Craftworks | Unable to index potion pack ${pack.collection}.`, error);
        continue;
      }

      for (const row of index) {
        if (row.type !== "consumable") continue;
        if (foundry.utils.getProperty(row, "system.type.value") !== "potion") continue;

        const rarity = this.#normalizeRarity(
          foundry.utils.getProperty(row, "system.rarity")
        );
        if (!rarity) continue;

        const sourceLabel = this.sourceFilter
          ? await this.sourceFilter.sourceLabelForCompendiumItem(row, { pack })
          : "Craftworks";

        potions.push({
          name: row.name,
          img: row.img ?? "icons/consumables/potions/potion-bottle-corked-red.webp",
          rarity,
          uuid: `Compendium.${pack.collection}.Item.${row._id}`,
          sourceLabel
        });
      }
    }

    return potions.sort((a, b) =>
      POTION_RARITIES.findIndex(entry => entry.id === a.rarity)
      - POTION_RARITIES.findIndex(entry => entry.id === b.rarity)
      || a.name.localeCompare(b.name)
    );
  }

  async availableCounts() {
    const counts = Object.fromEntries(POTION_RARITIES.map(rarity => [rarity.id, 0]));
    for (const potion of await this.availablePotions()) {
      counts[potion.rarity] += 1;
    }
    return counts;
  }

  async generate(counts = {}) {
    if (!this.hasAccess) throw new Error("Potion Generator requires premium access.");

    const potions = await this.availablePotions();
    const generated = [];

    for (const rarity of POTION_RARITIES) {
      const requested = Math.max(0, Math.floor(Number(counts[rarity.id] ?? 0)));
      if (!requested) continue;

      const pool = potions.filter(potion => potion.rarity === rarity.id);
      if (!pool.length) {
        throw new Error(`No ${rarity.label.toLowerCase()} potions are available from enabled Item compendiums.`);
      }

      for (let index = 0; index < requested; index += 1) {
        generated.push(foundry.utils.deepClone(
          pool[Math.floor(Math.random() * pool.length)]
        ));
      }
    }

    return generated;
  }

  async createAndAward({ potions = [], fallbackActorUuid = null } = {}) {
    if (!this.hasAccess) throw new Error("Potion Generator requires premium access.");
    if (!potions.length) throw new Error("Generate at least one potion before awarding the results.");

    const fallback = fallbackActorUuid ? await fromUuid(fallbackActorUuid) : null;
    const recipient = await this.recipientResolver?.resolve(fallback);
    if (!recipient) throw new Error("No valid recipient is available for the potions.");

    const grouped = new Map();
    for (const potion of potions) {
      const entry = grouped.get(potion.uuid) ?? { potion, quantity: 0 };
      entry.quantity += 1;
      grouped.set(potion.uuid, entry);
    }

    const awarded = [];
    for (const { potion, quantity } of grouped.values()) {
      const source = await fromUuid(potion.uuid);
      if (!source) throw new Error(`Potion could not be resolved: ${potion.name}`);
      const created = await this.adapter.addItemToActor(recipient, source, quantity);
      awarded.push({
        document: created,
        linkUuid: potion.uuid,
        quantity,
        rarity: created.system?.rarity
      });
    }

    await AwardChatCardService.post({
      recipient,
      items: awarded,
      title: "Potions Received",
      subtitle: `${potions.length} potion${potions.length === 1 ? "" : "s"} generated`
    });

    return { recipient, items: awarded, potions };
  }

  #normalizeRarity(value) {
    const normalized = String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    return ({
      common: "common",
      uncommon: "uncommon",
      rare: "rare",
      veryrare: "veryRare",
      legendary: "legendary",
      artifact: "artifact"
    })[normalized] ?? null;
  }
}
