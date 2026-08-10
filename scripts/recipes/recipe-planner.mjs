export class RecipePlanner {
  constructor({ recipeRegistry, evaluator }) {
    this.recipeRegistry = recipeRegistry;
    this.evaluator = evaluator;
  }

  plan(recipe, actor) {
    const direct = this.evaluator.evaluate(recipe, actor);

    if (!actor) {
      return {
        ...direct,
        status: "unselected",
        label: "No Inventory",
        processingSteps: []
      };
    }

    if (direct.ready) {
      return {
        ...direct,
        status: "ready",
        label: "Ready",
        processingSteps: []
      };
    }

    const baseInventory = this.#buildInventory(actor);
    const groupPlans = [];

    for (let groupIndex = 0; groupIndex < (recipe.requirementGroups ?? []).length; groupIndex += 1) {
      const group = recipe.requirementGroups[groupIndex];
      const inventory = new Map(baseInventory);
      const visiting = new Set();
      const processingSteps = [];
      const requirementResults = [];
      let possible = true;

      for (let requirementIndex = 0; requirementIndex < (group.requirements ?? []).length; requirementIndex += 1) {
        const requirement = group.requirements[requirementIndex];
        const planned = this.#satisfyRequirement(
          requirement,
          inventory,
          visiting
        );

        requirementResults.push({
          ...(direct.requirementGroups?.[groupIndex]?.requirements?.[requirementIndex] ?? {}),
          ready: planned.ready,
          status: planned.ready ? "processing" : "missing",
          detail: planned.ready
            ? `Available after processing: ${planned.summary}`
            : direct.requirementGroups?.[groupIndex]?.requirements?.[requirementIndex]?.detail
              ?? "Missing materials.",
          processingSteps: planned.processingSteps
        });

        if (!planned.ready) {
          possible = false;
          break;
        }

        processingSteps.push(...planned.processingSteps);
        if (!this.#consumeRequirement(requirement, inventory)) {
          possible = false;
          break;
        }
      }

      groupPlans.push({
        id: group.id,
        ready: possible,
        requirements: requirementResults,
        processingSteps: this.#dedupeSteps(processingSteps)
      });

      if (possible) {
        return {
          ...direct,
          ready: false,
          status: "processing",
          label: "Ready after processing",
          requirementGroups: groupPlans,
          selectedGroupIndex: groupIndex,
          processingSteps: this.#dedupeSteps(processingSteps)
        };
      }
    }

    return {
      ...direct,
      ready: false,
      status: "missing",
      label: "Missing materials",
      requirementGroups: direct.requirementGroups,
      selectedGroupIndex: null,
      processingSteps: []
    };
  }

  #satisfyRequirement(requirement, inventory, visiting) {
    if (requirement.type === "alternatives") {
      const attempts = [];

      for (const alternative of requirement.alternatives ?? []) {
        const inventoryCopy = new Map(inventory);
        const attempt = this.#satisfyMatch(
          alternative.match,
          alternative.quantity,
          alternative.sameMaterial,
          inventoryCopy,
          new Set(visiting)
        );

        if (attempt.ready) {
          this.#replaceInventory(inventory, inventoryCopy);
          return attempt;
        }

        attempts.push(attempt);
      }

      return {
        ready: false,
        summary: "No alternative can currently be produced.",
        processingSteps: attempts.flatMap(a => a.processingSteps ?? [])
      };
    }

    return this.#satisfyMatch(
      requirement.match,
      requirement.quantity,
      requirement.sameMaterial,
      inventory,
      visiting
    );
  }

  #satisfyMatch(match, quantity, sameMaterial, inventory, visiting) {
    const required = Math.max(1, Number(quantity ?? 1));
    const available = this.#matchingQuantity(match, inventory, sameMaterial);

    if (available >= required) {
      return {
        ready: true,
        summary: `${available} available`,
        processingSteps: []
      };
    }

    if (!match?.materialId) {
      return {
        ready: false,
        summary: "Generic tag/category requirements cannot yet be recursively produced.",
        processingSteps: []
      };
    }

    const missing = required - available;
    const producers = this.recipeRegistry
      .recipesProducingMaterial(match.materialId)
      .filter(recipe => recipe.kind === "processing");

    if (!producers.length) {
      return {
        ready: false,
        summary: `No processing recipe produces ${match.materialId}.`,
        processingSteps: []
      };
    }

    for (const producer of producers) {
      if (visiting.has(producer.id)) continue;

      const branchInventory = new Map(inventory);
      const branchVisiting = new Set(visiting);
      branchVisiting.add(producer.id);

      const outputQty = Math.max(1, Number(producer.output?.quantity ?? 1));
      const craftsNeeded = Math.ceil(missing / outputQty);

      const steps = [];
      let possible = true;

      for (let craftIndex = 0; craftIndex < craftsNeeded; craftIndex += 1) {
        let groupSatisfied = false;

        for (const group of producer.requirementGroups ?? []) {
          const groupInventory = new Map(branchInventory);
          const groupSteps = [];
          let groupPossible = true;

          for (const req of group.requirements ?? []) {
            const result = this.#satisfyRequirement(
              req,
              groupInventory,
              branchVisiting
            );

            if (!result.ready || !this.#consumeRequirement(req, groupInventory)) {
              groupPossible = false;
              break;
            }

            groupSteps.push(...result.processingSteps);
          }

          if (groupPossible) {
            this.#replaceInventory(branchInventory, groupInventory);
            steps.push(...groupSteps);
            groupSatisfied = true;
            break;
          }
        }

        if (!groupSatisfied) {
          possible = false;
          break;
        }

        const current = branchInventory.get(match.materialId) ?? 0;
        branchInventory.set(
          match.materialId,
          current + outputQty
        );

        steps.push({
          recipeId: producer.id,
          recipeName: producer.name,
          outputMaterialId: match.materialId,
          outputLabel: producer.output?.label ?? match.materialId,
          quantity: outputQty
        });
      }

      if (possible && this.#matchingQuantity(match, branchInventory, sameMaterial) >= required) {
        this.#replaceInventory(inventory, branchInventory);

        return {
          ready: true,
          summary: `${required} can be supplied after processing`,
          processingSteps: steps
        };
      }
    }

    return {
      ready: false,
      summary: `Unable to produce enough ${match.materialId}.`,
      processingSteps: []
    };
  }

  #buildInventory(actor) {
    const map = new Map();

    for (const item of actor.items ?? []) {
      const materialId = item.flags?.["morelord-craftworks"]?.materialId;
      if (!materialId) continue;

      const quantity = Math.max(0, Number(item.system?.quantity ?? 1));
      map.set(materialId, (map.get(materialId) ?? 0) + quantity);
    }

    return map;
  }

  #matchingQuantity(match, inventory, sameMaterial) {
    if (!match?.materialId) return 0;

    const quantity = inventory.get(match.materialId) ?? 0;
    return sameMaterial ? quantity : quantity;
  }

  #consumeRequirement(requirement, inventory) {
    if (requirement.type === "alternatives") {
      for (const alternative of requirement.alternatives ?? []) {
        if (!alternative.match?.materialId) continue;

        const current = inventory.get(alternative.match.materialId) ?? 0;
        const needed = Math.max(1, Number(alternative.quantity ?? 1));

        if (current >= needed) {
          inventory.set(alternative.match.materialId, current - needed);
          return true;
        }
      }

      return false;
    }

    if (!requirement.match?.materialId) return false;

    const current = inventory.get(requirement.match.materialId) ?? 0;
    const needed = Math.max(1, Number(requirement.quantity ?? 1));

    if (current < needed) return false;

    inventory.set(requirement.match.materialId, current - needed);
    return true;
  }

  #replaceInventory(target, source) {
    target.clear();
    for (const [key, value] of source.entries()) {
      target.set(key, value);
    }
  }

  #dedupeSteps(steps) {
    const counts = new Map();

    for (const step of steps) {
      const key = `${step.recipeId}|${step.outputMaterialId}`;
      const existing = counts.get(key);

      if (existing) {
        existing.crafts += 1;
        existing.totalOutput += Number(step.quantity ?? 1);
      } else {
        counts.set(key, {
          recipeId: step.recipeId,
          recipeName: step.recipeName,
          outputMaterialId: step.outputMaterialId,
          outputLabel: step.outputLabel,
          crafts: 1,
          totalOutput: Number(step.quantity ?? 1)
        });
      }
    }

    return Array.from(counts.values());
  }
}
