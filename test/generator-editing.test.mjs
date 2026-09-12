import test from "node:test";
import assert from "node:assert/strict";

class Application {
  async _prepareContext() { return {}; }
  async _onRender() {}
}
globalThis.foundry = {
  applications: { api: { ApplicationV2: Application, HandlebarsApplicationMixin: Base => Base } },
  utils: { mergeObject: (a, b) => ({ ...a, ...b }), deepClone: structuredClone }
};
globalThis.CONFIG = { DND5E: { spellSchools: { evo: "Evocation", abj: "Abjuration" } } };
globalThis.game = { actors: [], i18n: { localize: value => value } };
globalThis.ui = { notifications: { warn: assert.fail, error: assert.fail } };

const { SpellScrollGeneratorApp } = await import("../scripts/ui/spell-scroll-generator-app.mjs");
const { PotionGeneratorApp } = await import("../scripts/ui/potion-generator-app.mjs");
const { RecipePickerApp } = await import("../scripts/ui/recipe-picker-app.mjs");
const { PotionGeneratorService } = await import("../scripts/potions/potion-generator-service.mjs");

const spells = [
  { uuid: "spell.a", name: "A", school: "evo", level: 1, sourceLabel: "Source A" },
  { uuid: "spell.b", name: "B", school: "abj", level: 1, sourceLabel: "Source B" }
];
const potions = [{ uuid: "potion.a", name: "Healing", rarity: "common", category: "healing", sourceLabel: "Source A" }];
const craftworks = {
  materialService: { getPartyRecipientInfo: async () => ({}) },
  spellScrollGenerator: { hasAccess: true, availableSpells: async () => spells, generate: async () => [...spells] },
  potionGenerator: { hasAccess: true, availableCounts: async () => ({}), availablePotions: async () => potions, generate: async () => [...potions] }
};

function controls(app, selectors) {
  const listeners = {};
  const nodes = Object.fromEntries(Object.entries(selectors).map(([selector, data]) => [selector, {
    ...data, addEventListener: (type, callback) => { listeners[`${selector}:${type}`] = callback; }
  }]));
  app.element = {
    querySelector: selector => nodes[selector],
    querySelectorAll: selector => nodes[selector] ? [nodes[selector]] : []
  };
  app.render = async () => {};
  return async (selector, type = "click") => listeners[`${selector}:${type}`]({ preventDefault() {}, currentTarget: nodes[selector] });
}

test("school availability counts selected schools, including none", async () => {
  const app = new SpellScrollGeneratorApp(craftworks);
  assert.equal((await app._prepareContext()).levels[1].available, 2);
  app.selectedSchools = new Set(["evo"]);
  assert.equal((await app._prepareContext()).levels[1].available, 1);
  app.selectedSchools.clear();
  assert.equal((await app._prepareContext()).levels[1].available, 0);
  const service = new PotionGeneratorService();
  service.availablePotions = async () => potions;
  assert.equal((await service.availableCounts({ categories: [] })).common, 0);
});

for (const [App, plural, item] of [[SpellScrollGeneratorApp, "scrolls", spells[0]], [PotionGeneratorApp, "potions", potions[0]]]) {
  test(`${plural}: generation opens a draft, duplicate removal keeps indexes and an empty draft can be refilled`, async () => {
    const app = new App(craftworks);
    app.counts = { 1: 1 };
    app.selectedSchools = new Set(["evo"]);
    const trigger = controls(app, {
      [`[data-action='generate-${plural}']`]: {},
      "[data-remove-result]": { dataset: { removeResult: "1" } },
      "[data-action='add-result']": {},
      "[name='recipient']": { value: "Actor.party" }
    });
    await app._onRender();
    await trigger(`[data-action='generate-${plural}']`);
    assert.equal((await app._prepareContext()).hasResult, true);
    app.result = [{ ...item }, { ...item }, { ...item }];
    await trigger("[name='recipient']", "change");
    await trigger("[data-remove-result]");
    assert.equal(app.result.length, 2);
    const group = (await app._prepareContext()).resultGroups[0];
    assert.deepEqual((group.spells ?? group.potions).map(row => row.resultIndex), [0, 1]);
    assert.equal(app.selectedRecipientUuid, "Actor.party");
    app.result = [];
    assert.equal((await app._prepareContext()).hasResult, true);
    const originalRender = RecipePickerApp.prototype.render;
    try {
      RecipePickerApp.prototype.render = async function () {
        const context = await this._prepareContext();
        assert.ok(context.sources.length);
        assert.ok(context.categories.length);
        await this.onSelect(this.catalog[0]);
      };
      await trigger("[data-action='add-result']");
      // The click listener starts the async picker; allow its selection to settle.
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(app.result[0].uuid, item.uuid);
    } finally { RecipePickerApp.prototype.render = originalRender; }
  });
}
