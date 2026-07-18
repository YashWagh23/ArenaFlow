import { test, expect } from '@playwright/test';

test('Landing page loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/ArenaFlow/i);

  await expect(
    page.getByRole('button', { name: /Launch ArenaFlow/i })
  ).toBeVisible();
});
