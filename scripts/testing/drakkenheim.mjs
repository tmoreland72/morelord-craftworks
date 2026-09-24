import { assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { CraftworksSettingsApp } from "../ui/craftworks-settings-app.mjs";
import { LuckyFindsApp } from "../ui/lucky-finds-app.mjs";

const waitFor = async predicate => {
  const end = Date.now() + 180000;
  while (!predicate()) {
    if (Date.now() > end) throw new Error("Craftworks regression timed out.");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};
export const drakkenheimChecks = [{
  id: "craftworks.champion-and-settings-save-sync",
  async run() {
    const api = game.modules.get('morelord-craftworks').api;
    assert(game.user.isGM, "Run this regression as a GM in Dev1.");
    const original = new Map([...game.settings.settings.values()].filter(setting => setting.namespace === 'morelord-craftworks' && setting.scope === 'world')
      .map(setting => [setting.key, foundry.utils.deepClone(game.settings.get('morelord-craftworks', setting.key))]));
    const app = new CraftworksSettingsApp();
    try {
      await app.render({force:true});
      for (const id of ['phb','dmg']) {
        const card = app.element.querySelector(`[name="pack:${id}"]`)?.closest('.ml-card');
        assert([...card.querySelectorAll('.ml-badge')].some(badge => badge.textContent.trim() === 'Premium'), "PHB and DMG retain their Premium subscription badges separately from availability.");
      }
      for (const id of ['standard-core','srd-5.2','srd-5.1']) {
        const card = app.element.querySelector(`[name="pack:${id}"]`)?.closest('.ml-card');
        assert([...card.querySelectorAll('.ml-badge')].some(badge => badge.textContent.trim() === 'Standard'), "Craftworks Standard and SRD packs show Standard subscription badges.");
      }
      const pack = app.element.querySelector('[name="pack:monsters-of-drakkenheim"]')?.closest('.ml-card');
      assert(pack?.textContent.includes('Champion'), "Drakkenheim content card labels Champion access.");
      assert(pack.querySelector('h4').textContent === 'Drakkenheim', "Settings use the Drakkenheim umbrella label.");
      assert(pack.querySelectorAll('h5').length === 2, "Both official modules have separate subheaders.");
      assert(!pack.querySelector('.ml-callout'), "The old setup callout is removed.");
      assert(pack.textContent.includes('official source books'), "Official content requirement is visible.");
      const before = api.contentSync.diagnosticAttempts.at(-1);
      app.element.querySelector('[data-action="save"]').click();
      await waitFor(() => !app.rendered || api.contentSync.diagnosticAttempts.at(-1)?.status === 'failed');
      const attempt = api.contentSync.diagnosticAttempts.at(-1);
      assert(attempt !== before && attempt.status === 'completed', "Saving performs and awaits a fresh sync.");
      assert(!app.rendered, "Settings close after successful synchronization.");
    } finally {
      await app.close();
      for (const [key,value] of original) await game.settings.set('morelord-craftworks',key,value);
    }
  }
}, {
  id: "craftworks.lucky-finds-source-results",
  async run() {
    const api = game.modules.get('morelord-craftworks').api;
    const table = await api.luckyFinds.getTable();
    assert(table, "Installed Dungeons of Drakkenheim Lucky Finds table exists.");
    const results = [];
    for (const result of table.results) results.push(await api.luckyFinds.describe(result));
    assert(results.some(r => r.artisanTools && /gmroll 1d4/.test(r.text)), "Tools use a clickable 1d4 quantity.");
    assert(results.some(r => /Art Object \(25 GP\)/i.test(r.text) && /@UUID/.test(r.text)), "Result 12 links the DMG item.");
    assert(results.some(r => /Keoghtom/.test(r.text) && /@UUID/.test(r.text)), "Results 15–16 link the ointment.");
    assert(results.filter(r=>/delerium/i.test(r.text)).every(r=>r.text.includes('Compendium.drakkenheim-monsters.items.Item.')), "Delerium references use MoD Magic Items.");
    const app = new LuckyFindsApp(api,{total:20,results:results.filter(r=>r.scrollRarity === 'rare')});
    try {
      await app.render({force:true});
      assert(app.element.querySelector('[data-action="generate-scroll"]'), "Result 20 exposes the direct generator action.");
      assert(getComputedStyle(app.element.querySelector('p')).fontWeight === '400', "Lucky Finds uses Core's normal paragraph weight.");
    } finally { await app.close(); }
  }
}];
