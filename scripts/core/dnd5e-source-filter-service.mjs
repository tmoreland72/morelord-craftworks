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

    if (collection === "dnd5e.equipment24") {
      return "SRD 5.2";
    }

    if (
      collection === "dnd5e.items"
      || collection === "dnd5e.tradegoods"
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
}
