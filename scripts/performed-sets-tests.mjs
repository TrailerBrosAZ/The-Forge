import assert from "node:assert/strict";
import { isPerformedSet, performedSets, sessionHasPerformedSet, sessionUsesExplicitSetCompletion } from "../src/lib/performedSets.js";
import { consistencyMatrix, exerciseProgression, weeklyCrossDomain, weeklyForgeBrief } from "../src/lib/insights.js";

const targets = { calories: 2200, protein: 150 };
const today = "2026-09-21";
const partialGuided = {
  date: today,
  sets: [
    { kind: "working", weight: "100", reps: "4", done: true },
    { kind: "working", weight: "100", reps: "4", done: false },
    { kind: "working", weight: "100", reps: "4", done: false },
    { kind: "working", weight: "100", reps: "4", done: false },
  ],
};
const untouchedGuided = {
  date: today,
  sets: partialGuided.sets.map((set) => ({ ...set, done: false })),
};
const logs = { lift: { sessions: [partialGuided] } };

assert.equal(sessionUsesExplicitSetCompletion(partialGuided), true);
assert.equal(performedSets(partialGuided).length, 1);
assert.equal(sessionHasPerformedSet(partialGuided), true);
const brief = weeklyForgeBrief({ workoutLogs: logs, targets, today });
assert.deepEqual(brief.training, { workouts: 1, workingSets: 1 });
assert.equal(brief.sentence, "1 training day logged.");

assert.equal(sessionHasPerformedSet(untouchedGuided), false);
const untouchedBrief = weeklyForgeBrief({ workoutLogs: { lift: { sessions: [untouchedGuided] } }, targets, today });
assert.deepEqual(untouchedBrief.training, { workouts: 0, workingSets: 0 });
assert.equal(consistencyMatrix({ workoutLogs: { lift: { sessions: [untouchedGuided] } }, targets, today }).find((day) => day.date === today).training, false);

const legacyReps = { date: today, sets: [{ weight: "80", reps: "8" }] };
assert.equal(sessionUsesExplicitSetCompletion(legacyReps), false);
assert.equal(isPerformedSet(legacyReps.sets[0]), true);
assert.equal(weeklyForgeBrief({ workoutLogs: { legacy: { sessions: [legacyReps] } }, targets, today }).training.workingSets, 1);

const completedAdvanced = {
  date: today,
  sets: [
    { kind: "warmup", weight: "40", reps: "10", done: true },
    { kind: "working", weight: "100", reps: "8", done: true },
    { kind: "drop", weight: "50", reps: "12", done: true },
  ],
};
assert.equal(weeklyForgeBrief({ workoutLogs: { advanced: { sessions: [completedAdvanced] } }, targets, today }).training.workingSets, 2);

const mixedGuided = { date: today, sets: [{ reps: "8", done: true }, { reps: "8", done: false }, { reps: "8" }] };
assert.deepEqual(performedSets(mixedGuided), [mixedGuided.sets[0]]);

const legacyDuration = { date: today, sets: [{ type: "cardio", duration: "30" }] };
assert.equal(sessionHasPerformedSet(legacyDuration), true);
assert.deepEqual(weeklyForgeBrief({ workoutLogs: { cardio: { sessions: [legacyDuration] } }, targets, today }).training, { workouts: 1, workingSets: 0 });

const guidedCardio = { date: today, sets: [{ type: "cardio", duration: "30", done: true }] };
assert.deepEqual(weeklyForgeBrief({ workoutLogs: { cardio: { sessions: [guidedCardio] } }, targets, today }).training, { workouts: 1, workingSets: 0 });

const cross = weeklyCrossDomain({ workoutLogs: logs, targets, today, weeks: 1 }).rows[0];
assert.deepEqual({ workouts: cross.workouts, volume: cross.volume }, { workouts: 1, volume: 400 });
assert.equal(exerciseProgression([partialGuided])[0].volume, 400);

console.log("Performed-set analytics tests passed.");
