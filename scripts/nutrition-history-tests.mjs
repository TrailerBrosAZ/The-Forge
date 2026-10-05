import assert from "node:assert/strict";
import { summarizeNutritionWindow } from "../src/lib/nutritionHistory.js";

const row = (date, calories, protein = 0, carbs = 0, fat = 0) => ({ date, calories, protein, carbs, fat });

const sparse = summarizeNutritionWindow({
  todayKey: "2024-03-01",
  days: 7,
  dailyRows: [row("2024-02-24", 100, 10), row("2024-02-27", 0, 20), row("2024-02-29", 200, 40), row("2024-03-01", 300, 30), row("2024-03-02", 999), row("bad-date", 100)],
});
assert.deepEqual(sparse.range, { start: "2024-02-24", end: "2024-03-01" });
assert.deepEqual(sparse.rows.map(({ date }) => date), ["2024-02-24", "2024-02-27", "2024-02-29", "2024-03-01"]);
assert.equal(sparse.loggedDays, 4);
assert.equal(sparse.averages.calories, 600 / 4);
assert.equal(sparse.averages.protein, 25);

const yearBoundary = summarizeNutritionWindow({ todayKey: "2025-01-02", days: 3, dailyRows: [row("2024-12-31", 10), row("2025-01-01", 20), row("2025-01-02", 30)] });
assert.deepEqual(yearBoundary.range, { start: "2024-12-31", end: "2025-01-02" });
assert.equal(yearBoundary.averages.calories, 20);

const empty = summarizeNutritionWindow({ todayKey: "2024-03-01", days: 2, dailyRows: [row("2024-02-28", 5), row("2024-03-02", 5)] });
assert.equal(empty.loggedDays, 0);
assert.deepEqual(empty.averages, { calories: null, protein: null, carbs: null, fat: null });

assert.throws(() => summarizeNutritionWindow({ todayKey: "2024-02-30", days: 7, dailyRows: [] }), RangeError);
assert.throws(() => summarizeNutritionWindow({ todayKey: "2024-03-01", days: 0, dailyRows: [] }), RangeError);
console.log("Nutrition history calendar-window tests passed.");
