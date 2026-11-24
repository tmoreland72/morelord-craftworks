import test from 'node:test';
import assert from 'node:assert/strict';

test('Delerium skill buttons use character bonuses and prepare native dice on the requesting client', async t => {
  const names = ['game','foundry','MorelordCore','Hooks','ChatMessage','fromUuid'];
  const saved = names.map(key => [key,Object.getOwnPropertyDescriptor(globalThis,key)]);
  t.after(() => { for (const [key, descriptor] of saved) if (descriptor) Object.defineProperty(globalThis,key,descriptor); else delete globalThis[key]; });
  globalThis.foundry = { applications: { api: { ApplicationV2: class { async _prepareContext(){return {}} }, HandlebarsApplicationMixin: Base => Base } }, utils: { deepClone: structuredClone, escapeHTML: String, mergeObject:(a,b)=>({...a,...b}) } };
  const actor = { id: 'a', uuid: 'Actor.a', system: { skills: { arc: { total: 5 }, inv: { total: -1 }, sur: { total: 2 } } } };
  globalThis.fromUuid = async () => actor;
  const gm = { id:'gm',isGM:true,active:true };
  const users = [gm]; users.get = id => users.find(user => user.id === id);
  globalThis.game = { user:gm, users, messages:[], actors:new Map(), settings:{settings:new Map()} };
  globalThis.Hooks = { on(){} };
  const handlers = new Map(), cards = [], rolls = [], opened = [];
  let cancel = false;
  globalThis.MorelordCore = { users:{activePlayerForActor:()=>null},socket:{createChannel:()=>({on(){},executeAsUser:async(type,data,user)=>{opened.push({type,data,user});return {opened:true};}})},chatRequests:{register:(type,handler)=>handlers.set(type,handler),create:async card=>cards.push(card)},
    rolls:{skill:async (who,skill,options)=>{rolls.push({who,skill,options});return cancel?{cancelled:true}:{roll:{toJSON:()=>({total:17})}};}} };
  globalThis.ChatMessage = { create:async(data)=>({id:'record',getFlag:()=>session,setFlag:async()=>{}}) };
  const session = {id:'search',zone:{name:'Outer City',dc:15},participants:{},successes:0,failures:0};
  const api = {deleriumSearch:{start:()=>session,getSkillOptions:()=>[{id:'arc',label:'Arcana'},{id:'inv',label:'Investigation'},{id:'sur',label:'Survival'}]}};
  const { initializeDeleriumChatRequests } = await import('../scripts/acquisition/delerium-chat-requests.mjs');
  const request = initializeDeleriumChatRequests(api);
  await request('outer',[actor.uuid]);
  assert.equal(cards.length,0);
  assert.equal(opened[0].type,'open'); assert.equal(opened[0].data.actorUuid,actor.uuid); assert.equal(opened[0].user,gm.id);
  const { DeleriumSearchPlayerApp } = await import('../scripts/ui/delerium-search-player-app.mjs');
  const app = new DeleriumSearchPlayerApp(api,session,actor.uuid);
  const context = await app._prepareContext({});
  assert.deepEqual(context.skills.map(skill=>skill.modifierLabel),['+5','-1','+2']);
  const entry = {actorUuid:actor.uuid,dc:15};
  const handler = handlers.get('craftworks.delerium');
  assert.deepEqual(await handler.prepare(entry,'arc'),{total:17});
  assert.equal(rolls[0].who,actor); assert.equal(rolls[0].options.configure,true); assert.equal(rolls[0].options.create,false);
  cancel = true; assert.equal(await handler.prepare(entry,'arc'),null);
  assert.deepEqual(await handler.prepare(entry,'decline'),{}); assert.equal(rolls.length,2);
  await assert.rejects(handler.prepare(entry,'bad'),/Choose a search skill/);
});
