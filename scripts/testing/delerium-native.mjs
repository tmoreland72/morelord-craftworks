import { assert } from "../../../morelord-core/scripts/testing/in-game.js";
export const deleriumNativeCheck = {
  id: "craftworks.delerium-native-skill-choices",
  async run() {
    assert(game.user.isGM, "GM required for disposable search fixtures.");
    const api = game.modules.get("morelord-craftworks").api;
    const originalMessages = new Set(game.messages.map(message => message.id));
    let actor, session, recordId;
    const until = async predicate => { const end = Date.now() + 20000; while (!predicate()) { if (Date.now() > end) throw new Error("Delerium native-roll regression timed out."); await new Promise(resolve => setTimeout(resolve, 50)); } };
    try {
      actor = await Actor.create({ name: "Delerium native roll regression", type: "character", system: { abilities: { int: { value: 16 } } } });
      session = await api.requestDeleriumSearch("outer", [actor.uuid]);
      recordId = game.messages.find(message => message.getFlag("morelord-craftworks", "chatSearch")?.id === session.id)?.id;
      const app = foundry.applications.instances.get(`morelord-craftworks-delerium-search-player-${actor.id}`);
      assert(app?.rendered, "Search must open a character-specific Gather-style window.");
      assert(!game.messages.some(message => message.getFlag("morelord-core", "rollRequest")?.key === session.id), "New searches must not create a chat roll card.");
      const row = () => app.element;
      const { GatherPlayerApp } = await import("../ui/gather-player-app.mjs");
      const gather = new GatherPlayerApp(api, { ...session, terrain: session.zone }, actor.uuid);
      try {
        await gather.render({ force: true });
        for (const selector of ['.ml-craftworks-player-skill-grid', '.ml-craftworks-player-actor', '.ml-form-footer']) {
          assert(row().querySelector(selector)?.className === gather.element.querySelector(selector)?.className, `Search must match Gather's ${selector} markup.`);
        }
        assert(row().querySelectorAll('.ml-craftworks-player-skill-grid button[data-action="roll"]').length === 3, "Search must present three skill buttons in Gather's skill grid.");
        if (window.captureCraftworks) await window.captureCraftworks("delerium-gather-reference", gather.id);
      } finally { await gather.close(); }
      for (const width of [680, 460]) {
        app.setPosition({ width, left: 50, top: 50 });
        await new Promise(resolve => setTimeout(resolve, 200));
        app.setPosition({ width, left: 50, top: 50 });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        assert(app.element.querySelector('.window-content').scrollWidth <= app.element.querySelector('.window-content').clientWidth + 1, "The Gather-style search window must not overflow horizontally.");
        if (window.captureCraftworks) await window.captureCraftworks(`delerium-gather-window-${width}`, app.id);
      }
      const button = row().querySelector('[data-action="roll"][data-skill="arc"]');
      const bonus = Number(actor.system.skills.arc.total ?? actor.system.skills.arc.mod);
      assert(button.textContent.includes("Arcana") && button.textContent.includes(bonus >= 0 ? `+${bonus}` : String(bonus)), "The Arcana button must display this character's bonus.");
      const previous = new Set(foundry.applications.instances.keys());
      button.click();
      await until(() => [...foundry.applications.instances.values()].some(app => !previous.has(app.id) && app.rendered));
      const dialog = [...foundry.applications.instances.values()].find(app => !previous.has(app.id) && app.rendered);
      assert(dialog, "Clicking a skill must open its native D&D5e roll dialog on this client.");
      if (window.captureCraftworks) await window.captureCraftworks("delerium-native-dialog", dialog.id);
      await dialog.close();
      await new Promise(resolve => setTimeout(resolve, 150));
      const entry = () => ({ completed: Boolean(app.searchState) });
      assert(!entry().completed, "Cancelling native dice must leave the request pending.");
      const nativeRoll = actor.rollSkill;
      let calls = 0;
      actor.rollSkill = function(config, dialogConfig, messageConfig) {
        calls++;
        assert(dialogConfig.configure === true, "The search must request a configurable native skill roll.");
        return nativeRoll.call(this, config, { ...dialogConfig, configure: false }, messageConfig);
      };
      row().querySelector('[data-action="roll"][data-skill="arc"]').click();
      await until(() => entry().completed);
      assert(calls === 1, "The GM fallback must resolve one native roll without duplicate dice.");
      const record = game.messages.find(message => message.getFlag("morelord-craftworks", "chatSearch")?.id === session.id);
      assert(record.getFlag("morelord-craftworks", "chatSearch").participants[`actor:${actor.id}`]?.total != null, "The native result must reach the saved search.");
      await app.close();
      api.sessions.delete(session.id);
    } finally {
      for (const message of game.messages.filter(message => !originalMessages.has(message.id) && (message.getFlag("morelord-craftworks", "chatSearch")?.selectedCharacterUuids?.includes(actor?.uuid)
        || message.getFlag("morelord-craftworks", "chatSearchRoll")?.actorUuid === actor?.uuid
        || Object.values(message.getFlag("morelord-core", "rollRequest")?.entries ?? {}).some(entry => entry.actorUuid === actor?.uuid)
        || (recordId && message.getFlag("morelord-craftworks", "chatSearchResult")?.sessionMessageId === recordId)))) await message.delete();
      await foundry.applications.instances.get(`morelord-craftworks-delerium-search-player-${actor?.id}`)?.close();
      if (session) api.sessions.delete(session.id);
      await actor?.delete();
    }
  }
};
