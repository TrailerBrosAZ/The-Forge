import assert from "node:assert/strict";
import {
  bestStrengthSet,
  clonePlanForProfile,
  completedWorkingSetCount,
  dayProgress,
  dropSetPrescription,
  ensurePlanIds,
  exerciseCompleteEver,
  exerciseLoadMode,
  exerciseGroupLabel,
  findNextWorkout,
  formatStrengthSet,
  historicalDayProgress,
  legacyLogKey,
  LOAD_MODES,
  resolveWorkoutLogIdentity,
  repSegmentTargets,
  SET_KINDS,
  setRepSegments,
  setReps,
  stableLogKey,
  strengthSetScore,
} from "../src/lib/workoutLogic.js";
import {
  createTimerState,
  extendTimerState,
  pauseTimerState,
  remainingSeconds,
  resumeTimerState,
} from "../src/lib/deadlineTimer.js";
import { parseEvoltPageItems } from "../src/lib/evoltParser.js";
import {
  foodFromOpenFoodFacts,
  normalizeBarcode,
  parseNutritionLabelText,
} from "../src/lib/nutritionImport.js";
import { completeProfileSetup, normalizeProfilePreferences, profileSetupComplete, validateTargets } from "../src/lib/profileSetup.js";
import { copyMealIntoDay, rankFoodSuggestions } from "../src/lib/foodHistory.js";
import { csvCell, rowsToCsv, workoutCsvRows } from "../src/lib/csvExport.js";
import { createBackupObject, inspectBackupText, summarizeStoredData, validateBackupObject } from "../src/lib/backup.js";
import { consistencyMatrix, exerciseProgression, recompositionSeries, scanComparison, weeklyCrossDomain, weeklyForgeBrief } from "../src/lib/insights.js";
import "./nutrition-history-tests.mjs";
import "./performed-sets-tests.mjs";

const plan = ensurePlanIds({
  id: "plan",
  structure: "weeks",
  weeks: [
    { wk: 1, days: [{ d: 1, ex: [{ n: "Squat" }, { n: "Row" }] }] },
    { wk: 2, days: [{ d: 1, ex: [{ n: "Press" }] }] },
  ],
});
assert.equal(plan.weeks[0].days[0].ex.every((exercise) => exercise.id), true);

const date = "2026-07-26";
const squatKey = stableLogKey(plan, plan.weeks[0], plan.weeks[0].days[0], plan.weeks[0].days[0].ex[0], 0, 0, 0);
const rowLegacyKey = legacyLogKey(plan, 1, "Row", 1);
const logs = {
  [squatKey]: { sessions: [{ date, sets: [{ reps: "8", weight: "100" }] }] },
  [rowLegacyKey]: { sessions: [{ date, sets: [{ reps: "10", weight: "50" }] }] },
};
assert.deepEqual(dayProgress(logs, plan, 0, 0, date), { required: 2, completed: 2, complete: true, empty: false });
assert.deepEqual(historicalDayProgress(logs, plan, 0, 0), { required: 2, completed: 2, complete: true, empty: false });
assert.equal(exerciseCompleteEver(logs[squatKey], plan.weeks[0].days[0].ex[0]), true);
assert.deepEqual(findNextWorkout(logs, plan, date), { weekIndex: 1, dayIndex: 0, exerciseIndex: 0, reason: "next" });

const splitDateLogs = {
  [squatKey]: { sessions: [{ date: "2026-07-24", sets: [{ reps: "8", weight: "100" }] }] },
  [rowLegacyKey]: { sessions: [{ date: "2026-07-25", sets: [{ reps: "10", weight: "50" }] }] },
};
assert.equal(historicalDayProgress(splitDateLogs, plan, 0, 0).complete, true);
assert.deepEqual(findNextWorkout(splitDateLogs, plan, date), { weekIndex: 1, dayIndex: 0, exerciseIndex: 0, reason: "next" });

const partial = { [squatKey]: logs[squatKey] };
assert.deepEqual(historicalDayProgress(partial, plan, 0, 0), { required: 2, completed: 1, complete: false, empty: false });
assert.deepEqual(findNextWorkout(partial, plan, date), { weekIndex: 0, dayIndex: 0, exerciseIndex: 1, reason: "partial" });
assert.deepEqual(resolveWorkoutLogIdentity(squatKey, [plan]), {
  planId: "plan",
  exerciseName: "Squat",
  zones: {},
  loadMode: LOAD_MODES.EXTERNAL,
});
assert.deepEqual(resolveWorkoutLogIdentity(rowLegacyKey, [plan]), {
  planId: "plan",
  exerciseName: "Row",
  zones: {},
  loadMode: LOAD_MODES.EXTERNAL,
});

