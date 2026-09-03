import { GATHER_SKILLS_DND5E, MODULE_ID } from "../constants.mjs";
import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getGatherProfiles, getGatherDC, getGatherProfile } from "./gather-profiles.mjs";
import { randomInt, weightedPick } from "./random-choice.mjs";

const GATHER_FLAG = "gatheredActors";

export class GatherService {
  constructor({ adapter, materialRegistry, materialService, sessions, contentPacks = null }) {
    this.adapter = adapter;
    this.materialRegistry = materialRegistry;
    this.materialService = materialService;
    this.sessions = sessions;
    this.contentPacks = contentPacks;
  }

  getProfiles() {
    return getGatherProfiles({
      activePackIds: this.#activeGatherPackIds()
    }).map(profile => ({
      id: profile.id,
      name: profile.name,
      dc: getGatherDC(profile)
    }));
  }

  getSkillOptions() {
    return GATHER_SKILLS_DND5E;
  }

  getSceneGatherRecords(sceneId = canvas.scene?.id) {
    const scene = game.scenes.get(sceneId);
    return foundry.utils.deepClone(scene?.getFlag(MODULE_ID, GATHER_FLAG) ?? {});
  }

  getGatherRecord(sceneId, actorUuid) {
    if (!sceneId || !actorUuid) return null;
    return this.getSceneGatherRecords(sceneId)[actorUuid] ?? null;
  }

  hasGathered(sceneId, actorUuid) {
    return Boolean(this.getGatherRecord(sceneId, actorUuid));
  }

  async resetScene(sceneId = canvas.scene?.id) {
    const scene = game.scenes.get(sceneId);
    if (!scene) throw new Error("The current scene could not be resolved.");
    await scene.unsetFlag(MODULE_ID, GATHER_FLAG);
    return true;
  }

  start(profileId, { gatherActorsByUser = {} } = {}) {
    const profile = getGatherProfile(profileId, {
      activePackIds: this.#activeGatherPackIds()
    });
    if (!profile) {
      throw new Error(
        "Choose a gathering terrain supplied by an active Craftworks Content Pack."
      );
    }

    const scene = canvas.scene;
    if (!scene) throw new Error("Gathering requires an active scene.");

    return this.sessions.create({
      type: "gather",
      sceneId: scene.id,
      sceneUuid: scene.uuid,
      sceneName: scene.name,
      terrain: {
        id: profile.id,
        name: profile.name,
        dc: getGatherDC(profile)
      },
      gatherActorsByUser: foundry.utils.deepClone(gatherActorsByUser),
      participants: {},
      results: []
    });
  }

  decline({ sessionId, userId, actorUuid = null }) {
    const session = this.#requireOpen(sessionId);
    const permittedActors = session.gatherActorsByUser?.[userId] ?? [];
    if (!(Array.isArray(permittedActors) ? permittedActors : [permittedActors]).includes(actorUuid)) {
      throw new Error("This character is not part of the Gathering session.");
    }
    if (session.participants[actorUuid]?.status) {
      throw new Error("This gathering opportunity is already resolved for that player.");
    }

    const state = {
      userId,
      actorUuid,
      status: "declined"
    };
    session.participants[actorUuid] = state;
    return state;
  }

  async attempt({ sessionId, userId, actorUuid, skillId, total }) {
    const session = this.#requireOpen(sessionId);
    const permittedActors = session.gatherActorsByUser?.[userId] ?? [];
    if (!(Array.isArray(permittedActors) ? permittedActors : [permittedActors]).includes(actorUuid)) {
      throw new Error("This character is not part of the Gathering session.");
    }
    if (session.participants[actorUuid]?.status) {
      throw new Error("This gathering opportunity is already resolved for that player.");
    }

    const numericTotal = Number(total);
    const success = Number.isFinite(numericTotal) && numericTotal >= session.terrain.dc;

    if (!success) {
      const failed = {
        userId,
        actorUuid,
        skillId,
        total: numericTotal,
        status: "failed"
      };
      session.participants[actorUuid] = failed;
      await this.#recordGatherAttempt(session, failed);
      return failed;
    }

    const profile = getGatherProfile(session.terrain.id, {
      activePackIds: this.#activeGatherPackIds()
    });

    if (!profile) {
      throw new Error(
        "The Content Pack that supplied this gathering terrain is no longer active."
      );
    }

    const candidates = (profile.results ?? [])
      .filter(result => this.materialRegistry.get(result.materialId));

    const rareBias = Number(getSetting(SETTINGS.GATHER_RARE_BIAS) ?? 0);
    const result = weightedPick(this.#applyRarityBias(candidates, rareBias));
    if (!result) {
      throw new Error("No installed Craftworks materials are available for this terrain.");
    }

    const baseQuantity = randomInt(result.min, result.max);
    const quantityMultiplier = Math.max(
      0.25,
      Number(getSetting(SETTINGS.GATHER_QUANTITY_MULTIPLIER) ?? 1)
    );
    const quantity = Math.max(1, Math.round(baseQuantity * quantityMultiplier));
    const actor = await fromUuid(actorUuid);
    if (!actor) throw new Error("The gathering character could not be resolved.");

    const { item, recipient } = await this.materialService.award(
      actor,
      result.materialId,
      quantity,
      { preferPartyRecipient: true }
    );
    const material = this.materialRegistry.get(result.materialId);

    const state = {
      userId,
      actorUuid,
      skillId,
      total: numericTotal,
      status: "succeeded",
      result: {
        materialId: result.materialId,
        name: material?.name ?? result.materialId,
        img: material?.img ?? "",
        quantity,
        itemUuid: item.uuid,
        recipientUuid: recipient.uuid,
        recipientName: recipient.name
      }
    };

    session.participants[actorUuid] = state;
    session.results.push(state.result);
    await this.#recordGatherAttempt(session, state);
    return state;
  }

  finalize(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Gathering session not found.");
    session.status = "complete";
    session.completedAt = Date.now();
    return session;
  }

  async #recordGatherAttempt(session, state) {
    const scene = game.scenes.get(session.sceneId);
    if (!scene) throw new Error("The gathering scene could not be resolved.");

    const records = this.getSceneGatherRecords(session.sceneId);
    records[state.actorUuid] = {
      actorUuid: state.actorUuid,
      userId: state.userId,
      terrain: session.terrain.id,
      terrainName: session.terrain.name,
      status: state.status,
      total: state.total,
      gatheredAt: Date.now()
    };

    await scene.setFlag(MODULE_ID, GATHER_FLAG, records);
  }

  #activeGatherPackIds() {
    return this.contentPacks
      ?.enabled({ capability: "gathering" })
      .map(pack => pack.id)
      ?? null;
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

  #requireOpen(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Gathering session not found.");
    if (session.status !== "open") throw new Error("This gathering session is no longer open.");
    return session;
  }
}
