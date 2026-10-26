import assert from 'node:assert/strict';
import test from 'node:test';

test.describe('Craftworks settings save', { concurrency: false }, () => {

test('SRD pack checkboxes save the underscored world settings', async () => {
  globalThis.foundry = { applications: { api: { ApplicationV2: class { async _onRender() {} async close() { this.closed = true; } }, HandlebarsApplicationMixin: Base => Base } } };
  const { CraftworksSettingsApp } = await import('../scripts/ui/craftworks-settings-app.mjs');
  globalThis.ui = { notifications: { info() {}, error() {} } };
  const saved = new Map();
  globalThis.game = {
    settings: { set: async (_id, key, value) => { saved.set(key, value); }, get: () => null },
    modules: new Map()
  };
  const originalFormData = globalThis.FormData;
  globalThis.FormData = class extends Map {
    constructor() {
      super([
        ['pack:srd-5.2', 'on'],
        ['pack:phb', 'on'],
        ['pack:dmg', 'on'],
        ['pack:monsters-of-drakkenheim', 'on'],
        ['pack:standard-core', 'on']
      ]);
    }
  };
  try {
    const app = new CraftworksSettingsApp();
    const listeners = {};
    const button = { disabled: false, isConnected: true, addEventListener: (_name, fn) => { listeners.save = fn; } };
    app.element = { querySelectorAll: () => [], querySelector: selector => selector === 'form' ? {} : selector === "[data-action='save']" ? button : null };
    let finish;
    CraftworksSettingsApp.craftworks = {
      contentSync: { running: null },
      syncContent: async () => { await new Promise(resolve => { finish = resolve; }); }
    };
    await app._onRender({}, {});
    const save = listeners.save({ preventDefault() {}, currentTarget: button });
    while (!finish) await new Promise(resolve => setImmediate(resolve));
    finish();
    await save;
    assert.equal(saved.get('recipePackEnabled_srd_5_2'), true);
    assert.equal(saved.get('recipePackEnabled_srd_5_1'), false);
    assert.equal(saved.get('recipePackEnabled_standard_core'), true);
  } finally {
    globalThis.FormData = originalFormData;
  }
});

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

});
