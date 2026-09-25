import test from "node:test";
import assert from "node:assert/strict";
import { SpellScrollGeneratorService } from "../scripts/scrolls/spell-scroll-generator-service.mjs";
import { MagicItemGeneratorService, MAGIC_ITEM_CATEGORIES } from "../scripts/items/magic-item-generator-service.mjs";

globalThis.foundry = { utils: { deepClone: structuredClone } };

test("scroll quantities support rarity OR level and preserve school filtering", async () => {
  const service = new SpellScrollGeneratorService();
  let requestedSchools;
  service.availableSpells = async ({ schools }) => {
    requestedSchools = schools;
    return Array.from({ length: 10 }, (_, level) => ({ name: `Spell ${level}`, level }));
  };
  const result = await service.generate({ common: 2, uncommon: 3, rare: 1, veryrare: 2, legendary: 1 }, { byRarity: true, schools: ["evo"] });
  assert.deepEqual(requestedSchools, ["evo"]);
  assert.equal(result.length, 9);
  assert.ok(result.slice(0, 2).every(item => [0, 1].includes(item.level)));
  assert.ok(result.slice(2, 5).every(item => [2, 3].includes(item.level)));
  assert.ok([4, 5].includes(result[5].level));
  assert.ok(result.slice(6, 8).every(item => [6, 7, 8].includes(item.level)));
  assert.equal(result[8].level, 9);
  assert.deepEqual((await service.generate({ 4: 3 })).map(item => item.level), [4, 4, 4]);
  await assert.rejects(service.generate({ uncommon: 1 }, { byRarity: true, schools: [] }), /No uncommon/);
  await assert.rejects(service.generate({ common: 1.5 }, { byRarity: true }), /whole number/);
});

test("magic catalog excludes nonphysical/mundane and disabled content, deduplicates sources, reads old and v6 rarity", async () => {
  const row = (name, type, rarity, subtype) => ({ _id: name, name, type, system: { rarity, type: { value: subtype } } });
  const pack = (collection, rows, visible = true) => ({ collection, visible, documentName: "Item", getIndex: async () => rows });
  const staff = row("Staff of Fire", "weapon", "veryRare", "simpleM");
  globalThis.game = { user: { isGM: true }, packs: [
    pack("preferred", [row("Sword", "weapon", "rare"), row("Shield", "equipment", "uncommon", "shield"), staff,
      row("Potion", "consumable", "common", "potion"), row("Spell", "spell", "rare"), row("Mundane", "weapon", ""),
      row("Disabled source", "equipment", "rare"), { _id: "v6", name: "Ring", type: "equipment", system: { rarities: ["rare", "legendary"], type: { value: "ring" } } }]),
    pack("fallback", [row("Sword", "weapon", "rare")]),
    pack("disabled", [row("Excluded", "weapon", "rare")]),
    pack("hidden", [row("Hidden", "weapon", "rare")], false)
  ] };
  const service = new MagicItemGeneratorService({ sourceFilter: {
    isPackEnabled: pack => pack.collection !== "disabled", sortPacks: packs => packs,
    sourceLabelForCompendiumItem: row => row.name === "Disabled source" ? "disabled" : "enabled",
    isSourceEnabled: source => source !== "disabled"
  } });
  const items = await service.availableItems();
  assert.deepEqual(items.map(item => item.name), ["Potion", "Ring", "Shield", "Staff of Fire", "Sword"]);
  assert.equal(items.find(item => item.name === "Sword").uuid, "Compendium.preferred.Item.Sword");
  assert.equal(items.find(item => item.name === "Staff of Fire").category, "staff");
  assert.equal(items.find(item => item.name === "Ring").rarity, "rare");
  assert.deepEqual(await service.availableItems({ categories: [] }), []);
  const result = await service.generate({ rare: 1 }, { categories: ["weapon"] });
  assert.equal(result[0].name, "Sword");
  await assert.rejects(service.generate({ rare: 2 }, { categories: ["weapon"] }), /Only 1 distinct/);
  assert.equal((await service.generate({ rare: 2 }, { categories: ["weapon"], allowDuplicates: true })).length, 2);
  assert.equal((await service.generate({ rare: 2 }, { categories: MAGIC_ITEM_CATEGORIES.map(c => c.id) })).length, 2);
  await assert.rejects(service.generate({ rare: Infinity }), /whole number/);
  game.user.isGM = false;
  await assert.rejects(service.generate({ rare: 1 }), /Only the GM/);
});
