import test from "node:test";
import assert from "node:assert/strict";
import { PotionGeneratorService } from "../scripts/potions/potion-generator-service.mjs";
import { SpellScrollGeneratorService } from "../scripts/scrolls/spell-scroll-generator-service.mjs";
import { AwardChatCardService } from "../scripts/core/award-chat-card-service.mjs";

test("potion quantities default to one, aggregate duplicates, and validate before awarding", async () => {
  const recipient = { uuid: "Actor.party" };
  const deliveries = [];
  let chat;
  globalThis.fromUuid = async uuid => ({ uuid, name: "Healing", system: { rarity: "common" } });
  AwardChatCardService.post = async data => { chat = data; };
  const service = new PotionGeneratorService({ recipientResolver: { resolve: async () => recipient }, adapter: { addItemToActor: async (actor, source, quantity) => { deliveries.push(quantity); return source; } } });
  await service.createAndAward({ potions: [{ uuid: "potion" }, { uuid: "potion", quantity: "3" }] });
  assert.deepEqual(deliveries, [4]);
  assert.equal(chat.items[0].quantity, 4);
  await assert.rejects(service.createAndAward({ potions: [{ uuid: "potion" }, { uuid: "potion", quantity: 0 }] }), /positive whole number/);
  assert.deepEqual(deliveries, [4]);
});

test("scroll quantities reach inventory and chat and invalid batches award nothing", async () => {
  const recipient = { uuid: "Actor.party" };
  const deliveries = [];
  let chat;
  AwardChatCardService.post = async data => { chat = data; };
  const service = new SpellScrollGeneratorService({ recipientResolver: { resolve: async () => recipient }, adapter: { addItemToActor: async (_, source, quantity) => { deliveries.push(quantity); return source; } } });
  service.createScrollItem = async ({ spellUuid }) => ({ item: { system: {} }, spell: { uuid: spellUuid, name: "Shield" } });
  await service.createAndAwardScrolls({ spells: [{ uuid: "spell" }, { uuid: "spell", quantity: "3" }] });
  assert.deepEqual(deliveries, [1, 3]);
  assert.deepEqual(chat.items.map(row => row.quantity), [1, 3]);
  await assert.rejects(service.createAndAwardScrolls({ spells: [{ uuid: "spell" }, { uuid: "spell", quantity: 1.5 }] }), /positive whole number/);
  assert.deepEqual(deliveries, [1, 3]);
});
