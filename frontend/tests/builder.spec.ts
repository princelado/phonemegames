import { test, expect } from "@playwright/test";

test("builder can create, update and delete a word", async ({ page }) => {
  const testWord = `playwright${Date.now()}`;

  await page.goto("/manage");

  await page.getByLabel("English word").fill(testWord);
  await page
    .getByLabel("Phonemes (space separated)")
    .fill("p l eɪ");

  await page
    .getByLabel("Hint")
    .fill("Playwright test word");

  await page
    .getByRole("button", { name: "Add Word" })
    .click();

  await expect(
    page.getByText("Word created successfully.")
  ).toBeVisible();

  const row = page.locator("tr", {
    hasText: testWord,
  });

  await expect(row).toBeVisible();

  await row
    .getByRole("button", { name: "Edit" })
    .click();

  await page
    .getByLabel("Hint")
    .fill("Updated by Playwright");

  await page
    .getByRole("button", { name: "Save Changes" })
    .click();

  await expect(
    page.getByText("Word updated successfully.")
  ).toBeVisible();

  const updatedRow = page.locator("tr", {
    hasText: testWord,
  });

  await expect(
    updatedRow.getByText("Updated by Playwright")
  ).toBeVisible();

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await updatedRow
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(
    page.getByText("Word deleted.")
  ).toBeVisible();

  await expect(
    page.locator("tr", {
      hasText: testWord,
    })
  ).toHaveCount(0);
});