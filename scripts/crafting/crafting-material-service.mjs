import { AwardChatCardService } from "../core/award-chat-card-service.mjs";
import { MODULE_ID } from "../constants.mjs";
import {
  recipeItemMatches,
  spellScrollMatches
} from "../recipes/recipe-item-match-utils.mjs";

export class CraftingMaterialService {
  constructor({ materialRegistry, adapter }) {
    this.materialRegistry = materialRegistry;
    this.adapter = adapter;
  }

  planOptions(recipe, actor) {
    if (!recipe || !actor) return [];

    const baseInventory = this.#inventory(actor);
    const plans = [];

    for (let groupIndex = 0; groupIndex < (recipe.requirementGroups ?? []).length; groupIndex += 1) {
      const group = recipe.requirementGroups[groupIndex];
      const groupPlans = this.#solveRequirements(
        group.requirements ?? [],
        baseInventory,
        0,
        []
      );

      for (const solved of groupPlans) {
        plans.push({
          id: `group-${groupIndex}-plan-${plans.length}`,
          groupId: group.id ?? `group-${groupIndex + 1}`,
          groupIndex,
          selections: solved.selections,
          consumptions: this.#mergeConsumptions(solved.consumptions),
          summary: solved.selections.map(selection => selection.label).join(" AND ")
        });
      }
    }

