import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 13']);

test('Mobile view loads', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('button', {
      name: /Launch ArenaFlow/i
    })
  ).toBeVisible();
});
