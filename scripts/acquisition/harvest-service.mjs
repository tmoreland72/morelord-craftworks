import { HARVEST_SKILLS_DND5E, MODULE_ID } from "../constants.mjs";
import { SETTINGS, getSetting } from "../core/settings.mjs";
import { getHarvestChoiceCount, getHarvestDC } from "./harvest-rules.mjs";
import { findHarvestProfile } from "./harvest-profiles.mjs";
import { weightedDistinctSample } from "./weighted-choice.mjs";
import { DrakkenheimMonsterDataService } from "../integrations/drakkenheim-monster-data-service.mjs";
import { DrakkenheimMaterialMatchService } from "../integrations/drakkenheim-material-match-service.mjs";
import { AwardChatCardService } from "../core/award-chat-card-service.mjs";

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
      components: standardComponents,
      specialItems: []
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
      context.specialItems =
        Array.isArray(harvestData.specialItems)
          ? harvestData.specialItems
          : [];
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

  async start({
    creatureContexts = null,
    skipSkillChecks = []
  } = {}) {
    let creatures =
      Array.isArray(creatureContexts)
        ? foundry.utils.deepClone(creatureContexts)
        : null;

    if (!creatures) {
      const tokens =
        this.adapter.getDeadCreatureTokens();

      creatures = [];

      for (
        const token of tokens.filter(
          entry => entry.actor
        )
      ) {
        creatures.push(
          await this.buildCreatureContext(token)
        );
      }
    }

    if (!creatures.length) {
      throw new Error(
        "No dead creatures were found on the current scene."
      );
    }

    const session = this.sessions.create({
      type: "harvest",
      sceneId: canvas.scene?.id ?? null,
      sceneName: canvas.scene?.name ?? null,
      creatures,
      participants: {},
      results: [],
      skipSkillChecks:
        foundry.utils.deepClone(
          skipSkillChecks ?? []
        )
    });

    for (const entry of skipSkillChecks ?? []) {
      if (!entry?.actorUuid || !entry?.userId) {
        continue;
      }

      for (const creature of creatures) {
        if (
          await this.hasHarvested(
            creature.tokenUuid,
            entry.actorUuid
          )
        ) {
          continue;
        }

        const key =
          `${entry.userId}:${creature.tokenUuid}`;

        session.participants[key] =
          this.#buildSuccessfulState({
            creature,
            userId: entry.userId,
            actorUuid: entry.actorUuid,
            skillId: null,
            total: null,
            naturalD20: null,
            automaticSuccess: true
          });
      }
    }

    return session;
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

  #buildChoices(creature) {
    if (creature.harvestMode === "drakkenheim") {
      return (creature.components ?? [])
        .filter(
          component =>
            component.matched
            && component.materialId
        )
        .map(component => {
          const material =
            this.materialRegistry.get(
              component.materialId
            );

          return material
            ? {
                ...material,
                componentId: component.id,
                componentName:
                  component.componentName,
                category:
                  component.category
              }
            : null;
        })
        .filter(Boolean);
    }

    const candidates =
      (creature.components ?? [])
        .filter(
          component =>
            component.matched
            && component.materialId
        )
        .map(component => ({
          materialId:
            component.materialId,
          weight:
            Number(component.weight ?? 1)
        }));

    const rareBias =
      Number(
        getSetting(
          SETTINGS.HARVEST_RARE_BIAS
        ) ?? 0
      );

    const weightedCandidates =
      this.#applyRarityBias(
        candidates,
        rareBias
      );

    const activePartySize = Math.max(
      1,
      game.users.filter(user => user.active && !user.isGM).length
    );

    return weightedDistinctSample(
      weightedCandidates,
      Math.max(
        getHarvestChoiceCount(),
        activePartySize
      )
    )
      .map(result => {
        const material =
          this.materialRegistry.get(
            result.materialId
          );

        if (!material) return null;

        const component =
          (creature.components ?? [])
            .find(
              entry =>
                entry.materialId ===
                result.materialId
            );

        return {
          ...material,
          componentId:
            component?.id ?? null,
          componentName:
            component?.componentName
            ?? material.name,
          category:
            component?.category
            ?? material.category
            ?? "Harvest Material"
        };
      })
      .filter(Boolean);
  }

  #buildSuccessfulState({
    creature,
    userId,
    actorUuid,
    skillId,
    total,
    naturalD20 = null,
    automaticSuccess = false
  }) {
    const choices =
      this.#buildChoices(creature);

    if (!choices.length) {
      return {
        userId,
        actorUuid,
        creatureTokenUuid:
          creature.tokenUuid,
        skillId,
        status: "no-results",
        total,
        naturalD20,
        automaticSuccess
      };
    }

    const doubleClaimEnabled =
      !automaticSuccess
      && Boolean(
        getSetting(
          SETTINGS.HARVEST_NAT20_DOUBLE_CLAIM
        )
      );

    const claimsAllowed =
      Math.min(
        choices.length,
        doubleClaimEnabled
        && Number(naturalD20) === 20
          ? 2
          : 1
      );

    return {
      userId,
      actorUuid,
      creatureTokenUuid:
        creature.tokenUuid,
      skillId,
      status: "awaiting-claim",
      total,
      naturalD20:
        Number(naturalD20) || null,
      automaticSuccess,
      claimsAllowed,
      claimsMade: 0,
      claimsRemaining: claimsAllowed,
      claimedComponentIds: [],
      claimedMaterialIds: [],
      claimedNames: [],
      choices: choices.map(choice => ({
        materialId:
          choice.materialId,
        name:
          choice.name,
        img:
          choice.img,
        rarity:
          choice.rarity,
        componentId:
          choice.componentId ?? null,
        componentName:
          choice.componentName
          ?? choice.name,
        category:
          choice.category ?? null
      }))
    };
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

    const successState =
      this.#buildSuccessfulState({
        creature,
        userId,
        actorUuid,
        skillId,
        total: numericTotal,
        naturalD20,
        automaticSuccess: false
      });

    session.participants[key] =
      successState;

    if (
      successState.status ===
      "no-results"
    ) {
      await this.#writeHarvestRecord(
        creatureTokenUuid,
        actorUuid,
        {
          status: "no-results",
          skillId,
          total: numericTotal
        }
      );
    }

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

    const recipient =
      await this.materialService.getRecipient(
        actor,
        { preferParty: true }
      );

    if (!recipient) {
      throw new Error(
        "No recipient Actor is available for this Harvest claim."
      );
    }

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
      itemUuid: null,
      sourceItemUuid: material.uuid,
      awarded: false
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
      itemUuid: null,
      sourceItemUuid: material.uuid,
      awarded: false,
      awardedAt: null
    };

    session.results.push(result);

    return {
      state,
      result,
      session
    };
  }

  async updatePlayerCompletions(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Harvest session not found.");

    const userIds = new Set(
      Object.values(session.participants ?? {})
        .map(state => state?.userId)
        .filter(Boolean)
    );
    const completedUserIds = new Set(session.completedUserIds ?? []);
    const completed = [];

    for (const userId of userIds) {
      if (completedUserIds.has(userId)) continue;

      let isComplete = true;
      for (const creature of session.creatures ?? []) {
        const state = session.participants?.[`${userId}:${creature.tokenUuid}`];
        if (!state?.status) {
          isComplete = false;
          break;
        }

        if (state.status === "awaiting-claim") {
          const hasAvailableChoice = (state.choices ?? []).some(choice => {
            const componentId = choice.componentId
              ?? `${creature.tokenUuid}::${choice.materialId}`;
            if ((state.claimedComponentIds ?? []).includes(componentId)) return false;
            return !(session.results ?? []).some(result =>
              result.creatureTokenUuid === creature.tokenUuid
              && result.componentId === componentId
            );
          });

          if (hasAvailableChoice) {
            isComplete = false;
            break;
          }

          state.status = Number(state.claimsMade ?? 0) > 0
            ? "claimed"
            : "no-results";
          state.claimsRemaining = 0;
          await this.#writeHarvestRecord(creature.tokenUuid, state.actorUuid, {
            status: state.status,
            skillId: state.skillId,
            total: state.total,
            naturalD20: state.naturalD20 ?? null
          });
        }

        if (!["failed", "no-results", "claimed"].includes(state.status)) {
          isComplete = false;
          break;
        }
      }

      if (!isComplete) continue;
      completedUserIds.add(userId);
      completed.push({
        userId,
        userName: game.users.get(userId)?.name ?? "A player"
      });
    }

    session.completedUserIds = [...completedUserIds];
    return completed;
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

  async finalize(sessionId) {
    const session =
      this.sessions.get(sessionId);

    if (!session) {
      throw new Error(
        "Harvest session not found."
      );
    }

    if (
      session.status === "complete"
      && session.awardsFinalized === true
    ) {
      return session;
    }

    session.status = "finalizing";

    // Award each reserved claim exactly once. The awarded flag lives on the
    // authoritative session result so retrying Finalize after an interruption
    // cannot duplicate items already delivered.
    for (const result of session.results ?? []) {
      if (result.awarded === true) {
        continue;
      }

      const actor =
        result.actorUuid
          ? await fromUuid(result.actorUuid)
          : null;

      if (!actor) {
        session.status = "open";
        throw new Error(
          `Could not resolve harvesting actor for ${
            result.componentName
            ?? result.materialName
            ?? "a claimed component"
          }.`
        );
      }

      const material =
        this.materialRegistry.get(
          result.materialId
        );

      if (!material) {
        session.status = "open";
        throw new Error(
          `Could not resolve Craftworks material '${
            result.materialId
          }' while finalizing Harvest.`
        );
      }

      const resolved =
        await this.materialService.award(
          actor,
          result.materialId,
          1,
          {
            postChatCard: false,
            preferPartyRecipient: true
          }
        );

      result.recipientUuid =
        resolved.recipient.uuid;
      result.recipientName =
        resolved.recipient.name;
      result.itemUuid =
        resolved.item.uuid;
      result.awarded = true;
      result.awardedAt = Date.now();

      const stateKey =
        `${result.userId}:${result.creatureTokenUuid}`;

      const state =
        session.participants?.[stateKey];

      if (state) {
        state.recipientUuid =
          resolved.recipient.uuid;
        state.recipientName =
          resolved.recipient.name;
      }

      await this.#writeHarvestRecord(
        result.creatureTokenUuid,
        actor.uuid,
        {
          status:
            state?.status ?? "claimed",
          skillId:
            result.skillId ?? null,
          total:
            result.rollTotal ?? null,
          naturalD20:
            state?.naturalD20 ?? null,
          claimsAllowed:
            state?.claimsAllowed ?? 1,
          claimsMade:
            state?.claimsMade ?? 1,
          claimedMaterialIds:
            state?.claimedMaterialIds
            ?? [result.materialId],
          claimedComponentIds:
            state?.claimedComponentIds
            ?? [result.componentId],
          claimedNames:
            state?.claimedNames
            ?? [result.materialName],
          materialId:
            result.materialId,
          componentId:
            result.componentId,
          claimedName:
            result.materialName,
          recipientUuid:
            resolved.recipient.uuid,
          recipientName:
            resolved.recipient.name,
          itemUuid:
            resolved.item.uuid,
          sourceItemUuid:
            material.uuid,
          awarded: true
        }
      );
    }

    const byRecipient =
      new Map();

    for (const result of session.results ?? []) {
      if (
        result.awarded !== true
        || !result.recipientUuid
      ) {
        continue;
      }

      if (
        !byRecipient.has(
          result.recipientUuid
        )
      ) {
        byRecipient.set(
          result.recipientUuid,
          {
            recipientUuid:
              result.recipientUuid,
            items: []
          }
        );
      }

      byRecipient
        .get(result.recipientUuid)
        .items.push({
          uuid:
            result.sourceItemUuid
            ?? result.itemUuid
            ?? null,
          name:
            result.materialName
            ?? result.componentName
            ?? "Harvested Component",
          img:
            result.materialImg
            ?? null,
          rarity:
            result.rarity
            ?? null,
          quantity: 1
        });
    }

    const postedRecipients =
      new Set(
        session.awardCardRecipientUuids
        ?? []
      );

    for (const group of byRecipient.values()) {
      if (
        postedRecipients.has(
          group.recipientUuid
        )
      ) {
        continue;
      }

      const recipient =
        await fromUuid(
          group.recipientUuid
        );

      if (!recipient) {
        continue;
      }

      const aggregated =
        new Map();

      for (const item of group.items) {
        const key =
          item.uuid
          ?? `${item.name}::${
            item.rarity ?? ""
          }`;

        if (!aggregated.has(key)) {
          aggregated.set(
            key,
            { ...item }
          );
          continue;
        }

        aggregated.get(key).quantity +=
          Number(item.quantity ?? 1);
      }

      await AwardChatCardService.post({
        recipient,
        items:
          [...aggregated.values()],
        title:
          "Harvested Items Received",
        subtitle:
          session.sceneName
            ? `Harvest from ${session.sceneName}`
            : "Harvest Complete"
      });

      postedRecipients.add(
        group.recipientUuid
      );

      session.awardCardRecipientUuids =
        [...postedRecipients];
    }

    session.status = "complete";
    session.completedAt = Date.now();
    session.awardsFinalized = true;
    session.awardCardsPosted = true;

    return session;
  }

}
