import test from "node:test";
import assert from "node:assert/strict";

class Application {
  async _onRender() {}
  async _prepareContext() { return {}; }
  async close() {}
}
const randomIds = [];
globalThis.foundry = {
  applications: {
    api: {
      ApplicationV2: Application,
      HandlebarsApplicationMixin: Base => Base
    }
  },
  utils: {
    randomID: () => {
      const id = `req-${randomIds.length + 1}`;
      randomIds.push(id);
      return id;
    },
    setProperty(object, path, value) {
      const parts = path.split(".");
      let target = object;
      for (const part of parts.slice(0, -1)) target = target[part] ??= {};
      target[parts.at(-1)] = value;
      return object;
    },
    mergeObject: (original, extra) => ({ ...original, ...extra })
  }
};

const notifications = { errors: [], info: [] };
globalThis.ui = {
  notifications: {
    info: message => notifications.info.push(message),
    warn: assert.fail,
    error: message => notifications.errors.push(message)
  }
};

const { Dnd5eAdapter } = await import("../scripts/adapters/dnd5e-adapter.mjs");
const { resolvePartyInventoryAdd, startCraftworksPartyInventoryRelay } = await import("../scripts/core/party-inventory-relay.mjs");
const { CraftCompletionApp } = await import("../scripts/ui/craft-completion-app.mjs");

const source = {
  uuid: "Item.antitoxin",
  name: "Antitoxin",
  documentName: "Item",
  toObject() { return { name: "Antitoxin", type: "consumable", system: { quantity: 1 } }; },
  getFlag() { return null; }
};
const darro = { id: "darro", name: "Darro", isGM: false, active: true };
const gm = { id: "gm", name: "GM", isGM: true, active: true };
const users = [darro, gm];
users.get = id => users.find(user => user.id === id);
const party = {
  uuid: "Actor.pbsoParty0000000",
  id: "pbsoParty0000000",
  type: "group",
  name: "Party",
  testUserPermission: () => false,
  items: [],
  creates: [],
  async createEmbeddedDocuments(_type, data) {
    party.creates.push(structuredClone(data));
    return [{ uuid: `Item.created${party.creates.length}`, name: data[0].name }];
  }
};
const documents = new Map([
  [party.uuid, party],
  [source.uuid, source]
]);
const gmCalls = [];
let member = true;
globalThis.fromUuid = async uuid => documents.get(uuid) ?? null;
globalThis.game = { user: darro, users, actors: [party], modules: new Map(), packs: { get: () => null } };
globalThis.MorelordCore = {
  socket: {
    createChannel() {
      const transport = {
        on(_type, handler) { transport.handler = handler; },
        async executeAsGM(_type, data) {
          gmCalls.push(data);
          const player = game.user;
          game.user = gm;
          try { return await transport.handler(data, { senderUserId: player.id }); }
          finally { game.user = player; }
        }
      };
      return transport;
    }
  },
  ui: {
    participation: {
      canUseActorInventory: (actor, user) => member && actor?.uuid === party.uuid && user?.id === darro.id
    }
  }
};
const adapter = new Dnd5eAdapter();
startCraftworksPartyInventoryRelay(adapter);

test("a party member places a crafted item through the GM without creating it locally", async () => {
  game.user = darro;
  member = true;
  const before = party.creates.length;
  const created = await adapter.addItemToActor(party, source, 1);
  assert.equal(gmCalls.length, 1);
  assert.equal(gmCalls[0].actorUuid, party.uuid);
  assert.equal(gmCalls[0].sourceUuid, source.uuid);
  assert.equal(party.creates.length, before + 1);
  assert.equal(party.creates.at(-1)[0].name, "Antitoxin");
  assert.equal(party.creates.at(-1)[0].system.quantity, 1);
  assert.equal(created.name, "Antitoxin");
});

test("a repeated party inventory request creates the item once", async () => {
  game.user = gm;
  member = true;
  const before = party.creates.length;
  const data = { requestId: "same-request", actorUuid: party.uuid, sourceUuid: source.uuid, quantity: 1 };
  const [first, second] = await Promise.all([
    resolvePartyInventoryAdd(data, darro.id),
    resolvePartyInventoryAdd(data, darro.id)
  ]);
  assert.equal(first, second);
  assert.equal(first.ok, true);
  assert.equal(party.creates.length, before + 1);
});

test("a player who is not a party member cannot create an item on the Group", async () => {
  game.user = darro;
  member = false;
  const before = party.creates.length;
  await assert.rejects(
    adapter.addItemToActor(party, source, 1),
    /cannot place that item in the party inventory/
  );
  assert.equal(party.creates.length, before);
});

test("an owned character inventory is written by the player", async () => {
  game.user = darro;
  const callsBefore = gmCalls.length;
  const character = {
    uuid: "Actor.darro",
    type: "character",
    name: "Darro",
    testUserPermission: () => true,
    items: [],
    creates: [],
    async createEmbeddedDocuments(_type, data) {
      character.creates.push(data);
      return [{ uuid: "Item.onDarro", name: data[0].name }];
    }
  };
  const created = await adapter.addItemToActor(character, source, 1);
  assert.equal(gmCalls.length, callsBefore);
  assert.equal(character.creates.length, 1);
  assert.equal(created.uuid, "Item.onDarro");
});

test("Place in Party Inventory runs once when the completion action is delivered twice", async () => {
  notifications.errors.length = 0;
  notifications.info.length = 0;
  let awards = 0;
  const destination = { uuid: party.uuid, name: "Party" };
  const app = new CraftCompletionApp({
    craftingMaterials: {
      awardOutput: async actor => {
        awards += 1;
        assert.equal(actor, destination);
        return { quantity: 1, label: "Antitoxin" };
      }
    },
    craftingJobs: { markOutputAwarded: async () => {} }
  }, {
    recipe: { id: "antitoxin", name: "Antitoxin" },
    crafter: { name: "Darro", uuid: "Actor.darro" },
    progress: {}
  });
  const listeners = [];
  const buttons = [{ disabled: false }, { disabled: false }];
  app.partyActor = destination;
  app.element = {
    dataset: {},
    addEventListener(_type, fn) { listeners.push(fn); },
    querySelector: () => null,
    querySelectorAll: selector => String(selector).includes("place-") ? buttons : []
  };
  app.close = async () => { app.closed = true; };
  await app._onRender({}, {});
  await app._onRender({}, {});
  assert.equal(listeners.length, 1);
  const target = {
    dataset: { action: "place-party" },
    closest: selector => selector === "[data-action]" ? target : null
  };
  const event = { target, preventDefault() {} };
  listeners[0](event);
  listeners[0](event);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(awards, 1);
  assert.equal(notifications.errors.length, 0);
  assert.equal(notifications.info.length, 1);
  assert.equal(app.closed, true);
  assert.equal(buttons.every(button => button.disabled), true);
});
