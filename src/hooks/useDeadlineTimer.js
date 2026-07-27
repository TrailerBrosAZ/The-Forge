import { useEffect, useMemo, useState } from "react";
import {
  createTimerState,
  extendTimerState,
  pauseTimerState,
  remainingSeconds,
  resumeTimerState,
} from "../lib/deadlineTimer.js";

function loadTimer(storageKey, duration) {
  if (!storageKey) return { duration, endAt: null, pausedRemaining: null };
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey));
    if (value && typeof value === "object") return { duration, ...value };
  } catch {
    // A damaged timer should never prevent a workout from opening.
  }
  return { duration, endAt: null, pausedRemaining: null };
}

export function useDeadlineTimer(storageKey, durationSeconds) {
  const duration = Math.max(0, Math.round(Number(durationSeconds) || 0));
  const [state, setState] = useState(() => loadTimer(storageKey, duration));
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    setState(loadTimer(storageKey, duration));
    setClock(Date.now());
  }, [storageKey, duration]);

  useEffect(() => {
    if (!storageKey) return;
    if (!state.endAt && state.pausedRemaining == null) window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  useEffect(() => {
    if (!state.endAt) return undefined;
    const tick = () => setClock(Date.now());
    const id = window.setInterval(tick, 250);
    const onVisible = () => tick();
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [state.endAt]);

  const remaining = state.endAt
    ? remainingSeconds(state.endAt, clock)
    : Math.max(0, Number(state.pausedRemaining) || 0);
  const running = Boolean(state.endAt && remaining > 0);

  useEffect(() => {
    if (state.endAt && remaining === 0) {
      setState((current) => ({ ...current, endAt: null, pausedRemaining: 0 }));
    }
  }, [remaining, state.endAt]);

  const actions = useMemo(() => ({
    start: (seconds = duration) => {
      setState(createTimerState(seconds));
      setClock(Date.now());
    },
    pause: () => setState((current) => pauseTimerState(current)),
    resume: () => setState((current) => resumeTimerState(current)),
    toggle: () => setState((current) => current.endAt ? pauseTimerState(current) : resumeTimerState({
      ...current,
      pausedRemaining: current.pausedRemaining == null ? duration : current.pausedRemaining,
    })),
    extend: (seconds = 30) => setState((current) => extendTimerState(current, seconds)),
    reset: () => setState({ duration, endAt: null, pausedRemaining: duration }),
    clear: () => setState({ duration, endAt: null, pausedRemaining: null }),
  }), [duration]);

  return { remaining, running, active: running || state.pausedRemaining != null, ...actions };
}
