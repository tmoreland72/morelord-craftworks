import test from "node:test";
import assert from "node:assert/strict";

import {
  handleCraftworksChatLinkClick,
  openCraftworksChatLink
} from "../scripts/ui/craftworks-chat-link.mjs";

const UUID = "Compendium.dnd5e.items.Item.rope";

test("a disabled chat-card source warns and does not call fromUuid", async () => {
  const warnings = [];
  const opened = [];
  globalThis.ui = { notifications: { warn: message => warnings.push(message) } };
  globalThis.game = { packs: [], modules: new Map() };
  globalThis.fromUuid = async () => { opened.push("fromUuid"); return null; };

  await openCraftworksChatLink(UUID);

  assert.deepEqual(opened, []);
  assert.deepEqual(warnings, ["That source is disabled in D&D5e Configure Sources."]);
});

test("an allowed chat-card source opens the document sheet", async () => {
  const warnings = [];
  let rendered = null;
  globalThis.ui = { notifications: { warn: message => warnings.push(message) } };
  globalThis.game = {
    packs: [],
    modules: new Map([["morelord-core", { api: { sources: { isUuidAllowed: () => true } } }]])
  };
  globalThis.fromUuid = async uuid => ({
    uuid,
    sheet: { render(force) { rendered = force; } }
  });

  await openCraftworksChatLink("Compendium.dnd5e.equipment24.Item.sword");

  assert.equal(rendered, true);
  assert.deepEqual(warnings, []);
});

test("a chat-card row checks Configure Sources before fromUuid", async () => {
  const warnings = [];
  const opened = [];
  globalThis.ui = { notifications: { warn: message => warnings.push(message) } };
  globalThis.game = { packs: [], modules: new Map() };
  globalThis.fromUuid = async () => { opened.push("fromUuid"); return null; };
  const row = { dataset: { mlCraftworksLinkTarget: UUID } };
  let prevented = false;

  await handleCraftworksChatLinkClick({
    target: {
      closest: selector => selector === "[data-ml-craftworks-link-target]" ? row : null
    },
    preventDefault() { prevented = true; },
    stopPropagation() {}
  });

  assert.equal(prevented, true);
  assert.deepEqual(opened, []);
  assert.deepEqual(warnings, ["That source is disabled in D&D5e Configure Sources."]);
});

test("the item-name content link is left to Foundry", async () => {
  const warnings = [];
  globalThis.ui = { notifications: { warn: message => warnings.push(message) } };
  globalThis.fromUuid = async () => { throw new Error("should not open"); };
  const row = { dataset: { mlCraftworksLinkTarget: UUID } };
  let prevented = false;

  await handleCraftworksChatLinkClick({
    target: {
      closest: selector => {
        if (selector === ".content-link") return {};
        if (selector === "[data-ml-craftworks-link-target]") return row;
        return null;
      }
    },
    preventDefault() { prevented = true; },
    stopPropagation() {}
  });

  assert.equal(prevented, false);
  assert.deepEqual(warnings, []);
});
