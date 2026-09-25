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
    id: "craftworks.one-harvest-roll-per-session",
    async run() {
      assert(game.user.isGM, "GM required for disposable Harvest fixtures.");
      const material = api.materials.all()[0];
      assert(material, "An indexed material is required.");
      let actor, scene, app, session;
      const messages = new Set(game.messages.map(message => message.id));
      const originalRoll = api.adapter.rollSkill;
      let rolls = 0;
      try {
        actor = await Actor.create({ name: "Craftworks single-roll regression", type: "character" });
        scene = await Scene.create({ name: "Craftworks single-roll regression", active: false });
        const tokens = await scene.createEmbeddedDocuments("Token", [
          { name: "Harvest Success", x: 0, y: 0 }, { name: "Harvest Failure", x: 100, y: 0 }
        ]);
        const creatures = tokens.map((token, index) => ({ tokenUuid: token.uuid, name: token.name,
          dc: index ? 1000 : -1000, harvestMode: "drakkenheim", cr: 1,
          components: [{ id: `${token.id}-material`, materialId: material.materialId, name: material.name, componentName: material.name, matched: true }] }));
        session = await api.harvest.start({ creatureContexts: creatures, harvestActorsByUser: { [game.user.id]: [actor.uuid] },
          skipSkillChecks: [{ userId: game.user.id, actorUuid: actor.uuid }] });
        assert(!Object.keys(session.participants).length, "Legacy skip input must not grant automatic success.");
        api.adapter.rollSkill = async (who, skill, options) => {
          rolls++;
          return originalRoll.call(api.adapter, who, skill, { ...options, configure: false });
        };
        await api.socket.emit("harvest.open", { session, actorUuid: actor.uuid }, { targetUserId: game.user.id });
        app = foundry.applications.instances.get(`morelord-craftworks-harvest-player-${actor.id}`);
        assert(app instanceof HarvestPlayerApp, "Real Harvest window must open through its socket route.");
        const select = app.element.querySelector('[data-action="select-harvest-skill"]');
        select.value = "nat"; select.dispatchEvent(new Event("change"));
        await capture(app, "harvest-before");
        app.element.querySelector('[data-action="roll-harvest-checks"]').click();
        await until(() => !app.rolling && Object.keys(session.participants).length === 2, "Harvest did not resolve both creatures.");
        assert(rolls === 1, "The player must roll exactly once for the entire session.");
        const states = Object.values(session.participants);
        assert(states[0].total === states[1].total, "Every creature must use the same roll total.");
        assert(states[0].status === "awaiting-claim" && states[1].status === "failed", "The shared total must be compared against each creature DC.");
        const snapshot = JSON.stringify(session.participants);
        await api.socket.executeAsGm("harvest.batch-attempt", { sessionId: session.id, userId: game.user.id, actorUuid: actor.uuid, skillId: "nat", total: 9999, naturalD20: 20 }, { gmUserId: game.user.id });
        assert(JSON.stringify(session.participants) === snapshot, "Repeated submissions must not replace resolved outcomes.");
        await capture(app, "harvest-after");
        await app.close();
        await api.socket.emit("harvest.open", { session, actorUuid: actor.uuid }, { targetUserId: game.user.id });
        app = foundry.applications.instances.get(`morelord-craftworks-harvest-player-${actor.id}`);
        assert(app.element.querySelector('[data-action="roll-harvest-checks"]').disabled, "Reopening must not allow another roll.");
        assert(session.participants[harvestParticipantKey(actor.uuid, tokens[0].uuid)].total === session.harvestRolls[actor.uuid].total, "Authoritative roll must remain available on reopen.");
      } finally {
        api.adapter.rollSkill = originalRoll;
        await app?.close();
        if (session) api.sessions.delete(session.id);
        for (const message of game.messages.filter(message => !messages.has(message.id) && message.speaker?.actor === actor?.id)) await message.delete();
        await scene?.delete();
        await actor?.delete();
      }
    }
  }];
}
