import { MODULE_ID } from "../constants.mjs";
import { craftingProgressSummary } from "./crafting-rules.mjs";

const FLAG_KEY = "craftingJobs";

export class CraftingJobService {
  constructor() {
    this.cache = new Map();
  }

  #key(recipeId) {
    return String(recipeId);
  }

  #legacyKey(recipeId, inventoryActorUuid) {
    return `${String(recipeId)}::${String(inventoryActorUuid ?? "none")}`;
  }

  #cacheKey(crafterUuid, recipeId) {
    return `${String(crafterUuid)}::${this.#key(recipeId)}`;
  }

  #jobs(actor) {
    if (!actor) return {};
    return foundry.utils.deepClone(
      actor.flags?.[MODULE_ID]?.[FLAG_KEY] ?? {}
    );
  }

  #cacheJob(crafter, job) {
    if (!crafter || !job) return;
    this.cache.set(
      this.#cacheKey(crafter.uuid, job.recipeId),
      foundry.utils.deepClone(job)
    );
  }

  #uncacheJob(recipeId, crafter) {
    if (!crafter) return;
    this.cache.delete(
      this.#cacheKey(crafter.uuid, recipeId)
    );
  }

  #findPersistedJob(jobs, recipeId, inventoryActorUuid) {
    const key = this.#key(recipeId);

    if (jobs[key]) {
      return {
        key,
        job: jobs[key],
        legacy: false
      };
    }

    const preferredLegacyKey = this.#legacyKey(
      recipeId,
      inventoryActorUuid
    );

    if (jobs[preferredLegacyKey]) {
      return {
        key: preferredLegacyKey,
        job: jobs[preferredLegacyKey],
        legacy: true
      };
    }

    const prefix = `${String(recipeId)}::`;
    const legacyKey = Object.keys(jobs)
      .find(candidate => candidate.startsWith(prefix));

    if (!legacyKey) return null;

    return {
      key: legacyKey,
      job: jobs[legacyKey],
      legacy: true
    };
  }

  get(recipeId, crafter, inventoryActorUuid = null) {
    if (!recipeId || !crafter) return null;

    const cacheKey = this.#cacheKey(
      crafter.uuid,
      recipeId
    );

    const cached = this.cache.get(cacheKey);
    if (cached) return foundry.utils.deepClone(cached);

    const jobs = crafter.flags?.[MODULE_ID]?.[FLAG_KEY] ?? {};
    const found = this.#findPersistedJob(
      jobs,
      recipeId,
      inventoryActorUuid
    );

    if (!found?.job) return null;

    const normalized = {
      recipeId: String(recipeId),
      inventoryActorUuid: found.job.inventoryActorUuid ?? inventoryActorUuid ?? null,
      hoursRequired: found.job.hoursRequired ?? null,
      successes: Math.max(0, Number(found.job.successes ?? 0)),
      attempts: Math.max(0, Number(found.job.attempts ?? 0)),
      materialsConsumed: found.job.materialsConsumed === true,
      consumedMaterials: Array.isArray(found.job.consumedMaterials)
        ? foundry.utils.deepClone(found.job.consumedMaterials)
        : [],
      materialPlanSummary: found.job.materialPlanSummary ?? null,
      outputAwarded: found.job.outputAwarded === true,
      completedAt: found.job.completedAt ?? null,
      startedAt: found.job.startedAt ?? null,
      updatedAt: found.job.updatedAt ?? null
    };

    this.#cacheJob(crafter, normalized);
    return foundry.utils.deepClone(normalized);
  }

  getProgress(recipeId, crafter, inventoryActorUuid = null) {
    const job = this.get(
      recipeId,
      crafter,
      inventoryActorUuid
    );

    if (!job) return null;

    return {
      ...craftingProgressSummary({
        hoursRequired: job.hoursRequired,
        successes: job.successes,
        attempts: job.attempts
      }),
      recipeId: job.recipeId,
      crafterUuid: crafter.uuid,
      inventoryActorUuid: job.inventoryActorUuid ?? null,
      materialsConsumed: job.materialsConsumed,
      consumedMaterials: foundry.utils.deepClone(job.consumedMaterials ?? []),
      materialPlanSummary: job.materialPlanSummary ?? null,
      outputAwarded: job.outputAwarded,
      completedAt: job.completedAt,
      startedAt: job.startedAt,
      updatedAt: job.updatedAt
    };
  }

  async start({
    recipeId,
    crafter,
    inventoryActorUuid,
    hoursRequired,
    consumedMaterials,
    materialPlanSummary
  }) {
    if (!recipeId) throw new Error("Crafting job requires a recipe id.");
    if (!crafter) throw new Error("Crafting job requires a crafter Actor.");

    const jobs = this.#jobs(crafter);
    const key = this.#key(recipeId);
    const now = Date.now();

    const job = {
      recipeId: String(recipeId),
      inventoryActorUuid: String(inventoryActorUuid ?? ""),
      hoursRequired: Number(hoursRequired),
      successes: 0,
      attempts: 0,
      materialsConsumed: true,
      consumedMaterials: foundry.utils.deepClone(consumedMaterials ?? []),
      materialPlanSummary: materialPlanSummary ?? null,
      outputAwarded: false,
      completedAt: null,
      startedAt: now,
      updatedAt: now
    };

    jobs[key] = job;
    this.#removeLegacyKeys(jobs, recipeId);
    this.#cacheJob(crafter, job);

    await crafter.setFlag(
      MODULE_ID,
      FLAG_KEY,
      jobs
    );

    return foundry.utils.deepClone(job);
  }

  async recordAttempt(
    recipeId,
    crafter,
    inventoryActorUuid,
    { success }
  ) {
    const jobs = this.#jobs(crafter);
    const key = this.#key(recipeId);
    const existing = this.get(
      recipeId,
      crafter,
      inventoryActorUuid
    );

    if (!existing) {
      throw new Error("Crafting job not found.");
    }

    if (existing.outputAwarded) {
      throw new Error("This crafting job is already complete.");
    }

    const job = {
      ...existing,
      attempts: existing.attempts + 1,
      successes: existing.successes + (success ? 1 : 0),
      updatedAt: Date.now()
    };

    jobs[key] = job;
    this.#removeLegacyKeys(jobs, recipeId);
    this.#cacheJob(crafter, job);

    await crafter.setFlag(
      MODULE_ID,
      FLAG_KEY,
      jobs
    );

    return this.getProgress(
      recipeId,
      crafter,
      inventoryActorUuid
    );
  }

  async markOutputAwarded(
    recipeId,
    crafter,
    inventoryActorUuid = null
  ) {
    const jobs = this.#jobs(crafter);
    const key = this.#key(recipeId);
    const existing = this.get(
      recipeId,
      crafter,
      inventoryActorUuid
    );

    if (!existing) {
      throw new Error("Crafting job not found.");
    }

    const now = Date.now();
    const job = {
      ...existing,
      outputAwarded: true,
      completedAt: now,
      updatedAt: now
    };

    jobs[key] = job;
    this.#removeLegacyKeys(jobs, recipeId);
    this.#cacheJob(crafter, job);

    await crafter.setFlag(
      MODULE_ID,
      FLAG_KEY,
      jobs
    );

    return this.getProgress(
      recipeId,
      crafter,
      inventoryActorUuid
    );
  }

  async clear(recipeId, crafter) {
    if (!crafter) return false;

    const jobs = this.#jobs(crafter);
    const key = this.#key(recipeId);
    const legacyPrefix = `${String(recipeId)}::`;
    let changed = false;

    if (key in jobs) {
      delete jobs[key];
      changed = true;
    }

    for (const candidate of Object.keys(jobs)) {
      if (candidate.startsWith(legacyPrefix)) {
        delete jobs[candidate];
        changed = true;
      }
    }

    if (!changed) return false;

    this.#uncacheJob(
      recipeId,
      crafter
    );

    await crafter.setFlag(
      MODULE_ID,
      FLAG_KEY,
      jobs
    );

    return true;
  }

  #removeLegacyKeys(jobs, recipeId) {
    const prefix = `${String(recipeId)}::`;

    for (const candidate of Object.keys(jobs)) {
      if (candidate.startsWith(prefix)) {
        delete jobs[candidate];
      }
    }
  }
}
