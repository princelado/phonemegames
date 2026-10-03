import { test, expect } from "@playwright/test";

test("user can generate a Wordle HTML activity", async ({ page }) => {
  await page.goto("/wordle");

  await expect(
    page.getByRole("heading", {
      name: "Wordle Builder",
    })
  ).toBeVisible();

  await expect(
    page.getByText("Activity Preview")
  ).toBeVisible();

  const downloadPromise =
    page.waitForEvent("download");

  await page
    .getByRole("button", {
      name: "Generate HTML",
    })
    .click();

  const download =
    await downloadPromise;

  expect(
    download.suggestedFilename()
  ).toBe("phoneme-wordle.html");
});