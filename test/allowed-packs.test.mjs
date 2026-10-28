import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  getAllowedPack,
  getAllowedPacks,
  isUuidAllowed,
  packAccess
} from "../scripts/core/allowed-packs.mjs";

function pack(collection, documentName, extra = {}) {
  return { collection, documentName, visible: true, ...extra };
}

test("Configure Sources delegation is the only pack reader and does not copy the setting", () => {
  const source = readFileSync(new URL("../scripts/core/allowed-packs.mjs", import.meta.url), "utf8");
  assert.match(source, /TODO\(morelord-core\)/);
  assert.match(source, /getAllowedPacks/);
  assert.match(source, /isUuidAllowed/);
  assert.match(source, /packSourceConfiguration/);
  assert.match(source, /rulesVersion/);
  assert.equal(source.includes("game.settings"), false);
  assert.match(source, /Do not reimplement/);
});

test("getAllowedPacks and isUuidAllowed call Core when those functions exist", () => {
  const items = [pack("dnd5e.equipment24", "Item"), pack("dnd5e.monsters", "Actor")];
  const calls = [];
  globalThis.game = {
    packs: items,
    modules: new Map([["morelord-core", { api: { sources: {
      getAllowedPacks(options) {
        calls.push(["packs", options]);
        return options.documentName
          ? items.filter(entry => entry.documentName === options.documentName)
          : items;
      },
      isUuidAllowed(uuid) {
        calls.push(["uuid", uuid]);
        if (!String(uuid).startsWith("Compendium.")) return true;
        return uuid.includes("equipment24");
      }
    } } }]])
  };

  assert.deepEqual(
    getAllowedPacks({ documentName: "Item" }).map(entry => entry.collection),
    ["dnd5e.equipment24"]
  );
  assert.equal(isUuidAllowed("Compendium.dnd5e.equipment24.Item.sword"), true);
  assert.equal(isUuidAllowed("Compendium.dnd5e.monsters.Actor.wolf"), false);
  assert.equal(isUuidAllowed("Actor.world"), true);
  assert.deepEqual(calls.map(call => call[0]), ["packs", "uuid", "uuid", "uuid"]);
});

test("the Core bridge allows only Actor and Item packs its filter accepts", () => {
  const packs = [
    pack("dnd5e.equipment24", "Item"),
    pack("dnd5e.monsters", "Actor"),
    pack("dnd5e.items", "Item"),
    pack("drakkenheim-core.tables", "RollTable"),
    pack("world.morelord-craftworks-custom-recipes", "JournalEntry"),
    pack("hidden.items", "Item", { visible: false })
  ];
  globalThis.game = {
    packs,
    modules: new Map([["morelord-core", { api: { sources: {
      filter: { isPackEnabled: entry => entry.collection !== "dnd5e.items" }
    } } }]])
  };

  assert.deepEqual(
    getAllowedPacks({ documentName: "Item", visible: true }).map(entry => entry.collection),
    ["dnd5e.equipment24"]
  );
  assert.equal(getAllowedPack("dnd5e.items"), null);
  assert.equal(getAllowedPack("drakkenheim-core.tables")?.documentName, "RollTable");
  assert.equal(getAllowedPack("world.morelord-craftworks-custom-recipes")?.documentName, "JournalEntry");
  assert.equal(isUuidAllowed("Compendium.dnd5e.items.Item.rope"), false);
  assert.equal(isUuidAllowed("Compendium.dnd5e.equipment24.Item.rope"), true);
  assert.deepEqual(packAccess("dnd5e.items"), { present: true, allowed: false, pack: null });
  assert.equal(packAccess("dnd5e.equipment24").allowed, true);
  assert.deepEqual(packAccess("missing.pack"), { present: false, allowed: false, pack: null });
});

test("a missing Core helper does not invent Configure Sources rules", () => {
  const packs = [pack("dnd5e.items", "Item"), pack("module.journal", "JournalEntry")];
  globalThis.game = { packs, modules: new Map() };
  assert.deepEqual(getAllowedPacks().map(entry => entry.collection), ["dnd5e.items", "module.journal"]);
  assert.equal(isUuidAllowed("Compendium.dnd5e.items.Item.rope"), true);
});
