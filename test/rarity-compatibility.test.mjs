import test from "node:test";
import assert from "node:assert/strict";
import { PotionGeneratorService } from "../scripts/potions/potion-generator-service.mjs";
import { SpecialTreasureService } from "../scripts/acquisition/special-treasure-service.mjs";
import { Dnd5eCompendiumItemResolver } from "../scripts/recipes/dnd5e-compendium-item-resolver.mjs";

test("legacy and v6 indexes retain potions, special treasure, and recipe output rarity", async () => {
  globalThis.foundry = { utils: { getProperty: (obj, path) => path.split(".").reduce((value, key) => value?.[key], obj) } };
  for (const rarity of [{ rarity: "rare" }, { rarities: ["rare"] }, { rarities: ["legendary", "rare"] }]) {
    const row = { _id: "potion", name: "Rare healing potion", type: "consumable", system: { ...rarity, type: { value: "potion" } } };
    const pack = { collection: "dnd5e.equipment24", documentName: "Item", getIndex: async ({ fields }) => {
      assert.ok(fields.includes("system.rarity"));
      assert.ok(fields.includes("system.rarities"));
      return [row];
    } };
    const packs = [pack]; packs.get = id => packs.find(p => p.collection === id);
    globalThis.game = { packs };
    const potions = await new PotionGeneratorService().availablePotions();
    assert.equal(potions.length, 1);
    assert.equal(potions[0].rarity, "rare");
    const treasure = await new SpecialTreasureService().sourceStatus();
    assert.equal(treasure.counts.rare, 1);
    const item = await new Dnd5eCompendiumItemResolver().resolve(row.name, { sourceBook: "SRD 5.2" });
    assert.equal(item.rarity, "rare");
  }
});
