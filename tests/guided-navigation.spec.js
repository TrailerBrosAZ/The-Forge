import { expect, test } from "@playwright/test";

test("guided workout has persistent top controls and supports horizontal swipes", async ({ page }) => {
  await page.addInitScript(() => {
    const profile = { id: "guided-nav-qa", name: "Guided navigation QA", activePlanId: "guided-nav-plan", setupVersion: 1 };
    const plan = {
      id: profile.activePlanId,
      name: "Guided Navigation QA",
      createdBy: profile.id,
      structure: "days",
      days: [{ d: 1, focus: "Navigation", ex: [
        { id: "guided-nav-first", n: "FIRST QA LIFT", ws: "2", r: "8", loadMode: "external" },
        { id: "guided-nav-second", n: "SECOND QA LIFT", ws: "2", r: "8", loadMode: "external" },
      ] }],
    };
    localStorage.setItem("theforge:profiles", JSON.stringify([profile]));
    localStorage.setItem("theforge:activeProfileId", JSON.stringify(profile.id));
    localStorage.setItem("theforge:plans", JSON.stringify([plan]));
  });

  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: "Guided", exact: true }).click();

  const navigation = page.getByLabel("Exercise navigation");
  await expect(navigation).toContainText("Exercise 1 of 2");
  await expect(navigation.getByRole("button", { name: "Previous exercise" })).toBeDisabled();
  await expect(navigation.getByRole("button", { name: "Next exercise" })).toBeEnabled();

  await navigation.getByRole("button", { name: "Next exercise" }).click();
  await expect(page.getByText("Second Qa Lift", { exact: true })).toBeVisible();
  await expect(navigation).toContainText("Exercise 2 of 2");

  await navigation.getByRole("button", { name: "Previous exercise" }).click();
  const stage = page.locator(".guided-exercise-stage");
  await stage.evaluate((element) => {
    const touch = (x, y) => ({ clientX: x, clientY: y });
    const start = new Event("touchstart", { bubbles: true, cancelable: true });
    Object.defineProperty(start, "touches", { value: [touch(300, 180)] });
    element.dispatchEvent(start);
    const end = new Event("touchend", { bubbles: true, cancelable: true });
    Object.defineProperty(end, "changedTouches", { value: [touch(130, 182)] });
    element.dispatchEvent(end);
  });
  await expect(page.getByText("Second Qa Lift", { exact: true })).toBeVisible();
  await expect(stage).toHaveClass(/guided-exercise-stage--next/);
});
