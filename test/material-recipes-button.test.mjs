import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

globalThis.foundry = { applications: { api: {
  ApplicationV2: class { async _prepareContext() { return {}; } async _onRender() {} async close() {} },
  HandlebarsApplicationMixin: Base => Base
} }, utils: { mergeObject: (base, update) => ({ ...base, ...update }) } };
globalThis.canvas = { tokens: { controlled: [] } };

const { MaterialBrowserApp } = await import("../scripts/ui/material-browser-app.mjs");
const { MODULE_ID } = await import("../scripts/constants.mjs");

const material = {
  materialId: "drakkenheim-rare-organ",
  name: "Organ (Rare)",
  packId: "monsters-of-drakkenheim",
  rarity: "rare",
  category: "drakkenheim-organ",
  tags: ["drakkenheim-component-organ"],
  price: { value: 0 }
};
const known = { id: "potion", name: "Potion of Healing" };
const hidden = { id: "amulet", name: "Amulet of Incineration" };

function appFor({ isGM, recipes }) {
  const calls = [];
  const api = {
    materials: { all: () => [material], get: id => id === material.materialId ? material : null },
    contentPacks: {
      enabled: ({ capability } = {}) => capability === "materials"
        ? [{ id: "monsters-of-drakkenheim", label: "Monsters of Drakkenheim" }]
        : [],
      get: () => ({ label: "Monsters of Drakkenheim" }),
      isEnabled: () => true
    },
    recipes: {
      recipesUsingMaterial: id => id === material.materialId ? recipes : [],
      recipesProducingMaterial: () => []
    },
    openRecipes: async options => { calls.push(options); }
  };
  globalThis.game = {
    user: { isGM },
    actors: [],
    settings: { get: (_module, key) => key === "hiddenRecipeIds" ? JSON.stringify(["amulet"]) : "[]" }
  };
  const browser = new MaterialBrowserApp(api);
  const button = {
    dataset: { materialId: material.materialId },
    addEventListener: (_event, callback) => { button.callback = callback; }
  };
  browser.element = {
    querySelector: () => null,
    querySelectorAll: selector => selector === "[data-action='show-material-recipes']" ? [button] : [],
    addEventListener() {}
  };
  browser.rendered = true;
  return { browser, button, calls };
}

test("Recipes opens the enabled recipes that accept the material, including the focus note", async () => {
  const { browser, button, calls } = appFor({ isGM: true, recipes: [known, hidden] });
  const context = await browser._prepareContext({});
  assert.equal(context.materials[0].recipeCount, 2);
  await browser._onRender(context, {});
  await button.callback({ preventDefault() {}, stopPropagation() {} });
  assert.deepEqual(calls, [{
    recipeIds: ["potion", "amulet"],
    crafterActorUuid: null,
    recipeFocusNote: "Showing 2 recipes that use Organ (Rare)."
  }]);
  assert.equal(MODULE_ID, "morelord-craftworks");
});

test("players only receive Recipes for materials they are allowed to see", async () => {
  const { browser, button, calls } = appFor({ isGM: false, recipes: [known, hidden] });
  const context = await browser._prepareContext({});
  assert.equal(context.materials[0].recipeCount, 1);
  await browser._onRender(context, {});
  await button.callback({ preventDefault() {}, stopPropagation() {} });
  assert.equal(calls[0].recipeIds.join(), "potion");
  assert.equal(calls[0].recipeFocusNote, "Showing 1 recipe that uses Organ (Rare).");
});

test("material cards replace the inline Used in line with the Recipes button", () => {
  const template = readFileSync(new URL("../templates/material-browser.hbs", import.meta.url), "utf8");
  assert.match(template, /data-action="show-material-recipes"/);
  assert.match(template, /Recipes \(\{\{recipeCount\}\}\)/);
  assert.doesNotMatch(template, /Used in:/);
});
