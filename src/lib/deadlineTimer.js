export function remainingSeconds(endAt, now = Date.now()) {
  if (!endAt) return 0;
  return Math.max(0, Math.ceil((Number(endAt) - now) / 1000));
}

export function createTimerState(durationSeconds, now = Date.now()) {
  const duration = Math.max(0, Math.round(Number(durationSeconds) || 0));
  return {
    duration,
    endAt: duration ? now + duration * 1000 : null,
    pausedRemaining: null,
  };
}

export function pauseTimerState(state, now = Date.now()) {
  return { ...state, pausedRemaining: remainingSeconds(state?.endAt, now), endAt: null };
}

export function resumeTimerState(state, now = Date.now()) {
  const remaining = Math.max(0, Number(state?.pausedRemaining) || 0);
  return { ...state, endAt: remaining ? now + remaining * 1000 : null, pausedRemaining: null };
}

export function extendTimerState(state, seconds, now = Date.now()) {
  const addition = Math.max(0, Math.round(Number(seconds) || 0));
  if (state?.endAt) return { ...state, endAt: Math.max(now, state.endAt) + addition * 1000 };
  return { ...state, pausedRemaining: Math.max(0, Number(state?.pausedRemaining) || 0) + addition };
}
