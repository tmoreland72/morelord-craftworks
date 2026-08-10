import { HARVEST_SKILLS_DND5E, MODULE_ID } from "../constants.mjs";
import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getHarvestChoiceCount, getHarvestDC } from "./harvest-rules.mjs";
import { findHarvestProfile } from "./harvest-profiles.mjs";
import { weightedDistinctSample } from "./weighted-choice.mjs";

const HARVEST_FLAG = "harvestAttempts";

export class HarvestService {
  constructor({ adapter, materialRegistry, materialService, sessions, contentPacks = null }) {
    this.adapter = adapter;
    this.materialRegistry = materialRegistry;
    this.materialService = materialService;
    this.sessions = sessions;
    this.contentPacks = contentPacks;
  }

  buildCreatureContext(token) {
    const actor = token.actor;
    const cr = this.adapter.getCreatureCR(actor);
    const creatureType = this.adapter.getCreatureType(actor);
    const profile = findHarvestProfile(creatureType, {
      activePackIds: this.contentPacks?.enabled({ capability: "harvest" }).map(pack => pack.id) ?? null
    });
    return {
      tokenUuid: token.document.uuid,
      actorUuid: actor.uuid,
      name: actor.name,
      img: actor.img,
      cr,
      creatureType,
      dc: getHarvestDC(cr),
      profileId: profile?.id ?? null
    };
  }

  start() {
    const tokens = this.adapter.getDeadCreatureTokens();
    const creatures = tokens.filter(t => t.actor).map(t => this.buildCreatureContext(t));
    if (!creatures.length) throw new Error("No dead creatures were found on the current scene.");
    return this.sessions.create({
      type: "harvest",
      creatures,
      participants: {},
      results: []
    });
  }

  getSkillOptions() {
    return HARVEST_SKILLS_DND5E;
  }

  async getHarvestRecord(tokenUuid, actorUuid) {
    const token = await fromUuid(tokenUuid);
    if (!token || !actorUuid) return null;
    const records = foundry.utils.deepClone(token.getFlag(MODULE_ID, HARVEST_FLAG) ?? {});
    return records[actorUuid] ?? null;
  }

  async hasHarvested(tokenUuid, actorUuid) {
    return Boolean(await this.getHarvestRecord(tokenUuid, actorUuid));
  }

  async #writeHarvestRecord(tokenUuid, actorUuid, record) {
    const token = await fromUuid(tokenUuid);
    if (!token) throw new Error("The harvested creature token could not be resolved.");

    const records = foundry.utils.deepClone(
      token.getFlag(MODULE_ID, HARVEST_FLAG) ?? {}
    );

    records[actorUuid] = {
      ...record,
      actorUuid,
      tokenUuid,
      resolvedAt: Date.now()
    };

