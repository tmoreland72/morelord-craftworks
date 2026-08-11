import { HARVEST_SKILLS_DND5E, MODULE_ID } from "../constants.mjs";
import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getHarvestChoiceCount, getHarvestDC } from "./harvest-rules.mjs";
import { findHarvestProfile } from "./harvest-profiles.mjs";
import { weightedDistinctSample } from "./weighted-choice.mjs";
import { DrakkenheimMonsterDataService } from "../integrations/drakkenheim-monster-data-service.mjs";
import { DrakkenheimMaterialMatchService } from "../integrations/drakkenheim-material-match-service.mjs";

const HARVEST_FLAG = "harvestAttempts";

export class HarvestService {
  constructor({ adapter, materialRegistry, materialService, sessions, contentPacks = null }) {
    this.adapter = adapter;
    this.materialRegistry = materialRegistry;
    this.materialService = materialService;
    this.sessions = sessions;
    this.contentPacks = contentPacks;
    DrakkenheimMaterialMatchService.configure(materialRegistry);
  }

  async buildCreatureContext(token) {
    const actor = token.actor;
    const cr = this.adapter.getCreatureCR(actor);
    const creatureType = this.adapter.getCreatureType(actor);
    const activePackIds = this.contentPacks?.enabled({ capability: "harvest" }).map(pack => pack.id) ?? null;
    const profile = findHarvestProfile(creatureType, { activePackIds });

    const standardComponents = [];
    const seenStandardMaterialIds = new Set();

    for (const result of profile?.results ?? []) {
      if (cr < Number(result.minCR ?? 0)) continue;
      if (!result.materialId || seenStandardMaterialIds.has(result.materialId)) continue;

      const material = this.materialRegistry.get(result.materialId);
      if (!material) continue;

      seenStandardMaterialIds.add(result.materialId);
      standardComponents.push({
        id: `${token.document.uuid}::standard::${result.materialId}`,
        category: material.category ?? "Harvest Material",
        componentName: material.name,
        rarity: material.rarity ?? null,
        matched: true,
        status: "available",
        materialId: material.materialId,
        name: material.name,
        img: material.img ?? null,
        weight: Number(result.weight ?? 1),
        minCR: Number(result.minCR ?? 0)
      });
    }

    const context = {
      tokenUuid: token.document.uuid,
      actorUuid: actor.uuid,
      name: actor.name,
      img: token.document.texture?.src ?? actor.img,
      cr,
      creatureType,
      dc: getHarvestDC(cr),
      profileId: profile?.id ?? null,
      harvestMode: "standard",
      harvestRarity: null,
      components: standardComponents
    };

    // Drakkenheim is an enhancement path, never a dependency. A Drakkenheim
    // actor uses exact book components only when that content pack is both
    // configured and entitled. Otherwise it stays on the standard profile.
    const drakkenheimEnabled =
      this.contentPacks?.isEnabled?.("monsters-of-drakkenheim") ?? false;

    if (!drakkenheimEnabled) return context;

    try {
      const monsterActor = await DrakkenheimMonsterDataService.findMonsterActor(actor);
      if (!monsterActor) return context;

      const harvestData = await DrakkenheimMonsterDataService.inspectHarvestData(monsterActor);
      const matches = await DrakkenheimMaterialMatchService.matchHarvestComponents(monsterActor, harvestData);

      context.harvestMode = "drakkenheim";
      context.harvestRarity = harvestData.rarity ?? null;
      context.profileId = "monsters-of-drakkenheim-exact";
      context.components = matches.map((match, index) => {
        const materialId = match.item?.materialId ?? match.item?.id ?? null;
        const material = materialId ? this.materialRegistry.get(materialId) : null;
        return {
          id: `${token.document.uuid}::${index}::${materialId ?? "unmatched"}`,
          index,
          category: match.component?.category ?? "Unknown",
          componentName: match.component?.name ?? "Unknown",
          rarity: harvestData.rarity ?? null,
          matched: Boolean(match.matched && material),
          status: match.status ?? "unmatched",
          materialId,
          name: material?.name ?? match.item?.name ?? null,
          img: material?.img ?? match.item?.img ?? null
        };
      });
    } catch (error) {
      console.warn(`Morelord Craftworks | Drakkenheim harvest inspection failed for ${actor.name}.`, error);
    }

    return context;
  }

