import { runInGameTests, assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { connectionLayoutCheck } from "../../../morelord-core/scripts/testing/connection-layout.js";
import { POTION_CATEGORIES } from "../potions/potion-generator-service.mjs";

export async function runGeneratorLayoutTests() {
  return runInGameTests({ checks:[connectionLayoutCheck, ...['potion','spell-scroll','spellbook'].map(kind=>({
    id:`craftworks.${kind}-checkbox-layout`,
    async run() {
      const categories = POTION_CATEGORIES.map(row=>({...row,selected:true}));
      const schools = Object.entries(CONFIG.DND5E.spellSchools).map(([id,school])=>({id,label:game.i18n.localize(school.label ?? school),selected:true}));
      const content = await foundry.applications.handlebars.renderTemplate(`modules/morelord-craftworks/templates/${kind}-generator.hbs`,{hasAccess:true,categories,schools});
      const app = new foundry.applications.api.DialogV2({classes:['ml-window','ml-craftworks-module'],window:{title:`${kind} layout regression`},position:{width:820,height:700},content:`<div>${content}</div>`,buttons:[{action:'close',label:'Close'}]});
      try {
        await app.render({force:true});
        for (const width of [820,460]) {
          app.setPosition({width});
          app.element.querySelector('.ml-app').style.fontSize='20px';
          await new Promise(resolve=>requestAnimationFrame(resolve));
          const inputs = [...app.element.querySelectorAll('[data-potion-category],[data-spell-school]')];
          assert(inputs.length >= 5,'The test must render the category or school choices.');
          const labels = inputs.map(input=>input.closest('label'));
          for (const [index,label] of labels.entries()) {
            const rect = label.getBoundingClientRect();
            const bounds = label.parentElement.getBoundingClientRect();
            assert(rect.right <= bounds.right + 1, 'Checkbox labels must fit their container.');
            for (const other of labels.slice(index+1)) {
              const b = other.getBoundingClientRect();
              assert(!(rect.left < b.right-1 && rect.right > b.left+1 && rect.top < b.bottom-1 && rect.bottom > b.top+1),'Checkbox labels must never overlap.');
            }
          }
          const input = inputs[0];const initial=input.checked;
          labels[0].querySelector('span').click();
          assert(input.checked !== initial,'Clicking the option text must toggle its checkbox.');
          input.checked=initial;
          await globalThis.captureCheckboxLayout?.(`${kind}-${width}`,app.element);
        }
      } finally { await app.close(); }
    }
  }))] });
}
