import { runInGameTests, assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { HarvestPlayerApp } from "../ui/harvest-player-app.mjs";
import { harvestParticipantKey } from "../acquisition/harvest-participants.mjs";

// Opt-in GM test. Creates and removes only its own Actor/Item fixtures.
export async function runHarvestQuantityTests({ onRendered = async () => {} } = {}) {
  return runInGameTests({ checks: [{
    id: "craftworks.harvest-personal-party-quantities",
    skip: game.user.isGM ? null : "GM required to create disposable inventory fixtures.",
    async run() {
      const api = game.modules.get("morelord-craftworks")?.api;
      assert(api, "Craftworks is not ready.");
      const recipe = api.recipes.all({ includeDisabled: true }).find(recipe =>
        recipe.requirementGroups?.length === 1 && recipe.requirementGroups[0].requirements?.some(r =>
          r.match?.materialId && Number(r.quantity) >= 2 && api.materials.get(r.match.materialId)
        )
      );
      assert(recipe, "Load a recipe with an explicit material quantity of at least two before running this test.");
      const requirement = recipe.requirementGroups[0].requirements.find(r => r.match?.materialId && Number(r.quantity) >= 2 && api.materials.get(r.match.materialId));
      const material = api.materials.get(requirement.match.materialId);
      const fixtures = [];
      let app;
      try {
        const character = await Actor.create({ name: "Craftworks quantity test character", type: "character" });
        assert(character, "Character fixture creation was cancelled.");
        fixtures.push(character);
        const party = await Actor.create({ name: "Craftworks quantity test party", type: "group", system: { members: [{ actor: character.id }] } });
        assert(party, "Party fixture creation was cancelled.");
        fixtures.push(party);
        const unrelated = await Actor.create({ name: "Craftworks quantity test unrelated party", type: "group" });
        assert(unrelated, "Unrelated party fixture creation was cancelled.");
        fixtures.push(unrelated);
        const itemData = quantity => ({ name: material.name, type: "loot", system: { quantity }, flags: { "morelord-craftworks": { materialId: material.materialId } } });
        await character.createEmbeddedDocuments("Item", [itemData(1)]);
        const [partyItem] = await party.createEmbeddedDocuments("Item", [itemData(1)]);
        await unrelated.createEmbeddedDocuments("Item", [itemData(99)]);
        await api.markedRecipes.set(character, recipe.id, true);
        const tokenUuid = "harvest-quantity-fixture";
        const component = { id: "quantity-fixture", materialId: material.materialId, name: material.name, matched: true };
        const session = {
          id: foundry.utils.randomID(), gmUserId: game.user.id,
          harvestActorsByUser: { [game.user.id]: [character.uuid] },
          creatures: [{ tokenUuid, name: "Quantity Test Creature", components: [component] }],
          participants: { [harvestParticipantKey(character.uuid, tokenUuid)]: { status: "awaiting-claim", choices: [{ componentId: component.id }] } },
          results: []
        };
        app = new HarvestPlayerApp(api, session, character.uuid);
        await app.render({ force: true });
        const tag = () => app.element.querySelector(".ml-craftworks-harvest-recipe-tag");
        const expected = amount => `${amount}/${requirement.quantity}`;
        assert(tag()?.textContent.includes(`${recipe.name} ${expected(2)}`), "Harvest must display combined personal + party stock beside the marked recipe.");
        assert(app.element.querySelector('[data-action="claim"]'), "Fixture must display the actual component claim action.");
        assert(getComputedStyle(app.element).getPropertyValue("--ml-space-2").trim(), "Core styles must be loaded.");
        await onRendered(app, "wide");
        await partyItem.update({ "system.quantity": 2 });
        await app.render({ force: true });
        assert(tag()?.textContent.includes(expected(3)), "Rerender must reflect changed party stock without counting unrelated parties.");
        app.setPosition({ width: 520 });
        await onRendered(app, "compact");
        await api.markedRecipes.set(character, recipe.id, false);
        await app.render({ force: true });
        assert(!tag(), "Unmarked recipes must disappear from the harvest component.");
      } finally {
        await app?.close();
        for (const actor of fixtures.reverse()) await actor.delete();
      }
    }
  }] });
}
