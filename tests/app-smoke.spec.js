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

test("a weekly day completed across dates opens the next workout", async ({ page }) => {
  const splitPlan = {
    id: "qa-split-dates", name: "QA Weekly", createdBy: "qa-profile", structure: "weeks", weeks: [
      { wk: 1, days: [{ d: 1, focus: "Previous", ex: [{ n: "QA SQUAT", ws: "1", r: "8" }, { n: "QA ROW", ws: "1", r: "8" }] }] },
      { wk: 2, days: [{ d: 1, focus: "Next", ex: [{ n: "QA PRESS", ws: "1", r: "8" }] }] },
    ],
  };
  await seed(page, { profile: { activePlanId: splitPlan.id }, extra: { plans: [splitPlan] } });
  await page.addInitScript(({ prefixValue, id }) => {
    localStorage.setItem(`${prefixValue}p:qa-profile:workoutLogs`, JSON.stringify({
      [`${id}|w1|d1|QA SQUAT`]: { sessions: [{ date: "2026-07-24", sets: [{ reps: "8" }] }] },
      [`${id}|w1|d1|QA ROW`]: { sessions: [{ date: "2026-07-25", sets: [{ reps: "8" }] }] },
    }));
  }, { prefixValue: prefix, id: splitPlan.id });
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await expect(page.getByText("Next · Week 2")).toBeVisible();
});

test("combined reps save each phase in list and guided modes", async ({ page }) => {
  const phasePlan = { id: "qa-phases", name: "QA Phases", createdBy: "qa-profile", structure: "days", days: [{ d: 1, focus: "Arms", ex: [{ n: "EZ BAR CURL 21S", ws: "1", r: "7/7/7", loadMode: "external" }] }] };
  await seed(page, { profile: { activePlanId: phasePlan.id }, extra: { plans: [phasePlan] } });
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: /Ez Bar Curl 21s Strength/ }).click();
  await expect(page.getByRole("spinbutton", { name: "Phase 3 reps" })).toHaveValue("7");
  await page.getByRole("spinbutton", { name: "Phase 3 reps" }).fill("6");
  await page.getByRole("button", { name: "Save session" }).click();
  await page.getByRole("button", { name: "Guided", exact: true }).click();
  await page.getByRole("button", { name: /Correct completed Set 1/ }).click();
  await page.getByRole("spinbutton", { name: "Phase 3 reps" }).first().fill("5");
  await page.getByRole("button", { name: "Save correction" }).click();
  await expect.poll(async () => page.evaluate(() => {
    const raw = localStorage.getItem("theforge:p:qa-profile:workoutLogs");
    const logs = JSON.parse(raw || "{}");
    const set = Object.values(logs).flatMap((log) => log.sessions || []).flatMap((session) => session.sets || []).find((item) => item.repSegments);
    return set ? { phases: set.repSegments, total: set.reps } : null;
  })).toEqual({ phases: ["7", "7", "5"], total: "19" });
  await page.getByRole("button", { name: /Correct completed Set 1/ }).click();
  await page.getByRole("button", { name: "Add rep phase" }).first().click();
  await page.getByRole("spinbutton", { name: "Phase 4 reps" }).first().fill("1");
  await page.getByRole("button", { name: "Save correction" }).click();
  await expect.poll(async () => page.evaluate(() => {
    const logs = JSON.parse(localStorage.getItem("theforge:p:qa-profile:workoutLogs") || "{}");
    const set = Object.values(logs).flatMap((log) => log.sessions || []).flatMap((session) => session.sets || []).find((item) => item.repSegments);
    return set ? { phases: set.repSegments, total: set.reps } : null;
  })).toEqual({ phases: ["7", "7", "5", "1"], total: "20" });
});

test("body sections, weight history, goal, and chart selection", async ({ page }) => {
  await seed(page, { extra: { "p:qa-profile:weights": [{ date: "2026-07-18", lbs: 182 }, { date: "2026-07-20", lbs: 181 }] } });
  await page.goto("./");
  await page.getByRole("button", { name: "Body", exact: true }).click();
  await expect(page.getByRole("button", { name: "Log weight" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Weight entries/ })).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("2026-07-18 · 182 lbs")).toBeHidden();
  await page.getByRole("slider", { name: "Weight chart entry" }).fill("0");
  await expect(page.getByText("2026-07-18 · 182 lbs")).toBeVisible();
  const chart = page.getByRole("img", { name: /Weight chart/ });
  const bounds = await chart.boundingBox();
  await chart.click({ position: { x: bounds.width - 14, y: bounds.height / 2 } });
  await expect(page.getByText("2026-07-20 · 181 lbs")).toBeVisible();
  await page.getByRole("button", { name: /Weight entries/ }).click();
  await expect(page.getByRole("button", { name: /Weight entries/ })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Set goal" }).click();
  await page.getByRole("spinbutton", { name: "Goal weight in pounds" }).fill("175");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("button", { name: "Update goal" })).toBeVisible();
  await page.getByRole("button", { name: "Log weight" }).click();
  await expect(page.locator("#body-weight-lbs")).toBeFocused();
  await page.locator("#body-weight-lbs").fill("180.5");
  await page.getByRole("button", { name: "Log", exact: true }).click();
  await expect(page.getByText(/Latest logged: 180.5 lbs/)).toBeVisible();
  await page.getByRole("button", { name: "Measurements", exact: true }).first().click();
  await expect(page.getByText("Add Measurement")).toBeVisible();
  await expect(page.locator("#body-weight-lbs")).toBeHidden();
  await page.getByRole("button", { name: "Body map & training" }).click();
  await expect(page.getByText("Sets by muscle")).toBeVisible();
  await page.getByRole("button", { name: "Scans & composition" }).click();
  await expect(page.getByText("Body Composition")).toBeVisible();
  await page.getByRole("button", { name: "Log weight" }).click();
  await expect(page.getByText(/Latest logged: 180.5 lbs/)).toBeVisible();
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import scan" }).click();
  expect((await chooser).isMultiple()).toBe(false);
});

