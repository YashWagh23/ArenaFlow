import { test, expect } from '@playwright/test';

test('Hackathon Demo Flow (Judge Walkthrough)', async ({ page }) => {
  // 1. Open Landing Page
  await page.goto('/');
  await expect(page).toHaveTitle(/ArenaFlow/i);

  // 2. Click Launch ArenaFlow
  await page.getByRole('button', { name: /Launch ArenaFlow/i }).click();

  // 3. Verify Dashboard loads
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('SAFETY SCORE', { exact: true })).toBeVisible();

  // 4. Go to Scenarios (sidebar link)
  await page.locator('aside a[href="/scenarios"]').click();
  await expect(page).toHaveURL(/scenarios/);
  
  // Scope the check to the scenario card on the simulator page
  await expect(page.locator('.glass-card').filter({ hasText: 'Metro Delay' })).toBeVisible();

  // 5. Trigger Metro Delay
  await page.locator('.glass-card')
    .filter({ hasText: 'Metro Delay' })
    .getByRole('button', { name: /Trigger Scenario/i })
    .click();

  // 6. Return to Dashboard (navigation happens automatically upon triggering)
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  // 7. Verify AI Playbook appears
  // Locate the active playbook card by looking for the one that has the Approve button
  const playbookCard = page.locator('.glass-card', {
    has: page.getByRole('button', { name: /Approve & Deploy Playbook/i })
  });
  await expect(playbookCard).toBeVisible({ timeout: 15000 });
  
  // Use .first() to resolve strict mode violation (matches heading, description, reasoning, etc.)
  await expect(playbookCard.getByText(/Metro/i).first()).toBeVisible();

  // 8. Click Deploy Playbook
  await playbookCard.getByRole('button', { name: /Approve & Deploy Playbook/i }).click();

  // 9. Verify incident resolves (returns to System Nominal status)
  await expect(page.getByText('System Nominal')).toBeVisible({ timeout: 20000 });

  // 10. Open Analytics (sidebar link)
  await page.locator('aside a[href="/analytics"]').click();
  await expect(page).toHaveURL(/analytics/);

  // 11. Verify Safety Gauge is displayed
  await expect(page.getByText('Safety Gauge', { exact: true })).toBeVisible({ timeout: 15000 });
});
