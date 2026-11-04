import test from "node:test";
import assert from "node:assert/strict";
import { itemCard as coreItemCard } from "../../morelord-core/scripts/ui/item-card.js";
import {
  adjustCurrencyCopper,
  copperRate,
  cpToCurrency,
  currencyToCp,
  getCurrencyCopper
} from "../../morelord-core/scripts/services/currency-service.js";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character]));
}

globalThis.foundry = {
  applications: {
    api: {
      ApplicationV2: class {
        async _prepareContext() { return {}; }
        async _onRender() {}
      },
      HandlebarsApplicationMixin: Base => Base
    }
  },
  utils: { escapeHTML }
};

const { AwardChatCardService } = await import("../scripts/core/award-chat-card-service.mjs");
const { HoardApp } = await import("../scripts/ui/hoard-app.mjs");
const { SpellbookGeneratorService } = await import("../scripts/spellbooks/spellbook-generator-service.mjs");

const award = {
  recipient: { name: "Ada", uuid: "Actor.ada" },
  items: [
    {
      uuid: "Item.potion",
      name: "Potion of Healing",
      img: "icons/potion.webp",
      quantity: 2,
      rarity: "rare"
    },
    { name: "Torch", quantity: 3 }
  ],
  coinLabel: "12 gp",
  title: "Items Received",
  subtitle: "From the vault",
  icon: "fa-solid fa-gift"
};

const hoardResult = {
  profileLabel: "Challenge 0–4",
  coinCopper: 100,
  coinLabel: "1 gp",
  materials: [{ materialId: "rope", name: "Rope", quantity: 4, img: "seed.webp" }],
  potions: [],
  spellScrolls: [{ uuid: "Item.fireball", name: "Fireball", img: "scroll.webp", level: 3 }],
  customItems: [{
    uuid: "Item.gem",
    name: "Gem",
    img: "gem.webp",
    quantity: 2,
    sourceLabel: "DMG"
  }],
  special: {
    enabled: true,
    triggered: true,
    items: [{
      itemUuid: "Item.sword",
      itemName: "Sword",
      itemImg: "sword.webp",
      rarity: "rare",
      sourceLabel: "SRD",
      tableName: ""
    }]
  }
};

const spells = [
  { uuid: "Item.light", name: "Light", img: "light.webp", level: 0 },
  { uuid: "Item.shield", name: "Shield", img: "shield.webp", level: 1 }
];

function currencyApi() {
  return {
    cpToCurrency,
    adjustCurrencyCopper,
    copperRate,
    currencyToCp,
    getCurrencyCopper
  };
}

function installGlobals({ itemCard = null } = {}) {
  const messages = [];
  globalThis.MorelordCore = { ui: itemCard ? { itemCard } : {} };
  globalThis.game = {
    actors: [],
    modules: {
      get(id) {
        return id === "morelord-core" ? { api: { currency: currencyApi() } } : null;
      }
    }
  };
  globalThis.ui = { notifications: { info() {}, warn() {}, error() {} } };
  globalThis.TextEditor = { async enrichHTML(html) { return html; } };
  globalThis.ChatMessage = {
    getSpeaker: () => ({}),
    async create(data) {
      messages.push(data);
      return data;
    }
  };
  globalThis.CONFIG = {
    Item: {
      documentClass: class Item {
        constructor(data) { Object.assign(this, data); }
      }
    }
  };
  return messages;
}

async function sendHoard(result) {
  const app = new HoardApp({
    materials: {
      async resolveItem() {
        return { uuid: "Item.rope", img: "rope.webp" };
      }
    }
  });
  app.result = result;
  let send = null;
  app.element = {
    querySelector(selector) {
      if (selector === "[data-action='send-chat']") {
        return { addEventListener(_type, fn) { send = fn; } };
      }
      return null;
    },
    querySelectorAll() { return []; }
  };
  await app._onRender({}, {});
  await send();
}

async function awardSpellbook() {
  const service = new SpellbookGeneratorService({
    spellScrollGenerator: { hasAccess: true },
    adapter: {
      async addItemToActor() {
        return { uuid: "Item.book", name: "Ada's Book", img: "book.webp" };
      }
    },
    recipientResolver: {
      async resolve() { return { name: "Ada", uuid: "Actor.ada" }; }
    }
  });
  await service.createAndAward({ name: "Ada's Book", spells });
}

