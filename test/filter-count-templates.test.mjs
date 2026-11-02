import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("recipe, material, and settings templates no longer show those counts", () => {
  const recipes = read("../templates/recipe-browser.hbs");
  const materials = read("../templates/material-browser.hbs");
  const settings = read("../templates/craftworks-settings.hbs");
  const settingsApp = read("../scripts/ui/craftworks-settings-app.mjs");

  assert.equal(recipes.includes("<small>{{count}}</small>"), false);
  assert.equal(recipes.includes("{{recipeCount}}"), false);
  assert.equal(materials.includes("{{materialCount}}"), false);
  assert.match(materials, /Recipes \(\{\{recipeCount\}\}\)/);
  assert.equal(settings.includes("{{recipeCount}}"), false);
  assert.equal(settings.includes("active recipe(s)"), false);
  assert.match(settingsApp, /recipe\(s\) indexed/);
});
