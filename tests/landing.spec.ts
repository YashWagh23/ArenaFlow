import { test, expect } from '@playwright/test';

test('Landing page loads with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ArenaFlow/i);
});

test('Launch ArenaFlow button is visible and clickable', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByRole('button', { name: /Launch ArenaFlow/i });
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
});

test('Landing page shows hero headline', async ({ page }) => {
  await page.goto('/');
  // Look for the main headline text
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('Landing page KPI stat: Safety Score is displayed', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Safety Score|SAFETY SCORE/i)).toBeVisible();
});

test('Landing page KPI stat: Prediction Accuracy is displayed', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Prediction Accuracy|PREDICTION ACCURACY/i)).toBeVisible();
});

test('Launch ArenaFlow navigates to /dashboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Launch ArenaFlow/i }).click();
  await expect(page).toHaveURL(/dashboard/);
});
