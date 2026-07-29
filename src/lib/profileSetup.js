export const PROFILE_SETUP_VERSION = 1;

export const DEFAULT_PROFILE_PREFERENCES = Object.freeze({
  units: { weight: "lb", measurement: "in" },
  bodyModel: "unspecified",
  primaryGoal: "track",
  targetsSource: "skipped",
});

const VALID_WEIGHT_UNITS = new Set(["lb", "kg"]);
const VALID_MEASUREMENT_UNITS = new Set(["in", "cm"]);
const VALID_BODY_MODELS = new Set(["male", "female", "unspecified"]);
const VALID_GOALS = new Set(["maintain", "lose", "gain", "track"]);
const VALID_TARGET_SOURCES = new Set(["manual", "estimated", "skipped"]);

export function normalizeProfilePreferences(profile = {}) {
  const units = profile.units || {};
  return {
    units: {
      weight: VALID_WEIGHT_UNITS.has(units.weight) ? units.weight : DEFAULT_PROFILE_PREFERENCES.units.weight,
      measurement: VALID_MEASUREMENT_UNITS.has(units.measurement) ? units.measurement : DEFAULT_PROFILE_PREFERENCES.units.measurement,
    },
    bodyModel: VALID_BODY_MODELS.has(profile.bodyModel) ? profile.bodyModel : DEFAULT_PROFILE_PREFERENCES.bodyModel,
    primaryGoal: VALID_GOALS.has(profile.primaryGoal) ? profile.primaryGoal : DEFAULT_PROFILE_PREFERENCES.primaryGoal,
    targetsSource: VALID_TARGET_SOURCES.has(profile.targetsSource) ? profile.targetsSource : DEFAULT_PROFILE_PREFERENCES.targetsSource,
  };
}

export function profileSetupComplete(profile) {
  return Number(profile?.setupVersion) >= PROFILE_SETUP_VERSION && Boolean(profile?.setupCompletedAt);
}

export function completeProfileSetup(profile, answers, now = new Date().toISOString()) {
  const normalized = normalizeProfilePreferences({ ...profile, ...answers });
  return {
    ...profile,
    ...normalized,
    setupVersion: PROFILE_SETUP_VERSION,
    setupCompletedAt: now,
    ...(answers?.targets ? { targets: answers.targets } : {}),
    ...(answers?.activePlanId !== undefined ? { activePlanId: answers.activePlanId } : {}),
  };
}

export function validateTargets(targets) {
  const calories = Number(targets?.calories);
  const macros = ["protein", "carbs", "fat"].map((key) => Number(targets?.[key]));
  return Number.isFinite(calories) && calories > 0 && macros.every((value) => Number.isFinite(value) && value >= 0);
}
