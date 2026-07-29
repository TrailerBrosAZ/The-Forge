export const WORKOUT_SCHEMA_VERSION = 3;
export const LOAD_MODES = Object.freeze({
  EXTERNAL: "external",
  BODYWEIGHT: "bodyweight",
  ADDED: "added",
  ASSISTED: "assisted",
});
export const SET_KINDS = Object.freeze({
  WORKING: "working",
  WARMUP: "warmup",
  DROP: "drop",
  AMRAP: "amrap",
  TIMED: "timed",
});
const VALID_SET_KINDS = new Set(Object.values(SET_KINDS));
const VALID_GROUP_TYPES = new Set(["superset", "circuit"]);

export function normalizeSetKind(set) {
  return VALID_SET_KINDS.has(set?.kind) ? set.kind : SET_KINDS.WORKING;
}

export function dropSetPrescription(exercise) {
  const advanced = exercise?.advancedSets?.drop;
  const repParts = String(exercise?.r || "").split("/").map((part) => part.trim()).filter(Boolean);
  const inferred = /\bdrop\s*set\b/i.test(String(exercise?.note || "")) && repParts.length >= 2;
  if (!advanced && !inferred) return null;
  return {
    workingReps: String(advanced?.workingReps || repParts[0] || exercise?.r || ""),
    dropReps: String(advanced?.reps || repParts[1] || repParts[0] || exercise?.r || ""),
    ratio: Number(advanced?.loadRatio) > 0 ? Number(advanced.loadRatio) : 0.5,
  };
}

export function setClusterKey(set, index) {
  return set?.clusterId || set?.setId || `row-${index}`;
}

export function completedWorkingSetCount(sets = [], explicitDone = true) {
  const groups = new Map();
  sets.forEach((set, index) => {
    if (normalizeSetKind(set) === SET_KINDS.WARMUP) return;
    const key = setClusterKey(set, index);
    const rows = groups.get(key) || [];
    rows.push(set);
    groups.set(key, rows);
  });
  return [...groups.values()].filter((rows) => rows.every((set) => (
    explicitDone ? set?.done === true : Number(set?.reps) > 0 || Number(set?.durationSeconds) > 0
  ))).length;
}

export function groupIndices(exercises = [], exerciseIndex) {
  const groupId = exercises[exerciseIndex]?.groupId;
  if (!groupId) return [exerciseIndex];
  return exercises.map((exercise, index) => exercise?.groupId === groupId ? index : -1).filter((index) => index >= 0);
}

export function exerciseGroupLabel(exercises = [], exerciseIndex) {
  const indices = groupIndices(exercises, exerciseIndex);
  if (indices.length < 2) return "";
  return `A${indices.indexOf(exerciseIndex) + 1}`;
}

const VALID_LOAD_MODES = new Set(Object.values(LOAD_MODES));
const CLEAR_BODYWEIGHT_EXERCISES = new Set([
  "BICYCLE CRUNCH",
  "BIRD DOGS",
  "DEAD BUG",
  "DIP",
  "GLUTE BRIDGE",
  "GLUTE HAM RAISE",
  "HANGING LEG RAISE",
  "HEEL SLIDES",
  "PELVIC TILTS",
  "PUSH UP",
  "PUSH-UP",
]);

export function exerciseLoadMode(exercise) {
  if (VALID_LOAD_MODES.has(exercise?.loadMode)) return exercise.loadMode;
  const name = String(exercise?.n || "").trim().toUpperCase();
  if (CLEAR_BODYWEIGHT_EXERCISES.has(name) || name.startsWith("BODYWEIGHT ")) {
    return LOAD_MODES.BODYWEIGHT;
  }
  if (name.startsWith("WEIGHTED ")) return LOAD_MODES.ADDED;
  if (name.startsWith("ASSISTED ")) return LOAD_MODES.ASSISTED;
  return LOAD_MODES.EXTERNAL;
}

export function loadFieldLabel(exercise) {
  const mode = exerciseLoadMode(exercise);
  if (mode === LOAD_MODES.ADDED) return "Added";
  if (mode === LOAD_MODES.ASSISTED) return "Assistance";
  return "Weight";
}

