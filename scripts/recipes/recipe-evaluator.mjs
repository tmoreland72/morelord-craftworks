import { MODULE_ID } from "../constants.mjs";
import {
  recipeItemMatches,
  spellScrollMatches
} from "./recipe-item-match-utils.mjs";

export class RecipeEvaluator {
  constructor({ materialRegistry }) {
    this.materialRegistry = materialRegistry;
  }

  evaluate(recipe, actor) {
    if (!actor) {
      return {
        actorUuid: null,
        ready: null,
        status: "unselected",
        label: "Select an inventory",
        requirementGroups: [],
        selectedGroupIndex: null
      };
    }

    const inventory = this.#inventory(actor);
    const requirementGroups = (recipe.requirementGroups ?? []).map(group =>
      this.#evaluateGroup(group, inventory)
    );

    const selectedGroupIndex = requirementGroups.findIndex(group => group.ready);
    const ready = selectedGroupIndex >= 0;

    return {
      actorUuid: actor.uuid,
      actorName: actor.name,
      ready,
      status: ready ? "ready" : "missing",
      label: ready ? "Ready" : "Missing materials",
      requirementGroups,
      selectedGroupIndex: ready ? selectedGroupIndex : null
    };
  }

  #inventory(actor) {
    return Array.from(actor.items ?? []).map(item => {
      const flags = item.flags?.[MODULE_ID] ?? {};
      const quantity = Math.max(0, Number(item.system?.quantity ?? 1));

      return {
        item,
        itemName: String(item.name ?? "").trim().toLowerCase(),
        quantity,
        materialId: flags.materialId ?? null,
        tags: Array.isArray(flags.tags) ? flags.tags.map(String) : [],
        rarity: String(flags.rarity ?? item.system?.rarity ?? "").toLowerCase(),
        category: String(flags.category ?? "").toLowerCase(),
        stage: String(flags.stage ?? "").toLowerCase()
      };
    });
  }

  #evaluateGroup(group, baseInventory) {
    const independent = (group.requirements ?? []).map(requirement =>
      this.#evaluateRequirement(requirement, baseInventory)
    );

    const solved = this.#solveGroup(
      group.requirements ?? [],
      this.#cloneInventory(baseInventory),
      0
    );

    return {
      id: group.id,
      ready: solved.ready,
      requirements: solved.ready ? solved.requirements : independent
    };
  }

  #solveGroup(requirements, inventory, index) {
    if (index >= requirements.length) {
      return {
        ready: true,
        requirements: []
      };
    }

    const requirement = requirements[index];
    const options = requirement.type === "alternatives"
      ? requirement.alternatives
      : [requirement];

    const optionEvaluations = options.map(option =>
      this.#evaluateMatch(
        option.match,
        option.quantity,
        option.sameMaterial,
        inventory
      )
    );

    for (let optionIndex = 0; optionIndex < options.length; optionIndex += 1) {
      const option = options[optionIndex];
      const evaluation = optionEvaluations[optionIndex];
      if (!evaluation.ready) continue;

      const nextInventory = this.#cloneInventory(inventory);
      if (!this.#consumeMatch(
        option.match,
        option.quantity,
        option.sameMaterial,
        nextInventory
      )) continue;

      const tail = this.#solveGroup(requirements, nextInventory, index + 1);
      if (!tail.ready) continue;

      const result = requirement.type === "alternatives"
        ? {
            type: "alternatives",
            ready: true,
            display: requirement.display,
            alternatives: optionEvaluations,
            selectedAlternativeIndex: optionIndex,
            detail: evaluation.detail
          }
        : {
            type: "match",
            display: requirement.display,
            ...evaluation
          };

      return {
        ready: true,
        requirements: [result, ...tail.requirements]
      };
    }

    return {
      ready: false,
      requirements: []
    };
  }

  #evaluateRequirement(requirement, inventory) {
    if (requirement.type === "alternatives") {
      const alternatives = (requirement.alternatives ?? []).map(alternative =>
        this.#evaluateMatch(
          alternative.match,
          alternative.quantity,
          alternative.sameMaterial,
          inventory
        )
      );

      const ready = alternatives.some(result => result.ready);

      return {
        type: "alternatives",
        ready,
        display: requirement.display,
        alternatives,
        selectedAlternativeIndex: ready
          ? alternatives.findIndex(result => result.ready)
          : null,
        detail: ready
          ? alternatives.find(result => result.ready)?.detail ?? "Requirement satisfied."
          : alternatives.map(result => result.detail).join(" OR ")
      };
    }

    const result = this.#evaluateMatch(
      requirement.match,
      requirement.quantity,
      requirement.sameMaterial,
      inventory
    );

    return {
      type: "match",
      display: requirement.display,
      ...result
    };
  }

  #evaluateMatch(match, quantity, sameMaterial, inventory) {
    const required = Math.max(1, Number(quantity ?? 1));
    const matches = inventory.filter(entry => this.#matches(entry, match));

    if (sameMaterial) {
      const best = matches
        .filter(entry => entry.quantity >= required)
        .sort((a, b) => b.quantity - a.quantity)[0];

      if (best) {
        return {
          ready: true,
          required,
          available: best.quantity,
          matchedItems: [best.item.uuid],
          detail: `${best.quantity} available.`
        };
      }

      const largest = matches.reduce(
        (max, entry) => Math.max(max, entry.quantity),
        0
      );

      return {
        ready: false,
        required,
        available: largest,
        matchedItems: [],
        detail: `${largest} of ${required} available in a single matching material stack.`
      };
    }

    const available = matches.reduce(
      (total, entry) => total + entry.quantity,
      0
    );

    return {
      ready: available >= required,
      required,
      available,
      matchedItems: matches.map(entry => entry.item.uuid),
      detail: `${available} of ${required} available.`
    };
  }

  #consumeMatch(match, quantity, sameMaterial, inventory) {
    let remaining = Math.max(1, Number(quantity ?? 1));
    const matches = inventory
      .filter(entry => this.#matches(entry, match) && entry.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity);

    if (sameMaterial) {
      const entry = matches.find(candidate => candidate.quantity >= remaining);
      if (!entry) return false;
      entry.quantity -= remaining;
      return true;
    }

    const available = matches.reduce((sum, entry) => sum + entry.quantity, 0);
    if (available < remaining) return false;

    for (const entry of matches) {
      if (remaining <= 0) break;
      const used = Math.min(entry.quantity, remaining);
      entry.quantity -= used;
      remaining -= used;
    }

    return remaining <= 0;
  }

  #cloneInventory(inventory) {
    return inventory.map(entry => ({ ...entry }));
  }

  #matches(entry, match) {
    if (!match) return false;

    if (match.materialId && entry.materialId !== match.materialId) {
      return false;
    }

    if (match.itemName && !recipeItemMatches(entry.item, match.itemName)) {
      return false;
    }

    if (
      match.itemType === "spellScroll"
      && !spellScrollMatches(entry.item, match.spellName)
    ) {
      return false;
    }

    if (match.rarity && entry.rarity !== String(match.rarity).toLowerCase()) {
      return false;
    }

    if (match.category && entry.category !== String(match.category).toLowerCase()) {
      return false;
    }

    if (match.stage && entry.stage !== String(match.stage).toLowerCase()) {
      return false;
    }

    if (match.tags?.length) {
      if (!materialTagsSatisfy(match.tags, entry.tags)) {
        return false;
      }
    }

    return true;
  }
}
import { materialTagsSatisfy } from "../materials/material-match-utils.mjs";