const bodyweightExercise = ensurePlanIds({
  id: "bodyweight",
  structure: "days",
  days: [{ d: 1, ex: [{ n: "Hanging Leg Raise" }, { n: "Dip" }, { n: "Swiss Ball Leg Curl" }, { n: "Ab Wheel Rollout" }, { n: "Chin-Up" }, { n: "Weighted Pull-Up" }] }],
}).days[0].ex;
assert.equal(exerciseLoadMode(bodyweightExercise[0]), LOAD_MODES.BODYWEIGHT);
assert.equal(exerciseLoadMode(bodyweightExercise[1]), LOAD_MODES.BODYWEIGHT);
assert.equal(exerciseLoadMode(bodyweightExercise[2]), LOAD_MODES.BODYWEIGHT);
assert.equal(exerciseLoadMode(bodyweightExercise[3]), LOAD_MODES.BODYWEIGHT);
assert.equal(exerciseLoadMode(bodyweightExercise[4]), LOAD_MODES.BODYWEIGHT);
assert.equal(exerciseLoadMode(bodyweightExercise[5]), LOAD_MODES.ADDED);
assert.equal(exerciseLoadMode({ n: "Dip", loadMode: LOAD_MODES.ADDED }), LOAD_MODES.ADDED);
assert.equal(formatStrengthSet(bodyweightExercise[0], { reps: "12", weight: "0" }), "12 reps");
assert.equal(formatStrengthSet(bodyweightExercise[5], { reps: "6", weight: "25" }), "+25×6");

const curlDrop = { n: "Supinated EZ Bar Curl", ws: "3", r: "15/15", note: "DROPSET. DROP WEIGHT BY ~50% ON SECOND 15 REPS." };
assert.deepEqual(dropSetPrescription(curlDrop), { workingReps: "15", dropReps: "15", ratio: 0.5 });
assert.deepEqual(repSegmentTargets(curlDrop), []);
assert.deepEqual(repSegmentTargets({ r: "7/7/7" }), ["7", "7", "7"]);
assert.deepEqual(repSegmentTargets({ r: "10+2" }), ["10", "2"]);
assert.deepEqual(repSegmentTargets({ r: "3-5" }), []);
const curlPhases = setRepSegments({ kind: SET_KINDS.WORKING, done: true, weight: "40" }, ["7", "7", "6"]);
assert.equal(curlPhases.reps, "20");
assert.equal(setReps(curlPhases), 20);
assert.equal(completedWorkingSetCount([curlPhases]), 1);
assert.equal(setReps(setRepSegments(curlPhases, ["7", "", "6"])), 0);
const clusteredSets = [
  { kind: SET_KINDS.WORKING, clusterId: "c1", segmentIndex: 0, weight: "40", reps: "15", done: true },
  { kind: SET_KINDS.DROP, clusterId: "c1", segmentIndex: 1, weight: "20", reps: "15", done: true },
  { kind: SET_KINDS.WORKING, clusterId: "c2", segmentIndex: 0, weight: "40", reps: "15", done: true },
  { kind: SET_KINDS.DROP, clusterId: "c2", segmentIndex: 1, weight: "20", reps: "15", done: false },
  { kind: SET_KINDS.WARMUP, weight: "15", reps: "10", done: true },
];
assert.equal(completedWorkingSetCount(clusteredSets), 1);
assert.equal(strengthSetScore(curlDrop, clusteredSets[0]), 40);
assert.equal(strengthSetScore(curlDrop, clusteredSets[1]), null);
const groupedExercises = [{ n: "Curl", groupId: "g", groupType: "superset" }, { n: "Pressdown", groupId: "g", groupType: "superset" }];
assert.equal(exerciseGroupLabel(groupedExercises, 0), "A1");
assert.equal(exerciseGroupLabel(groupedExercises, 1), "A2");
const advancedPlan = ensurePlanIds({ id: "advanced", structure: "days", days: [{ d: 1, ex: groupedExercises }] });
assert.equal(advancedPlan.schemaVersion, 3);
assert.equal(advancedPlan.days[0].ex[0].groupId, "g");
assert.equal(advancedPlan.days[0].ex.every((exercise) => Boolean(exercise.id)), true);

