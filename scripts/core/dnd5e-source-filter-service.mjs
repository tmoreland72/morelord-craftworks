export class Dnd5eSourceFilterService {
  get configuration() {
    if (game.system.id !== "dnd5e") return {};

    try {
      return game.settings.get(
        "dnd5e",
        "packSourceConfiguration"
      ) ?? {};
    } catch {
      return {};
    }
  }

  isPackEnabled(packOrCollection) {
    if (game.system.id !== "dnd5e") return true;

    const collection =
      typeof packOrCollection === "string"
        ? packOrCollection
        : packOrCollection?.collection;

    if (!collection) return true;

    // D&D5e's Compendium Browser source configuration is exclusion-based.
    // Current versions store pack collections directly, but tolerate nested
    // configuration shapes so Craftworks remains compatible with source
    // configuration produced by add-on content packages.
    const config = this.configuration;
    if (config?.[collection] === false) return false;

    const shortCollection = String(collection)
      .split(".")
      .at(-1);

    if (config?.[shortCollection] === false) return false;

    const pack =
      typeof packOrCollection === "string"
        ? game.packs.get(packOrCollection)
        : packOrCollection;

    const packageName = String(
      pack?.metadata?.packageName
      ?? pack?.metadata?.package
      ?? ""
    );

    if (
      packageName
      && config?.[packageName]?.[collection] === false
    ) {
      return false;
    }

    if (
      Array.isArray(config?.disabled)
      && config.disabled.includes(collection)
    ) {
      return false;
    }

    const identifiers = new Set([
      collection,
      shortCollection,
      packageName,
      pack?.metadata?.label,
      pack?.metadata?.name,
      pack?.metadata?.sourceBook,
      pack?.title,
      this.sourceLabelForPack(pack)
    ].filter(Boolean).map(value => this.#normalizeIdentifier(value)));

    if (this.#configurationDisables(config, identifiers)) {
      return false;
    }

    return true;
  }

  sourceLabelForPack(packOrCollection) {
    const pack =
      typeof packOrCollection === "string"
        ? game.packs.get(packOrCollection)
        : packOrCollection;

    const collection = String(
      pack?.collection
      ?? packOrCollection
      ?? ""
    ).toLowerCase();

    if (
      collection === "dnd5e.equipment24"
      || collection === "dnd5e.spells24"
    ) {
      return "SRD 5.2";
    }

    if (
      collection === "dnd5e.items"
      || collection === "dnd5e.tradegoods"
      || collection === "dnd5e.spells"
    ) {
      return "SRD 5.1";
    }

    const label = String(
      pack?.metadata?.label
      ?? pack?.title
      ?? pack?.metadata?.name
      ?? pack?.collection
      ?? packOrCollection
      ?? "Unknown Source"
    ).trim();

    return label || "Unknown Source";
  }

  sourceLabelForItem(itemData, { pack = null } = {}) {
    const source = foundry.utils.getProperty(itemData, "system.source");
    const book = typeof source === "object" && source ? source.book : null;
    const custom = typeof source === "object" && source ? source.custom : null;

    if (book) return this.#sourceBookLabel(book);

    if (custom) return String(custom).trim();
    if (typeof source === "string" && source.trim()) return source.trim();

    const packSourceBook = pack?.metadata?.sourceBook;
    if (packSourceBook) return this.#sourceBookLabel(packSourceBook);

    const collection = String(pack?.collection ?? "").toLowerCase();
    if (collection === "dnd5e.equipment24" || collection === "dnd5e.spells24") {
      return "SRD 5.2";
    }
    if (
      collection === "dnd5e.items"
      || collection === "dnd5e.tradegoods"
      || collection === "dnd5e.spells"
    ) {
      return "SRD 5.1";
    }

    return "Craftworks";
  }

  async sourceLabelForCompendiumItem(itemData, { pack = null } = {}) {
    const indexedLabel = this.sourceLabelForItem(itemData, { pack });
    if (indexedLabel !== "Craftworks" || !pack || !itemData?._id) {
      return indexedLabel;
    }

    try {
      const document = await pack.getDocument(itemData._id);
      if (document) return this.sourceLabelForItem(document, { pack });
    } catch (error) {
      console.warn(
        `Morelord Craftworks | Unable to resolve source for ${pack.collection}.${itemData._id}.`,
        error
      );
    }

    return "Craftworks";
  }

  #sourceBookLabel(book) {
    const sourceBooks =
      CONFIG?.DND5E?.sourceBooks
      ?? game?.system?.config?.sourceBooks
      ?? {};
    const configured = sourceBooks[book];
    const label = typeof configured === "object"
      ? configured.label ?? configured.name ?? configured.title
      : configured;
    return game.i18n.localize(String(label ?? book));
  }

  sortPacks(packs = []) {
    return [...packs].sort((a, b) => {
      const priorityDelta =
        this.packPriority(a) - this.packPriority(b);

      if (priorityDelta) return priorityDelta;

      const aLabel = String(
        a?.metadata?.label
        ?? a?.title
        ?? a?.collection
        ?? ""
      );

      const bLabel = String(
        b?.metadata?.label
        ?? b?.title
        ?? b?.collection
        ?? ""
      );

      return aLabel.localeCompare(bLabel);
    });
  }

  packPriority(pack) {
    const collection = String(pack?.collection ?? "").toLowerCase();

    const metadataText = [
      pack?.metadata?.label,
      pack?.metadata?.name,
      pack?.metadata?.sourceBook,
      pack?.metadata?.system,
      pack?.title,
      collection
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const isSrd = /\bsrd\b/.test(metadataText)
      || collection === "dnd5e.equipment24"
      || collection === "dnd5e.items"
      || collection === "dnd5e.tradegoods";

    if (!isSrd) return 0;

    const is52 =
      /\bsrd\s*5[.\s_-]*2\b/.test(metadataText)
      || collection === "dnd5e.equipment24";

    if (is52) return 100;

    const is51 =
      /\bsrd\s*5[.\s_-]*1\b/.test(metadataText)
      || collection === "dnd5e.items"
      || collection === "dnd5e.tradegoods";

    if (is51) return 200;

    // Unknown/older SRD sources come after the known generations.
    return 300;
  }

  enabledPacks({
    documentName = null,
    includeWorld = true
  } = {}) {
    return this.sortPacks(
      Array.from(game.packs ?? [])
        .filter(pack =>
          !documentName
          || pack.documentName === documentName
        )
        .filter(pack =>
          includeWorld
          || pack.metadata?.packageType !== "world"
        )
        .filter(pack =>
          this.isPackEnabled(pack)
        )
    );
  }

  #configurationDisables(value, identifiers, key = "") {
    if (value == null) return false;

    const normalizedKey = this.#normalizeIdentifier(key);
    const keyMatches = normalizedKey && identifiers.has(normalizedKey);

    if (keyMatches && value === false) return true;

    if (Array.isArray(value)) {
      if (
        /disabled|excluded/i.test(key)
        && value.some(entry =>
          identifiers.has(this.#normalizeIdentifier(entry))
        )
      ) return true;

      return value.some(entry =>
        this.#configurationDisables(entry, identifiers)
      );
    }

    if (typeof value !== "object") return false;

    if (
      keyMatches
      && (
        value.enabled === false
        || value.load === false
        || value.active === false
      )
    ) return true;

    const identity =
      value.collection
      ?? value.id
      ?? value.key
      ?? value.name
      ?? value.label
      ?? value.source;

    if (
      identifiers.has(this.#normalizeIdentifier(identity))
      && (
        value.enabled === false
        || value.load === false
        || value.active === false
      )
    ) return true;

    return Object.entries(value).some(([childKey, childValue]) =>
      this.#configurationDisables(
        childValue,
        identifiers,
        childKey
      )
    );
  }

  #normalizeIdentifier(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  }
}
