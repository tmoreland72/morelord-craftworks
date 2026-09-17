import test from "node:test";
import assert from "node:assert/strict";
import { DrakkenheimMonsterDataService as Monsters } from "../scripts/integrations/drakkenheim-monster-data-service.mjs";

test("harvest documents include the creature biography and resolved journal embeds without a compendium match", async t => {
  t.mock.method(Monsters, "getBiographyHtml", actor => actor.system.details.biography.value);
  const section = "<h3>Harvestable Components (Common)</h3><p><strong>Fluid:</strong> Monster Blood.</p>";
  const actor = { uuid: "Actor.imported", name: "Renamed Garmyr", system: { details: { biography: { value: section } } } };
  const resolve = t.mock.method(Monsters, "resolveBiographyEmbeds", async () => []);
  assert.deepEqual((await Monsters.findHarvestDocuments(actor)).map(row => row.html), [section]);

  actor.system.details.biography.value = "@Embed[JournalEntry.garmyr.JournalEntryPage.bio inline]";
  const embedded = { uuid: "JournalEntry.garmyr.JournalEntryPage.bio", html: section };
  resolve.mock.mockImplementation(async () => [embedded]);
  assert.deepEqual(await Monsters.findHarvestDocuments(actor), [embedded]);

  actor.system.details.biography.value = "<p>No harvesting instructions.</p>";
  resolve.mock.mockImplementation(async () => []);
  assert.deepEqual(await Monsters.findHarvestDocuments(actor), []);
});