export function formatStrengthSet(exercise, set, empty = "—") {
  const reps = Number(set?.reps) > 0 ? String(set.reps) : empty;
  const mode = exerciseLoadMode(exercise);
  if (mode === LOAD_MODES.BODYWEIGHT) return `${reps} reps`;
  const weight = set?.weight !== "" && set?.weight != null ? String(set.weight) : empty;
  if (mode === LOAD_MODES.ADDED) return `+${weight}×${reps}`;
  if (mode === LOAD_MODES.ASSISTED) return `${weight} assist×${reps}`;
  return `${weight}×${reps}`;
}

export function strengthSetScore(exercise, set) {
  const kind = normalizeSetKind(set);
  if (kind === SET_KINDS.WARMUP || kind === SET_KINDS.DROP || kind === SET_KINDS.TIMED) return null;
  const reps = Number(set?.reps);
  if (!(reps > 0)) return null;
  const mode = exerciseLoadMode(exercise);
  if (mode === LOAD_MODES.BODYWEIGHT) return reps;
  const weight = Number(set?.weight);
  if (!(weight >= 0) || set?.weight === "") return null;
  if (mode === LOAD_MODES.ASSISTED) return -weight;
  return weight;
}

export function bestStrengthSet(exercise, sessions) {
  let best = null;
  (sessions || []).forEach((session) => {
    (session.sets || []).forEach((set) => {
      const score = strengthSetScore(exercise, set);
      if (score == null) return;
      if (!best || score > best.score || (score === best.score && Number(set.reps) > Number(best.set.reps))) {
        best = { score, set, date: session.date };
      }
    });
  });
  return best;
}

export function stableId(...parts) {
  const input = parts.map((part) => String(part ?? "")).join("|");
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `f-${(hash >>> 0).toString(36)}`;
}

export function planWeeks(plan) {
  if (!plan) return [];
  if (plan.structure === "weeks") return plan.weeks || [];
  return [{ id: stableId(plan.id, "repeat"), wk: null, blk: null, days: plan.days || [] }];
}

export function weekIdentity(plan, week, weekIndex) {
  return week?.id || stableId(plan?.id, "week", week?.wk ?? weekIndex + 1);
}

export function dayIdentity(plan, week, day, weekIndex, dayIndex) {
  return day?.id || stableId(
    plan?.id,
    weekIdentity(plan, week, weekIndex),
    "day",
    day?.d ?? dayIndex + 1,
  );
}

export function exerciseIdentity(plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex) {
  return exercise?.id || stableId(
    plan?.id,
    weekIdentity(plan, week, weekIndex),
    dayIdentity(plan, week, day, weekIndex, dayIndex),
    "exercise",
    exerciseIndex,
    exercise?.n,
  );
}

export function legacyLogKey(plan, dayNumber, exerciseName, weekNumber) {
  return plan.structure === "weeks"
    ? `${plan.id}|w${weekNumber}|d${dayNumber}|${exerciseName}`
    : `${plan.id}|d${dayNumber}|${exerciseName}`;
}

export function stableLogKey(plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex) {
  return [
    "v2",
    plan.id,
    weekIdentity(plan, week, weekIndex),
    dayIdentity(plan, week, day, weekIndex, dayIndex),
    exerciseIdentity(plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex),
  ].join("|");
}

export function resolveWorkoutLogIdentity(key, plans) {
  const parts = String(key || "").split("|");
  const modern = parts[0] === "v2";
  const planId = modern ? parts[1] : parts[0];
  const plan = (plans || []).find((candidate) => candidate.id === planId);
  if (!modern) {
    const exerciseName = parts.at(-1) || "";
    let exercise = null;
    for (const week of planWeeks(plan)) {
      for (const day of week.days || []) {
        exercise = (day.ex || []).find((candidate) => candidate.n === exerciseName);
        if (exercise) break;
      }
      if (exercise) break;
    }
    return { planId, exerciseName, zones: exercise?.mz || {}, loadMode: exerciseLoadMode(exercise) };
  }

  const [, , weekId, dayId, exerciseId] = parts;
  const week = planWeeks(plan).find((candidate) => candidate.id === weekId);
  const day = (week?.days || []).find((candidate) => candidate.id === dayId);
  const exercise = (day?.ex || []).find((candidate) => candidate.id === exerciseId);
  return {
    planId,
    exerciseName: exercise?.n || exerciseId || "",
    zones: exercise?.mz || {},
    loadMode: exerciseLoadMode(exercise),
  };
}

