function dateDistanceDays(dateKey, todayKey) {
  const a = new Date(`${dateKey}T12:00:00`);
  const b = new Date(`${todayKey}T12:00:00`);
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export function foodIdentity(food = {}) {
  return food.foodKey || food.savedId || food.barcode || [
    String(food.name || "").trim().toLowerCase(),
    Number(food.baseCalories ?? food.calories ?? 0),
    Number(food.baseProtein ?? food.protein ?? 0),
    Number(food.baseCarbs ?? food.carbs ?? 0),
    Number(food.baseFat ?? food.fat ?? 0),
  ].join("|");
}

export function rankFoodSuggestions({ dayLog = {}, targetMeal, todayKey, limit = 8 }) {
  const scores = new Map();
  Object.keys(dayLog).sort().reverse().forEach((date) => {
    const age = dateDistanceDays(date, todayKey);
    if (age > 90) return;
    Object.entries(dayLog[date] || {}).forEach(([meal, entries]) => {
      (entries || []).forEach((entry) => {
        const key = foodIdentity(entry);
        if (!key) return;
        const existing = scores.get(key) || { food: entry, score: 0, uses: 0, latestDate: date, sameMealUses: 0 };
        const recency = Math.max(0, 12 - age * 0.25);
        const sameMeal = meal === targetMeal ? 10 : 0;
        existing.score += 2 + recency + sameMeal;
        existing.uses += 1;
        existing.sameMealUses += meal === targetMeal ? 1 : 0;
        if (date > existing.latestDate) {
          existing.food = entry;
          existing.latestDate = date;
        }
        scores.set(key, existing);
      });
    });
  });
  return [...scores.values()]
    .sort((a, b) => b.score - a.score || b.sameMealUses - a.sameMealUses || b.latestDate.localeCompare(a.latestDate))
    .slice(0, limit)
    .map((item) => ({
      ...item.food,
      suggestionReason: item.sameMealUses >= 2
        ? `Often at ${targetMeal}`
        : item.latestDate === todayKey ? "Logged today" : `Last used ${item.latestDate}`,
      suggestionUses: item.uses,
    }));
}

export function mostRecentMealDate(dayLog = {}, meal, beforeDate) {
  return Object.keys(dayLog)
    .filter((date) => date < beforeDate && (dayLog[date]?.[meal] || []).length > 0)
    .sort()
    .reverse()[0] || null;
}

export function cloneMealEntries(entries = [], createId, loggedAt = new Date().toISOString()) {
  return entries.map((entry) => ({ ...entry, id: createId(), loggedAt }));
}

export function copyMealIntoDay({ dayLog, sourceDate, targetDate, meal, createId, mode = "append" }) {
  const source = dayLog[sourceDate]?.[meal] || [];
  if (!source.length) return dayLog;
  const targetDay = { ...(dayLog[targetDate] || {}) };
  const copied = cloneMealEntries(source, createId);
  targetDay[meal] = mode === "replace" ? copied : [...(targetDay[meal] || []), ...copied];
  return { ...dayLog, [targetDate]: targetDay };
}
