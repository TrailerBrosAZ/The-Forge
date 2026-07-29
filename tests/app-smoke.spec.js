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

test("new profile completes optional guided setup", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("Fresh QA");
  await page.getByRole("button", { name: "Add profile" }).click();
  await expect(page.getByRole("dialog", { name: "Profile setup" })).toContainText("Step 1 of 5");
  await page.getByRole("button", { name: "Kilograms / centimeters" }).click();
  await page.getByRole("button", { name: "Female", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /^Track only/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Set later" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("combobox").selectOption({ label: "Jeff Nippard High Frequency Full Body" });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("dialog")).toContainText("Your records stay on this device");
  await page.getByRole("button", { name: "Open Forge" }).click();
  await expect(page.getByRole("button", { name: "Train", exact: true })).toBeVisible();
});

test("populated history routes forward and retains completion", async ({ page }) => {
  await seed(page);
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await expect(page.getByText("Chest Focused Full Body · Week 1")).toBeVisible();
  await page.getByRole("button", { name: "Week 1" }).click();
  await expect(page.getByRole("button", { name: "Day 1: Done", exact: true })).toBeVisible();
});

test("food suggestions and spreadsheet export remain local", async ({ page }) => {
  await seed(page);
  await page.goto("./");
  await page.getByRole("button", { name: "Food", exact: true }).click();
  await page.getByRole("button", { name: "Add lunch" }).last().click();
  await expect(page.getByRole("button", { name: /Cottage Cheese.*Last used/ })).toBeVisible();
  await page.getByRole("button", { name: "Close food entry" }).click();
  await page.getByRole("button", { name: "Data settings" }).click();
  await expect(page.getByText(/1 profiles · 6 workout sessions/)).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Nutrition" }).click();
  expect((await download).suggestedFilename()).toMatch(/forge-nutrition-\d{4}-\d{2}-\d{2}\.csv/);
});

test("Nippard drop clusters suggest half load and delay rest", async ({ page }) => {
  await seed(page);
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: "Week 1" }).click();
  await page.getByRole("button", { name: /Day 1 Lower Focused Full Body/ }).click();
  await page.getByRole("button", { name: /Supinated Ez Bar Curl Strength/ }).click();
  await expect(page.getByText("1A")).toBeVisible();
  const inputs = page.getByRole("spinbutton");
  await inputs.nth(0).fill("40");
  await expect(inputs.nth(2)).toHaveValue("20");
  await page.getByRole("button", { name: "Day 1" }).click();
  await page.getByRole("button", { name: "Guided" }).click();
  await expect(page.getByText("Set 1A · Working")).toBeVisible();
  await page.getByRole("spinbutton").nth(0).fill("40");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect(page.getByText("Set 1B · Drop")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Complete Drop Set" }).click();
  await expect(page.getByText("Rest", { exact: true })).toBeVisible();
  await expect(page.getByRole("spinbutton").nth(0)).not.toHaveValue("20");
});

test("grouped exercises cycle by round and rest after the final member", async ({ page }) => {
  const groupedPlan = {
    id: "qa-grouped",
    name: "QA Superset",
    createdBy: "qa-profile",
    builtin: false,
    structure: "days",
    days: [{
      d: 1,
      focus: "Superset QA",
      ex: [
        { id: "qa-a1", n: "QA PRESS", type: "strength", loadMode: "external", ws: "2", r: "8", rest: "60 sec", groupId: "qa-group", groupType: "superset", groupPosition: 1, groupRest: "75 sec", mz: {} },
        { id: "qa-a2", n: "QA ROW", type: "strength", loadMode: "external", ws: "2", r: "8", rest: "60 sec", groupId: "qa-group", groupType: "superset", groupPosition: 2, groupRest: "75 sec", mz: {} },
      ],
    }],
  };
  await seed(page, { profile: { activePlanId: "qa-grouped" }, extra: { plans: [groupedPlan] } });
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await expect(page.getByRole("button", { name: /A1 Qa Press/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /A2 Qa Row/ })).toBeVisible();
  await page.getByRole("button", { name: "Guided" }).click();
  await page.getByRole("spinbutton").nth(0).fill("50");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect(page.getByText("QA Row")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toHaveCount(0);
  await page.getByRole("spinbutton").nth(0).fill("50");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect(page.getByText("QA Press")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toBeVisible();
});

test("premium insights connect home, training, nutrition, and body history", async ({ page }) => {
  const scans = [
    { id: "scan-a", scanDate: "2026-06-15", metrics: [
      { code: "weight", value: 90, unit: "kg" }, { code: "lean_body_mass", value: 65, unit: "kg" },
      { code: "body_fat_mass", value: 25, unit: "kg" }, { code: "body_fat_percent", value: 27.8, unit: "%" },
    ] },
    { id: "scan-b", scanDate: "2026-07-18", metrics: [
      { code: "weight", value: 88, unit: "kg" }, { code: "lean_body_mass", value: 66, unit: "kg" },
      { code: "body_fat_mass", value: 22, unit: "kg" }, { code: "body_fat_percent", value: 25, unit: "%" },
    ] },
  ];
  await seed(page, { extra: {
    "p:qa-profile:weights": [{ date: "2026-06-15", lbs: 198.4 }, { date: "2026-07-18", lbs: 194 }],
    "p:qa-profile:bodyScans": scans,
    "p:qa-profile:dayLog": {
      "2026-07-17": { breakfast: [{ id: "a", name: "Breakfast", calories: 1900, protein: 150 }] },
      "2026-07-18": { breakfast: [{ id: "b", name: "Breakfast", calories: 2050, protein: 165 }] },
    },
  } });
  await page.goto("./");
  await expect(page.getByText("Forge Brief")).toBeVisible();
  await expect(page.getByRole("img", { name: /7-day consistency/ })).toBeVisible();

  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: "Week 1" }).click();
  await expect(page.getByRole("region", { name: "Program progress timeline" })).toBeVisible();
  await page.getByRole("button", { name: /Day 1 Lower Focused Full Body/ }).click();
  await page.getByRole("button", { name: /Back Squat Strength/ }).click();
  await expect(page.getByRole("region", { name: "Back Squat progression" })).toBeVisible();

  await page.getByRole("button", { name: "Food", exact: true }).click();
  await expect(page.getByText("Nutrition adherence")).toBeVisible();
  await expect(page.getByText(/Unlogged days are not treated as zero/)).toBeVisible();

  await page.getByRole("button", { name: "Body", exact: true }).click();
  await expect(page.getByText("Scan comparison")).toBeVisible();
  await expect(page.getByRole("region", { name: "Body recomposition story" })).toBeVisible();
});

test("premium surfaces remain inside the viewport at supported phone widths", async ({ page }) => {
  await seed(page);
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    await expect(page.getByText("Forge Brief")).toBeVisible();
  }
});
