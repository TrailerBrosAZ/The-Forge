const LB_PER_KG = 2.2046226218;

export const EVOLT_METRICS = {
  weight: { label: "Weight", kind: "mass", featured: true },
  lean_body_mass: { label: "Lean Body Mass", kind: "mass", featured: true },
  skeletal_muscle_mass: { label: "Skeletal Muscle Mass", kind: "mass", featured: true },
  protein_mass: { label: "Protein Mass", kind: "mass" },
  mineral_mass: { label: "Mineral Mass", kind: "mass" },
  total_body_water: { label: "Total Body Water", kind: "mass" },
  body_fat_mass: { label: "Body Fat Mass", kind: "mass", featured: true },
  subcutaneous_fat_mass: { label: "Subcutaneous Fat Mass", kind: "mass" },
  subcutaneous_fat_percent: { label: "Subcutaneous Fat %", kind: "percent" },
  visceral_fat_mass: { label: "Visceral Fat Mass", kind: "mass" },
  visceral_fat_percent: { label: "Visceral Fat %", kind: "percent" },
  visceral_fat_area: { label: "Visceral Fat Area", kind: "area", featured: true },
  body_fat_percent: { label: "Body Fat", kind: "percent", featured: true },
  visceral_fat_level: { label: "Visceral Fat Level", kind: "score", featured: true },
  intracellular_fluid: { label: "Intracellular Fluid", kind: "mass" },
  intracellular_fluid_percent: { label: "Intracellular Fluid %", kind: "percent" },
  extracellular_fluid: { label: "Extracellular Fluid", kind: "mass" },
  extracellular_fluid_percent: { label: "Extracellular Fluid %", kind: "percent" },
  bmr: { label: "Basal Metabolic Rate", kind: "energy" },
  tee: { label: "Total Energy Expenditure", kind: "energy" },
  bio_age: { label: "Bio Age", kind: "years", hidden: true },
  bwi_score: { label: "BWI Score", kind: "score" },
  abdominal_circumference: { label: "Abdominal Circumference", kind: "length", featured: true },
  waist_to_hip_ratio: { label: "Waist-to-Hip Ratio", kind: "ratio" },
  left_arm_lean_mass: { label: "Left Arm Lean Mass", kind: "mass", region: "left_arm" },
  left_arm_fat_mass: { label: "Left Arm Fat Mass", kind: "mass", region: "left_arm" },
  right_arm_lean_mass: { label: "Right Arm Lean Mass", kind: "mass", region: "right_arm" },
  right_arm_fat_mass: { label: "Right Arm Fat Mass", kind: "mass", region: "right_arm" },
  torso_lean_mass: { label: "Torso Lean Mass", kind: "mass", region: "torso" },
  torso_fat_mass: { label: "Torso Fat Mass", kind: "mass", region: "torso" },
  left_leg_lean_mass: { label: "Left Leg Lean Mass", kind: "mass", region: "left_leg" },
  left_leg_fat_mass: { label: "Left Leg Fat Mass", kind: "mass", region: "left_leg" },
  right_leg_lean_mass: { label: "Right Leg Lean Mass", kind: "mass", region: "right_leg" },
  right_leg_fat_mass: { label: "Right Leg Fat Mass", kind: "mass", region: "right_leg" },
};

const VALUE_SLOTS = [
  ["lean_body_mass", 21, 660.5], ["body_fat_mass", 164, 660.5], ["visceral_fat_level", 307, 660.5],
  ["skeletal_muscle_mass", 21, 620.5], ["subcutaneous_fat_mass", 164, 620.5], ["intracellular_fluid", 307, 620.5],
  ["protein_mass", 21, 580.5], ["visceral_fat_mass", 164, 580.5], ["extracellular_fluid", 307, 580.5],
  ["mineral_mass", 21, 540.5], ["visceral_fat_area", 164, 540.5], ["bmr", 307, 540.5],
  ["total_body_water", 21, 500.5], ["body_fat_percent", 164, 500.5], ["tee", 307, 500.5],
  ["bio_age", 508, 620.9], ["bwi_score", 501, 538.9],
  ["left_arm_lean_mass", 23, 378.2], ["left_arm_fat_mass", 138, 378.2],
  ["right_arm_lean_mass", 355, 378.2], ["right_arm_fat_mass", 469, 378.2],
  ["torso_lean_mass", 23, 330.2], ["torso_fat_mass", 138, 330.2],
  ["abdominal_circumference", 355, 330.2], ["waist_to_hip_ratio", 469, 330.2],
  ["left_leg_lean_mass", 23, 284.2], ["left_leg_fat_mass", 138, 284.2],
  ["right_leg_lean_mass", 355, 284.2], ["right_leg_fat_mass", 469, 284.2],
];