  async start() {
    const tokens = this.adapter.getDeadCreatureTokens();
    const creatures = [];
    for (const token of tokens.filter(t => t.actor)) {
      creatures.push(await this.buildCreatureContext(token));
    }
    if (!creatures.length) throw new Error("No dead creatures were found on the current scene.");
    return this.sessions.create({
      type: "harvest",
      sceneId: canvas.scene?.id ?? null,
      sceneName: canvas.scene?.name ?? null,
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

  async recordAttempt({
    sessionId,
    creatureTokenUuid,
    userId,
    actorUuid,
    skillId,
    total,
    naturalD20 = null
  }) {
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
        total: numericTotal,
        naturalD20: Number(naturalD20) || null
      };

      await this.#writeHarvestRecord(creatureTokenUuid, actorUuid, {
        status: "failed",
        skillId,
        total: numericTotal
      });

      return session.participants[key];
    }

    let choices = [];

    if (creature.harvestMode === "drakkenheim") {
      choices = (creature.components ?? [])
        .filter(component => component.matched && component.materialId)
        .map(component => {
          const material = this.materialRegistry.get(component.materialId);
          return material ? { ...material, componentId: component.id, componentName: component.componentName, category: component.category } : null;
        })
        .filter(Boolean);
    } else {
      const candidates = (creature.components ?? [])
        .filter(component => component.matched && component.materialId)
        .map(component => ({
          materialId: component.materialId,
          weight: Number(component.weight ?? 1)
        }));

      const rareBias = Number(getSetting(SETTINGS.HARVEST_RARE_BIAS) ?? 0);
      const weightedCandidates = this.#applyRarityBias(candidates, rareBias);

      choices = weightedDistinctSample(
        weightedCandidates,
        getHarvestChoiceCount()
      )
        .map(result => {
          const material = this.materialRegistry.get(result.materialId);
          if (!material) return null;

          const component = (creature.components ?? [])
            .find(entry => entry.materialId === result.materialId);

          return {
            ...material,
            componentId: component?.id ?? null,
            componentName: component?.componentName ?? material.name,
            category: component?.category ?? material.category ?? "Harvest Material"
          };
        })
        .filter(Boolean);
    }

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

    const natural =
      Number(naturalD20) || null;

    const doubleClaimEnabled = Boolean(
      getSetting(
        SETTINGS.HARVEST_NAT20_DOUBLE_CLAIM
      )
    );

    const claimsAllowed = Math.min(
      choices.length,
      doubleClaimEnabled && natural === 20
        ? 2
        : 1
    );

    session.participants[key] = {
      userId,
      actorUuid,
      creatureTokenUuid,
      skillId,
      status: "awaiting-claim",
      total: numericTotal,
      naturalD20: natural,
      claimsAllowed,
      claimsMade: 0,
      claimsRemaining: claimsAllowed,
      claimedComponentIds: [],
      claimedMaterialIds: [],
      claimedNames: [],
      choices: choices.map(c => ({
        materialId: c.materialId,
        name: c.name,
        img: c.img,
        rarity: c.rarity,
        componentId: c.componentId ?? null,
        componentName: c.componentName ?? c.name,
        category: c.category ?? null
      }))
    };