const normalizedPreferences = normalizeProfilePreferences({ units: { weight: "kg", measurement: "cm" }, bodyModel: "female", primaryGoal: "gain" });
assert.equal(normalizedPreferences.units.weight, "kg");
assert.equal(normalizedPreferences.bodyModel, "female");
assert.equal(validateTargets({ calories: 2200, protein: 150, carbs: 220, fat: 70 }), true);
assert.equal(validateTargets({ calories: 0, protein: 150, carbs: 220, fat: 70 }), false);
const configuredProfile = completeProfileSetup({ id: "p1", name: "Alex" }, normalizedPreferences);
assert.equal(profileSetupComplete(configuredProfile), true);

const mealHistory = {
  "2026-07-26": { breakfast: [{ id: "old", name: "Cottage Cheese", calories: 100, protein: 12, carbs: 4, fat: 2 }] },
  "2026-07-27": { breakfast: [{ id: "newer", name: "Cottage Cheese", calories: 100, protein: 12, carbs: 4, fat: 2 }] },
};
const suggestions = rankFoodSuggestions({ dayLog: mealHistory, targetMeal: "breakfast", todayKey: "2026-07-28" });
assert.equal(suggestions[0].name, "Cottage Cheese");
assert.match(suggestions[0].suggestionReason, /Often at breakfast/);
const copiedHistory = copyMealIntoDay({ dayLog: mealHistory, sourceDate: "2026-07-27", targetDate: "2026-07-28", meal: "breakfast", createId: () => "copy" });
assert.equal(copiedHistory["2026-07-28"].breakfast[0].id, "copy");
assert.notEqual(copiedHistory["2026-07-28"].breakfast[0], mealHistory["2026-07-27"].breakfast[0]);

assert.equal(csvCell("plain"), "plain");
assert.equal(csvCell("a,b"), "\"a,b\"");
assert.equal(csvCell("=SUM(A1:A2)"), "'=SUM(A1:A2)");
assert.equal(rowsToCsv(["name", "value"], [{ name: "Squat", value: 100 }]), "\uFEFFname,value\r\nSquat,100");
const workoutRows = workoutCsvRows({ profile: { name: "Alex" }, plans: [plan], workoutLogs: logs, resolveIdentity: resolveWorkoutLogIdentity });
assert.equal(workoutRows.find((row) => row.exercise === "Squat").week, 1);
assert.equal(workoutRows.find((row) => row.exercise === "Squat").day, 1);
const segmentedExport = workoutCsvRows({
  profile: { name: "Alex" }, plans: [plan],
  workoutLogs: { [squatKey]: { sessions: [{ date, sets: [curlPhases] }] } },
  resolveIdentity: resolveWorkoutLogIdentity,
});
assert.equal(segmentedExport[0].reps, "20");
assert.equal(segmentedExport[0].rep_segments, "7/7/6");

const storedData = {
  "theforge:profiles": JSON.stringify([{ id: "p1", name: "Alex" }]),
  "theforge:p1:workoutLogs": JSON.stringify({ squat: { sessions: [{ date: "2026-07-28", sets: [] }] } }),
  "theforge:p1:dayLog": JSON.stringify({ "2026-07-28": { breakfast: [{ name: "Eggs" }] } }),
};
const backupSummary = summarizeStoredData(storedData, [{ key: "p1:scan" }]);
assert.equal(backupSummary.workoutSessions, 1);
assert.equal(backupSummary.foodEntries, 1);
assert.equal(backupSummary.scanDocuments, 1);
const backupFixture = createBackupObject({ appRelease: "test", data: storedData, scanDocuments: [], exportedAt: "2026-07-28T12:00:00.000Z" });
assert.equal(inspectBackupText(JSON.stringify(backupFixture)).summary.profiles, 1);
assert.equal(validateBackupObject({ ...backupFixture, version: 1 }).version, 1);
assert.equal(validateBackupObject({ ...backupFixture, version: 2 }).version, 2);
assert.throws(() => validateBackupObject({ ...backupFixture, data: { unsafe: "{}" } }), /invalid data/);
assert.equal(strengthSetScore(bodyweightExercise[0], { reps: "15" }), 15);
assert.equal(strengthSetScore({ loadMode: LOAD_MODES.ASSISTED }, { reps: "8", weight: "40" }), -40);
assert.equal(bestStrengthSet(bodyweightExercise[0], [
  { date: "2026-07-01", sets: [{ reps: "10" }] },
  { date: "2026-07-02", sets: [{ reps: "14" }] },
]).set.reps, "14");