function numberFrom(text) {
  const match = String(text || "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function percentFromBracket(text) {
  const match = String(text || "").match(/\[\s*(\d+(?:\.\d+)?)%\s*\]/);
  return match ? Number(match[1]) : null;
}

function rangeFrom(text) {
  const match = String(text || "").replace(/,/g, "").match(/\[\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\]/);
  return match ? { low: Number(match[1]), high: Number(match[2]) } : null;
}

function statusFrom(text) {
  const match = String(text || "").match(/\/\s*([A-Za-z ]+)/);
  return match ? match[1].trim() : null;
}

function nearest(items, x, y, xTolerance = 12, yTolerance = 4) {
  return items
    .filter((item) => Math.abs(item.x - x) <= xTolerance && Math.abs(item.y - y) <= yTolerance && String(item.text || "").trim())
    .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))[0] || null;
}

function nearbyBracket(items, x, y) {
  return items.find((item) => (
    item.x > x + 35
    && item.x < x + 145
    && Math.abs(item.y - y) < 5
    && String(item.text || "").includes("[")
  )) || null;
}

function canonicalUnit(kind) {
  return {
    mass: "kg",
    percent: "%",
    area: "cm2",
    energy: "kcal",
    years: "years",
    score: "score",
    length: "cm",
    ratio: "ratio",
  }[kind] || "value";
}

function normalizeValue(value, kind, sourceMassUnit, sourceLengthUnit) {
  if (!Number.isFinite(value)) return null;
  if (kind === "mass" && sourceMassUnit === "lb") return value / LB_PER_KG;
  if (kind === "length" && sourceLengthUnit === "in") return value * 2.54;
  return value;
}

function metricFromSlot(code, valueItem, bracketItem, sourceMassUnit) {
  if (!valueItem) return null;
  const definition = EVOLT_METRICS[code];
  const rawText = String(valueItem.text || "").trim();
  const rawValue = numberFrom(rawText);
  if (!Number.isFinite(rawValue)) return null;
  const sourceLengthUnit = /\bin\b/i.test(rawText) ? "in" : "cm";
  const originalUnit = definition.kind === "mass"
    ? sourceMassUnit
    : definition.kind === "length"
      ? sourceLengthUnit
      : canonicalUnit(definition.kind);
  const metric = {
    code,
    label: definition.label,
    value: normalizeValue(rawValue, definition.kind, sourceMassUnit, sourceLengthUnit),
    unit: canonicalUnit(definition.kind),
    originalValue: rawValue,
    originalUnit,
    status: statusFrom(rawText),
    confidence: 0.99,
    ...(definition.region ? { region: definition.region } : {}),
  };
  const range = rangeFrom(bracketItem?.text);
  if (range) {
    metric.referenceLow = normalizeValue(range.low, definition.kind, sourceMassUnit, sourceLengthUnit);
    metric.referenceHigh = normalizeValue(range.high, definition.kind, sourceMassUnit, sourceLengthUnit);
  }
  return metric;
}

function metricMap(metrics) {
  return Object.fromEntries(metrics.map((metric) => [metric.code, metric]));
}

function closeEnough(actual, expected, tolerance, code, warnings) {
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) return;
  if (Math.abs(actual - expected) > tolerance) warnings.push({ code, severity: "review" });
}

export function validateEvoltScan(scan) {
  const values = Object.fromEntries(scan.metrics.map((metric) => [metric.code, metric.value]));
  const warnings = [];
  closeEnough(values.lean_body_mass + values.body_fat_mass, values.weight, 0.25, "composition_total", warnings);
  closeEnough((values.body_fat_mass / values.weight) * 100, values.body_fat_percent, 0.25, "body_fat_percent", warnings);
  closeEnough(values.subcutaneous_fat_mass + values.visceral_fat_mass, values.body_fat_mass, 0.25, "fat_components", warnings);
  closeEnough(values.intracellular_fluid + values.extracellular_fluid, values.total_body_water, 0.25, "water_components", warnings);
  const required = ["weight", "lean_body_mass", "body_fat_mass", "body_fat_percent", "skeletal_muscle_mass"];
  required.forEach((code) => {
    if (!Number.isFinite(values[code])) warnings.push({ code: `missing_${code}`, severity: "error" });
  });
  return warnings;
}

