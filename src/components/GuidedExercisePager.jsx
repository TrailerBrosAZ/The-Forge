import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./GuidedExercisePager.css";

const CARD_GAP = 12;
const INTERACTIVE = "button, input, select, textarea, a, [contenteditable], [role='slider'], [data-no-swipe]";

// Keep gesture frames outside the workout form's render cycle. The three keyed
// panels share one offset, so the incoming card stays attached to the drag.
export default function GuidedExercisePager({ exercises, activeIndex, onNavigate, renderExercise }) {
  const viewportRef = useRef(null);
  const panelsRef = useRef(new Map());
  const gestureRef = useRef(null);
  const phaseRef = useRef("idle");
  const pendingRef = useRef(null);
  const fallbackRef = useRef(null);
  const [phase, setPhase] = useState("idle");

  const changePhase = (nextPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };
  const paint = (offset, duration = 0) => {
    const stride = (viewportRef.current?.clientWidth || 1) + CARD_GAP;
    for (const [index, panel] of panelsRef.current) {
      panel.style.transition = duration ? `transform ${duration}ms cubic-bezier(0.22, 0.75, 0.18, 1)` : "none";
      panel.style.transform = `translate3d(${(index - activeIndex) * stride + offset}px, 0, 0)`;
    }
  };
  const reset = () => {
    window.clearTimeout(fallbackRef.current);
    pendingRef.current = null;
    gestureRef.current = null;
    paint(0);
    changePhase("idle");
  };
  useLayoutEffect(reset, [activeIndex, exercises.length]);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      // A rotation or layout resize invalidates the gesture's measured width.
      if (phaseRef.current !== "idle") reset();
      else paint(0);
    });
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackRef.current);
    };
  }, [activeIndex, exercises.length]);

  const finish = () => {
    const pending = pendingRef.current;
    if (!pending || phaseRef.current !== "settling") return;
    window.clearTimeout(fallbackRef.current);
    pendingRef.current = null;
    if (pending.index === activeIndex) reset();
    else onNavigate(pending.index);
  };
  const settle = (index, offset = 0) => {
    const width = viewportRef.current?.clientWidth || 1;
    const destination = index === activeIndex ? 0 : (activeIndex - index) * (width + CARD_GAP);
    const duration = Math.round(Math.max(220, Math.min(380, 380 * Math.abs(destination - offset) / width)));
    gestureRef.current = null;
    pendingRef.current = { index };
    changePhase("settling");
    paint(destination, duration);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(destination - offset) < 1) {
      finish();
    } else {
      // transitionend is primary; the fallback handles backgrounded tabs and
      // browsers that cancel an animation without delivering its final event.
      fallbackRef.current = window.setTimeout(finish, duration + 100);
    }
  };
  const navigate = (index) => {
    if (phaseRef.current !== "idle") return;
    const boundedIndex = Math.max(0, Math.min(exercises.length - 1, index));
    if (Math.abs(boundedIndex - activeIndex) > 1) onNavigate(boundedIndex);
    else if (boundedIndex !== activeIndex) settle(boundedIndex);
  };
  const onTouchStart = (event) => {
    if (event.touches.length !== 1) {
      if (gestureRef.current) settle(activeIndex, gestureRef.current.offset);
      return;
    }
    if (phaseRef.current !== "idle" || event.target.closest(INTERACTIVE)) return;
    const touch = event.touches[0];
    gestureRef.current = {
      id: touch.identifier, x: touch.clientX, y: touch.clientY,
      lastX: touch.clientX, lastTime: performance.now(), velocity: 0,
      horizontal: false, offset: 0,
    };
  };
  const onTouchMove = (event) => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    if (event.touches.length !== 1) {
      settle(activeIndex, gesture.offset);
      return;
    }
    const touch = event.touches[0];
    if (touch.identifier !== gesture.id) return;
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    if (!gesture.horizontal) {
      if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) {
        gestureRef.current = null;
        return;
      }
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      gesture.horizontal = true;
      changePhase("dragging");
    }
    const now = performance.now();
    const elapsed = now - gesture.lastTime;
    if (elapsed > 0) gesture.velocity = (touch.clientX - gesture.lastX) / Math.max(elapsed, 8);
    gesture.lastX = touch.clientX;
    gesture.lastTime = now;
    const width = viewportRef.current?.clientWidth || 1;
    const atEdge = (activeIndex === 0 && dx > 0) || (activeIndex === exercises.length - 1 && dx < 0);
    gesture.offset = atEdge
      ? Math.sign(dx) * width * 0.2 * (1 - Math.exp(-Math.abs(dx) / (width * 0.5)))
      : Math.max(-width - CARD_GAP, Math.min(width + CARD_GAP, dx));
    paint(gesture.offset);
  };
  const onTouchEnd = (event) => {
    const gesture = gestureRef.current;
    if (!gesture) return;
    if (!gesture.horizontal) {
      gestureRef.current = null;
      return;
    }
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === gesture.id);
    if (!touch) { settle(activeIndex, gesture.offset); return; }
    const dx = touch.clientX - gesture.x;
    const width = viewportRef.current?.clientWidth || 1;
    const velocity = performance.now() - gesture.lastTime < 80 ? gesture.velocity : 0;
    const projectedDistance = dx + velocity * 140;
    const threshold = Math.max(72, width * 0.24);
    const committed = Math.abs(dx) >= threshold || (Math.abs(dx) > 32 && Math.abs(projectedDistance) >= threshold && Math.sign(projectedDistance) === Math.sign(dx));
    const nextIndex = activeIndex + (dx < 0 ? 1 : -1);
    settle(committed && nextIndex >= 0 && nextIndex < exercises.length ? nextIndex : activeIndex, gesture.offset);
  };

  const indices = [activeIndex - 1, activeIndex, activeIndex + 1].filter((index) => index >= 0 && index < exercises.length);
  return (
    <div ref={viewportRef} className="guided-exercise-viewport" data-phase={phase}
      aria-label="Guided exercise cards" aria-roledescription="carousel"
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      onTouchCancel={() => { if (gestureRef.current) settle(activeIndex, gestureRef.current.offset); }}>
      {indices.map((index) => {
        const isActive = index === activeIndex;
        return (
          <div key={exercises[index].id || `${index}-${exercises[index].n}`}
            ref={(panel) => { if (panel) panelsRef.current.set(index, panel); else panelsRef.current.delete(index); }}
            className={isActive ? "guided-exercise-stage" : "guided-exercise-preview"}
            aria-hidden={!isActive} inert={!isActive || phase === "settling"}
            style={{ position: isActive ? "relative" : "absolute", transform: `translate3d(calc(${(index - activeIndex) * 100}% + ${(index - activeIndex) * CARD_GAP}px), 0, 0)` }}
            onTransitionEnd={(event) => { if (isActive && event.target === event.currentTarget && event.propertyName === "transform") finish(); }}>
            {renderExercise(index, navigate, isActive)}
          </div>
        );
      })}
    </div>
  );
}