export function logForExercise(logs, plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex) {
  const modern = logs?.[stableLogKey(plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex)];
  if (modern) return modern;
  return logs?.[legacyLogKey(plan, day.d, exercise.n, week?.wk)] || null;
}

export function sessionOnDate(log, date) {
  return (log?.sessions || []).find((session) => session.date === date) || null;
}

export function exerciseCompleteOnDate(log, date, exercise) {
  const session = sessionOnDate(log, date);
  if (!session) return false;
  if (!Array.isArray(session.sets) || session.sets.length === 0) return false;
  if (exercise?.type === "cardio" || session.sets.some((set) => set?.type === "cardio")) {
    return session.sets.some((set) => set?.done === true || Number(set?.duration) > 0);
  }
  const strengthSets = session.sets.filter((set) => set?.type !== "cardio");
  const hasGuidedState = strengthSets.some((set) => typeof set?.done === "boolean");
  if (!hasGuidedState) {
    // Historical and list-mode sessions predate explicit per-set completion.
    return strengthSets.some((set) => Number(set?.reps) > 0 || Number(set?.durationSeconds) > 0);
  }
  const targetSets = Math.max(1, parseInt(exercise?.ws, 10) || strengthSets.length || 1);
  return completedWorkingSetCount(strengthSets, true) >= targetSets;
}

export function exerciseCompleteEver(log, exercise) {
  return (log?.sessions || []).some((session) => (
    exerciseCompleteOnDate(log, session.date, exercise)
  ));
}

export function dayProgress(logs, plan, weekIndex, dayIndex, date) {
  const weeks = planWeeks(plan);
  const week = weeks[weekIndex];
  const day = week?.days?.[dayIndex];
  const exercises = (day?.ex || []).filter(Boolean);
  const required = exercises.length;
  const completed = exercises.reduce((sum, exercise, exerciseIndex) => (
    sum + (exerciseCompleteOnDate(
      logForExercise(logs, plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex),
      date,
      exercise,
    ) ? 1 : 0)
  ), 0);
  return {
    required,
    completed,
    complete: required > 0 && completed === required,
    empty: required === 0,
  };
}

export function historicalDayProgress(logs, plan, weekIndex, dayIndex) {
  const weeks = planWeeks(plan);
  const week = weeks[weekIndex];
  const day = week?.days?.[dayIndex];
  const exercises = (day?.ex || []).filter(Boolean);
  const required = exercises.length;
  const completed = exercises.reduce((sum, exercise, exerciseIndex) => (
    sum + (exerciseCompleteEver(
      logForExercise(logs, plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex),
      exercise,
    ) ? 1 : 0)
  ), 0);
  return {
    required,
    completed,
    complete: required > 0 && completed === required,
    empty: required === 0,
  };
}

function completionDatesForDay(logs, plan, week, day, weekIndex, dayIndex) {
  const exercises = day?.ex || [];
  if (!exercises.length) return [];
  const dates = new Set();
  exercises.forEach((exercise, exerciseIndex) => {
    const log = logForExercise(logs, plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex);
    (log?.sessions || []).forEach((session) => dates.add(session.date));
  });
  return [...dates].filter((date) => (
    exercises.every((exercise, exerciseIndex) => exerciseCompleteOnDate(
      logForExercise(logs, plan, week, day, exercise, weekIndex, dayIndex, exerciseIndex),
      date,
      exercise,
    ))
  )).sort();
}

export function findPartialWorkout(logs, plan, date) {
  const weeks = planWeeks(plan);
  for (let wi = 0; wi < weeks.length; wi += 1) {
    const week = weeks[wi];
    for (let di = 0; di < (week.days || []).length; di += 1) {
      const progress = dayProgress(logs, plan, wi, di, date);
      const day = week.days[di];
      const hasStarted = (day.ex || []).some((exercise, exerciseIndex) => sessionOnDate(
        logForExercise(logs, plan, week, day, exercise, wi, di, exerciseIndex),
        date,
      ));
      if (hasStarted && !progress.complete) {
        const exerciseIndex = (day.ex || []).findIndex((exercise, ei) => !exerciseCompleteOnDate(
          logForExercise(logs, plan, week, day, exercise, wi, di, ei),
          date,
          exercise,
        ));
        return { weekIndex: wi, dayIndex: di, exerciseIndex: Math.max(0, exerciseIndex), reason: "partial" };
      }
    }
  }
  return null;
}

