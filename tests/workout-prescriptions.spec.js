import { expect, test } from "@playwright/test";

const prefix = "theforge:";
const profile = {
  id: "qa-profile",
  name: "Part One QA",
  color: "#E9A642",
  activePlanId: "builtin-nippard",
  setupVersion: 1,
  setupCompletedAt: "2026-07-20T12:00:00.000Z",
};
const dayOneExercises = [
  "BACK SQUAT",
  "DUMBBELL INCLINE PRESS",
  "LYING LEG CURL",
  "PRONATED PULLDOWN",
  "SUPINATED EZ BAR CURL",
  "HANGING LEG RAISE",
];

async function seed(page, overrides = {}) {
  await page.addInitScript(({ prefixValue, profileValue, exerciseNames, extra }) => {
    const logs = Object.fromEntries(exerciseNames.map((name) => [
      `builtin-nippard|w1|d1|${name}`,
      { sessions: [{ date: "2026-07-20", completedAt: "2026-07-20T12:00:00.000Z", sets: [{ weight: "40", reps: "10" }] }] },
    ]));
    localStorage.setItem(`${prefixValue}profiles`, JSON.stringify([profileValue]));
    localStorage.setItem(`${prefixValue}activeProfileId`, JSON.stringify(profileValue.id));
    localStorage.setItem(`${prefixValue}p:${profileValue.id}:workoutLogs`, JSON.stringify(logs));
    localStorage.setItem(`${prefixValue}p:${profileValue.id}:dayLog`, JSON.stringify({
      "2026-07-20": { breakfast: [{ id: "food-1", name: "Cottage Cheese", calories: 180, protein: 24, carbs: 8, fat: 5, servings: 1 }] },
    }));
    Object.entries(extra || {}).forEach(([key, value]) => localStorage.setItem(`${prefixValue}${key}`, JSON.stringify(value)));
  }, { prefixValue: prefix, profileValue: { ...profile, ...(overrides.profile || {}) }, exerciseNames: dayOneExercises, extra: overrides.extra || {} });
}

test("Nippard week 6 labels bodyweight movements and splits 10+2 curls", async ({ page }) => {
  await seed(page);
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: "Week 1" }).click();
  for (let week = 1; week < 6; week += 1) await page.getByRole("button", { name: "Next workout week" }).click();
  await page.getByRole("button", { name: /Day 1 Lower Focused Full Body/ }).click();
  await page.getByRole("button", { name: /Swiss Ball Leg Curl Strength/ }).click();
  await expect(page.getByText("Bodyweight exercise — only reps are tracked.")).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Weight", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Day 1" }).click();
  await page.getByRole("button", { name: /Ab Wheel Rollout Strength/ }).click();
  await expect(page.getByText("Bodyweight exercise — only reps are tracked.")).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Weight", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Day 1" }).click();
  await page.getByRole("button", { name: /Supinated Ez Bar Curl Strength/ }).click();
  await expect(page.getByRole("spinbutton", { name: "Phase 1 reps" }).first()).toHaveValue("10");
  await expect(page.getByRole("spinbutton", { name: "Phase 2 reps" }).first()).toHaveValue("2");
  await page.getByRole("button", { name: "Day 1" }).click();
  await page.getByRole("button", { name: "Guided", exact: true }).click();
  await expect(page.getByRole("spinbutton", { name: "Phase 1 reps" })).toHaveValue("10");
  await expect(page.getByRole("spinbutton", { name: "Phase 2 reps" })).toHaveValue("2");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect.poll(async () => page.evaluate(() => {
    const logs = JSON.parse(localStorage.getItem("theforge:p:qa-profile:workoutLogs") || "{}");
    return Object.values(logs).flatMap((log) => log.sessions || []).flatMap((session) => session.sets || [])
      .find((set) => set.repSegments?.join("+") === "10+2")?.reps || null;
  })).toBe("12");
});
