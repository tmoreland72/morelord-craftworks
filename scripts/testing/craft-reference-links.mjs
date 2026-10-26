import { runInGameTests, assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { CraftApp } from "../ui/craft-app.mjs";

export async function runCraftReferenceTests() {
  if (game.world?.id !== "dev1") throw new Error("Craft reference tests require verified Dev1.");
  const instances = foundry.applications.instances;
  const busy = ["morelord-craftworks-material-browser", "morelord-craftworks-recipes"].some(id => instances.get(id)?.rendered);
  return runInGameTests({ checks: [{
    id: "craftworks.craft-images-and-material-used-in",
    skip: !game.user.isGM ? "GM required for a disposable character fixture." : busy ? "Close Materials and Recipes before this check." : null,
    async run() {
      const api = game.modules.get("morelord-craftworks")?.api;
      const player = game.users.find(user => !user.isGM);
      assert(api && player, "Load Craftworks and a player user first.");
      const recipe = api.recipes.all().find(recipe => recipe.output?.img && recipe.requirementGroups?.some(group =>
        group.requirements?.some(requirement => requirement.match?.materialId && api.materials.get(requirement.match.materialId))));
      assert(recipe, "Load an enabled recipe with an explicit material ingredient and output image.");
      const materialId = recipe.requirementGroups.flatMap(group => group.requirements).find(requirement => requirement.match?.materialId && api.materials.get(requirement.match.materialId)).match.materialId;
      const waitFor = async (predicate, message = "Reference browser did not open after image activation.") => {
        for (let attempt = 0; attempt < 100; attempt++) {
          const value = predicate();
          if (value) return value;
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        throw new Error(message);
      };
      let actor, craft;
      try {
        actor = await Actor.create({ name: "Craft reference regression fixture", type: "character", ownership: { [player.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER } });
        await api.markedRecipes.set(actor, recipe.id, true);
        craft = new CraftApp(api, { id: "morelord-craftworks-reference-regression", recipeId: recipe.id, crafterActorUuid: actor.uuid, inventoryActorUuid: actor.uuid });
        await craft.render({ force: true });
        const output = craft.element.querySelector("[data-open-recipe-id]");
        assert(output, "Craft must render an accessible recipe image button.");
        output.click();
        const recipes = await waitFor(() => {
          const app = instances.get("morelord-craftworks-recipes");
          return app?.rendered && app.recipeIds?.has(recipe.id) && app;
        });
        assert(recipes.crafterUuid === actor.uuid, "Recipe navigation must preserve the crafter.");
        const material = craft.element.querySelector(`[data-material-id="${materialId}"]`);
        assert(material, "Craft must render an accessible material image button.");
        material.click();
        await waitFor(() => {
          const app = instances.get("morelord-craftworks-material-browser");
          return app?.rendered && app.focusMaterialId === materialId;
        });
        const organ = api.materials.get("drakkenheim-rare-organ");
        assert(organ, "Enable the Drakkenheim material catalog for the Recipes regression.");
        const matching = api.recipes.recipesUsingMaterial(organ.materialId);
        assert(matching.length, "Drakkenheim tag-based requirements must resolve to recipes.");
        await api.openMaterials({ materialId: organ.materialId });
        const browser = instances.get("morelord-craftworks-material-browser");
        const recipesButton = browser.element.querySelector(`[data-action='show-material-recipes'][data-material-id='${organ.materialId}']`);
        assert(recipesButton?.textContent.includes(`Recipes (${matching.length})`), "Materials must offer Recipes with the tag-matched count.");
        recipesButton.click();
        const opened = await waitFor(() => {
          const app = instances.get("morelord-craftworks-recipes");
          return app?.rendered && matching.every(recipe => app.recipeIds?.has(recipe.id)) && app;
        }, "Recipes did not open filtered to the material.");
        assert(opened.element.textContent.includes(matching[0].name), "Recipes must list the tag-matched recipe.");
      } finally {
        await craft?.close();
        for (const id of ["morelord-craftworks-material-browser", "morelord-craftworks-recipes"]) await instances.get(id)?.close();
        await actor?.delete();
      }
    }
  }] });
}