export function findNextWorkout(logs, plan, date) {
  if (!plan) return { weekIndex: 0, dayIndex: 0, exerciseIndex: 0, reason: "none" };
  const partial = findPartialWorkout(logs, plan, date);
  if (partial) return partial;
  const weeks = planWeeks(plan);

  if (plan.structure === "weeks") {
    for (let wi = 0; wi < weeks.length; wi += 1) {
      const week = weeks[wi];
      for (let di = 0; di < (week.days || []).length; di += 1) {
        const day = week.days[di];
        if (!day.ex?.length) continue;
        const hasAnyCompleteDate = completionDatesForDay(logs, plan, week, day, wi, di).length > 0;
        if (!hasAnyCompleteDate) return { weekIndex: wi, dayIndex: di, exerciseIndex: 0, reason: "next" };
      }
    }
    return {
      weekIndex: Math.max(0, weeks.length - 1),
      dayIndex: Math.max(0, (weeks.at(-1)?.days?.length || 1) - 1),
      exerciseIndex: 0,
      reason: "program-complete",
    };
  }

  const days = weeks[0]?.days || [];
  let latest = null;
  days.forEach((day, dayIndex) => {
    completionDatesForDay(logs, plan, weeks[0], day, 0, dayIndex).forEach((completedDate) => {
      if (!latest || completedDate > latest.date) latest = { date: completedDate, dayIndex };
    });
  });
  if (!latest) {
    const first = days.findIndex((day) => day.ex?.length);
    return { weekIndex: 0, dayIndex: Math.max(0, first), exerciseIndex: 0, reason: "next" };
  }
  for (let offset = 1; offset <= days.length; offset += 1) {
    const dayIndex = (latest.dayIndex + offset) % days.length;
    if (days[dayIndex]?.ex?.length) return { weekIndex: 0, dayIndex, exerciseIndex: 0, reason: "next" };
  }
  return { weekIndex: 0, dayIndex: latest.dayIndex, exerciseIndex: 0, reason: "next" };
}

export function ensurePlanIds(plan) {
  const copy = structuredClone(plan);
  const weeks = planWeeks(copy);
  weeks.forEach((week, wi) => {
    week.id ||= weekIdentity(copy, week, wi);
    (week.days || []).forEach((day, di) => {
      day.id ||= dayIdentity(copy, week, day, wi, di);
      (day.ex || []).forEach((exercise, ei) => {
        exercise.id ||= exerciseIdentity(copy, week, day, exercise, wi, di, ei);
        if (exercise?.type !== "cardio") exercise.loadMode = exerciseLoadMode(exercise);
        if (!exercise.groupId || !VALID_GROUP_TYPES.has(exercise.groupType)) {
          delete exercise.groupId;
          delete exercise.groupType;
          delete exercise.groupPosition;
          delete exercise.groupRest;
        }
      });
    });
  });
  if (copy.structure === "days") copy.days = weeks[0]?.days || [];
  else copy.weeks = weeks;
  copy.schemaVersion = WORKOUT_SCHEMA_VERSION;
  return copy;
}

export function clonePlanForProfile(plan, profileId, newId, newName) {
  const copy = structuredClone(plan);
  copy.id = newId;
  copy.name = newName || `${plan.name} - Custom`;
  copy.createdBy = profileId;
  copy.builtin = false;
  delete copy.schemaVersion;
  const clearIds = (days) => days.forEach((day) => {
    delete day.id;
    (day.ex || []).forEach((exercise) => delete exercise.id);
  });
  if (copy.structure === "weeks") {
    copy.weeks.forEach((week) => {
      delete week.id;
      clearIds(week.days || []);
    });
  } else clearIds(copy.days || []);
  return ensurePlanIds(copy);
}
