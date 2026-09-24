import assert from "node:assert/strict";
import test from "node:test";
import { LuckyFindsService, clickableFindDice } from "../scripts/acquisition/lucky-finds-service.mjs";

test("Lucky Finds enriches dice once and preserves linked document identifiers", () => {
  assert.equal(clickableFindDice('2d6 x 10 gp and [[/r 1d4]] @UUID[Item.1d4]{Tool}'),
    '[[/gmroll 2d6 * 10]] gp and [[/gmroll 1d4]] @UUID[Item.1d4]{Tool}');
});
test("Lucky Finds uses corrected results and canonical item sources without awarding items", async () => {
  const resolved = [];
  const resolver = { resolve: async (name, options) => { resolved.push({name, ...options}); return {name, uuid: `Compendium.dmg.Item.item`}; },
    resolveAny: async name => ({name, uuid: 'Compendium.dmg.Item.item'}) };
  globalThis.game = { user: {isGM:true}, modules: new Map([['drakkenheim-core',{active:true}]]),
    packs: new Map([['drakkenheim-core.tables',{}], ['drakkenheim-monsters.items',{getIndex:async()=>[{_id:'chip',name:'Delerium Chip'}]}]]) };
  const service = new LuckyFindsService({contentPacks:{isEnabled:()=>true},itemResolver:resolver});
  const describe = (range, description) => service.describe({toObject:()=>({range,description})});
  assert.match((await describe([8,8], '1d4 sets of tools')).text, /\[\[\/gmroll 1d4]] artisan tools/);
  assert.match((await describe([12,12], '1d4 art objects worth 25 gp each')).text, /Art Object \(25 GP\)/);
  assert.equal(resolved[0].sourceBook, "Dungeon Master's Guide");
  assert.match((await describe([15,16], '<em>restorative ointment</em> pon a shelf')).text, /Keoghtom's Ointment.*upon/);
  assert.match((await describe([13,13], '2d6 delerium chips')).text, /Compendium\.drakkenheim-monsters\.items\.Item\.chip/);
  assert.equal((await describe([20,20], 'rare spell scroll')).scrollRarity, 'rare');
  game.user.isGM = false;
  assert.equal(service.hasAccess, false);
  await assert.rejects(()=>service.roll(), /unavailable/);
});
