import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:5000/api/simulation/reset');
});

test('Scenario page opens', async ({ page }) => {
  await page.goto('/scenarios');

  await expect(
    page.getByText(/Metro Delay/i)
  ).toBeVisible();
});

test('Metro Delay triggers', async ({ page }) => {
  await page.goto('/scenarios');

  await page.getByRole('button', {
    name: /Trigger Scenario/i
  }).first().click();

  await expect(page).toHaveURL(/dashboard/);
});