const guidedPartial = {
  [squatKey]: { sessions: [{ date, sets: [{ reps: "8", done: true }, { reps: "8", done: false }] }] },
};
assert.deepEqual(findNextWorkout(guidedPartial, plan, date), { weekIndex: 0, dayIndex: 0, exerciseIndex: 0, reason: "partial" });

const customized = clonePlanForProfile(plan, "profile", "custom", "Custom");
assert.equal(customized.weeks.length, 2);
assert.notEqual(customized.weeks[0].days[0].ex[0].id, plan.weeks[0].days[0].ex[0].id);
assert.equal(ensurePlanIds(plan).weeks[0].days[0].ex[0].id, plan.weeks[0].days[0].ex[0].id);

const repeating = ensurePlanIds({
  id: "repeat",
  structure: "days",
  days: [
    { d: 1, ex: [{ n: "A" }] },
    { d: 2, ex: [{ n: "B" }] },
  ],
});
const repeatKey = legacyLogKey(repeating, 1, "A", null);
assert.deepEqual(findNextWorkout({
  [repeatKey]: { sessions: [{ date: "2026-07-25", sets: [{ reps: "5" }] }] },
}, repeating, date), { weekIndex: 0, dayIndex: 1, exerciseIndex: 0, reason: "next" });

const timer = createTimerState(90, 1_000);
assert.equal(remainingSeconds(timer.endAt, 61_000), 30);
const paused = pauseTimerState(timer, 31_000);
assert.equal(paused.pausedRemaining, 60);
const resumed = resumeTimerState(paused, 100_000);
assert.equal(remainingSeconds(resumed.endAt, 130_000), 30);
assert.equal(remainingSeconds(extendTimerState(resumed, 30, 130_000).endAt, 130_000), 60);

const labelFood = parseNutritionLabelText(`
Nutrition Facts
Serving size 1 cup (226g)
Calories 180
Total Fat 5g
Total Carbohydrate 8g
Protein 24g
`);
assert.equal(labelFood.servingNote, "1 cup (226g)");
assert.equal(labelFood.calories, 180);
assert.equal(labelFood.fat, 5);
assert.equal(labelFood.carbs, 8);
assert.equal(labelFood.protein, 24);
assert.equal(parseNutritionLabelText("Serving size 1 cup (559g)\nCalories 100\nTotal Fat 2g").warnings.some((warning) => warning.includes("serving-size")), true);
assert.equal(normalizeBarcode("0 12345-67890 5"), "012345678905");
assert.equal(normalizeBarcode("123"), "");

const openFood = foodFromOpenFoodFacts({
  product_name: "Cottage Cheese",
  brands: "Forge Foods",
  serving_size: "1/2 cup (113 g)",
  serving_quantity: 113,
  nutriments: {
    "energy-kcal_100g": 90,
    proteins_100g: 12,
    carbohydrates_100g: 4,
    fat_100g: 2.5,
  },
}, "012345678905");
assert.equal(openFood.name, "Forge Foods Cottage Cheese");
assert.equal(openFood.calories, 101.7);
assert.equal(openFood.protein, 13.6);
assert.equal(openFood.barcode, "012345678905");

const pdfItems = [
  { text: "YOUR EVOLT 360 BODY SCAN", x: 190, y: 809 },
  { text: "07-18-2026 10:01", x: 21, y: 776.5 },
  { text: "QA", x: 164, y: 776.5 },
  { text: "6 ft 0 in", x: 21, y: 739.5 },
  { text: "200 lb", x: 164, y: 739.5 },
  { text: "30", x: 307, y: 739.5 },
  { text: "Male", x: 450, y: 739.5 },
  { text: "150 / Optimal", x: 21, y: 660.5 },
  { text: "50 / High", x: 164, y: 660.5 },
  { text: "8 / Optimal", x: 307, y: 660.5 },
  { text: "80 / Optimal", x: 21, y: 620.5 },
  { text: "42", x: 164, y: 620.5 },
  { text: "[ 21% ]", x: 260, y: 621.2 },
  { text: "60", x: 307, y: 620.5 },
  { text: "[ 60% ]", x: 409, y: 621.2 },
  { text: "8", x: 164, y: 580.5 },
  { text: "[ 4% ]", x: 264, y: 581.2 },
  { text: "40", x: 307, y: 580.5 },
  { text: "[ 40% ]", x: 409, y: 581.2 },
  { text: "100", x: 21, y: 500.5 },
  { text: "25%", x: 164, y: 500.5 },
];
const parsedScan = parseEvoltPageItems(pdfItems, "fixture.pdf");
assert.equal(parsedScan.scanDate, "2026-07-18");
assert.equal(parsedScan.metrics.find((metric) => metric.code === "weight").originalUnit, "lb");
assert.ok(Math.abs(parsedScan.metrics.find((metric) => metric.code === "weight").value - 90.7185) < 0.001);
assert.equal(parsedScan.warnings.length, 0);

