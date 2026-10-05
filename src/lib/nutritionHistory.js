const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;
const METRICS = ["calories", "protein", "carbs", "fat"];

function parseDateKey(value) {
  if (typeof value !== "string") return null;
  const match = DATE_KEY.exec(value);
  if (!match) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date;
}
function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function numericMetric(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Summarize logged nutrition rows over inclusive calendar dates.
 * A row is logged when it has a valid date key on or before todayKey; zero
 * values are valid logged values. Missing metric values remain unknown and do
 * not contribute to that metric's average.
 */
export function summarizeNutritionWindow({ dailyRows = [], todayKey, days }) {
  const today = parseDateKey(todayKey);
  if (!today) throw new RangeError("todayKey must be a valid YYYY-MM-DD date key");
  if (!Number.isInteger(days) || days < 1) throw new RangeError("days must be a positive integer");

  const start = new Date(today.getTime());
  start.setUTCDate(start.getUTCDate() - (days - 1));
  const startDate = dateKey(start);
  const endDate = dateKey(today);
  const rowsByDate = new Map();

  for (const row of Array.isArray(dailyRows) ? dailyRows : []) {
    const rowDate = parseDateKey(row?.date);
    if (!rowDate) continue;
    const key = dateKey(rowDate);
    if (key < startDate || key > endDate) continue;
    // Daily rows should be unique; retaining the last row makes the day count
    // and averages deterministic if a caller accidentally supplies a duplicate.
    rowsByDate.set(key, { ...row, date: key });
  }

  const rows = [...rowsByDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  const averages = Object.fromEntries(METRICS.map((metric) => {
    const values = rows.map((row) => numericMetric(row[metric])).filter((value) => value !== null);
    return [metric, values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null];
  }));

  return { range: { start: startDate, end: endDate }, rows, loggedDays: rows.length, averages };
}