    return this.#dedupePlans(plans);
  }

  async consume(actor, plan) {
    if (!actor) throw new Error("Crafting material consumption requires an Actor.");
    if (!plan?.consumptions?.length) {
      throw new Error("Crafting material consumption requires a valid material plan.");
    }

    // Validate against the live Actor before changing anything.
    for (const consumption of plan.consumptions) {
      const item = actor.items.get(consumption.itemId);
      const current = Number(item?.system?.quantity ?? 0);

      if (!item || current < consumption.quantity) {
        throw new Error(
          `${actor.name} no longer has enough ${consumption.name}.`
        );
      }
    }

    const updates = [];
    const deletes = [];

    for (const consumption of plan.consumptions) {
      const item = actor.items.get(consumption.itemId);
      const current = Number(item.system?.quantity ?? 0);
      const next = current - consumption.quantity;

      if (next > 0) {
        updates.push({
          _id: item.id,
          "system.quantity": next
        });
      } else {
        deletes.push(item.id);
      }
    }

    if (updates.length) {
      await actor.updateEmbeddedDocuments("Item", updates);
    }

    if (deletes.length) {
      await actor.deleteEmbeddedDocuments("Item", deletes);
    }

    return plan.consumptions.map(entry => ({
      materialId: entry.materialId,
      name: entry.name,
      quantity: entry.quantity
    }));
  }

  async refund(actor, consumedMaterials = []) {
    if (!actor) return;

    for (const entry of consumedMaterials) {
      if (!entry?.materialId || !entry.quantity) continue;

      const source = await this.materialRegistry.resolveItem(entry.materialId);
      if (!source) {
        console.warn(
          `Morelord Craftworks | Could not refund unknown material ${entry.materialId}.`
        );
        continue;
      }

      await this.adapter.addItemToActor(
        actor,
        source,
        Number(entry.quantity)
      );
    }
  }

  async resolveOutput(recipe) {
    if (!recipe?.output) {
      throw new Error(
        "Crafting completion requires a recipe output."
      );
    }

    let source;

    if (recipe.output.type === "craftworks-material") {
      source = await this.materialRegistry.resolveItem(
        recipe.output.materialId
      );
    } else if (recipe.output.type === "foundry-item") {
      source = await fromUuid(recipe.output.uuid);
    }

    if (!source || source.documentName !== "Item") {
      throw new Error(
        `Craftworks could not resolve the output Item for ${recipe.name}.`
      );
    }

    return {
      source,
      quantity: Math.max(
        1,
        Number(recipe.output.quantity ?? 1)
      ),
      label: source.name
    };
  }

  async awardOutput(actor, recipe) {
    if (!actor) {
      throw new Error(
        "Crafting completion requires an output Actor."
      );
    }

    const resolved = await this.resolveOutput(recipe);

    const item = await this.adapter.addItemToActor(
      actor,
      resolved.source,
      resolved.quantity
    );

    await AwardChatCardService.post({
      recipient: actor,
      items: [{
        document: resolved.source,
        uuid: resolved.source.uuid,
        quantity: resolved.quantity,
        rarity: resolved.source.system?.rarity
      }],
      title: "Crafted Item Received",
      subtitle: recipe.name
    });

    return {
      actor,
      item,
      source: resolved.source,
      quantity: resolved.quantity,
      label: resolved.label
    };
  }

  #inventory(actor) {
    return Array.from(actor.items ?? []).map(item => {
      const flags = item.flags?.[MODULE_ID] ?? {};

      return {
        item,
        itemId: item.id,
        itemUuid: item.uuid,
        name: item.name,
        itemName: String(item.name ?? "").trim().toLowerCase(),
        quantity: Math.max(
          0,
          Number(item.system?.quantity ?? 1)
        ),
        materialId: flags.materialId ?? null,
        tags: Array.isArray(flags.tags)
          ? flags.tags.map(String)
          : [],
        rarity: String(
          flags.rarity
          ?? item.system?.rarity
          ?? ""
        ).toLowerCase(),
        category: String(flags.category ?? "").toLowerCase(),
        stage: String(flags.stage ?? "").toLowerCase()
      };
    });
  }

  #solveRequirements(requirements, inventory, index, selections) {
    if (index >= requirements.length) {
      return [{
        inventory,
        selections,
        consumptions: selections.flatMap(selection => selection.consumptions)
      }];
    }

    const requirement = requirements[index];
    const choices = requirement.type === "alternatives"
      ? requirement.alternatives ?? []
      : [requirement];

    const results = [];

    for (let alternativeIndex = 0; alternativeIndex < choices.length; alternativeIndex += 1) {
      const choice = choices[alternativeIndex];
      const allocated = this.#allocate(
        choice.match,
        choice.quantity,
        choice.sameMaterial,
        inventory
      );

      if (!allocated) continue;

      const selection = {
        requirementIndex: index,
        alternativeIndex:
          requirement.type === "alternatives"
            ? alternativeIndex
            : null,
        label: choice.display
          ?? this.#describeChoice(choice),
        consumptions: allocated.consumptions
      };

      results.push(
        ...this.#solveRequirements(
          requirements,
          allocated.inventory,
          index + 1,
          [...selections, selection]
        )
      );
    }

    return results;
  }

  #allocate(match, quantity, sameMaterial, inventory) {
    const required = Math.max(
      1,
      Number(quantity ?? 1)
    );

    const candidates = inventory
      .filter(entry =>
        entry.quantity > 0
        && this.#matches(entry, match)
      );

    if (!candidates.length) return null;

    if (sameMaterial) {
      const byMaterial = new Map();

      for (const entry of candidates) {
        const materialKey = entry.materialId
          ?? entry.itemId;

        if (!byMaterial.has(materialKey)) {
          byMaterial.set(materialKey, []);
        }

        byMaterial.get(materialKey).push(entry);
      }

      for (const entries of byMaterial.values()) {
        const available = entries.reduce(
          (sum, entry) => sum + entry.quantity,
          0
        );

        if (available < required) continue;

        return this.#consumeFromEntries(
          entries,
          required,
          inventory
        );
      }

      return null;
    }

    const available = candidates.reduce(
      (sum, entry) => sum + entry.quantity,
      0
    );

    if (available < required) return null;

    return this.#consumeFromEntries(
      candidates,
      required,
      inventory
    );
  }

  #consumeFromEntries(entries, required, inventory) {
    const next = inventory.map(entry => ({ ...entry }));
    const consumptions = [];
    let remaining = required;

    const ordered = [...entries].sort(
      (a, b) => b.quantity - a.quantity
    );

    for (const candidate of ordered) {
      if (remaining <= 0) break;

      const live = next.find(
        entry => entry.itemId === candidate.itemId
      );

      if (!live) continue;

      const use = Math.min(
        live.quantity,
        remaining
      );

      if (use <= 0) continue;

      live.quantity -= use;
      remaining -= use;

      consumptions.push({
        itemId: live.itemId,
        itemUuid: live.itemUuid,
        materialId: live.materialId,
        name: live.name,
        quantity: use
      });
    }

    if (remaining > 0) return null;

    return {
      inventory: next,
      consumptions
    };
  }

  #matches(entry, match) {
    if (!match) return false;

    if (
      match.materialId
      && entry.materialId !== match.materialId
    ) {
      return false;
    }

    if (
      match.itemName
      && !recipeItemMatches(entry.item, match.itemName)
    ) {
      return false;
    }

    if (
      match.itemType === "spellScroll"
      && !spellScrollMatches(entry.item, match.spellName)
    ) {
      return false;
    }

    if (
      match.rarity
      && entry.rarity !== String(match.rarity).toLowerCase()
    ) {
      return false;
    }

    if (
      match.category
      && entry.category !== String(match.category).toLowerCase()
    ) {
      return false;
    }

    if (
      match.stage
      && entry.stage !== String(match.stage).toLowerCase()
    ) {
      return false;
    }

    if (match.tags?.length) {
      if (!materialTagsSatisfy(match.tags, entry.tags)) {
        return false;
      }
    }

    return true;
  }

  #describeChoice(choice) {
    const material = choice.match?.materialId
      ? this.materialRegistry.get(choice.match.materialId)
      : null;

    const label = choice.match?.itemType === "spellScroll"
      ? `Spell Scroll: ${choice.match.spellName}`
      : material?.name
      ?? choice.match?.materialId
      ?? choice.match?.itemName
      ?? "matching material";

    return `${Math.max(1, Number(choice.quantity ?? 1))} × ${label}`;
  }

  #mergeConsumptions(consumptions) {
    const merged = new Map();

    for (const entry of consumptions) {
      const current = merged.get(entry.itemId);

      if (current) {
        current.quantity += entry.quantity;
      } else {
        merged.set(
          entry.itemId,
          { ...entry }
        );
      }
    }

    return Array.from(merged.values());
  }

  #dedupePlans(plans) {
    const seen = new Set();
    const unique = [];

    for (const plan of plans) {
      const key = JSON.stringify(
        [...plan.consumptions]
          .sort((a, b) => a.itemId.localeCompare(b.itemId))
          .map(entry => [
            entry.itemId,
            entry.quantity
          ])
      );

      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(plan);
    }

    return unique;
  }
}
import { materialTagsSatisfy } from "../materials/material-match-utils.mjs";
