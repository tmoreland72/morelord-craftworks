import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

globalThis.foundry = {
  applications: {
    api: {
      ApplicationV2: class {
        async _prepareContext() { return {}; }
        async _onRender() {}
      },
      HandlebarsApplicationMixin: Base => Base
    }
  }
};

const { HoardApp } = await import("../scripts/ui/hoard-app.mjs");

test("hoard search results add an item without opening its sheet", async () => {
  const template = readFileSync(new URL("../templates/hoard-gm.hbs", import.meta.url), "utf8");
  const searchButton = template.match(/<button type="button" data-action="add-result-item"[^>]*>/)[0];
  const openButton = template.match(/class="[^"]*ml-craftworks-special-item-open[^"]*"/)[0];
  assert.match(searchButton, /data-item-uuid=/);
  assert.equal(searchButton.includes("ml-craftworks-special-item-open"), false);
  assert.match(openButton, /ml-craftworks-special-item-open/);

  const opened = [];
  globalThis.ui = { notifications: { warn() {}, info() {}, error() {} } };
  globalThis.fromUuid = async uuid => ({
    uuid,
    documentName: "Item",
    sheet: { render() { opened.push(uuid); } }
  });
  globalThis.game = { actors: [], user: { isGM: true } };

  const search = { dataset: { itemUuid: "Item.search", action: "add-result-item" } };
  const opener = { dataset: { itemUuid: "Item.special" } };
  const listeners = [];
  const app = new HoardApp({});
  app.element = {
    querySelector() { return null; },
    querySelectorAll(selector) {
      const nodes = [];
      if (selector === ".ml-craftworks-special-item-open[data-item-uuid]") nodes.push(opener);
      if (selector === "[data-item-uuid]") nodes.push(search, opener);
      if (selector === "[data-action='add-result-item']") nodes.push(search);
      return nodes.map(node => ({
        ...node,
        addEventListener(_type, fn) { listeners.push({ selector, fn, node }); }
      }));
    }
  };

  await app._onRender({}, {});

  assert.equal(listeners.some(entry => entry.selector === "[data-item-uuid]"), false);
  const sheet = listeners.find(entry => entry.node === opener);
  assert.ok(sheet);
  await sheet.fn({
    preventDefault() {},
    stopPropagation() {},
    currentTarget: opener
  });
  assert.deepEqual(opened, ["Item.special"]);
});
