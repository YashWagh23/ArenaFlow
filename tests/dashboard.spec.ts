import { test, expect } from '@playwright/test';

test('Launch ArenaFlow navigates to dashboard', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', {
    name: /Launch ArenaFlow/i
  }).click();

  await expect(page).toHaveURL(/dashboard/);

  // Wait for the dashboard to connect and load telemetry data
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  await expect(
    page.getByText('SAFETY SCORE', { exact: true })
  ).toBeVisible();
});

test('Dashboard KPIs exist', async ({ page }) => {
  await page.goto('/dashboard');

  // Wait for telemetry data to load
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  await expect(page.getByText('SAFETY SCORE', { exact: true })).toBeVisible();
  await expect(page.getByText('CROWD DENSITY', { exact: true })).toBeVisible();
  await expect(page.getByText('AI CONFIDENCE', { exact: true })).toBeVisible();
  await expect(page.getByText('ACTIVE INCIDENTS', { exact: true })).toBeVisible();
});

test('Stadium map renders', async ({ page }) => {
  await page.goto('/dashboard');

  // Wait for telemetry data to load
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  await expect(page.locator('svg').first()).toBeVisible();
});

test('Zoom controls work', async ({ page }) => {
  await page.goto('/dashboard');

  // Wait for telemetry data to load
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  await page.getByRole('button').filter({ hasText: 'add' }).click();
  await page.getByRole('button').filter({ hasText: 'remove' }).click();
});

test('Heatmap toggle works', async ({ page }) => {
  await page.goto('/dashboard');

  // Wait for telemetry data to load
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  const toggle = page.getByRole('button', {
    name: /Heatmap/i
  });

  await toggle.click();
  await expect(toggle).toBeVisible();
});
