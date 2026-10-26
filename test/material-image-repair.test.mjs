import test from "node:test";
import assert from "node:assert/strict";
import { repairCatalogImages } from "../scripts/materials/material-images.mjs";

test("stored catalog artwork repair updates only known invalid images and restores compendium locking", async () => {
  globalThis.game = { user: { isGM: true } };
  const events = [];
  const pack = { collection: "world.morelord-craftworks-standard-materials", locked: true,
    configure: async options => events.push(options) };
  const rows = [
    { _id: "broken", img: "icons/commodities/stone/ore-pile-silver.webp", flags: { "morelord-craftworks": { materialId: "mithril-ore" } } },
    { _id: "custom", img: "worlds/dev1/custom.webp", flags: { "morelord-craftworks": { materialId: "mithril-ore" } } },
    { _id: "unrelated", img: "icons/commodities/stone/ore-pile-silver.webp", flags: {} }
  ];
  globalThis.CONFIG = { Item: { documentClass: { updateDocuments: async (updates, options) => events.push({ updates, options }) } } };
  assert.equal(await repairCatalogImages(pack, rows), 1);
  assert.deepEqual(events, [{ locked: false }, { updates: [{ _id: "broken", img: "icons/commodities/stone/ore-chunk-silver-gray.webp" }], options: { pack: pack.collection } }, { locked: true }]);
  events.length = 0;
  assert.equal(await repairCatalogImages({ ...pack, collection: "third-party.items" }, rows), 0);
  game.user.isGM = false;
  assert.equal(await repairCatalogImages(pack, rows), 0);
  assert.equal(events.length, 0);
});

test("stored artwork repair restores locking when an update fails", async () => {
  globalThis.game = { user: { isGM: true } };
  const locks = [];
  globalThis.CONFIG = { Item: { documentClass: { updateDocuments: async () => { throw Error("failed"); } } } };
  const pack = { collection: "world.morelord-craftworks-standard-materials", locked: true, configure: async options => locks.push(options.locked) };
  await assert.rejects(repairCatalogImages(pack, [{ _id: "test", img: "icons/commodities/metal/ingot-dark.webp", flags: { "morelord-craftworks": { materialId: "adamantine-cube" } } }]), /failed/);
  assert.deepEqual(locks, [false, true]);
});
