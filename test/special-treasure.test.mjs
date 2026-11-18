import test from "node:test";
import assert from "node:assert/strict";
import { SpecialTreasureService } from "../scripts/acquisition/special-treasure-service.mjs";

test("special treasure avoids parent/child index projection collisions and resolves an allowed item", async () => {
  const previousGame = globalThis.game;
  const previousFromUuid = globalThis.fromUuid;
  const item = { documentName: "Item", uuid: "Compendium.books.magic.Item.ring", name: "Ring of Protection" };
  const pack = { collection: "books.magic", documentName: "Item", visible: true,
    async getIndex({ fields }) {
      // Foundry's server projects the system default source field before custom fields.
      const projected = ["system.source", ...fields];
      for (const parent of projected) {
        for (const child of projected) {
          if (child.startsWith(`${parent}.`)) throw new Error("Cannot use 'in' operator to search for 'book' in 1");
        }
      }
      assert.ok(fields.includes("system.source"));
      return [{ _id: "ring", name: item.name, system: { rarities: ["rare"], source: { book: "DMG" } } }];
    }
  };
  try {
    globalThis.game = { modules: new Map([["morelord-core", { api: { sources: {
      getAllowedPacks: () => [pack], isUuidAllowed: uuid => uuid === item.uuid
    } } }]]) };
    globalThis.fromUuid = async uuid => { assert.equal(uuid, item.uuid); return item; };
    const service = new SpecialTreasureService({ sourceFilter: {
      sourceLabelForItem: row => row.system.source.book
    } });
    assert.equal((await service.sourceStatus()).counts.rare, 1);
    const result = await service.rollForEncounter(13);
    assert.equal(result.status, "item");
    assert.equal(result.itemUuid, item.uuid);
    assert.equal(result.sourceLabel, "DMG");
  } finally {
    globalThis.game = previousGame;
    globalThis.fromUuid = previousFromUuid;
  }
});
