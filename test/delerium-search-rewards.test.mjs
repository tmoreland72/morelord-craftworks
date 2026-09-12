import test from "node:test";
import assert from "node:assert/strict";
import { DeleriumSearchService } from "../scripts/acquisition/delerium-search-service.mjs";
import { AwardChatCardService } from "../scripts/core/award-chat-card-service.mjs";

test("cumulative Drakkenheim rewards deliver once and resume partial awards without rerolling", async () => {
  const sources = ["Chip", "Fragment", "Shard"].map(name => ({ _id: name,
    uuid: `Compendium.drakkenheim-monsters.items.Item.${name}`, name: `Delerium ${name}`, system: { rarity: "rare" } }));
  const official = { collection: "drakkenheim-monsters.items", documentName: "Item",
    getIndex: async () => sources, getDocument: async id => sources.find(item => item._id === id) };
  globalThis.game = { packs: [{ ...official, collection: "other-drakkenheim.items", getDocument: async () => assert.fail("Wrong source module") }, official] };
  const recipients = [{ uuid: "Actor.character", type: "character", name: "Character" }, { uuid: "Actor.party", type: "group", name: "Party" }];
  globalThis.fromUuid = async uuid => [...sources, ...recipients].find(document => document.uuid === uuid);
  let formulas = [], deliveries = [], cards = [];
  globalThis.Roll = class {
    constructor(formula) { formulas.push(formula); this.total = formula === "1" ? 1 : 6; }
    async evaluate() { return this; }
    async toMessage() {}
  };
  globalThis.ChatMessage = { getSpeaker: () => ({}) };
  const originalPost = AwardChatCardService.post;
  AwardChatCardService.post = async card => cards.push(card);
  const make = (successes, failOnce = false) => {
    const session = { id: "search", status: "open", successes, failures: 2, results: [] };
    const service = new DeleriumSearchService({ sessions: { get: () => session }, sourceFilter: { isPackEnabled: () => true },
      adapter: { addItemToActor: async (actor, source, quantity) => {
        if (failOnce && source._id === "Fragment") { failOnce = false; throw new Error("Delivery failed"); }
        deliveries.push({ actor, source, quantity }); return { uuid: "Actor.reward" };
      } } });
    return { session, service };
  };
  try {
    for (const [successes, count] of [[2, 0], [3, 1], [4, 2], [5, 3], [8, 3]]) {
      formulas = []; deliveries = []; cards = [];
      const { session, service } = make(successes);
      await service.finalize(session.id);
      assert.equal(session.randomEncounter, true);
      assert.deepEqual(session.rewards.map(row => row.sourceUuid), sources.slice(0, count).map(row => row.uuid));
      if (!count) { await assert.rejects(service.rollAndAward(session.id, recipients[0].uuid), /did not find/); continue; }
      const recipient = recipients[successes === 3 ? 0 : 1];
      await service.rollAndAward(session.id, recipient.uuid);
      assert.deepEqual(formulas, ["3d6", "1d6", "1"].slice(0, count));
      assert.equal(deliveries.length, count);
      assert.ok(deliveries.every(row => row.actor === recipient));
      assert.deepEqual(deliveries.map(row => row.quantity), [6, 6, 1].slice(0, count));
      assert.equal(cards.length, 1); assert.equal(cards[0].items.length, count);
      await assert.rejects(service.rollAndAward(session.id, recipient.uuid), /already been awarded/);
    }
    formulas = []; deliveries = []; cards = [];
    const { session, service } = make(5, true);
    await service.finalize(session.id);
    await assert.rejects(service.rollAndAward(session.id, recipients[1].uuid), /Delivery failed/);
    assert.equal(session.results.length, 1);
    await assert.rejects(service.rollAndAward(session.id, recipients[0].uuid), /original recipient/);
    await service.rollAndAward(session.id, recipients[1].uuid);
    assert.deepEqual(formulas, ["3d6", "1d6", "1"]);
    assert.deepEqual(deliveries.map(row => row.source._id), ["Chip", "Fragment", "Shard"]);
    assert.equal(cards.length, 1);
  } finally { AwardChatCardService.post = originalPost; }
});
