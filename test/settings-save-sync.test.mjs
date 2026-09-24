import assert from 'node:assert/strict';
import test from 'node:test';

test('Save Changes persists settings before syncing, blocks duplicate saves, and stays open on sync failure', async () => {
  globalThis.foundry = { applications: { api: { ApplicationV2: class { async _onRender() {} async close() { this.closed = true; } }, HandlebarsApplicationMixin: Base => Base } } };
  const { CraftworksSettingsApp } = await import('../scripts/ui/craftworks-settings-app.mjs');
  const errors = [], events = [];
  globalThis.ui = {notifications:{info:()=>{},error:message=>errors.push(message)}};
  globalThis.game = {settings:{set:async (_id,key)=>events.push(key),get:()=>null},modules:new Map()};
  const originalFormData = globalThis.FormData;
  globalThis.FormData = class extends Map { constructor(){super();} };
  try {
    for (const fail of [false,true]) {
      const app = new CraftworksSettingsApp();
      const listeners = {};
      const button = {disabled:false,isConnected:true,addEventListener:(_name,fn)=>listeners.save=fn};
      app.element = {querySelectorAll:()=>[],querySelector:selector=>selector==='form'?{}:selector==="[data-action='save']"?button:null};
      let finish;
      CraftworksSettingsApp.craftworks = {syncContent:async options=>{assert.equal(options.reason,'settings-save');events.push('sync');await new Promise(resolve=>finish=resolve);if(fail)throw Error('offline');}};
      await app._onRender({},{});
      const event = {preventDefault(){},currentTarget:button};
      const save = listeners.save(event);
      await listeners.save(event);
      while (!finish) await new Promise(resolve=>setImmediate(resolve));
      assert.equal(events.at(-1),'sync');
      assert(events.includes('recipePackEnabled_monsters_of_drakkenheim'));
      assert.equal(button.disabled,true);
      assert(!app.closed);
      finish();await save;
      assert.equal(Boolean(app.closed),!fail);
      assert.equal(button.disabled,false);
    }
    assert.match(errors[0],/Settings saved, but compendium sync failed/);
    assert.equal(events.filter(x=>x==='sync').length,2);
  } finally { globalThis.FormData = originalFormData; }
});
