import { expect, test } from "@playwright/test";

test.use({ hasTouch: true, reducedMotion: "no-preference" });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const profile = { id: "guided-nav-qa", name: "Guided navigation QA", activePlanId: "guided-nav-plan", setupVersion: 1 };
    const plan = {
      id: profile.activePlanId,
      name: "Guided Navigation QA",
      createdBy: profile.id,
      structure: "days",
      days: [{ d: 1, focus: "Navigation", ex: [
        { id: "guided-nav-first", n: "FIRST QA LIFT", ws: "2", r: "8", loadMode: "external" },
        { id: "guided-nav-second", n: "SECOND QA LIFT", ws: "4", r: "12", loadMode: "external", note: "A longer exercise card with coaching notes to exercise the shared pager layout." },
        { id: "guided-nav-cardio", n: "QA BIKE", type: "cardio", duration: "15", intensity: "Easy" },
      ] }],
    };
    localStorage.setItem("theforge:profiles", JSON.stringify([profile]));
    localStorage.setItem("theforge:activeProfileId", JSON.stringify(profile.id));
    localStorage.setItem("theforge:plans", JSON.stringify([plan]));
  });

  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: "Guided", exact: true }).click();

});

async function touch(target, type, x, y = 180) {
  await target.evaluate((element, gesture) => {
    const point = { identifier: 1, clientX: gesture.x, clientY: gesture.y };
    const event = new Event(gesture.type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, "touches", { value: gesture.type === "touchend" || gesture.type === "touchcancel" ? [] : [point] });
    Object.defineProperty(event, "changedTouches", { value: [point] });
    element.dispatchEvent(event);
  }, { type, x, y });
}

async function offset(stage) {
  return stage.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
}

async function expectSettled(page, exerciseNumber) {
  await expect(page.locator(".guided-exercise-stage").getByLabel("Exercise navigation")).toContainText(`Exercise ${exerciseNumber} of 3`);
  await expect(page.locator(".guided-exercise-viewport")).toHaveAttribute("data-phase", "idle");
  await expect.poll(() => offset(page.locator(".guided-exercise-stage"))).toBeCloseTo(0, 0);
}

test("top arrows navigate different strength cards and the shared cardio pager", async ({ page }) => {
  const stage = page.locator(".guided-exercise-stage");
  const navigation = stage.getByLabel("Exercise navigation");
  await expect(navigation.getByRole("button", { name: "Previous exercise" })).toBeDisabled();
  await navigation.getByRole("button", { name: "Next exercise" }).click();
  await expectSettled(page, 2);
  await expect(stage.getByText("Second Qa Lift", { exact: true })).toBeVisible();
  await navigation.getByRole("button", { name: "Next exercise" }).click();
  await expectSettled(page, 3);
  await expect(stage.getByRole("button", { name: "Complete Cardio", exact: true })).toBeVisible();
  await expect(navigation.getByRole("button", { name: "Next exercise" })).toBeDisabled();
  await navigation.getByRole("button", { name: "Previous exercise" }).click();
  await expectSettled(page, 2);
});

test("card follows each finger movement and reversal before release commits", async ({ page }) => {
  const stage = page.locator(".guided-exercise-stage");
  await touch(stage, "touchstart", 300);
  await touch(stage, "touchmove", 220);
  await expect.poll(() => offset(stage)).toBeCloseTo(-80, 0);
  const viewportBounds = await page.locator(".guided-exercise-viewport").boundingBox();
  const preview = page.locator(".guided-exercise-preview").first();
  const previewBounds = await preview.boundingBox();
  expect(previewBounds.x).toBeLessThan(viewportBounds.x + viewportBounds.width);
  await expect(preview).toHaveAttribute("aria-hidden", "true");
  await expect(preview).toHaveAttribute("inert", "");
  await touch(stage, "touchmove", 140);
  await expect.poll(() => offset(stage)).toBeCloseTo(-160, 0);
  await touch(stage, "touchmove", 170);
  await expect.poll(() => offset(stage)).toBeCloseTo(-130, 0);
  await expect(stage.getByLabel("Exercise navigation")).toContainText("Exercise 1 of 3");
  await touch(stage, "touchend", 170);
  await expectSettled(page, 2);
  await expect(stage.getByText("Second Qa Lift", { exact: true })).toBeVisible();
});

test("short pulls and canceled gestures snap back without changing exercise", async ({ page }) => {
  const stage = page.locator(".guided-exercise-stage");
  await touch(stage, "touchstart", 300);
  await touch(stage, "touchmove", 270);
  await expect.poll(() => offset(stage)).toBeCloseTo(-30, 0);
  // Pause before release so this tests distance rather than a fast flick.
  await page.waitForTimeout(180);
  await touch(stage, "touchend", 270);
  await expectSettled(page, 1);

  await touch(stage, "touchstart", 300);
  await touch(stage, "touchmove", 130);
  await expect.poll(() => offset(stage)).toBeCloseTo(-170, 0);
  await touch(stage, "touchcancel", 130);
  await expectSettled(page, 1);
});

