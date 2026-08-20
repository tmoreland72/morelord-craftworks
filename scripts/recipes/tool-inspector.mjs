export class ToolInspector {
  inspect(actor, requiredToolName) {
    const required = String(requiredToolName ?? "").trim();

    if (!actor || !required) {
      return {
        requiredTool: required || null,
        hasTool: null,
        proficient: null,
        qualifiesForNormalDc: null,
        matchedItemUuid: null,
        matchedItemName: null
      };
    }

    const normalizedRequired = this.#normalize(required);

    const candidates = Array.from(actor.items ?? [])
      .filter(item => item?.type === "tool")
      .map(item => ({
        item,
        normalizedName: this.#normalize(item.name)
      }));

    const exact = candidates.find(entry =>
      entry.normalizedName === normalizedRequired
    );

    const fallback = exact ?? candidates.find(entry =>
      entry.normalizedName.includes(normalizedRequired)
      || normalizedRequired.includes(entry.normalizedName)
    );

    const hasTool = Boolean(fallback);

    const itemProficient = fallback
      ? Number(fallback.item.system?.proficient ?? 0) > 0
      : false;

    const actorProficient = this.#actorHasToolProficiency(
      actor,
      required,
      normalizedRequired,
      fallback?.item
    );

    const proficient = itemProficient || actorProficient;

    return {
      requiredTool: required,
      hasTool,
      proficient,
      qualifiesForNormalDc: hasTool && proficient,
      proficiencySource: itemProficient
        ? "item"
        : actorProficient
          ? "actor"
          : null,
      matchedItemUuid: fallback?.item?.uuid ?? null,
      matchedItemName: fallback?.item?.name ?? null
    };
  }

  #actorHasToolProficiency(actor, requiredName, normalizedRequired, matchedItem) {
    const values = [];

    this.#collectValues(actor.system?.tools, values);
    this.#collectValues(actor.system?.traits?.toolProf, values);
    this.#collectValues(actor.system?.traits?.toolProficiencies, values);
    this.#collectValues(actor.system?.proficiencies?.tools, values);
    this.#collectValues(actor.tools, values);
    this.#collectValues(actor.proficiencies?.tools, values);

    const normalizedCandidates = new Set(
      values
        .map(value => this.#normalize(value))
        .filter(Boolean)
    );

    if (normalizedCandidates.has(normalizedRequired)) return true;

    for (const candidate of normalizedCandidates) {
      if (
        candidate.includes(normalizedRequired)
        || normalizedRequired.includes(candidate)
      ) return true;
    }

    if (matchedItem) {
      const prepared = [
        matchedItem.proficient,
        matchedItem.proficiency,
        matchedItem.system?.proficiency,
        matchedItem.system?.proficient
      ];

      if (prepared.some(value => {
        if (typeof value === "number") return value > 0;
        if (typeof value === "boolean") return value;
        if (typeof value === "object" && value) {
          return Number(value.value ?? value.multiplier ?? 0) > 0;
        }
        return false;
      })) return true;
    }

    return false;
  }

  #collectValues(source, target) {
    if (source == null) return;

    if (typeof source === "string") {
      target.push(...source.split(/[;,]/g).map(value => value.trim()));
      return;
    }

    if (source instanceof Set) {
      for (const value of source) this.#collectValues(value, target);
      return;
    }

    if (Array.isArray(source)) {
      for (const value of source) this.#collectValues(value, target);
      return;
    }

    if (typeof source !== "object") return;

    if ("value" in source) this.#collectValues(source.value, target);
    if ("custom" in source && source.custom) this.#collectValues(source.custom, target);

    for (const [key, value] of Object.entries(source)) {
      if (["value", "custom"].includes(key)) continue;

      if (
        value === true
        || value === 1
        || value === "1"
        || value === "proficient"
      ) {
        target.push(key);
      } else if (typeof value === "string") {
        target.push(value);
      } else if (value && typeof value === "object") {
        const proficient =
          value.proficient === true
          || Number(value.proficient ?? 0) > 0
          || Number(value.value ?? 0) > 0;

        if (proficient) target.push(value.label ?? value.name ?? key);
      }
    }
  }

  #normalize(value) {
    return String(value ?? "")
      .toLowerCase()
      .replace(/[’']s\b/g, "")
      .replace(/[’']/g, "")
      .replace(/\btools?\b/g, "")
      .replace(/\bsupplies\b/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
