function safeSpreadsheetText(value) {
  const text = value == null ? "" : String(value);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

export function csvCell(value) {
  const text = safeSpreadsheetText(value).replaceAll('"', '""');
  return /[",\r\n]/.test(text) ? `"${text}"` : text;
}

export function rowsToCsv(columns, rows) {
  const lines = [
    columns.map(csvCell).join(","),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
  ];
  return `\uFEFF${lines.join("\r\n")}`;
}

export function nutritionCsvRows({ profile, dayLog }) {
  const rows = [];
  Object.keys(dayLog || {}).sort().forEach((date) => {
    Object.entries(dayLog[date] || {}).forEach(([meal, entries]) => {
      (entries || []).forEach((entry) => rows.push({
        profile: profile.name,
        date,
        meal,
        food: entry.name,
        servings: entry.servings ?? 1,
        serving_size: entry.servingNote || "",
        calories: entry.calories ?? "",
        protein_g: entry.protein ?? "",
        carbs_g: entry.carbs ?? "",
        fat_g: entry.fat ?? "",
        source: entry.source || "local",
        barcode: entry.barcode || "",
        logged_at: entry.loggedAt || "",
      }));
    });
  });
  return rows;
}

export function bodyCsvRows({ profile, weights, measurements }) {
  return [
    ...(weights || []).map((entry) => ({
      profile: profile.name,
      date: entry.date,
      record_type: "weight",
      body_part: "",
      measurement_kind: "",
      value: entry.lbs,
      unit: "lb",
      source: entry.source || "manual",
    })),
    ...(measurements || []).map((entry) => ({
      profile: profile.name,
      date: entry.date,
      record_type: "measurement",
      body_part: entry.part,
      measurement_kind: entry.kind || "circumference",
      value: entry.value,
      unit: entry.unit || ((entry.kind || "circumference") === "mass" ? "lb" : "in"),
      source: entry.source || "manual",
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));
}

export function scanCsvRows({ profile, bodyScans }) {
  return (bodyScans || []).flatMap((scan) => (scan.metrics || []).map((metric) => ({
    profile: profile.name,
    scan_date: scan.scanDate,
    scan_id: scan.id,
    source_filename: scan.sourceFileName || scan.fileName || "",
    metric_code: metric.code,
    metric_label: metric.label || metric.code,
    region: metric.region || "",
    value: metric.value,
    unit: metric.unit,
    original_value: metric.originalValue ?? "",
    original_unit: metric.originalUnit || "",
    status: metric.status || "",
    confidence: metric.confidence ?? scan.confidence ?? "",
    corrected_by_user: metric.correctedByUser ? "yes" : "no",
  })));
}

export function workoutCsvRows({ profile, plans, workoutLogs, resolveIdentity }) {
  const rows = [];
  Object.entries(workoutLogs || {}).forEach(([key, log]) => {
    const identity = resolveIdentity(key, plans);
    const plan = (plans || []).find((candidate) => candidate.id === identity.planId);
    const parts = String(key).split("|");
    let week = null;
    let day = null;
    let exercise = null;
    if (parts[0] === "v2") {
      const weeks = plan?.structure === "weeks" ? (plan.weeks || []) : [{ days: plan?.days || [] }];
      week = weeks.find((candidate) => candidate.id === parts[2]) || null;
      day = (week?.days || []).find((candidate) => candidate.id === parts[3]) || null;
      exercise = (day?.ex || []).find((candidate) => candidate.id === parts[4]) || null;
    } else if (plan) {
      const weekNumber = Number(parts.find((part) => /^w\d+$/.test(part))?.slice(1));
      const dayNumber = Number(parts.find((part) => /^d\d+$/.test(part))?.slice(1));
      const weeks = plan.structure === "weeks" ? (plan.weeks || []) : [{ days: plan.days || [] }];
      week = Number.isFinite(weekNumber) ? weeks.find((candidate) => Number(candidate.wk) === weekNumber) : weeks[0];
      day = (week?.days || []).find((candidate) => Number(candidate.d) === dayNumber) || null;
      exercise = (day?.ex || []).find((candidate) => candidate.n === identity.exerciseName) || null;
    }
    (log.sessions || []).forEach((session) => {
      (session.sets || []).forEach((set, index) => rows.push({
        profile: profile.name,
        date: session.date,
        plan: plan?.name || identity.planId,
        week: week?.wk ?? "",
        block: week?.blk ?? "",
        day: day?.d ?? "",
        focus: day?.focus || "",
        exercise: identity.exerciseName,
        exercise_type: set.type === "cardio" ? "cardio" : "strength",
        load_mode: identity.loadMode,
        set_number: index + 1,
        set_type: set.kind || "working",
        cluster_id: set.clusterId || "",
        segment_index: set.segmentIndex ?? "",
        weight: set.weight ?? "",
        reps: set.reps ?? "",
        rep_segments: Array.isArray(set.repSegments) ? set.repSegments.join("/") : "",
        duration_minutes: set.duration ?? "",
        target_reps: set.targetReps || "",
        target_rpe: set.targetRpe || "",
        rest: exercise?.rest || "",
        note: set.note || "",
        completed_at: session.completedAt || "",
      }));
    });
  });
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}
