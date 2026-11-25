import {assert} from '../../../morelord-core/scripts/testing/in-game.js';

export const craftworksSettingsCheck={id:'craftworks.settings-checkbox-and-save',async run(){
  assert(game.world.id==='dev1' && game.user.isGM,'Run as GM in Dev1');
  const App=game.settings.menus.get('morelord-craftworks.configure').type;
  assert(!foundry.applications.instances.get('morelord-craftworks-settings')?.rendered,'Close Craftworks settings before testing');
  const app=new App(),originalSet=game.settings.set,service=App.craftworks,originalSync=service.syncContent;
  try{
    await app.render({force:true});
    const input=app.element.querySelector('.ml-check[data-ml-check-state] input:not(:disabled)');
    assert(input,'An available pack checkbox is required');
    const label=input.closest('.ml-check').querySelector('[data-ml-check-label]');
    const before=input.checked;
    input.click();assert(label.textContent===(input.checked?'Enabled':'Disabled'),'Label reflects the unsaved checkbox change immediately');
    input.click();assert(input.checked===before && label.textContent===(before?'Enabled':'Disabled'),'Toggling back immediately restores the label');
    const button=app.element.querySelector('[data-action="save"]');
    assert(button.textContent.trim()==='Save Changes','Craftworks uses Save Changes');
    // Exercise actual controls without writing campaign settings or synchronizing content.
    game.settings.set=async()=>{throw Error('Regression save failure');};
    button.click();await until(()=>!app.saving);
    assert(app.rendered && !button.disabled,'Failed save stays open for retry');
    game.settings.set=async()=>{};
    let finish;
    service.syncContent=async()=>{await new Promise(resolve=>finish=resolve);};
    button.click();await until(()=>finish);
    assert(app.rendered && button.disabled,'Craftworks waits for sync before closing');
    finish();await until(()=>!app.saving);
    assert(!app.rendered,'Craftworks closes after successful save and sync');
  }finally{game.settings.set=originalSet;service.syncContent=originalSync;if(app.rendered)await app.close();}
}};

async function until(read){const end=Date.now()+15000;while(Date.now()<end){if(read())return;await new Promise(resolve=>setTimeout(resolve,25));}throw Error('Settings regression timed out');}
