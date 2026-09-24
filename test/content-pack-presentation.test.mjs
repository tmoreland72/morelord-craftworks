import assert from 'node:assert/strict';
import test from 'node:test';
import {CONTENT_PACKS} from '../data/content-packs.mjs';
import {contentPackPresentation} from '../scripts/ui/content-pack-presentation.mjs';

test('book availability reflects installed world modules independently of subscription and toggle',()=>{
  for (const id of ['standard-core','srd-5.2','srd-5.1']) {
    const view=contentPackPresentation(CONTENT_PACKS.find(p=>p.id===id),new Map());
    assert.equal(view.tierLabel,'Standard');
    assert.equal(view.statusLabel,'Available');
  }
  for(const id of ['phb','dmg']) {
    const pack=CONTENT_PACKS.find(p=>p.id===id), modules=new Map();
    assert.equal(contentPackPresentation(pack,modules).tierLabel,'Premium');
    assert.equal(contentPackPresentation(pack,modules).statusLabel,'Not Installed');
    modules.set(pack.requiredModuleId,{active:false});
    assert.equal(contentPackPresentation(pack,modules).statusLabel,'Disabled');
    modules.get(pack.requiredModuleId).active=true;
    assert.equal(contentPackPresentation(pack,modules).statusLabel,'Available');
    assert.equal(contentPackPresentation(pack,modules).tierLabel,'Premium');
  }
  const pack=CONTENT_PACKS.find(p=>p.id==='monsters-of-drakkenheim');
  const view=contentPackPresentation(pack,new Map([['drakkenheim-core',{active:false}],['drakkenheim-monsters',{active:true}]]));
  assert.equal(view.label,'Drakkenheim');assert.equal(view.statusLabel,'Champion');
  assert.deepEqual(view.sourceModules.map(s=>[s.name,s.label]),[['Dungeons of Drakkenheim','Disabled'],['Monsters of Drakkenheim','Available']]);
  assert.equal(pack.id,'monsters-of-drakkenheim');
});
