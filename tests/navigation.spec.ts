import { test, expect } from '@playwright/test';

test('Sidebar navigation: dashboard → analytics', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });
  await page.locator('aside a[href="/analytics"]').click();
  await expect(page).toHaveURL(/analytics/);
});

test('Sidebar navigation: dashboard → scenarios', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });
  await page.locator('aside a[href="/scenarios"]').click();
  await expect(page).toHaveURL(/scenarios/);
});

test('Sidebar navigation: analytics → dashboard', async ({ page }) => {
  await page.goto('/analytics', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Stadium Analytics')).toBeVisible({ timeout: 15000 });
  await page.locator('aside a[href="/dashboard"]').click();
  await expect(page).toHaveURL(/dashboard/);
});

test('Sidebar is rendered on every app page', async ({ page }) => {
  for (const route of ['/dashboard', '/analytics', '/scenarios']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('aside')).toBeVisible({ timeout: 10000 });
  }
});
