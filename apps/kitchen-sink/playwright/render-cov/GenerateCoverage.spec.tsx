// libs
import { expect } from "@playwright/test";

// fixtures
import { renderTest } from "playwright/fixtures";


renderTest.describe("Generate Render Coverage", () => {
    renderTest("generate render coverage for click action", async ({ page }) => {
        await page.goto("/");
        const button = page.getByTestId("btn-level-One");
        await expect(button).toBeVisible();
        await button.click();
        await expect(button).toBeVisible();
        await expect(page.getByText("Level One - 1")).toBeVisible();
    });
});