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
  assert.equal(filter.isSourceEnabled("Player's Handbook"), true);
});
