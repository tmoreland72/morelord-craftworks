import test from 'node:test';
import assert from 'node:assert/strict';
class Application { async _prepareContext() { return {}; } }
globalThis.foundry = { applications: { api: { ApplicationV2: Application, HandlebarsApplicationMixin: Base => Base } }, utils: { deepClone: structuredClone, mergeObject: (a,b) => ({...a,...b}) } };
const { HarvestPlayerApp } = await import('../scripts/ui/harvest-player-app.mjs');
const item = (quantity, materialId = 'bone') => ({ system: { quantity }, flags: { 'morelord-craftworks': { materialId } } });
const match = quantity => ({ quantity, match: { materialId: 'bone' } });
test('harvest recipe quantities combine personal and member-party stock, refresh, and preserve alternative paths', async () => {
  const actor = { id: 'hero', uuid: 'Actor.hero', type: 'character', items: [item(1)] };
  const party = { id: 'party', type: 'group', system: { members: [{ uuid: actor.uuid }, { uuid: actor.uuid }] }, items: [item(1)] };
  const other = { type: 'group', system: { members: [] }, items: [item(99)] };
  globalThis.game = { user: { id: 'gm', isGM: true }, actors: [actor, party, other] };
  globalThis.fromUuid = async () => actor;
  const recipes = [
    { id: 'four', name: 'Four Bones', requirementGroups: [{ requirements: [match(4)] }] },
    { id: 'and', requirementGroups: [{ requirements: [match(2), match(3)] }] },
    { id: 'or', requirementGroups: [{ requirements: [{type:'alternatives', alternatives:[match(6), match(4)]}] }, { requirements: [match(8)] }] },
    { id: 'scroll', requirementGroups: [{ requirements: [{ quantity: 1, match: { itemType: 'spellScroll' } }] }] }
  ];
  const api = { markedRecipes: { list: () => recipes.map(r => r.id) }, recipes: { get: id => recipes.find(r => r.id === id) }, materials: { get: () => ({materialId:'bone'}) }, harvest: {getSkillOptions:()=>[]} };
  const session = { creatures: [{ tokenUuid:'fixture', components:[{id:'bone',matched:true,materialId:'bone'}] }], results:[{materialId:'bone'}] };
  const app = new HarvestPlayerApp(api, session, actor.uuid);
  const context = await app._prepareContext({});
  const rows = context.creatures[0].displayComponents[0].matchingRecipes;
  assert.deepEqual(rows.map(r=>[r.id,r.available,r.required]), [['four',2,4],['and',2,5],['or',2,4]]);
  assert.deepEqual(context.claimedItems[0].matchingRecipes, rows);
  party.items[0].system.quantity = 5;
  assert.equal((await app._prepareContext({})).creatures[0].displayComponents[0].matchingRecipes[0].available,6);
  actor.items = []; party.items = [];
  assert.equal((await app._prepareContext({})).creatures[0].displayComponents[0].matchingRecipes[0].available,0);
});
