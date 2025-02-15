// libs
import { expect, test } from "@playwright/test";

test.describe("LevelOne", () => {
    test("should render LevelOne", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("text=Level One - 0 : inc").first()).toBeVisible();
    });
});