export function parseEvoltPageItems(items, sourceName = "Evolt PDF") {
  const normalized = (items || []).map((item) => ({
    text: item.text ?? item.str ?? "",
    x: Number(item.x ?? item.transform?.[4] ?? 0),
    y: Number(item.y ?? item.transform?.[5] ?? 0),
  }));
  const fingerprintText = normalized.map((item) => item.text).join(" ").toUpperCase();
  if (!fingerprintText.includes("EVOLT") || !fingerprintText.includes("BODY SCAN")) {
    throw new Error("This PDF does not match the supported Evolt body-scan report.");
  }
  const dateItem = nearest(normalized, 21, 776.5, 15, 5);
  const nameItem = nearest(normalized, 164, 776.5, 15, 5);
  const heightItem = nearest(normalized, 21, 739.5, 15, 5);
  const weightItem = nearest(normalized, 164, 739.5, 15, 5);
  const ageItem = nearest(normalized, 307, 739.5, 15, 5);
  const genderItem = nearest(normalized, 450, 739.5, 15, 5);
  const sourceMassUnit = /\blb\b/i.test(weightItem?.text || "") ? "lb" : "kg";
  const metrics = VALUE_SLOTS.map(([code, x, y]) => (
    metricFromSlot(code, nearest(normalized, x, y), nearbyBracket(normalized, x, y), sourceMassUnit)
  )).filter(Boolean);
  const weight = numberFrom(weightItem?.text);
  if (Number.isFinite(weight)) metrics.unshift({
    code: "weight",
    label: "Weight",
    value: normalizeValue(weight, "mass", sourceMassUnit),
    unit: "kg",
    originalValue: weight,
    originalUnit: sourceMassUnit,
    confidence: 1,
  });

  const subcutaneous = metricMap(metrics).subcutaneous_fat_mass;
  const visceral = metricMap(metrics).visceral_fat_mass;
  const icf = metricMap(metrics).intracellular_fluid;
  const ecf = metricMap(metrics).extracellular_fluid;
  const subPct = percentFromBracket(nearbyBracket(normalized, 164, 620.5)?.text);
  const visceralPct = percentFromBracket(nearbyBracket(normalized, 164, 580.5)?.text);
  const icfPct = percentFromBracket(nearbyBracket(normalized, 307, 620.5)?.text);
  const ecfPct = percentFromBracket(nearbyBracket(normalized, 307, 580.5)?.text);
  [
    ["subcutaneous_fat_percent", subPct, subcutaneous],
    ["visceral_fat_percent", visceralPct, visceral],
    ["intracellular_fluid_percent", icfPct, icf],
    ["extracellular_fluid_percent", ecfPct, ecf],
  ].forEach(([code, value, related]) => {
    if (Number.isFinite(value)) metrics.push({
      code,
      label: EVOLT_METRICS[code].label,
      value,
      unit: "%",
      originalValue: value,
      originalUnit: "%",
      confidence: related ? 0.99 : 0.9,
    });
  });

  const rawDate = String(dateItem?.text || "").trim();
  const dateMatch = rawDate.match(/(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  const scanDate = dateMatch ? `${dateMatch[3]}-${dateMatch[1]}-${dateMatch[2]}` : null;
  const scanTime = dateMatch?.[4] ? `${dateMatch[4]}:${dateMatch[5]}` : null;
  const nutritionItems = [
    ["calories", nearest(normalized, 57, 194.5, 15, 5)],
    ["protein", nearest(normalized, 201, 194.5, 15, 5)],
    ["carbohydrates", nearest(normalized, 339, 194.5, 15, 5)],
    ["fat", nearest(normalized, 479, 194.5, 15, 5)],
  ];
  const recommendations = Object.fromEntries(nutritionItems.filter(([, item]) => item).map(([key, item]) => [key, item.text]));
  const upperLowerX = normalized.some((item) => item.text === "X" && Math.abs(item.x - 223) < 8 && Math.abs(item.y - 437.5) < 5);
  const leftRightX = normalized.some((item) => item.text === "X" && Math.abs(item.x - 365) < 8 && Math.abs(item.y - 437.5) < 5);
  const scan = {
    source: "evolt",
    sourceName,
    template: "eos-evolt-v36_3",
    parserVersion: 1,
    scanDate,
    scanTime,
    subject: {
      name: nameItem?.text?.trim() || "",
      height: heightItem?.text?.trim() || "",
      age: numberFrom(ageItem?.text),
      gender: genderItem?.text?.trim() || "",
    },
    metrics,
    balance: {
      upperLower: upperLowerX ? "balanced" : "unbalanced",
      leftRight: leftRightX ? "balanced" : "unbalanced",
    },
    recommendations,
  };
  scan.warnings = validateEvoltScan(scan);
  scan.confidence = scan.warnings.some((warning) => warning.severity === "error") ? "review" : "high";
  scan.fingerprint = `evolt:${scanDate}:${metricMap(metrics).weight?.value?.toFixed(3)}:${metricMap(metrics).body_fat_percent?.value}`;
  return scan;
}

export function displayMetricValue(metric, massUnit = "lb") {
  if (!metric || !Number.isFinite(metric.value)) return "--";
  if (metric.unit === "kg") {
    const value = massUnit === "lb" ? metric.value * LB_PER_KG : metric.value;
    return `${value.toFixed(1)} ${massUnit}`;
  }
  if (metric.unit === "cm") return `${(metric.value / 2.54).toFixed(1)} in`;
  if (metric.unit === "%") return `${metric.value.toFixed(1)}%`;
  if (metric.unit === "cm2") return `${metric.value.toFixed(0)} cm²`;
  if (metric.unit === "kcal") return `${metric.value.toFixed(0)} kcal`;
  if (metric.unit === "years") return `${metric.value.toFixed(0)} yr`;
  if (metric.unit === "ratio") return metric.value.toFixed(2);
  return metric.value.toFixed(metric.value % 1 ? 1 : 0);
}
