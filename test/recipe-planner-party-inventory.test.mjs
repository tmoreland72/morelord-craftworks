import test from "node:test";
import assert from "node:assert/strict";
import { RecipePlanner } from "../scripts/recipes/recipe-planner.mjs";
import { CrafterContextService } from "../scripts/crafting/crafter-context-service.mjs";

test("planner includes a Group inventory when the crafter is a member", () => {
  const character = { id: "hero", uuid: "Actor.hero", type: "character", items: [] };
  const party = {
    id: "party",
    uuid: "Actor.party",
    type: "group",
    system: { members: [{ actor: { id: "hero", uuid: "Actor.hero" } }] },
    items: [{
      flags: { "morelord-craftworks": { materialId: "iron" } },
      system: { quantity: 2 }
    }]
  };
  const priorGame = globalThis.game;
  globalThis.game = { actors: [character, party] };

  try {
    const evaluator = {
      evaluate(recipe, actor) {
        const quantity = actor.items?.[0]?.system?.quantity ?? 0;
        return {
          ready: quantity >= 2,
          materialsReady: quantity >= 2,
          requirementGroups: [{ ready: quantity >= 2, requirements: [] }],
          selectedGroupIndex: quantity >= 2 ? 0 : null
        };
      }
    };
    const planner = new RecipePlanner({
      recipeRegistry: { recipesProducingMaterial: () => [] },
      evaluator
    });
    const recipe = { requirementGroups: [{ id: "materials", requirements: [] }] };
    const result = planner.plan(recipe, character);

    assert.equal(result.ready, true);
    assert.equal(result.inventoryActorUuid, party.uuid);
  } finally {
    globalThis.game = priorGame;
  }
});

test("explicit inventory planning does not switch to a party Group", () => {
  const character = { id: "hero", uuid: "Actor.hero", type: "character", items: [] };
  const party = {
    uuid: "Actor.party",
    type: "group",
    system: { members: ["hero"] },
    items: []
  };
  const priorGame = globalThis.game;
  globalThis.game = { actors: [character, party] };

  try {
    const planner = new RecipePlanner({
      recipeRegistry: { recipesProducingMaterial: () => [] },
      evaluator: { evaluate: () => ({ ready: false, requirementGroups: [] }) }
    });
    const result = planner.plan(
      { requirementGroups: [] },
      character,
      { includePartyInventory: false }
    );
    assert.equal(result.inventoryActorUuid, undefined);
  } finally {
    globalThis.game = priorGame;
  }
});

test("a player can select a Group inventory when their character is a member", () => {
  const character = {
    id: "hero",
    uuid: "Actor.hero",
    name: "Hero",
    type: "character",
    testUserPermission: () => true
  };
  const party = {
    uuid: "Actor.party",
    name: "The Party",
    type: "group",
    system: { members: [{ uuid: "Actor.hero" }] },
    testUserPermission: () => false
  };
  const unrelated = {
    uuid: "Actor.other-party",
    name: "Other Party",
    type: "group",
    system: { members: [] },
    testUserPermission: () => false
  };
  const priorGame = globalThis.game;
  globalThis.game = { user: { isGM: false }, actors: [character, party, unrelated] };

  try {
    const available = new CrafterContextService().availableInventoryActors(character);
    assert.deepEqual(available.map(actor => actor.uuid), [character.uuid, party.uuid]);
  } finally {
    globalThis.game = priorGame;
  }
});
