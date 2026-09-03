import test from "node:test";
import assert from "node:assert/strict";
import { MM_RECIPES } from "../data/packs/mm/recipes.mjs";

test("Monsters of Drakkenheim defines every Appendix E SRD recipe tier", () => {
  assert.equal(MM_RECIPES.length, 19);
  assert.equal(new Set(MM_RECIPES.map(recipe => recipe.id)).size, 19);
  assert.ok(MM_RECIPES.every(recipe =>
    recipe.packId === "monsters-of-drakkenheim"
    && recipe.source.section === "Appendix E: SRD Recipes"
    && recipe.craft.checkRequired === false
    && recipe.craft.hoursRequired === 8
    && recipe.requirementGroups[0].requirements.length > 0
  ));
});

test("enhancement tiers use the generic DMG/SRD 5.2 output documents", () => {
  const expected = new Map([
    ["Armor", "Armor, +1, +2, or +3"],
    ["Shield", "Shield, +1, +2, or +3"],
    ["Weapon", "Weapon, +1, +2, or +3"]
  ]);

  for (const [family, outputName] of expected) {
    const recipes = MM_RECIPES.filter(recipe =>
      new RegExp(`^${family} \\+[123]$`).test(recipe.name)
    );

    assert.equal(recipes.length, 3);
    for (const recipe of recipes) {
      assert.equal(recipe.output.label, outputName);
      assert.deepEqual(
        recipe.output.sourceCandidates.map(candidate => candidate.packId),
        ["phb", "dmg", "srd-5.2"]
      );
      assert.ok(recipe.output.sourceCandidates.every(candidate =>
        candidate.name === outputName
      ));
    }
  }
});

test("healing potions may fall back to SRD 5.1", () => {
  const healing = MM_RECIPES.filter(recipe =>
    /^Potion of (?:Greater |Superior |Supreme )?Healing$/.test(recipe.name)
  );

  assert.equal(healing.length, 4);
  assert.ok(healing.every(recipe =>
    recipe.output.sourceCandidates.at(-1).sourceBook === "SRD 5.1"
  ));
});
