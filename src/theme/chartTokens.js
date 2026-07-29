export const CHART_COLORS = Object.freeze({
  calories: "#E9A642",
  protein: "#6FA8D8",
  carbs: "#D9953E",
  fat: "#D87BA8",
  weight: "#D8DDD8",
  leanMass: "#6FA8D8",
  fatMass: "#D87BA8",
  volume: "#E9A642",
  completed: "#64BD82",
  muted: "#505863",
});

export const CHART_RANGES = Object.freeze([
  { id: "4w", label: "4W", days: 28 },
  { id: "12w", label: "12W", days: 84 },
  { id: "6m", label: "6M", days: 183 },
  { id: "all", label: "All", days: Infinity },
]);
