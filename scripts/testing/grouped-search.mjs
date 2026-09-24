import { assert } from "../../../morelord-core/scripts/testing/in-game.js";
import { holdTestRollAnimations, untilRollCheck } from "../../../morelord-core/scripts/testing/roll-completion.js";

async function checkSearch({ capture = async () => {}, roll = false } = {}) {
  const api = game.modules.get("morelord-craftworks").api;
  const actors = [], messages = [];
  const gate = roll ? holdTestRollAnimations(message => actors.some(actor => actor.id === message.speaker?.actor)) : null;
  let session;
  try {
    for (const name of ["Grouped search fixture A", "Grouped search fixture B"]) actors.push(await Actor.create({ name, type: "character", system: { bonuses: { abilities: { skill: "100" } } } }));
    session = await api.requestDeleriumSearch("outer", actors.map(actor => actor.uuid));
    const cards = game.messages.filter(message => message.getFlag("morelord-core", "rollRequest")?.key === session.id);
    messages.push(...cards, ...game.messages.filter(message => message.getFlag("morelord-craftworks", "chatSearch")?.id === session.id));
    assert(cards.length === 1, "The entire search party receives one public request card.");
    const card = cards[0], entries = Object.keys(card.getFlag("morelord-core", "rollRequest").entries);
    assert(entries.length === 2 && !card.whisper.length && !card.blind, "Both characters belong to the public card.");
    for (const [index, key] of entries.entries()) {
      const until = Date.now() + 60000;
      let button;
      const control = roll ? '[data-ml-core-roll="normal"]:not([data-ml-roll-decline])' : '[data-ml-roll-decline]';
      while (!(button = document.querySelector(`[data-message-id="${card.id}"] [data-ml-roll-entry="${key}"] ${control}`)) && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 50));
      assert(button && !button.disabled, "The GM can use each character's separate response control.");
      if (roll && !index) {
        const choice=button.closest(".ml-card").querySelector("select");
        choice.add(new Option("Rejected fixture choice", "invalid-fixture-choice"));choice.value="invalid-fixture-choice";
        button.click();
        assert(!button.isConnected, "Even a submitted invalid choice immediately removes its row controls.");
        await untilRollCheck(() => document.querySelector(`[data-message-id="${card.id}"] [data-ml-roll-entry="${key}"] ${control}`), "A rejected roll restores its controls for retry.");
        assert(!card.getFlag("morelord-core", "rollRequest").entries[key].completed && !gate.held.size, "Rejected choices neither complete nor roll dice.");
        button=document.querySelector(`[data-message-id="${card.id}"] [data-ml-roll-entry="${key}"] ${control}`);
      }
      if (!index) await capture(card.id);
      button.click();
      assert(document.querySelector(`[data-message-id="${card.id}"] [data-ml-roll-entry="${key}"] .ml-roll-completed`), "The clicked row says Completed immediately, before any socket response or dice.");
      while (!card.getFlag("morelord-core", "rollRequest").entries[key].completed && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 50));
      assert(card.getFlag("morelord-core", "rollRequest").entries[key].completed, "The clicked character completes through the real socket handler.");
      let row;
      while (!(row = document.querySelector(`[data-message-id="${card.id}"] [data-ml-roll-entry="${key}"]`))?.querySelector(".ml-roll-completed") && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 50));
      assert(row?.querySelector(".ml-roll-completed")?.textContent === "Completed" && !row.querySelector("button, select"), "Completed rows replace all roll controls with plain status text.");
      assert(getComputedStyle(row.querySelector(".ml-roll-completed")).textAlign === "center", "Completed text is centered by Core styles.");
      if (roll) assert(gate.held.size === index + 1, "Another character can roll and receive acknowledgment while earlier dice are still held.");
      if (!index) assert(!card.getFlag("morelord-core", "rollRequest").entries[entries[1]].completed, "The second character stays pending.");
    }
    const record = messages.find(message => message.getFlag("morelord-craftworks", "chatSearch"));
    if (roll) {
      assert(record.getFlag("morelord-craftworks", "chatSearch").status !== "complete", "Outcomes remain pending while the dice are held.");
      gate.stop();
    }
    await untilRollCheck(() => record.getFlag("morelord-craftworks", "chatSearch").status === "complete"
      && game.messages.some(message => message.getFlag("morelord-craftworks", "chatSearchResult")?.sessionMessageId === record.id), "The outcome summary appears after animation completion.");
    const stored = record.getFlag("morelord-craftworks", "chatSearch");
    if (roll) await capture(card.id);
    assert(stored?.status === "complete" && Object.values(stored.participants).every(entry => entry.status === (roll ? "succeeded" : "declined")), "The grouped search finalizes with both independent responses.");
    const results = () => game.messages.filter(message => message.getFlag("morelord-craftworks", "chatSearchResult")?.sessionMessageId === record.id);
    assert(results().length === 1, "Completion posts one new result after the rolls, not just an update to an older message.");
    assert(Array.from(results()[0].whisper).length && !results()[0].rolls.length, `The summary preserves GM visibility without rerolling anything (recipients: ${Array.from(results()[0].whisper).length}, dice: ${results()[0].rolls.length}).`);
    assert(results()[0].content.includes(roll ? "Delerium Chip" : "No delerium found."), "Completion explicitly shows the earned rewards or no-loot outcome.");
    if (roll) {
      assert(stored.successes === 4 && stored.rewards.length === 2, "Actual native skill rolls resolve reward sources for four successes.");
      const result = results()[0];
      await capture(result.id);
      const end = Date.now() + 10000;
      let open;
      while (!(open = document.querySelector(`[data-message-id="${result.id}"] [data-ml-delerium-results]`)) && Date.now() < end) await new Promise(resolve => setTimeout(resolve, 50));
      assert(open, "The final card exposes the results action.");
      open.click();
      while (!foundry.applications.instances.get("morelord-craftworks-delerium-search-results")?.rendered && Date.now() < end) await new Promise(resolve => setTimeout(resolve, 50));
      const app = foundry.applications.instances.get("morelord-craftworks-delerium-search-results");
      assert(app?.rendered && app.session.id === session.id && app.session.rewards.length === 2, "The results action opens the saved rewards in the real results window.");
      await app.close();
    }
    await MorelordCore.socket.createChannel("craftworks.chat-search").executeAsUser("finalize", { messageId: record.id }, game.user.id);
    assert(results().length === 1, "Finalization retries cannot duplicate completion cards or roll results.");
  } finally {
    gate?.stop();
    const app = foundry.applications.instances.get("morelord-craftworks-delerium-search-results");
    if (app?.session?.id === session?.id) await app.close();
    if (session) {
      const recordIds = new Set(game.messages.filter(message => message.getFlag("morelord-craftworks", "chatSearch")?.id === session.id).map(message => message.id));
      const ids = game.messages.filter(message => message.getFlag("morelord-core", "rollRequest")?.key === session.id || message.getFlag("morelord-craftworks", "chatSearch")?.id === session.id || recordIds.has(message.getFlag("morelord-craftworks", "chatSearchResult")?.sessionMessageId) || (actors.some(actor => actor.id === message.speaker?.actor) && message.flavor?.startsWith("Delerium Search"))).map(message => message.id);
      if (ids.length) await ChatMessage.deleteDocuments(ids);
      api.sessions.delete(session.id);
    }
    for (const actor of actors) await actor.delete();
  }
}
export const groupedSearchCheck = { id: "craftworks.grouped-delerium-search", run: capture => checkSearch({ capture }) };
export const searchCompletionCheck = { id: "craftworks.delerium-roll-completion", run: capture => checkSearch({ capture, roll: true }) };