test("vertical scrolling and input gestures do not change exercise", async ({ page }) => {
  const stage = page.locator(".guided-exercise-stage");
  await touch(stage, "touchstart", 280, 180);
  await touch(stage, "touchmove", 255, 320);
  await touch(stage, "touchend", 110, 380);
  await expectSettled(page, 1);

  const input = stage.locator("input").first();
  await touch(input, "touchstart", 280);
  await touch(input, "touchmove", 100);
  await touch(input, "touchend", 100);
  await expectSettled(page, 1);
  await input.fill("135");
  await expect(input).toHaveValue("135");
});

test("first and last exercises resist outward drags and cardio supports swiping back", async ({ page }) => {
  const stage = page.locator(".guided-exercise-stage");
  await touch(stage, "touchstart", 100);
  await touch(stage, "touchmove", 260);
  await expect.poll(() => offset(stage)).toBeGreaterThan(0);
  expect(await offset(stage)).toBeLessThan(100);
  await touch(stage, "touchend", 260);
  await expectSettled(page, 1);

  const next = stage.getByRole("button", { name: "Next exercise", exact: true });
  await next.click();
  await expectSettled(page, 2);
  await next.click();
  await expectSettled(page, 3);
  await touch(stage, "touchstart", 280);
  await touch(stage, "touchmove", 100);
  await expect.poll(() => offset(stage)).toBeLessThan(0);
  expect(await offset(stage)).toBeGreaterThan(-100);
  await touch(stage, "touchend", 100);
  await expectSettled(page, 3);

  await touch(stage, "touchstart", 100);
  await touch(stage, "touchmove", 280);
  await expect.poll(() => offset(stage)).toBeCloseTo(180, 0);
  await touch(stage, "touchend", 280);
  await expectSettled(page, 2);
});

test("unsaved exercise entries survive navigating to a neighbor and back", async ({ page }) => {
  const stage = page.locator(".guided-exercise-stage");
  await stage.locator("input").nth(0).fill("135");
  await stage.locator("input").nth(1).fill("9");
  await stage.getByRole("button", { name: "Next exercise", exact: true }).click();
  await expectSettled(page, 2);
  await stage.locator("input").nth(0).fill("90");

  await stage.getByRole("button", { name: "Previous exercise", exact: true }).click();
  await expectSettled(page, 1);
  await expect(stage.locator("input").nth(0)).toHaveValue("135");
  await expect(stage.locator("input").nth(1)).toHaveValue("9");
  await stage.getByRole("button", { name: "Next exercise", exact: true }).click();
  await expectSettled(page, 2);
  await expect(stage.locator("input").nth(0)).toHaveValue("90");
});

test("repeated navigation during settling cannot skip or later overwrite an exercise", async ({ page }) => {
  const stage = page.locator(".guided-exercise-stage");
  // Dispatch in one browser task to exercise the phase guard before React paints
  // the inert state or Playwright waits for the animation to finish.
  await stage.getByRole("button", { name: "Next exercise", exact: true }).evaluate((button) => {
    button.click();
    button.click();
    button.click();
  });
  await expectSettled(page, 2);
  await stage.getByRole("button", { name: "Previous exercise", exact: true }).click();
  await expectSettled(page, 1);
  // Past both fallback deadlines, no stale transition may restore exercise 2.
  await page.waitForTimeout(650);
  await expectSettled(page, 1);
});

test("reduced motion supports arrows and live swipes without a settling delay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const stage = page.locator(".guided-exercise-stage");
  await stage.getByRole("button", { name: "Next exercise", exact: true }).click();
  await expectSettled(page, 2);
  await expect.poll(() => stage.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");

  await touch(stage, "touchstart", 300);
  await touch(stage, "touchmove", 150);
  await expect.poll(() => offset(stage)).toBeCloseTo(-150, 0);
  await touch(stage, "touchend", 150);
  await expectSettled(page, 3);
  await expect(stage.getByRole("button", { name: "Complete Cardio", exact: true })).toBeVisible();
  await stage.getByRole("button", { name: "Previous exercise", exact: true }).click();
  await expectSettled(page, 2);
});

test("native browser touch tracks horizontally without being canceled by scrolling", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Native input dispatch uses the Chromium protocol.");
  const stage = page.locator(".guided-exercise-stage");
  const bounds = await stage.boundingBox();
  const titleBounds = await stage.getByText("First Qa Lift", { exact: true }).boundingBox();
  const x = bounds.x + bounds.width - 40;
  const y = titleBounds.y + titleBounds.height / 2;
  const session = await page.context().newCDPSession(page);
  const point = (nextX) => ({ x: nextX, y, id: 1, radiusX: 6, radiusY: 6, force: 1 });
  try {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(x)] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point(x - 40)] });
    await expect.poll(() => offset(stage)).toBeLessThan(-20);
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point(x - 150)] });
    await expect.poll(() => offset(stage)).toBeLessThan(-120);
    await expect(stage.getByLabel("Exercise navigation")).toContainText("Exercise 1 of 3");
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expectSettled(page, 2);
  } finally {
    await session.detach();
  }
});
