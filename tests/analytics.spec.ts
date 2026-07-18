import { test, expect } from '@playwright/test';

test('Analytics page loads', async ({ page }) => {
  await page.goto('/analytics');

  // Wait for the telemetry/analytics data to connect and load
  await expect(page.getByText('Stadium Analytics')).toBeVisible({ timeout: 15000 });

  await expect(
    page.getByText(/Safety Gauge/i)
  ).toBeVisible();
});
