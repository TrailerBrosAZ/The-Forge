function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(dateKey, delta) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + delta);
  return localDateKey(date);
}

function dayTotals(day = {}) {
  return Object.values(day).flat().reduce((sum, entry) => ({
    calories: sum.calories + (Number(entry?.calories) || 0),
    protein: sum.protein + (Number(entry?.protein) || 0),
  }), { calories: 0, protein: 0 });
}

function workoutSessions(workoutLogs = {}) {
  return Object.values(workoutLogs).flatMap((log) => log?.sessions || []);
}

export function consistencyMatrix({ workoutLogs = {}, dayLog = {}, weights = [], targets, today = localDateKey(new Date()), days = 7 }) {
  const workoutDates = new Set(workoutSessions(workoutLogs).filter((session) => (session.sets || []).some((set) => set.done === true || Number(set.reps) > 0 || Number(set.duration) > 0)).map((session) => session.date));
  const weightDates = new Set(weights.map((entry) => entry.date));
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(today, index - days + 1);
    const totals = dayTotals(dayLog[date]);
    const logged = totals.calories > 0 || totals.protein > 0;
    return {
      date,
      label: new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "narrow" }),
      training: workoutDates.has(date),
      calories: logged && totals.calories >= targets.calories * 0.85 && totals.calories <= targets.calories * 1.15,
      protein: logged && totals.protein >= targets.protein,
      weight: weightDates.has(date),
      logged,
    };
  });
}

export function weeklyForgeBrief({ workoutLogs = {}, dayLog = {}, weights = [], bodyScans = [], targets, today = localDateKey(new Date()) }) {
  const start = addDays(today, -6);
  const sessions = workoutSessions(workoutLogs).filter((session) => session.date >= start && session.date <= today);
  const workoutDates = new Set(sessions.map((session) => session.date));
  const workingSets = sessions.reduce((count, session) => count + (session.sets || []).filter((set) => set.kind !== "warmup" && (set.done === true || Number(set.reps) > 0)).length, 0);
  const nutrition = Object.entries(dayLog).filter(([date]) => date >= start && date <= today).map(([, day]) => dayTotals(day)).filter((totals) => totals.calories > 0 || totals.protein > 0);
  const proteinHits = nutrition.filter((totals) => totals.protein >= targets.protein).length;
  const calorieDelta = nutrition.length ? Math.round(nutrition.reduce((sum, totals) => sum + totals.calories - targets.calories, 0) / nutrition.length) : null;
  const recentWeights = weights.filter((entry) => entry.date >= start && entry.date <= today).sort((a, b) => a.date.localeCompare(b.date));
  const weightDelta = recentWeights.length > 1 ? recentWeights.at(-1).lbs - recentWeights[0].lbs : null;
  const latestBodyDate = [...weights.map((entry) => entry.date), ...bodyScans.map((scan) => scan.scanDate)].sort().at(-1) || null;
  const parts = [];
  if (workoutDates.size) parts.push(`${workoutDates.size} workout${workoutDates.size === 1 ? "" : "s"} completed`);
  if (nutrition.length) parts.push(`protein hit on ${proteinHits} of ${nutrition.length} logged days`);
  return {
    training: { workouts: workoutDates.size, workingSets },
    nutrition: { daysLogged: nutrition.length, proteinHits, calorieDelta },
    body: { weightDelta, latestBodyDate },
    sentence: parts.length ? `${parts.join(" and ")}.` : "Log training, nutrition, or body data to build this week's brief.",
  };
}

export function exerciseProgression(sessions = [], loadMode = "external") {
  return sessions.map((session) => {
    const eligible = (session.sets || []).filter((set) => !["warmup", "drop", "timed"].includes(set.kind) && Number(set.reps) > 0);
    const heaviest = eligible.reduce((best, set) => Number(set.weight) > Number(best?.weight || -Infinity) ? set : best, null);
    const volume = eligible.reduce((sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0);
    const bestReps = eligible.reduce((best, set) => Math.max(best, Number(set.reps) || 0), 0);
    const e1rm = loadMode === "bodyweight" || !heaviest ? null : Number(heaviest.weight) * (1 + Number(heaviest.reps) / 30);
    return { date: session.date, volume, bestReps, heaviest: Number(heaviest?.weight) || null, e1rm };
  }).filter((point) => point.volume > 0 || point.bestReps > 0);
}

function metricValue(scan, code, pounds = false) {
  const metric = scan?.metrics?.find((candidate) => candidate.code === code);
  if (!Number.isFinite(metric?.value)) return null;
  return pounds && metric.unit === "kg" ? metric.value * 2.2046226218 : metric.value;
}

export function recompositionSeries(weights = [], scans = []) {
  const points = new Map();
  weights.forEach((entry) => points.set(entry.date, { date: entry.date, weight: Number(entry.lbs), source: entry.source || "manual" }));
  scans.forEach((scan) => {
    const current = points.get(scan.scanDate) || { date: scan.scanDate };
    points.set(scan.scanDate, {
      ...current,
      weight: current.weight ?? metricValue(scan, "weight", true),
      leanMass: metricValue(scan, "lean_body_mass", true),
      fatMass: metricValue(scan, "body_fat_mass", true),
      bodyFatPercent: metricValue(scan, "body_fat_percent"),
      scanId: scan.id,
    });
  });
  return [...points.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function scanComparison(scanA, scanB) {
  if (!scanA || !scanB) return [];
  return ["weight", "lean_body_mass", "body_fat_mass", "body_fat_percent", "visceral_fat_level", "visceral_fat_area"].map((code) => {
    const a = metricValue(scanA, code, ["weight", "lean_body_mass", "body_fat_mass"].includes(code));
    const b = metricValue(scanB, code, ["weight", "lean_body_mass", "body_fat_mass"].includes(code));
    return a == null || b == null ? null : { code, before: a, after: b, delta: b - a };
  }).filter(Boolean);
}

export function weeklyCrossDomain({ workoutLogs = {}, dayLog = {}, weights = [], targets, today = localDateKey(new Date()), weeks = 8 }) {
  const sessions = workoutSessions(workoutLogs);
  const rows = Array.from({ length: weeks }, (_, index) => {
    const end = addDays(today, -(weeks - 1 - index) * 7);
    const start = addDays(end, -6);
    const weekSessions = sessions.filter((session) => session.date >= start && session.date <= end);
    const volume = weekSessions.reduce((sum, session) => sum + (session.sets || []).reduce((setSum, set) => setSum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0), 0);
    const nutrition = Object.entries(dayLog).filter(([date]) => date >= start && date <= end).map(([, day]) => dayTotals(day)).filter((totals) => totals.protein > 0);
    const proteinPct = nutrition.length ? nutrition.reduce((sum, totals) => sum + totals.protein / Math.max(1, targets.protein), 0) / nutrition.length * 100 : null;
    const weekWeights = weights.filter((entry) => entry.date >= start && entry.date <= end).sort((a, b) => a.date.localeCompare(b.date));
    return { start, end, workouts: new Set(weekSessions.map((session) => session.date)).size, volume, proteinPct, weight: weekWeights.at(-1)?.lbs ?? null, nutritionDays: nutrition.length };
  });
  const qualified = rows.filter((row) => row.workouts >= 2 && row.nutritionDays >= 3).length >= 4;
  return { qualified, rows };
}
