import { test, expect, devices } from '@playwright/test';

// ---------------------------------------------------------------------------
// iPhone 13
// ---------------------------------------------------------------------------

test.describe('iPhone 13 viewport', () => {
  test.use(devices['iPhone 13']);

  test('Landing page loads on iPhone 13', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Launch ArenaFlow/i })).toBeVisible();
  });

  test('Landing page has no horizontal overflow on iPhone 13', async ({ page }) => {
    await page.goto('/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2); // 2px tolerance
  });

  test('Dashboard KPIs render on iPhone 13', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('SAFETY SCORE', { exact: true })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Pixel 5
// ---------------------------------------------------------------------------

test.describe('Pixel 5 viewport', () => {
  test.use(devices['Pixel 5']);

  test('Landing page loads on Pixel 5', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Launch ArenaFlow/i })).toBeVisible();
  });

  test('Landing page has no horizontal overflow on Pixel 5', async ({ page }) => {
    await page.goto('/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 393;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });
});
