export const CRAFTING_CHECK_INTERVAL_HOURS = 2;
export const DEFAULT_NO_TOOL_DC_MODIFIER = 5;

export function isValidCraftingDuration(hoursRequired) {
  const hours = Number(hoursRequired);
  return Number.isFinite(hours)
    && hours > 0
    && hours % CRAFTING_CHECK_INTERVAL_HOURS === 0;
}

/**
 * Reference-only crafting attempt result.
 *
 * Craftworks Premium can use this same rule later when execution is enabled:
 * - every attempt consumes the full check interval in character time;
 * - success adds the interval to crafting progress;
 * - failure adds no progress;
 * - a failed check does not discard the materials and items set aside for the project.
 */
export function resolveCraftingAttempt({
  success,
  intervalHours = CRAFTING_CHECK_INTERVAL_HOURS
} = {}) {
  const hours = Math.max(0, Number(intervalHours ?? 0));

  return {
    success: Boolean(success),
    timeSpentHours: hours,
    progressHours: success ? hours : 0,
    loseMaterials: false
  };
}


export function craftingSuccessesRequired(
  hoursRequired,
  intervalHours = CRAFTING_CHECK_INTERVAL_HOURS
) {
  const hours = Math.max(0, Number(hoursRequired ?? 0));
  const interval = Math.max(0.0001, Number(intervalHours ?? CRAFTING_CHECK_INTERVAL_HOURS));

  if (!hours) return 0;
  return hours / interval;
}

export function craftingProgressSummary({
  hoursRequired,
  successes = 0,
  attempts = 0,
  intervalHours = CRAFTING_CHECK_INTERVAL_HOURS
} = {}) {
  const requiredSuccesses = craftingSuccessesRequired(
    hoursRequired,
    intervalHours
  );
  const recordedSuccesses = Math.max(0, Number(successes ?? 0));
  const successfulChecks = requiredSuccesses > 0
    ? Math.min(requiredSuccesses, recordedSuccesses)
    : recordedSuccesses;
  const attemptedChecks = Math.max(0, Number(attempts ?? 0));
  const interval = Math.max(0, Number(intervalHours ?? CRAFTING_CHECK_INTERVAL_HOURS));

  return {
    hoursRequired: Math.max(0, Number(hoursRequired ?? 0)),
    requiredSuccesses,
    successes: successfulChecks,
    attempts: attemptedChecks,
    progressHours: Math.min(
      Math.max(0, Number(hoursRequired ?? 0)),
      successfulChecks * interval
    ),
    timeSpentHours: attemptedChecks * interval,
    complete: requiredSuccesses > 0 && successfulChecks >= requiredSuccesses
  };
}

export function cappedCraftingSuccesses(successes, hoursRequired, intervalHours = CRAFTING_CHECK_INTERVAL_HOURS) {
  const required = craftingSuccessesRequired(hoursRequired, intervalHours);
  const recorded = Math.max(0, Number(successes ?? 0));
  return required > 0 ? Math.min(required, recorded) : recorded;
}

// The recipe card shows the current craft. Downtime keeps reading timeSpentHours,
// which includes hours from crafts already awarded.
export function craftCardProgress(progress) {
  if (!progress) return null;
  if (!progress.outputAwarded) {
    return {
      ...progress,
      timeSpentHours: Number(progress.currentTimeSpentHours ?? progress.timeSpentHours ?? 0)
    };
  }
  return {
    ...progress,
    successes: 0,
    progressHours: 0,
    timeSpentHours: 0,
    attempts: 0,
    complete: false
  };
}
