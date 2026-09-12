import test from "node:test";
import assert from "node:assert/strict";
import { combinedCraftingInventory } from "../scripts/crafting/group-membership.mjs";
import { RecipeEvaluator } from "../scripts/recipes/recipe-evaluator.mjs";
import { CraftingMaterialService } from "../scripts/crafting/crafting-material-service.mjs";

function setup() {
  const character = { id: "hero", uuid: "Actor.hero", name: "Hero", type: "character" };
  const party = { uuid: "Actor.party", name: "Party", type: "group", system: { members: ["hero"] } };
  const other = { uuid: "Actor.other", type: "character" };
  const unrelated = { uuid: "Actor.unrelated", type: "group", system: { members: [] } };
  const actors = [character, party, other, unrelated];
  for (const actor of actors) {
    const data = { _id: "same-id", name: "Iron", system: { quantity: 1 }, flags: { "morelord-craftworks": { materialId: "iron" } } };
    const item = { ...structuredClone(data), id: data._id, uuid: `${actor.uuid}.Item.same-id`, parent: actor, toObject: () => structuredClone(data) };
    actor.items = [item];
    actor.items.get = id => actor.items.find(entry => entry.id === id);
    actor.updateEmbeddedDocuments = async (_, updates) => { for (const update of updates) actor.items.get(update._id).system.quantity = update["system.quantity"]; };
    actor.deleteEmbeddedDocuments = async (_, ids) => { for (const id of ids) actor.items.splice(actor.items.findIndex(item => item.id === id), 1); };
  }
  globalThis.game = { user: { isGM: true }, actors };
  globalThis.foundry = { utils: { deepClone: structuredClone } };
  globalThis.CONFIG = { Item: { documentClass: class { constructor(data) { Object.assign(this, data); } } } };
  globalThis.fromUuid = async uuid => actors.find(actor => actor.uuid === uuid);
  const refunds = [];
  const service = new CraftingMaterialService({ materialRegistry: { get: () => null }, adapter: { addItemToActor: async (actor, item, quantity) => refunds.push({ actor: actor.uuid, name: item.name, quantity }) } });
  const recipe = { requirementGroups: [{ requirements: [{ quantity: 2, match: { materialId: "iron" } }] }] };
  return { character, party, other, service, recipe, refunds };
}

test("combined planning consumes split stacks with identical item ids and refunds their original owners", async () => {
  const { character, party, other, service, recipe, refunds } = setup();
  const inventory = combinedCraftingInventory(character);
  assert.deepEqual(inventory.combinedActors, [character, party]);
  const evaluator = new RecipeEvaluator({ materialRegistry: {} });
  assert.equal(evaluator.evaluate(recipe, character).ready, false);
  assert.equal(evaluator.evaluate(recipe, inventory).ready, true);
  const plans = service.planOptions(recipe, inventory);
  assert.equal(plans[0].consumptions.length, 2);
  const consumed = await service.consume(inventory, plans[0], { crafter: character, recipe });
  assert.equal(character.items.length, 0);
  assert.equal(party.items.length, 0);
  assert.equal(other.items.length, 1);
  await service.refund(character, consumed);
  assert.deepEqual(refunds.map(row => row.actor), [character.uuid, party.uuid]);
  assert.ok(refunds.every(row => row.quantity === 1));
});

test("combined consumption validates every inventory before changing any", async () => {
  const { character, party, service, recipe } = setup();
  const inventory = combinedCraftingInventory(character);
  const plan = service.planOptions(recipe, inventory)[0];
  party.items.length = 0;
  await assert.rejects(service.consume(inventory, plan, { crafter: character, recipe }), /no longer has enough/);
  assert.equal(character.items[0].system.quantity, 1);
});

test("a failed second inventory update refunds the first inventory", async () => {
  const { character, party, service, recipe, refunds } = setup();
  const inventory = combinedCraftingInventory(character);
  const plan = service.planOptions(recipe, inventory)[0];
  party.deleteEmbeddedDocuments = async () => { throw new Error("update failed"); };
  await assert.rejects(service.consume(inventory, plan, { crafter: character, recipe }), /update failed/);
  assert.deepEqual(refunds, [{ actor: character.uuid, name: "Iron", quantity: 1 }]);
});
