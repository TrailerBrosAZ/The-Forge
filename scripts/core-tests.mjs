import assert from "node:assert/strict";
import {
  bestStrengthSet,
  clonePlanForProfile,
  dayProgress,
  ensurePlanIds,
  exerciseCompleteEver,
  exerciseLoadMode,
  findNextWorkout,
  formatStrengthSet,
  historicalDayProgress,
  legacyLogKey,
  LOAD_MODES,
  resolveWorkoutLogIdentity,
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
  days: [{ d: 1, ex: [{ n: "Hanging Leg Raise" }, { n: "Dip" }, { n: "Weighted Pull-Up" }] }],
}).days[0].ex;
assert.equal(exerciseLoadMode(bodyweightExercise[0]), LOAD_MODES.BODYWEIGHT);
assert.equal(exerciseLoadMode(bodyweightExercise[1]), LOAD_MODES.BODYWEIGHT);
assert.equal(exerciseLoadMode(bodyweightExercise[2]), LOAD_MODES.ADDED);
assert.equal(exerciseLoadMode({ n: "Dip", loadMode: LOAD_MODES.ADDED }), LOAD_MODES.ADDED);
assert.equal(formatStrengthSet(bodyweightExercise[0], { reps: "12", weight: "0" }), "12 reps");
assert.equal(formatStrengthSet(bodyweightExercise[2], { reps: "6", weight: "25" }), "+25×6");
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

console.log("Core workout and timer tests passed.");
