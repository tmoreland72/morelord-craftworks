import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { annotateSetAsideMaterials, SET_ASIDE_LABEL, SET_ASIDE_NOTE } from "../scripts/crafting/set-aside-display.mjs";

const antitoxin = [{
  requirementRows: [
    { quantity: 2, materialId: "common-curative-reagent", displayLabel: "Common Curative Reagent", inventory: { available: 0, required: 2, ready: false } },
    { quantity: 1, materialId: "common-poisonous-reagent", displayLabel: "Common Poisonous Reagent", inventory: { available: 0, required: 1, ready: false } },
    { quantity: 1, materialId: "glass-vial", displayLabel: "Glass Vial", inventory: { available: 0, required: 1, ready: false } }
  ]
}];

test("an in-progress craft marks each set-aside material with the quantity held", () => {
  const result = annotateSetAsideMaterials(antitoxin, [
    { materialId: "common-curative-reagent", name: "Common Curative Reagent", quantity: 1 },
    { materialId: "common-curative-reagent", name: "Common Curative Reagent", quantity: 1 },
    { materialId: "common-poisonous-reagent", name: "Common Poisonous Reagent", quantity: 1 },
    { name: "Vial", itemData: { name: "Glass Vial" }, quantity: 1 }
  ]);
  assert.equal(result.materialsSetAside, true);
  assert.equal(result.setAsideNote, SET_ASIDE_NOTE);
  assert.deepEqual(result.setAsideExtras, []);
  const rows = result.requirementGroupRows[0].requirementRows;
  assert.equal(rows[0].setAsideLabel, SET_ASIDE_LABEL);
  assert.equal(rows[0].setAsideQuantity, 2);
  assert.equal(rows[1].setAsideQuantity, 1);
  assert.equal(rows[2].setAsideQuantity, 1);
  assert.equal(rows[2].setAsideLabel, SET_ASIDE_LABEL);
});

test("only the chosen alternative is marked set aside", () => {
  const groups = [{
    requirementRows: [{
      quantity: 1,
      displayLabel: "Choose one",
      alternativeRows: [
        { quantity: 1, materialId: "spine", displayLabel: "Spine" },
        { quantity: 1, materialId: "ribs", displayLabel: "Ribs" }
      ]
    }]
  }];
  const result = annotateSetAsideMaterials(groups, [{ materialId: "ribs", name: "Ribs", quantity: 1 }]);
  const [row] = result.requirementGroupRows[0].requirementRows;
  assert.equal(row.setAside, undefined);
  assert.equal(row.alternativeRows[0].setAside, undefined);
  assert.equal(row.alternativeRows[1].setAsideQuantity, 1);
  assert.equal(row.alternativeRows[1].setAsideLabel, SET_ASIDE_LABEL);
});

test("a craft that has not reserved materials does not show the set-aside note", () => {
  const result = annotateSetAsideMaterials(antitoxin, []);
  assert.equal(result.materialsSetAside, false);
  assert.equal(result.setAsideNote, "");
  assert.equal(result.requirementGroupRows[0].requirementRows[0].setAside, undefined);
});

test("the recipe card templates show the set-aside badge and note", () => {
  for (const file of ["templates/craft.hbs", "templates/partials/craft-card.hbs"]) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.match(text, /materialsSetAside/);
    assert.match(text, /Set aside for this craft|setAsideLabel/);
    assert.match(text, /setAsideQuantity/);
    assert.match(text, /setAsideNote/);
  }
});
