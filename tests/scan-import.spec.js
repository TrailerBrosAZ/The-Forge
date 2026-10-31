import { expect, test } from "@playwright/test";

// A complete text PDF exercises the real file picker, PDF parser, and import flow.
function scanPdf() {
  const items = [
    [190, 809, "YOUR EVOLT 360 BODY SCAN"], [21, 776.5, "10-31-2026 10:01"], [164, 776.5, "Scan QA"],
    [21, 739.5, "6 ft 0 in"], [164, 739.5, "200 lb"], [307, 739.5, "30"], [450, 739.5, "Male"],
    [21, 660.5, "150 / Optimal"], [164, 660.5, "50 / High"], [307, 660.5, "8 / Optimal"],
    [21, 620.5, "80 / Optimal"], [164, 620.5, "42"], [260, 621.2, "[ 21% ]"], [307, 620.5, "60"], [409, 621.2, "[ 60% ]"],
    [21, 580.5, "30 / Optimal"], [164, 580.5, "8"], [264, 581.2, "[ 4% ]"], [307, 580.5, "40"], [409, 581.2, "[ 40% ]"],
    [21, 540.5, "10 / Optimal"], [164, 540.5, "100"], [307, 540.5, "2000"],
    [21, 500.5, "100"], [164, 500.5, "25%"], [307, 500.5, "3000"], [508, 620.9, "30"], [501, 538.9, "7.7"],
    [23, 378.2, "10"], [138, 378.2, "3"], [355, 378.2, "10"], [469, 378.2, "3"],
    [23, 330.2, "70"], [138, 330.2, "20"], [355, 330.2, "36 in"], [469, 330.2, "0.82"],
    [23, 284.2, "25"], [138, 284.2, "8"], [355, 284.2, "25"], [469, 284.2, "8"],
  ];
  const stream = items.map(([x, y, text]) => `BT /F1 8 Tf 1 0 0 1 ${x} ${y} Tm (${text}) Tj ET`).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((object, index) => {
    const offset = pdf.length;
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    return offset;
  });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}`;
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return { name: "scan-qa.pdf", mimeType: "application/pdf", buffer: Buffer.from(pdf) };
}

async function expectReachable(button) {
  await expect(button).toBeInViewport({ ratio: 1 });
  expect(await button.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  })).toBe(true);
}

for (const scenario of [
  { name: "phone", viewport: { width: 390, height: 844 } },
  { name: "small phone", viewport: { width: 320, height: 568 } },
  { name: "landscape", viewport: { width: 844, height: 390 } },
]) {
  test(`scan import ${scenario.name}: one scroller and reachable actions`, async ({ page, browserName }, testInfo) => {
    await page.setViewportSize(scenario.viewport);
    // The tab animation creates the stacking context that hid the original dialog.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => {
      localStorage.setItem("theforge:profiles", JSON.stringify([{ id: "scan-qa", name: "Scan QA", setupVersion: 1 }]));
      localStorage.setItem("theforge:activeProfileId", JSON.stringify("scan-qa"));
    });
    await page.goto("./");
    await page.getByRole("button", { name: "Body", exact: true }).click();
    await page.getByRole("button", { name: "Scans & composition" }).click();
    const chooser = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Import PDF" }).click();
    await (await chooser).setFiles(scanPdf());

    const dialog = page.getByRole("dialog", { name: "Review Evolt scan" });
    const values = dialog.getByRole("region", { name: "Scan values" });
    const submit = dialog.getByRole("button", { name: "Confirm Import", exact: true });
    const cancel = dialog.getByRole("button", { name: "Cancel", exact: true });
    await expect(dialog).toContainText("34 values recognized");
    await expectReachable(submit);
    await expectReachable(cancel);
    expect(await page.locator("#root").evaluate((element) => element.inert)).toBe(true);
    expect(await dialog.evaluate((element) => element.parentElement === document.body)).toBe(true);
    expect(await dialog.locator("*").evaluateAll((elements) => elements.filter((element) => {
      const style = getComputedStyle(element);
      return /auto|scroll/.test(style.overflowY) && element.scrollHeight > element.clientHeight;
    }).length)).toBe(1);

    const originalButtonBounds = await submit.boundingBox();
    await page.screenshot({ path: testInfo.outputPath("scan-review-start.png") });
    await values.hover();
    await page.mouse.wheel(0, 4000);
    await expect.poll(() => values.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect(values.getByText(/The original PDF stays/)).toBeInViewport({ ratio: 1 });
    await expectReachable(submit);
    await expectReachable(cancel);
    expect(await submit.boundingBox()).toEqual(originalButtonBounds);
    await page.screenshot({ path: testInfo.outputPath("scan-review.png") });

    // Resizing also covers a short viewport while editing the last value.
    await page.setViewportSize({ width: 568, height: 320 });
    await expectReachable(submit);
    if (scenario.name === "phone") {
      await values.getByRole("spinbutton", { name: "Weight", exact: true }).fill("");
      await submit.click();
      await expect(dialog.getByRole("alert")).toContainText("Complete the required scan values");
      await expectReachable(submit);
      await expectReachable(cancel);
      await values.getByRole("spinbutton", { name: "Weight", exact: true }).fill("200");
    }
    await values.getByRole("spinbutton", { name: "Extracellular Fluid %", exact: true }).fill("35");
    await expectReachable(submit);
    // Windows Playwright WebKit cannot persist even a standalone Blob in IndexedDB.
    // Still verify its actual PDF parsing, editing, layout, and cancellation here;
    // Chromium exercises the complete save below without mocking storage.
    if (browserName === "webkit" && process.platform === "win32") {
      await cancel.click();
      await expect(dialog).toHaveCount(0);
      expect(await page.locator("#root").evaluate((element) => element.inert)).toBe(false);
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem("theforge:p:scan-qa:bodyScans") || "[]"))).toEqual([]);
      return;
    }
    await submit.click();
    await expect(dialog).toHaveCount(0);
    expect(await page.locator("#root").evaluate((element) => element.inert)).toBe(false);
    const scans = await page.evaluate(() => JSON.parse(localStorage.getItem("theforge:p:scan-qa:bodyScans") || "[]"));
    expect(scans).toHaveLength(1);
    expect(scans[0].documentStored).toBe(true);
    expect(scans[0].metrics.find((metric) => metric.code === "extracellular_fluid_percent").originalValue).toBe("35");
  });
}
