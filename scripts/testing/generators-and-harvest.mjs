import { assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { SpellScrollGeneratorApp } from "../ui/spell-scroll-generator-app.mjs";
import { MagicItemGeneratorApp } from "../ui/magic-item-generator-app.mjs";
import { HarvestPlayerApp } from "../ui/harvest-player-app.mjs";
import { harvestParticipantKey } from "../acquisition/harvest-participants.mjs";

async function until(predicate, message) {
  const end = Date.now() + 30000;
  while (!predicate()) {
    if (Date.now() > end) throw new Error(message);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

export function generatorAndHarvestChecks({ capture = async () => {} } = {}) {
  const api = game.modules.get("morelord-craftworks")?.api;
  return [{
    id: "craftworks.scroll-level-or-rarity",
    async run() {
      assert(api?.spellScrollGenerator.hasAccess, "Premium scroll access is required.");
      const app = new SpellScrollGeneratorApp(api);
      try {
        await app.render({ force: true });
        assert(app.element.querySelectorAll("[data-scroll-count]").length === 10, "Default mode must show ten spell-level quantities.");
        const levelInput = app.element.querySelector('[data-scroll-count="4"]');
        const stepper = levelInput.closest('[data-count-stepper]');
        stepper.querySelector('[data-count-adjust="-1"]').click();
        assert(levelInput.value === "0", "Decrement must stop at zero.");
        stepper.querySelector('[data-count-adjust="1"]').click();
        assert(levelInput.value === "1" && app.counts[4] === 1, "Increment must update the stored count.");
        assert(app.element.querySelector('fieldset').compareDocumentPosition(app.element.querySelector('[name="scrollCountMode"]')) & Node.DOCUMENT_POSITION_FOLLOWING, "Generate By must follow schools.");
        levelInput.value = "2";
        levelInput.dispatchEvent(new Event("change"));
        const mode = app.element.querySelector('[name="scrollCountMode"]');
        mode.value = "rarity"; mode.dispatchEvent(new Event("change"));
        await until(() => app.element.querySelectorAll("[data-scroll-count]").length === 5, "Rarity controls did not render.");
        const input = app.element.querySelector('[data-scroll-count="uncommon"]');
        input.value = "3"; input.dispatchEvent(new Event("change"));
        await capture(app, "scroll-rarity");
        app.element.querySelector('[data-action="generate-scrolls"]').click();
        await until(() => app.hasDraft && app.element.querySelector('[data-action="reroll-scrolls"]'), "Scroll generation failed.");
        assert(app.result.length === 3 && app.result.every(item => [2, 3].includes(item.level)), "Three uncommon scrolls must be levels 2–3.");
        const before = app.result;
        app.element.querySelector('[data-action="reroll-scrolls"]').click();
        await until(() => app.result !== before, "Scroll reroll failed.");
        assert(app.result.length === 3 && app.result.every(item => [2, 3].includes(item.level)), "Reroll must retain rarity mode and quantities.");
        await until(() => app.element.querySelector('[data-action="edit-scroll-options"]'), "Scroll result controls did not finish rendering.");
        app.element.querySelector('[data-action="edit-scroll-options"]').click();
        await until(() => app.element.querySelector('[name="scrollCountMode"]'), "Edit Options did not restore scroll options.");
        const select = app.element.querySelector('[name="scrollCountMode"]');
        select.value = "level"; select.dispatchEvent(new Event("change"));
        await until(() => app.element.querySelectorAll("[data-scroll-count]").length === 10, "Level controls did not return.");
        assert(app.element.querySelector('[data-scroll-count="4"]').value === "2", "Switching modes must retain separate quantities.");
      } finally { await app.close(); }
    }
  }, {
    id: "craftworks.magic-item-vendor-stock",
    async run() {
      assert(api?.magicItemGenerator.hasAccess, "Premium magic item access is required.");
      const app = new MagicItemGeneratorApp(api);
      const messageIds = new Set(game.messages.map(message => message.id));
      try {
        await app.render({ force: true });
        assert(app.element.querySelectorAll("[data-magic-category]").length === 9, "All magic item categories must render.");
        const catalog = await api.magicItemGenerator.availableItems({ categories: ["weapon"] });
        const item = catalog.find(item => item.rarity === "uncommon") ?? catalog[0];
        assert(item, "Enable a compendium with magic weapons before running this check.");
        app.selectedCategories = new Set(["weapon"]);
        app.selectedRarity = item.rarity;
        await app.render({ force: true });
        await capture(app, "magic-item-options");
        app.element.querySelector('[data-action="generate-stock"]').click();
        await until(() => app.hasDraft && app.element.querySelector('[data-remove-stock]'), "Magic item generation failed.");
        assert(app.result.length === 1 && app.result.every(row => row.category === "weapon" && row.rarity === item.rarity), "Generated item must honor category and rarity.");
        const link = app.element.querySelector('a[data-uuid]');
        assert((await fromUuid(link.dataset.uuid))?.documentName === "Item", "Stock links must resolve real compendium items.");
        assert(!app.element.querySelector('input[type="number"]'), "Results must have no quantity controls.");
        app.element.querySelector('[data-action="add-item"]').click();
        await until(() => document.querySelector('[data-select-row]'), "Add Item picker did not open.");
        document.querySelector('[data-select-row]').click();
        await until(() => app.result.length === 2 && app.element.querySelectorAll('[data-remove-stock]').length === 2, "Selected item was not added.");
        app.element.querySelector('[data-remove-stock="1"]').click();
        await until(() => app.result.length === 1 && app.element.querySelectorAll('[data-remove-stock]').length === 1, "Remove did not update the draft.");
        await capture(app, "magic-item-stock");
        app.element.querySelector('[data-action="share-stock"]').click();
        await until(() => game.messages.some(message => !messageIds.has(message.id) && message.content.includes("Generated Magic Items")), "Vendor stock chat was not posted.");
        const message = game.messages.find(message => !messageIds.has(message.id) && message.content.includes("Generated Magic Items"));
        assert(message.content.includes(app.result[0].uuid), "Chat must preserve item links.");
        app.element.querySelector('[data-action="edit-options"]').click();
        await until(() => app.element.querySelector('[name="magicRarity"]'), "Go Back did not restore options.");
        assert(!app.element.querySelector('input[type="number"], [name="vendorName"], [name="allowDuplicates"]'), "Options must have no quantity, vendor, or duplicate controls.");
      } finally {
        await app.close();
        for (const message of game.messages.filter(message => !messageIds.has(message.id) && message.content.includes("Generated Magic Items"))) await message.delete();
      }
    }
  }, {
    id: "craftworks.harvest-creature-walkthrough",
    async run() {
      assert(game.user.isGM, "GM required for disposable Harvest fixtures.");
      const material = api.materials.all()[0];
      assert(material, "An indexed material is required.");
      let actor, other, scene, app, gmApp, session;
      const messages = new Set(game.messages.map(message => message.id));
      const originalRoll = api.adapter.rollSkill;
      let rolls = 0;
      try {
        actor = await Actor.create({ name: "Harvest walkthrough regression", type: "character" });
        other = await Actor.create({ name: "Harvest skip regression", type: "character" });
        scene = await Scene.create({ name: "Harvest walkthrough regression", active: false });
        const tokens = await scene.createEmbeddedDocuments("Token", [
          { name: "Harvest Success", x: 0, y: 0 }, { name: "Harvest Failure", x: 100, y: 0 }, { name: "Drakkenheim Parts", x: 200, y: 0 }
        ]);
        const creatures = tokens.map((token, index) => ({ tokenUuid: token.uuid, name: token.name,
          dc: index ? 1000 : -1000, harvestMode: index === 2 ? "drakkenheim" : "kibbles", cr: 1,
          components: [{ id: token.id + "-material", materialId: material.materialId, name: material.name,
            componentName: material.name, quantity: 2, matched: true }] }));
        session = await api.harvest.start({ creatureContexts: creatures, harvestActorsByUser: { [game.user.id]: [actor.uuid, other.uuid] } });
        assert(session.rollMode === "creature", "New sessions must use per-creature rolls.");
        gmApp = await api.openHarvest();
        await gmApp.setSession(session);
        api.adapter.rollSkill = async (who, skill, options) => {
          rolls++;
          return originalRoll.call(api.adapter, who, skill, { ...options, configure: false });
        };
        const open = async who => {
          await api.socket.emit("harvest.open", { session, actorUuid: who.uuid }, { targetUserId: game.user.id });
          app = foundry.applications.instances.get("morelord-craftworks-harvest-player-" + who.id);
          assert(app instanceof HarvestPlayerApp, "Character window must open through its real socket route.");
        };
        const roll = async who => {
          const index = session.participantProgress[who.uuid] ?? 0;
          const select = app.element.querySelector('[data-action="select-harvest-skill"]');
          select.value = "nat"; select.dispatchEvent(new Event("change"));
          app.element.querySelector('[data-action="roll-harvest-checks"]').click();
          await until(() => !app.rolling && api.harvest.getParticipant(session.id, who.uuid, tokens[index].uuid), "Creature roll did not resolve.");
        };
        const claim = async who => {
          app.element.querySelector('[data-action="claim"]:not(:disabled)').click();
          await until(() => session.results.some(result => result.actorUuid === who.uuid), "Claim did not reach the GM.");
          await until(() => app.element.querySelector('[data-action="next-creature"]:not(:disabled)') || app.element.querySelector('[data-action="done-creature"]'), "Claim controls did not update.");
        };
        const next = async index => {
          app.element.querySelector('[data-action="next-creature"]').click();
          await until(() => !app.navigating && session.participantProgress[actor.uuid] === index, "Next did not persist the page position.");
        };
        await open(actor);
        assert(app.element.querySelectorAll('[data-creature-token]').length === 1, "Only one creature must be displayed.");
        assert(app.element.querySelector('[data-action="next-creature"]').disabled, "Next must wait for this creature's check and claims.");
        assert(!app.element.querySelector('[data-action="done-creature"]'), "Done belongs on the final creature.");
        await capture(app, "harvest-walkthrough-before");
        await roll(actor); await claim(actor);
        assert(rolls === 1 && session.results[0].quantity === 2, "The first page must roll once and preserve component quantity.");
        assert(!(session.completedParticipantIds ?? []).includes(actor.uuid), "Claims alone must not mark the player completed.");
        await next(1); await app.close(); await open(actor);
        assert(app.element.querySelector('[data-creature-token]').dataset.creatureToken === tokens[1].uuid, "Reopening must restore the current creature.");
        assert(app.element.querySelector('aside').textContent.includes(material.name), "The left panel must retain this character's claims.");
        await roll(actor);
        assert(rolls === 2 && api.harvest.getParticipant(session.id, actor.uuid, tokens[1].uuid).status === "failed", "The second non-Drakkenheim creature must get its own roll.");
        await next(2);
        assert(!app.element.querySelector('[data-action="roll-harvest-checks"]'), "Drakkenheim must open directly to claims.");
        assert(!app.element.querySelector('[data-action="next-creature"], [data-action="skip-creature"]'), "The final page must have only Done navigation.");
        assert(app.element.querySelector('[data-action="claim"]:not(:disabled)'), "Drakkenheim components must be immediately claimable.");
        await capture(app, "harvest-walkthrough-final");
        app.element.querySelector('[data-action="done-creature"]').click();
        await until(() => !app.rendered && session.completedParticipantIds?.includes(actor.uuid), "Done did not tell the GM this player is completed.");
        assert(gmApp.element.querySelector('.ml-craftworks-harvest-player-progress-row').textContent.includes("Harvesting Completed"), "The GM progress row must show completion.");
        assert(session.results.length === 1 && !actor.items.size, "Done must retain reservations without awarding inventory.");
        await open(actor);
        assert(app.element.textContent.includes("Harvesting Completed") && !app.element.querySelector('[data-action="claim"]'), "Completed players cannot claim again after reopening.");
        await app.close(); await open(other);
        assert(!app.element.querySelector('aside').textContent.includes(material.name), "One user's character windows must keep their ledgers separate.");
        await roll(other); await claim(other);
        app.element.querySelector('[data-action="skip-creature"]').click();
        await until(() => !app.rendered && session.completedParticipantIds?.includes(other.uuid), "Skip Remaining did not tell the GM this player is completed.");
        assert(session.results.length === 2, "Skip Remaining must preserve existing claims.");
        const count = session.completedParticipantIds.length;
        await api.socket.executeAsGm("harvest.advance", { sessionId: session.id, userId: game.user.id, actorUuid: other.uuid,
          creatureTokenUuid: tokens[0].uuid, action: "skip" }, { gmUserId: game.user.id });
        assert(session.completedParticipantIds.length === count, "Repeated completion must be idempotent.");
        await open(other);
        assert(!app.element.querySelector('[data-action="roll-harvest-checks"]'), "Skipped characters must stay completed after reopening.");
        await capture(app, "harvest-walkthrough-completed");
      } finally {
        api.adapter.rollSkill = originalRoll;
        await app?.close(); await gmApp?.close();
        if (session) api.sessions.delete(session.id);
        for (const message of game.messages.filter(message => !messages.has(message.id) && [actor?.id, other?.id].includes(message.speaker?.actor))) await message.delete();
        await scene?.delete(); await other?.delete(); await actor?.delete();
      }
    }
  }];
}
