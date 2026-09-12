import test from "node:test";
import assert from "node:assert/strict";

import { Dnd5eSourceFilterService } from "../scripts/core/dnd5e-source-filter-service.mjs";

test("SRD item provenance honors disabled canonical D&D5e packs", () => {
  const configuration = {
    "dnd5e.spells": false,
    "dnd5e.items": false,
    "dnd5e.tradegoods": false,
    "dnd5e.spells24": false,
    "dnd5e.equipment24": false
  };
  globalThis.game = {
    system: { id: "dnd5e" },
    settings: { get: () => configuration },
    packs: new Map(),
    modules: new Map()
  };

  const filter = new Dnd5eSourceFilterService();

  assert.equal(filter.isSourceEnabled("SRD 5.1", { itemType: "spell" }), false);
  assert.equal(filter.isSourceEnabled("SRD 5.2", { itemType: "spell" }), false);
  assert.equal(filter.isSourceEnabled("System Reference Document 5.1", { itemType: "spell" }), false);
  assert.equal(filter.isSourceEnabled("System Reference Document 5.2", { itemType: "spell" }), false);
  assert.equal(filter.isSourceEnabled("Player's Handbook"), true);
});

test("every source shape and pack fallback delegates to the Core resolver", async () => {
  const calls = [];
  globalThis.game = { modules: new Map([["morelord-core", { api: { sources: {
    resolveBookLabel: options => { calls.push(options); return "Core Canonical Book"; }
  } } }]]) };
  globalThis.foundry = { utils: { getProperty: (value, path) => path.split(".").reduce((entry, key) => entry?.[key], value) } };
  const filter = new Dnd5eSourceFilterService();
  const pack = { collection: "module.spells", metadata: { label: "Character Classes" } };
  for (const source of ["PHB Pg. 220", { custom: "PHB Pg. 228" }, { book: "PHB" }]) {
    assert.equal(await filter.sourceLabelForCompendiumItem({ system: { source } }, { pack }), "Core Canonical Book");
  }
  assert.equal(filter.sourceLabelForPack(pack), "Core Canonical Book");
  assert.deepEqual(calls, [
    { book: "PHB Pg. 220", custom: "", pack },
    { book: "", custom: "PHB Pg. 228", pack },
    { book: "PHB", custom: "", pack },
    { pack }
  ]);
});