test("recipe editor saves a batch and logs a portion", async ({ page }) => {
  await seed(page, { extra: { "p:qa-profile:myFoods": [
    { id: "ingredient-oats", name: "Oats", servingNote: "1 cup", calories: 150, protein: 5, carbs: 27, fat: 3 },
  ] } });
  await page.goto("./");
  await page.getByRole("button", { name: "Food", exact: true }).click();
  await page.getByRole("button", { name: "Add breakfast" }).first().click();
  await page.getByRole("button", { name: "Recipe", exact: true }).click();
  const editor = page.getByRole("region", { name: "Recipe editor" });
  await editor.getByRole("textbox", { name: "Recipe name" }).fill("Breakfast oats");
  await editor.getByRole("button", { name: "Add saved food" }).click();
  await editor.getByRole("button", { name: /Oats.*1 cup/ }).click();
  await editor.getByRole("spinbutton", { name: "Batch yield in portions" }).fill("2");
  await editor.getByRole("button", { name: "Save recipe" }).click();
  await expect(editor.getByRole("status")).toContainText("Recipe saved");
  await editor.getByRole("button", { name: "Log portions" }).click();
  await expect.poll(async () => page.evaluate(() => {
    const foods = JSON.parse(localStorage.getItem("theforge:p:qa-profile:myFoods") || "[]");
    const days = JSON.parse(localStorage.getItem("theforge:p:qa-profile:dayLog") || "{}");
    const entry = Object.values(days).flatMap((day) => day.breakfast || []).find((food) => food.name === "Breakfast oats");
    return { saved: foods.some((food) => food.name === "Breakfast oats" && food.isRecipe), calories: entry?.calories };
  })).toEqual({ saved: true, calories: 75 });
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
  await page.getByRole("button", { name: "Guided", exact: true }).click();
  await expect(page.getByText("Set 1A · Working")).toBeVisible();
  await page.getByRole("spinbutton").nth(0).fill("40");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect(page.getByText("Set 1B · Drop")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Complete Drop Set" }).click();
  await expect(page.getByText("Rest", { exact: true })).toBeVisible();
  await expect(page.getByRole("spinbutton").nth(0)).not.toHaveValue("20");
});

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
  await page.getByRole("spinbutton", { name: "Weight", exact: true }).fill("50");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect(page.getByText("QA Row")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toHaveCount(0);
  await page.getByRole("spinbutton").nth(0).fill("50");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect(page.getByText("QA Press")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toBeVisible();
});

test("guided workout corrects a completed set without advancing the active set", async ({ page }) => {
  const correctionPlan = {
    id: "qa-correction",
    name: "QA Guided Correction",
    createdBy: "qa-profile",
    builtin: false,
    structure: "days",
    days: [{
      d: 1,
      focus: "Correction QA",
      ex: [{ id: "qa-correction-lift", n: "QA LIFT", type: "strength", loadMode: "external", ws: "2", r: "8", rest: "60 sec", mz: {} }],
    }],
  };
  await seed(page, { profile: { activePlanId: "qa-correction" }, extra: { plans: [correctionPlan] } });
  await page.goto("./");
  await page.getByRole("button", { name: "Train", exact: true }).click();
  await page.getByRole("button", { name: "Guided", exact: true }).click();
  await page.getByRole("spinbutton", { name: "Weight", exact: true }).fill("50");
  await page.getByRole("button", { name: "Complete Working Set" }).click();
  await expect(page.getByText("Set 2 · Working")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Correct completed Set 1 · Working" }).click();
  await expect(page.getByText("Correct Set 1 · Working")).toBeVisible();
  await page.getByRole("spinbutton", { name: "Correction Weight", exact: true }).fill("65");
  await page.getByRole("button", { name: "Save correction" }).click();

  await expect(page.getByText("Set 2 · Working")).toBeVisible();
  await expect(page.getByText("Rest", { exact: true })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => {
    const entries = Object.entries(localStorage).filter(([key]) => key.includes("workoutLogs"));
    const logs = JSON.parse(entries[0][1]);
    const session = Object.values(logs).flatMap((log) => log.sessions || []).find((item) => item.sets?.[0]?.weight === "65");
    return session ? { count: session.sets.length, firstDone: session.sets[0].done, secondDone: session.sets[1].done } : null;
  })).toEqual({ count: 2, firstDone: true, secondDone: false });
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
  await page.getByRole("button", { name: /Scans & composition/ }).click();
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
