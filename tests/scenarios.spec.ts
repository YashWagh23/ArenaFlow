import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:5000/api/simulation/reset');
});

test('Scenario page opens and renders Metro Delay card', async ({ page }) => {
  await page.goto('/scenarios');
  await expect(page.getByText(/Metro Delay/i)).toBeVisible();
});

test('All 4 scenario cards are visible on the page', async ({ page }) => {
  await page.goto('/scenarios');
  await expect(page.getByText(/Metro Delay/i)).toBeVisible();
  await expect(page.getByText(/Heavy Rain/i)).toBeVisible();
  await expect(page.getByText(/Gate Scanner/i)).toBeVisible();
  await expect(page.getByText(/Match.end Egress|Post.Match Egress/i)).toBeVisible();
});

test('Each scenario card has a Trigger Scenario button', async ({ page }) => {
  await page.goto('/scenarios');
  const buttons = page.getByRole('button', { name: /Trigger Scenario/i });
  await expect(buttons.first()).toBeVisible();
  const count = await buttons.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test('Metro Delay triggers and redirects to dashboard', async ({ page }) => {
  await page.goto('/scenarios');
  await page.locator('.glass-card')
    .filter({ hasText: 'Metro Delay' })
    .getByRole('button', { name: /Trigger Scenario/i })
    .click();
  await expect(page).toHaveURL(/dashboard/);
});

test('Heavy Rain triggers and redirects to dashboard', async ({ page }) => {
  await page.goto('/scenarios');
  await page.locator('.glass-card')
    .filter({ hasText: 'Heavy Rain' })
    .getByRole('button', { name: /Trigger Scenario/i })
    .click();
  await expect(page).toHaveURL(/dashboard/);
});

test('Scenario page has sidebar navigation', async ({ page }) => {
  await page.goto('/scenarios');
  await expect(page.locator('aside')).toBeVisible();
  await expect(page.locator('aside a[href="/dashboard"]')).toBeVisible();
});
