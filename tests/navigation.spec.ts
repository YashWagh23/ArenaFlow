import { test, expect } from '@playwright/test';

test('Sidebar navigation works', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

  // Wait for telemetry data to load
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  // Use scoped selector for the sidebar navigation link
  await page.locator('aside a[href="/analytics"]').click();

  await expect(page).toHaveURL(/analytics/);
});