    return session.participants[key];
  }

  async claim({
    sessionId,
    creatureTokenUuid,
    userId,
    materialId,
    componentId = null
  }) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Harvest session not found.");

    const key = `${userId}:${creatureTokenUuid}`;
    const state = session.participants?.[key];

    if (!state || state.status !== "awaiting-claim") {
      throw new Error(
        "A successful harvest check is required before claiming."
      );
    }

    const choice = (state.choices ?? []).find(candidate =>
      componentId
        ? candidate.componentId === componentId
        : candidate.materialId === materialId
    );

    if (!choice) {
      throw new Error(
        "That component is not one of this player's harvest choices."
      );
    }

    const resolvedComponentId =
      choice.componentId
      ?? componentId
      ?? `${creatureTokenUuid}::${choice.materialId}`;

    if (
      (state.claimedComponentIds ?? [])
        .includes(resolvedComponentId)
    ) {
      throw new Error(
        "You have already claimed that component."
      );
    }

    const alreadyClaimed = (session.results ?? []).find(result =>
      result.creatureTokenUuid === creatureTokenUuid
      && result.componentId === resolvedComponentId
    );

    if (alreadyClaimed) {
      throw new Error(
        `${alreadyClaimed.componentName ?? alreadyClaimed.materialName ?? "That component"} `
        + `was already claimed by ${alreadyClaimed.actorName ?? alreadyClaimed.userName ?? "another player"}.`
      );
    }

    const actor = await fromUuid(state.actorUuid);
    if (!actor) {
      throw new Error(
        "The harvesting character could not be resolved."
      );
    }

    const material = this.materialRegistry.get(choice.materialId);
    if (!material) {
      throw new Error(
        "The selected Craftworks material could not be resolved."
      );
    }

    const { item, recipient } = await this.materialService.award(
      actor,
      choice.materialId,
      1
    );

    const user = game.users.get(userId);

    state.claimedComponentIds = [
      ...(state.claimedComponentIds ?? []),
      resolvedComponentId
    ];

    state.claimedMaterialIds = [
      ...(state.claimedMaterialIds ?? []),
      choice.materialId
    ];

    state.claimedNames = [
      ...(state.claimedNames ?? []),
      material.name
    ];

    state.claimsMade =
      Number(state.claimsMade ?? 0) + 1;

    const availableUnclaimedChoices =
      (state.choices ?? []).filter(candidate => {
        const id =
          candidate.componentId
          ?? `${creatureTokenUuid}::${candidate.materialId}`;

        if (
          (state.claimedComponentIds ?? [])
            .includes(id)
        ) {
          return false;
        }

        return !(session.results ?? []).some(result =>
          result.creatureTokenUuid === creatureTokenUuid
          && result.componentId === id
        );
      });

    const targetClaims =
      Math.max(
        1,
        Number(state.claimsAllowed ?? 1)
      );

    const mayClaimAgain =
      state.claimsMade < targetClaims
      && availableUnclaimedChoices.length > 0;

    state.claimsRemaining = mayClaimAgain
      ? targetClaims - state.claimsMade
      : 0;

    state.status = mayClaimAgain
      ? "awaiting-claim"
      : "claimed";

    state.claimedMaterialId = choice.materialId;
    state.claimedComponentId = resolvedComponentId;
    state.claimedName = material.name;
    state.recipientUuid = recipient.uuid;
    state.recipientName = recipient.name;

    await this.#writeHarvestRecord(creatureTokenUuid, actor.uuid, {
      status: state.status,
      skillId: state.skillId,
      total: state.total,
      naturalD20: state.naturalD20 ?? null,
      claimsAllowed: targetClaims,
      claimsMade: state.claimsMade,
      claimedMaterialIds: state.claimedMaterialIds,
      claimedComponentIds: state.claimedComponentIds,
      claimedNames: state.claimedNames,
      materialId: choice.materialId,
      componentId: resolvedComponentId,
      claimedName: state.claimedName,
      recipientUuid: recipient.uuid,
      recipientName: recipient.name,
      itemUuid: item.uuid,
      sourceItemUuid: material.uuid
    });

    const creature = session.creatures.find(
      entry => entry.tokenUuid === creatureTokenUuid
    );

    const result = {
      id:
        `${creatureTokenUuid}::${resolvedComponentId}::${Date.now()}`,
      claimedAt: Date.now(),
      userId,
      userName: user?.name ?? null,
      actorUuid: actor.uuid,
      actorName: actor.name,
      recipientUuid: recipient.uuid,
      recipientName: recipient.name,
      creatureTokenUuid,
      creatureName: creature?.name ?? "Unknown Creature",
      componentId: resolvedComponentId,
      componentName:
        choice.componentName
        ?? material.name,
      category:
        choice.category
        ?? material.category
        ?? null,
      materialId: choice.materialId,
      materialName: material.name,
      materialImg: material.img ?? null,
      rarity:
        choice.rarity
        ?? material.rarity
        ?? creature?.harvestRarity
        ?? null,
      rollTotal: state.total,
      skillId: state.skillId,
      itemUuid: item.uuid,
      sourceItemUuid: material.uuid
    };

    session.results.push(result);

    return {
      state,
      result,
      session
    };
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