test("itemCard receives the award, hoard, and spellbook options", async () => {
  const calls = [];
  const messages = installGlobals({
    itemCard(opts) {
      calls.push(structuredClone(opts));
      return coreItemCard(opts);
    }
  });

  const posted = await AwardChatCardService.post(award);
  await sendHoard(hoardResult);
  await awardSpellbook();

  assert.equal(calls.length, 3);
  assert.deepEqual(calls[0], {
    title: "Items Received",
    icon: "fa-solid fa-gift",
    recipientName: "Ada",
    subtitle: "From the vault",
    items: [
      {
        uuid: "Item.potion",
        name: "Potion of Healing",
        img: "icons/potion.webp",
        quantity: 2,
        rarity: "rare"
      },
      {
        uuid: null,
        name: "Torch",
        img: "icons/svg/item-bag.svg",
        quantity: 3,
        rarity: null
      }
    ],
    coinLabel: "12 gp",
    footer: "Morelord Craftworks"
  });
  assert.match(posted.content, /data-ml-craftworks-link-target="Item\.potion"/);
  assert.match(posted.content, /@UUID\[Item\.potion\]\{Potion of Healing\}/);
  assert.equal(
    posted.content.match(/data-ml-craftworks-link-target=/g).length,
    1
  );

  assert.deepEqual(calls[1], {
    title: "Treasure Hoard",
    icon: "fa-solid fa-vault",
    subtitle: "Challenge 0–4",
    sections: [
      {
        heading: "Crafting Materials",
        items: [{ uuid: "Item.rope", name: "Rope", img: "rope.webp", quantity: 4 }]
      },
      {
        heading: "Potions",
        items: []
      },
      {
        heading: "Spell Scrolls",
        items: [{
          uuid: "Item.fireball",
          name: "Spell Scroll: Fireball",
          img: "scroll.webp",
          quantity: 1,
          value: "Level 3"
        }]
      },
      {
        heading: "Added Items",
        items: [{
          uuid: "Item.gem",
          name: "Gem",
          img: "gem.webp",
          quantity: 2,
          value: "DMG"
        }]
      },
      {
        heading: "Special Treasure",
        items: [{
          uuid: "Item.sword",
          name: "Sword",
          img: "sword.webp",
          rarity: "rare",
          quantity: 1,
          value: "SRD"
        }]
      }
    ],
    emptyText: "None.",
    coins: cpToCurrency(100),
    footer: "Morelord Craftworks"
  });

  assert.deepEqual(calls[2], {
    title: "Ada's Book",
    icon: "fa-solid fa-book",
    recipientName: "Ada",
    items: [{
      uuid: "Item.book",
      name: "Ada's Book",
      img: "book.webp",
      quantity: 1
    }],
    sections: [
      {
        heading: "Cantrips",
        items: [{ uuid: "Item.light", name: "Light", img: "light.webp", quantity: 1 }]
      },
      {
        heading: "Level 1",
        items: [{ uuid: "Item.shield", name: "Shield", img: "shield.webp", quantity: 1 }]
      }
    ],
    footer: "Morelord Craftworks"
  });
  assert.equal(messages.length, 3);
});

test("a missing itemCard keeps the current award, hoard, and spellbook markup", async () => {
  const messages = installGlobals();

  const posted = await AwardChatCardService.post(award);
  await sendHoard(hoardResult);
  await awardSpellbook();

  assert.match(posted.content, /ml-craftworks-award-card/);
  assert.match(posted.content, /data-ml-craftworks-link-target="Item\.potion"/);
  assert.match(posted.content, /@UUID\[Item\.potion\]\{Potion of Healing\}/);
  assert.match(posted.content, /ml-craftworks-award-card-coins/);
  assert.doesNotMatch(posted.content, /ml-award-card/);

  const hoard = messages[1].content;
  assert.match(hoard, /ml-craftworks-hoard-chat-card/);
  assert.match(hoard, /Treasure Hoard/);
  assert.match(hoard, /@UUID\[Item\.fireball\]\{Spell Scroll: Fireball\}/);
  assert.match(hoard, /<strong>1 gp<\/strong>/);
  assert.match(hoard, /@UUID\[Item\.sword\]\{Sword\}/);
  assert.match(hoard, /SRD/);
  assert.doesNotMatch(hoard, /ml-award-card/);

  const spellbook = messages[2].content;
  assert.match(spellbook, /ml-craftworks-spellbook-card/);
  assert.match(spellbook, /Received by Ada/);
  assert.match(spellbook, /@UUID\[Item\.book\]\{Ada(?:'|&#39;)s Book\}/);
  assert.match(spellbook, /<strong>Cantrips<\/strong>/);
  assert.match(spellbook, /<strong>Level 1<\/strong>/);
  assert.match(spellbook, /@UUID\[Item\.light\]\{Light\}/);
  assert.doesNotMatch(spellbook, /ml-award-card/);
});
