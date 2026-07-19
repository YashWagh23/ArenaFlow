import { test, expect } from '@playwright/test';

test('Analytics page loads with correct heading', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByText('Stadium Analytics')).toBeVisible({ timeout: 15000 });
});

test('Analytics page displays Safety Gauge', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByText('Stadium Analytics')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/Safety Gauge/i)).toBeVisible();
});

test('Analytics page displays AI Confidence metric', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByText('Stadium Analytics')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/AI Confidence/i)).toBeVisible();
});

test('Analytics page displays at least one numeric metric card', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByText('Stadium Analytics')).toBeVisible({ timeout: 15000 });
  // Numeric cards contain text like "80%" or "4 min" etc.
  await expect(page.locator('text=/%/')).toBeVisible({ timeout: 10000 });
});

test('Analytics page does not have uncaught console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('socket.io') && !msg.text().includes('WebSocket')) {
      errors.push(msg.text());
    }
  });
  await page.goto('/analytics');
  await expect(page.getByText('Stadium Analytics')).toBeVisible({ timeout: 15000 });
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});