    await token.setFlag(MODULE_ID, HARVEST_FLAG, records);
    return records[actorUuid];
  }

  async resetSceneHarvesting() {
    const tokens = this.adapter.getDeadCreatureTokens();
    await Promise.all(tokens.map(token => token.document.unsetFlag(MODULE_ID, HARVEST_FLAG)));
    return tokens.length;
  }

  getParticipant(sessionId, userId, creatureTokenUuid) {
    const session = this.sessions.get(sessionId);
    return session?.participants?.[`${userId}:${creatureTokenUuid}`] ?? null;
  }

  async recordAttempt({ sessionId, creatureTokenUuid, userId, actorUuid, skillId, total }) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Harvest session not found.");
    if (session.status !== "open") throw new Error("This harvest session is no longer open.");

    const creature = session.creatures.find(c => c.tokenUuid === creatureTokenUuid);
    if (!creature) throw new Error("Creature is not part of this harvest session.");

    if (await this.hasHarvested(creature.tokenUuid, actorUuid)) {
      throw new Error("This character has already attempted to harvest this creature.");
    }

    const key = `${userId}:${creature.tokenUuid}`;
    if (session.participants[key]?.status) throw new Error("This player has already attempted to harvest this creature.");

    const numericTotal = Number(total);
    const success = Number.isFinite(numericTotal) && numericTotal >= creature.dc;
    if (!success) {
      session.participants[key] = {
        userId,
        actorUuid,
        creatureTokenUuid,
        skillId,
        status: "failed",
        total: numericTotal
      };

      await this.#writeHarvestRecord(creatureTokenUuid, actorUuid, {
        status: "failed",
        skillId,
        total: numericTotal
      });

      return session.participants[key];
    }

    const profile = findHarvestProfile(creature.creatureType, {
      activePackIds: this.contentPacks?.enabled({ capability: "harvest" }).map(pack => pack.id) ?? null
    });
    const candidates = (profile?.results ?? [])
      .filter(r => creature.cr >= Number(r.minCR ?? 0))
      .filter(r => this.materialRegistry.get(r.materialId));

    const rareBias = Number(getSetting(SETTINGS.HARVEST_RARE_BIAS) ?? 0);
    const weightedCandidates = this.#applyRarityBias(candidates, rareBias);

    const choices = weightedDistinctSample(
      weightedCandidates,
      getHarvestChoiceCount()
    )
      .map(result => this.materialRegistry.get(result.materialId))
      .filter(Boolean);

    if (!choices.length) {
      session.participants[key] = {
        userId,
        actorUuid,
        creatureTokenUuid,
        skillId,
        status: "no-results",
        total: numericTotal
      };

      await this.#writeHarvestRecord(creatureTokenUuid, actorUuid, {
        status: "no-results",
        skillId,
        total: numericTotal
      });

      return session.participants[key];
    }

    session.participants[key] = {
      userId,
      actorUuid,
      creatureTokenUuid,
      skillId,
      status: "awaiting-claim",
      total: numericTotal,
      choices: choices.map(c => ({
        materialId: c.materialId,
        name: c.name,
        img: c.img,
        rarity: c.rarity
      }))
    };

    return session.participants[key];
  }

  async claim({ sessionId, creatureTokenUuid, userId, materialId }) {
    const session = this.sessions.get(sessionId);
    const key = `${userId}:${creatureTokenUuid}`;
    const state = session?.participants?.[key];
    if (!state || state.status !== "awaiting-claim") throw new Error("A successful harvest check is required before claiming.");
    if (!state.choices.some(c => c.materialId === materialId)) throw new Error("That material is not one of this player's harvest choices.");

    const actor = await fromUuid(state.actorUuid);
    if (!actor) throw new Error("The harvesting character could not be resolved.");
    const { item, recipient } = await this.materialService.award(actor, materialId, 1);
    state.status = "claimed";
    state.claimedMaterialId = materialId;
    state.claimedName = this.materialRegistry.get(materialId)?.name ?? materialId;
    state.recipientUuid = recipient.uuid;
    state.recipientName = recipient.name;

    await this.#writeHarvestRecord(creatureTokenUuid, actor.uuid, {
      status: "claimed",
      skillId: state.skillId,
      total: state.total,
      materialId,
      claimedName: state.claimedName,
      recipientUuid: recipient.uuid,
      recipientName: recipient.name,
      itemUuid: item.uuid
    });

    session.results.push({
      userId,
      actorUuid: actor.uuid,
      recipientUuid: recipient.uuid,
      recipientName: recipient.name,
      creatureTokenUuid,
      materialId,
      itemUuid: item.uuid
    });

    return state;
  }

  #applyRarityBias(entries, bias) {
    const rank = {
      common: 0,
      uncommon: 0.35,
      rare: 0.7,
      veryrare: 0.9,
      legendary: 1
    };

    return entries.map(entry => {
      const material = this.materialRegistry.get(entry.materialId);
      const rarity = String(material?.rarity ?? "common")
        .toLowerCase()
        .replace(/[^a-z]/g, "");
      const rarityScale = rank[rarity] ?? 0;
      const multiplier = Math.max(0.05, 1 + (Number(bias ?? 0) / 100) * rarityScale);

      return {
        ...entry,
        weight: Number(entry.weight ?? 0) * multiplier
      };
    });
  }

  finalize(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Harvest session not found.");
    session.status = "complete";
    session.completedAt = Date.now();
    return session;
  }
}
