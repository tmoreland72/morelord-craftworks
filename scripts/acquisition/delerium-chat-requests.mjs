import { DeleriumSearchResultsApp } from "../ui/delerium-search-results-app.mjs";
import { rollAuthority } from "../../../morelord-core/scripts/services/chat-roll-requests.js";
import { afterDiceAnimation } from "../../../morelord-core/scripts/services/dice-animation.js";
const ID = "morelord-craftworks";
const escape = value => foundry.utils.escapeHTML(String(value ?? ""));

export function initializeDeleriumChatRequests(api) {
  const requests = MorelordCore.chatRequests;
  const channel = MorelordCore.socket.createChannel("craftworks.chat-search");
  const rollMessages = record => game.messages.filter(message => message.getFlag(ID, "chatSearchRoll")?.sessionMessageId === record.id);
  const summary = session => `<section class="ml-chat-card ml-stack"><h3>Delerium Search · ${escape(session.zone.name)}</h3><dl class="ml-data-list">${Object.values(session.participants).map(entry => `<div><dt>${escape(game.actors.get(entry.actorUuid?.split(".").at(-1))?.name ?? "Missing character")}</dt><dd>${escape(entry.total ?? "—")} · ${entry.status === "declined" ? "Declined" : entry.status === "succeeded" ? "Pass" : "Fail"}</dd></div>`).join("")}</dl><p>${session.successes} successes · ${session.failures} failures</p><p>${session.status === "complete" ? session.randomEncounter ? "Random encounter required." : "No random encounter triggered." : "Waiting for search rolls."}</p>${session.status === "complete" ? `<p>${session.rewards.map(reward => `${escape(reward.formula)} ${escape(reward.name)}`).join("<br>") || "No delerium found."}</p>${session.result ? `<p>Awarded to ${escape(session.result.recipientName)}.</p>` : ""}<button type="button" data-ml-delerium-results>${session.randomEncounter ? "Open Search Results / Encounter" : "Open Search Results"}</button>` : '<button type="button" data-ml-delerium-finalize>Finalize Search</button>'}</section>`;
  async function finishSearch(record, session) {
    if (rollMessages(record).some(message => message._dice3danimating)) throw new Error("Wait for the search dice to finish before opening results.");
    if (!session.selectedCharacterUuids.every(uuid => Object.values(session.participants).some(entry => entry.actorUuid === uuid))) throw new Error("Each character must roll or decline before finalizing.");
    if (session.status !== "complete") await api.deleriumSearch.finalize(session.id);
    const whisper = game.users.filter(user => user.isGM).map(user => user.id);
    await record.update({ content: summary(session), whisper, blind: false, [`flags.${ID}.chatSearch`]: foundry.utils.deepClone(session) });
    let result = game.messages.find(message => message.author?.isGM && message.getFlag(ID, "chatSearchResult")?.sessionMessageId === record.id);
    if (result) await result.update({ content: summary(session), whisper, blind: false });
    else result = await ChatMessage.create({ content: summary(session), whisper, blind: false,
      flags: { [ID]: { chatSearchResult: { sessionMessageId: record.id } } } }, { messageMode: "gm" });
    return result;
  }
  function scheduleSummary(record) {
    void afterDiceAnimation(rollMessages(record), async () => {
      if (!game.messages.get(record.id) || rollMessages(record).some(message => message._dice3danimating)) return;
      const session = api.sessions.import(record.getFlag(ID, "chatSearch"));
      if (session.selectedCharacterUuids.every(uuid => Object.values(session.participants).some(entry => entry.actorUuid === uuid))) await finishSearch(record, session);
      else await record.update({ content: summary(session) });
    }, "craftworks.delerium").catch(error => ui.notifications.warn(`Search rolls recorded. Use Finalize Search to retry: ${error.message}`));
  }
  requests.register("craftworks.delerium", async ({ sessionMessageId }, context) => {
    const record = game.messages.get(sessionMessageId);
    const stored = record?.author?.isGM && record.getFlag(ID, "chatSearch");
    if (!stored || !stored.selectedCharacterUuids.includes(context.actor?.uuid)) return { accepted: false, reason: "This search is unavailable." };
    const session = api.sessions.import(stored);
    const userId = `actor:${context.actor.id}`;
    if (!session.participants[userId]) {
      const values = { sessionId: session.id, userId, actorUuid: context.actor.uuid };
      if (context.choice === "decline") api.deleriumSearch.decline(values);
      else {
        if (!api.deleriumSearch.getSkillOptions().some(skill => skill.id === context.choice)) throw new Error("Choose a search skill.");
        const { roll } = await MorelordCore.rolls.skill(context.actor, context.choice, { dc: session.zone.dc, configure: false, create: false, advantage: context.mode === "adv", disadvantage: context.mode === "dis" });
        if (!Number.isFinite(roll?.total)) throw new Error("The search roll did not return a total.");
        api.deleriumSearch.attempt({ ...values, skillId: context.choice, total: roll.total, naturalD20: MorelordCore.rolls.naturalD20(roll) });
        await record.setFlag(ID, "chatSearch", foundry.utils.deepClone(session));
        await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: context.actor }), flavor: `Delerium Search · ${escape(session.zone.name)}`,
          flags: { [ID]: { chatSearchRoll: { sessionMessageId: record.id, actorUuid: context.actor.uuid } } } }, { messageMode: "public" });
      }
      await record.setFlag(ID, "chatSearch", foundry.utils.deepClone(session));
    }
    scheduleSummary(record);
    return { accepted: true };
  }, { serialize: "craftworks.delerium" });
  channel.on("finalize", async ({ messageId }, execution) => {
    const message = game.messages.get(messageId);
    if (!game.users.get(execution.senderUserId)?.isGM || !message?.author?.isGM || rollAuthority(message)?.id !== game.user.id) throw new Error("Only the active GM can finalize search results.");
    await finishSearch(message, api.sessions.import(message.getFlag(ID, "chatSearch")));
    return { accepted: true };
  }, { serialize: "craftworks.delerium" });
  channel.on("award", async ({ messageId, recipientUuid }, execution) => {
    const message = game.messages.get(messageId);
    if (!game.user.isGM || !game.users.get(execution.senderUserId)?.isGM || !message?.author?.isGM || rollAuthority(message)?.id !== game.user.id) throw new Error("Only the active GM can award search results.");
    const session = api.sessions.import(message.getFlag(ID, "chatSearch"));
    try {
      if (!session.result) await api.deleriumSearch.rollAndAward(session.id, recipientUuid);
    } finally {
      await message.setFlag(ID, "chatSearch", foundry.utils.deepClone(session));
    }
    await finishSearch(message, session);
    return foundry.utils.deepClone(session);
  }, { serialize: "craftworks.delerium" });
  Hooks.on("renderChatMessageHTML", (message, html) => {
    const finalize = html.querySelector("[data-ml-delerium-finalize]");
    if (finalize) {
      if (!game.user.isGM) finalize.remove();
      else finalize.addEventListener("click", async () => {
        finalize.disabled = true;
        try { await channel.executeAsUser("finalize", { messageId: message.id }, rollAuthority(message)?.id); }
        catch (error) { ui.notifications.error(error.message); }
        finally { finalize.disabled = false; }
      });
    }
    const button = html.querySelector("[data-ml-delerium-results]");
    if (!button) return;
    if (!game.user.isGM) { button.remove(); return; }
    button.addEventListener("click", async () => {
      try {
        const record = game.messages.get(message.getFlag(ID, "chatSearchResult")?.sessionMessageId) ?? message;
        const session = api.sessions.import(record.getFlag(ID, "chatSearch"));
        const facade = { ...api, deleriumSearch: { rollAndAward: async (_id, recipientUuid) => {
          Object.assign(session, await channel.executeAsUser("award", { messageId: record.id, recipientUuid }, rollAuthority(record)?.id));
          return session.result;
        } } };
        await new DeleriumSearchResultsApp(facade, session).render({ force: true });
      } catch (error) { ui.notifications.error(error.message); }
    });
  });
  // Recover already-finished searches after an upgrade/reload without repeating dice or awards.
  for (const record of game.messages) {
    const session = record.author?.isGM && record.getFlag(ID, "chatSearch");
    if (!session || rollAuthority(record)?.id !== game.user.id) continue;
    const recover = async () => {
      if (!record.whisper.length) await record.update({ whisper: game.users.filter(user => user.isGM).map(user => user.id) });
      if ((session.status === "complete" || session.selectedCharacterUuids.every(uuid => Object.values(session.participants).some(entry => entry.actorUuid === uuid)))
        && !game.messages.some(message => message.getFlag(ID, "chatSearchResult")?.sessionMessageId === record.id)) {
        await channel.executeAsUser("finalize", { messageId: record.id }, game.user.id);
      }
    };
    void recover().catch(error => ui.notifications.error(`Could not restore saved search results: ${error.message}`));
  }
  return async (zoneId, actorUuids) => {
    if (!game.user.isGM) throw new Error("Only a GM can request Delerium Search.");
    const session = api.deleriumSearch.start(zoneId);
    session.selectedCharacterUuids = [...new Set(actorUuids)];
    session.messageMode = "public";
    const record = await ChatMessage.create({ content: summary(session), whisper: game.users.filter(user => user.isGM).map(user => user.id), flags: { [ID]: { chatSearch: foundry.utils.deepClone(session) } } }, { messageMode: "gm" });
    for (const actorUuid of session.selectedCharacterUuids) await requests.create({ type: "craftworks.delerium", groupKey: session.id, key: `${session.id}:${actorUuid}`, title: `Delerium Search · ${session.zone.name}`, dc: session.zone.dc, actorUuid,
      choices: [...api.deleriumSearch.getSkillOptions(), { id: "decline", label: "Decline search" }], data: { sessionMessageId: record.id } });
    return session;
  };
}
