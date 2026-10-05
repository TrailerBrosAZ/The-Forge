function numericValue(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

export function sessionUsesExplicitSetCompletion(session) {
  return (session?.sets || []).some((set) => typeof set?.done === "boolean");
}

export function isPerformedSet(set, usesExplicitCompletion = false) {
  if (usesExplicitCompletion) return set?.done === true;
  return numericValue(set?.reps) > 0 || numericValue(set?.duration) > 0 || numericValue(set?.durationSeconds) > 0;
}

export function performedSets(session) {
  const usesExplicitCompletion = sessionUsesExplicitSetCompletion(session);
  return (session?.sets || []).filter((set) => isPerformedSet(set, usesExplicitCompletion));
}

export function sessionHasPerformedSet(session) {
  return performedSets(session).length > 0;
}
