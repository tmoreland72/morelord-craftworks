import test from "node:test";
import assert from "node:assert/strict";

import { SpellScrollGeneratorService } from "../scripts/scrolls/spell-scroll-generator-service.mjs";

function spellPack(collection, name) {
  return {
    collection,
    documentName: "Item",
    visible: true,
    async getIndex() {
      return [{
        _id: collection,
        name,
        type: "spell",
        system: { level: 1, school: "evo", source: {} }
      }];
    }
  };
}

test("available spells intersect D&D source and Craftworks SRD settings", async () => {
  globalThis.game = {
    packs: [
      spellPack("dnd5e.spells", "SRD 5.1 Spell"),
      spellPack("dnd5e.spells24", "SRD 5.2 Spell"),
      spellPack("module.enabled-spells", "Enabled Module Spell")
    ]
  };
  globalThis.foundry = {
    utils: {
      getProperty: (object, path) => path.split(".").reduce(
        (value, key) => value?.[key],
        object
      )
    }
  };

  const service = new SpellScrollGeneratorService({
    sourceFilter: {
      isPackEnabled: () => true,
      sortPacks: packs => packs,
      sourceLabelForCompendiumItem: (_row, { pack }) => pack.collection
    },
    contentPacks: {
      isEnabled: packId => !["srd-5.1", "srd-5.2"].includes(packId)
    }
  });

  const spells = await service.availableSpells();

  assert.deepEqual(spells.map(spell => spell.name), ["Enabled Module Spell"]);
});

test("an SRD spell copied into an enabled pack still honors its source exclusion", async () => {
  globalThis.game = {
    packs: [spellPack("world.copied-spells", "Copied SRD Spell")]
  };
  globalThis.foundry = {
    utils: {
      getProperty: (object, path) => path.split(".").reduce(
        (value, key) => value?.[key],
        object
      )
    }
  };

  const service = new SpellScrollGeneratorService({
    sourceFilter: {
      isPackEnabled: () => true,
      isSourceEnabled: label => label !== "SRD 5.1",
      sortPacks: packs => packs,
      sourceLabelForCompendiumItem: () => "SRD 5.1"
    }
  });

  assert.deepEqual(await service.availableSpells(), []);
});
