import { expect, test } from "@playwright/test";

async function finishWorkout(page) {
  await page.addInitScript(() => {
    const profile = { id: "completion-qa", name: "Completion QA", activePlanId: "completion-plan", setupVersion: 1 };
    const exercises = Array.from({ length: 7 }, (_, index) => ({ n: `QA LIFT ${index + 1}`, ws: "1", r: "8", loadMode: "external" }));
    const plan = { id: profile.activePlanId, name: "Jeff Nippard High Frequency Full Body", createdBy: profile.id, structure: "days", days: [
      { d: 1, focus: "Chest Focused Full Body", ex: exercises },
      { d: 2, focus: "Next Workout", ex: [{ n: "QA ROW", ws: "1", r: "8" }] },
    ] };
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const logs = Object.fromEntries(exercises.slice(0, -1).map((ex) => [
      `${plan.id}|d1|${ex.n}`, { sessions: [{ date, sets: [{ weight: "40", reps: "8" }] }] },
    ]));
    for (const [key, value] of Object.entries({ profiles: [profile], activeProfileId: profile.id, plans: [plan], [`p:${profile.id}:workoutLogs`]: logs })) {
      localStorage.setItem(`theforge:${key}`, JSON.stringify(value));
    }
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: /Qa Lift 7 Strength/ }).click();
  await page.getByRole("spinbutton").first().fill("40");
  await page.getByRole("button", { name: "Save session" }).click();
  // Opening from the end of a long exercise list reproduces the reported case.
  await page.getByRole("button", { name: "Finish Workout" }).click();
}

async function expectReachable(button) {
  await expect(button).toBeInViewport({ ratio: 1 });
  await expect.poll(() => button.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  })).toBe(true);
}

test.describe("workout completion", () => {
  for (const scenario of [
    { name: "phone", viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" },
    { name: "small phone", viewport: { width: 320, height: 568 }, reducedMotion: "reduce" },
    { name: "landscape", viewport: { width: 844, height: 390 }, reducedMotion: "no-preference" },
    { name: "desktop", viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" },
  ]) {
    test(`${scenario.name}: completion stays above navigation and dismisses`, async ({ page }, testInfo) => {
      await page.setViewportSize(scenario.viewport);
      await page.emulateMedia({ reducedMotion: scenario.reducedMotion });
      await finishWorkout(page);
      const dialog = page.getByRole("dialog", { name: "Workout complete" });
      const done = dialog.getByRole("button", { name: "Done", exact: true });
      await expectReachable(done);

      // Rotation / a shorter mobile viewport must preserve access to the action
      // and allow the entire summary to scroll independently of the workout.
      await page.setViewportSize({ width: 568, height: 320 });
      await expectReachable(done);
      const summary = dialog.getByRole("region", { name: "Workout summary" });
      await summary.hover();
      await page.mouse.wheel(0, 1000);
      await expect.poll(() => summary.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
      await expect(summary.getByText(/Effort logged/)).toBeInViewport({ ratio: 1 });
      await expectReachable(done);
      await page.screenshot({ path: testInfo.outputPath("completion-short-viewport.png") });
      await done.click();
      await expect(dialog).toHaveCount(0);
      await expect(page.getByText("Next Workout", { exact: true })).toBeVisible();
      await expect.poll(() => page.evaluate(() => {
        const logs = JSON.parse(localStorage.getItem("theforge:p:completion-qa:workoutLogs"));
        return Object.values(logs).reduce((count, log) => count + log.sessions.length, 0);
      })).toBe(7);
    });
  }
});