const insightLogs = {
  lift: { sessions: [
    { date: "2026-07-20", sets: [{ kind: SET_KINDS.WARMUP, weight: 40, reps: 10 }, { kind: SET_KINDS.WORKING, weight: 100, reps: 8 }, { kind: SET_KINDS.DROP, weight: 50, reps: 12 }] },
    { date: "2026-07-27", sets: [{ kind: SET_KINDS.WORKING, weight: 105, reps: 8 }] },
  ] },
};
const insightFood = {
  "2026-07-27": { breakfast: [{ calories: 2000, protein: 160 }] },
  "2026-07-28": { dinner: [{ calories: 2100, protein: 170 }] },
};
const insightTargets = { calories: 2000, protein: 160 };
const brief = weeklyForgeBrief({ workoutLogs: insightLogs, dayLog: insightFood, weights: [{ date: "2026-07-27", lbs: 200 }, { date: "2026-07-29", lbs: 199.5 }], targets: insightTargets, today: "2026-07-29" });
assert.equal(brief.training.workouts, 1);
assert.equal(brief.training.workingSets, 1);
assert.equal(brief.nutrition.proteinHits, 2);
assert.equal(consistencyMatrix({ workoutLogs: insightLogs, dayLog: insightFood, weights: [], targets: insightTargets, today: "2026-07-29" }).filter((day) => day.protein).length, 2);
const progression = exerciseProgression(insightLogs.lift.sessions);
assert.equal(progression[0].heaviest, 100);
assert.equal(Math.round(progression[1].e1rm), 133);
assert.equal(progression[0].volume, 800);
const scansForInsights = [
  { id: "scan-a", scanDate: "2026-06-01", metrics: [{ code: "weight", value: 90, unit: "kg" }, { code: "lean_body_mass", value: 65, unit: "kg" }, { code: "body_fat_mass", value: 25, unit: "kg" }, { code: "body_fat_percent", value: 27.8, unit: "%" }] },
  { id: "scan-b", scanDate: "2026-07-01", metrics: [{ code: "weight", value: 89, unit: "kg" }, { code: "lean_body_mass", value: 66, unit: "kg" }, { code: "body_fat_mass", value: 23, unit: "kg" }, { code: "body_fat_percent", value: 25.8, unit: "%" }] },
];
assert.equal(recompositionSeries([{ date: "2026-06-15", lbs: 197 }], scansForInsights).length, 3);
const comparison = scanComparison(scansForInsights[0], scansForInsights[1]);
assert.ok(Math.abs(comparison.find((item) => item.code === "lean_body_mass").delta - 2.2046) < 0.001);
assert.equal(weeklyCrossDomain({ workoutLogs: insightLogs, dayLog: insightFood, weights: [], targets: insightTargets, today: "2026-07-29" }).qualified, false);

// Exercise the Safari-compatible PDF bundle with modern APIs deliberately absent.
Promise.withResolvers = undefined;
URL.parse = undefined;
Uint8Array.fromBase64 = undefined;
const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  "<< /Length 51 >>\nstream\nBT /F1 12 Tf 72 720 Td (Safari compatible) Tj ET\nendstream",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];
let minimalPdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((object, index) => {
  offsets.push(minimalPdf.length);
  minimalPdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
});
const xrefOffset = minimalPdf.length;
minimalPdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
offsets.slice(1).forEach((offset) => { minimalPdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
minimalPdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
const compatibilityDocument = await getDocument({
  data: new TextEncoder().encode(minimalPdf),
  isEvalSupported: false,
  verbosity: 0,
}).promise;
const compatibilityText = await (await compatibilityDocument.getPage(1)).getTextContent();
assert.equal(compatibilityText.items.some((item) => item.str === "Safari compatible"), true);

await import("./recipe-tests.mjs");
console.log("Core workout and timer tests passed.");
