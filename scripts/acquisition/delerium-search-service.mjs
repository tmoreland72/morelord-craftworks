import { itemRarity } from "../../../morelord-core/scripts/services/item-rarity.js";
import { DELERIUM_SEARCH_SKILLS_DND5E } from "../constants.mjs";
import { AwardChatCardService } from "../core/award-chat-card-service.mjs";

const ZONES = Object.freeze({
  outer: { id: "outer", name: "Outer City", dc: 15 },
  inner: { id: "inner", name: "Inner City", dc: 20 }
});

const REWARDS = Object.freeze([
  { min: 5, name: "Delerium Shard", formula: "1" },
  { min: 4, name: "Delerium Fragment", formula: "1d6" },
  { min: 3, name: "Delerium Chip", formula: "3d6" }
]);

export class DeleriumSearchService {
  constructor({ adapter, recipientResolver, sessions, contentPacks, sourceFilter }) {
    this.awardingSessions = new Set();
    this.adapter = adapter;
    this.recipientResolver = recipientResolver;
    this.sessions = sessions;
    this.contentPacks = contentPacks;
    this.sourceFilter = sourceFilter;
  }

  get hasAccess() {
    return Boolean(
      this.contentPacks
        ?.enabled({ capability: "delerium-search" })
        .some(pack => pack.id === "monsters-of-drakkenheim")
    );
  }

  getZones() { return Object.values(ZONES).map(zone => ({ ...zone })); }
  getSkillOptions() { return DELERIUM_SEARCH_SKILLS_DND5E; }

  start(zoneId) {
    if (!this.hasAccess) throw new Error("Enable the Drakkenheim Content Pack to search for delerium.");
    const zone = ZONES[zoneId];
    if (!zone) throw new Error("Choose the Outer City or Inner City.");
    const scene = canvas.scene;
    if (!scene) throw new Error("Delerium searching requires an active scene.");
    return this.sessions.create({
      type: "delerium-search", sceneId: scene.id, sceneName: scene.name,
      zone: { ...zone }, durationHours: 1, distanceMiles: 0.25,
      participants: {}, successes: 0, failures: 0, results: []
    });
  }

  attempt({ sessionId, userId, actorUuid, skillId, total, naturalD20 = false }) {
    const session = this.#requireOpen(sessionId);
    if (session.participants[userId]?.status) throw new Error("That player's search check is already resolved.");
    if (!this.getSkillOptions().some(skill => skill.id === skillId)) throw new Error("Choose Arcana, Investigation, or Survival.");
    const numericTotal = Number(total);
    const rolledNatural20 = Number(naturalD20) === 20;
    const passed = rolledNatural20
      || (Number.isFinite(numericTotal) && numericTotal >= session.zone.dc);
    const successes = passed
      ? ((rolledNatural20 || numericTotal >= session.zone.dc + 5) ? 2 : 1)
      : 0;
    const state = { userId, actorUuid, skillId, total: numericTotal, naturalD20: rolledNatural20 ? 20 : null, successes, status: passed ? "succeeded" : "failed" };
    session.participants[userId] = state;
    session.successes += successes;
    if (!passed) session.failures += 1;
    return state;
  }

  decline({ sessionId, userId, actorUuid = null }) {
    const session = this.#requireOpen(sessionId);
    if (session.participants[userId]?.status) throw new Error("That player's search check is already resolved.");
    const state = { userId, actorUuid, status: "declined", successes: 0 };
    session.participants[userId] = state;
    return state;
  }

  async finalize(sessionId) {
    const session = this.#requireOpen(sessionId);
    const rewards = REWARDS.filter(entry => session.successes >= entry.min).toReversed();
    const resolvedRewards = [];
    for (const reward of rewards) {
      const source = await this.#resolveSourceItem(reward.name);
      if (!source) throw new Error(`${reward.name} was not found in the enabled Monsters of Drakkenheim Item compendiums.`);
      resolvedRewards.push({ sourceUuid: source.uuid, name: source.name, img: source.img,
        formula: reward.formula, rarity: itemRarity(source.system) ?? null });
    }
    session.rewards = resolvedRewards;
    session.result = null;
    session.randomEncounter = session.failures >= 2;
    session.status = "complete";
    session.completedAt = Date.now();
    return session;
  }

  async rollAndAward(sessionId, recipientUuid) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Delerium search session not found.");
    if (session.status !== "complete") throw new Error("Finalize the delerium search before awarding its result.");
    if (!session.rewards?.length) throw new Error("This search did not find any delerium to award.");
    if (session.result) throw new Error("This search result has already been awarded.");
    if (this.awardingSessions.has(sessionId)) throw new Error("This search is already being awarded.");
    if (session.results.length && session.results[0].recipientUuid !== recipientUuid) {
      throw new Error("Finish awarding this search to the original recipient.");
    }
    this.awardingSessions.add(sessionId);
    try {
      const recipient = recipientUuid ? await fromUuid(recipientUuid) : null;
      if (!recipient || !["character", "group"].includes(recipient.type)) throw new Error("Choose a valid party or character recipient.");
      // Resolve every source before changing the recipient's inventory.
      const sources = await Promise.all(session.rewards.map(async reward => {
        const source = await fromUuid(reward.sourceUuid) ?? await this.#resolveSourceItem(reward.name);
        if (!source) throw new Error(`${reward.name} is no longer available in the enabled compendiums.`);
        return source;
      }));
      for (const [index, reward] of session.rewards.entries()) {
        if (session.results.some(result => result.sourceUuid === reward.sourceUuid)) continue;
        if (reward.quantity == null) {
          const roll = await new Roll(reward.formula).evaluate();
          await roll.toMessage({ flavor: `Delerium Search — ${reward.name}`, speaker: ChatMessage.getSpeaker({ actor: recipient }) }, session.messageMode ? { messageMode: session.messageMode } : {});
          reward.quantity = Number(roll.total);
        }
        const source = sources[index];
        const item = await this.adapter.addItemToActor(recipient, source, reward.quantity);
        // Record each completed delivery so retries cannot duplicate earlier rewards.
        session.results.push({ sourceUuid: source.uuid, name: source.name, img: source.img,
          quantity: reward.quantity, itemUuid: item.uuid, recipientName: recipient.name, recipientUuid: recipient.uuid });
      }
      session.result = { items: [...session.results], recipientName: recipient.name, recipientUuid: recipient.uuid };
      await AwardChatCardService.post({ recipient, items: session.results.map(result => ({
        document: sources.find(source => source.uuid === result.sourceUuid), uuid: result.sourceUuid, quantity: result.quantity
      })), title: "Delerium Found", messageMode: session.messageMode });
      return session.result;
    } finally {
      this.awardingSessions.delete(sessionId);
    }
  }

  #requireOpen(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Delerium search session not found.");
    if (session.status !== "open") throw new Error("This delerium search is no longer open.");
    return session;
  }

  async #resolveSourceItem(name) {
    const normalizedName = String(name).trim().toLowerCase();
    const candidates = [];
    for (const pack of game.packs.filter(pack =>
      pack.documentName === "Item"
      && (this.sourceFilter?.isPackEnabled(pack) ?? true)
    )) {
      if (pack.metadata?.packageName !== "drakkenheim-monsters"
        && !String(pack.collection).startsWith("drakkenheim-monsters.")) continue;
      const index = await pack.getIndex({ fields: ["system.source"] });
      for (const entry of index) {
        if (String(entry.name ?? "").trim().toLowerCase() === normalizedName) {
          candidates.push({ pack, entry });
        }
      }
    }
    const match = candidates[0];
    return match ? match.pack.getDocument(match.entry._id) : null;
  }
}
