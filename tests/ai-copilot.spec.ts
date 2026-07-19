import { test, expect } from '@playwright/test';

/**
 * AI Copilot & Playbook Approval Flow Tests
 * Validates the core AI-powered decision-making workflow:
 * Trigger scenario → AI generates playbook → Operator approves → Incident resolved
 */

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:5000/api/simulation/reset');
});

test('AI Playbook card appears after triggering Metro Delay scenario', async ({ request, page }) => {
  // Trigger Metro Delay scenario
  await page.goto('/scenarios');
  await page.locator('.glass-card')
    .filter({ hasText: 'Metro Delay' })
    .getByRole('button', { name: /Trigger Scenario/i })
    .click();

  // Should redirect to dashboard
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  // AI Playbook card should appear
  const playbookCard = page.locator('.glass-card', {
    has: page.getByRole('button', { name: /Approve & Deploy Playbook/i })
  });
  await expect(playbookCard).toBeVisible({ timeout: 15000 });
});

test('Approve & Deploy Playbook button is enabled when playbook is ready', async ({ page }) => {
  await page.goto('/scenarios');
  await page.locator('.glass-card')
    .filter({ hasText: 'Metro Delay' })
    .getByRole('button', { name: /Trigger Scenario/i })
    .click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  const deployButton = page.getByRole('button', { name: /Approve & Deploy Playbook/i });
  await expect(deployButton).toBeVisible({ timeout: 15000 });
  await expect(deployButton).toBeEnabled();
});

test('Deploying playbook transitions to Executing state', async ({ page }) => {
  await page.goto('/scenarios');
  await page.locator('.glass-card')
    .filter({ hasText: 'Metro Delay' })
    .getByRole('button', { name: /Trigger Scenario/i })
    .click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  const deployButton = page.getByRole('button', { name: /Approve & Deploy Playbook/i });
  await expect(deployButton).toBeVisible({ timeout: 15000 });
  await deployButton.click();

  await expect(page.getByText(/Executing Playbook/i)).toBeVisible({ timeout: 5000 });
});

test('Full AI workflow: trigger → deploy → System Nominal', async ({ page }) => {
  await page.goto('/scenarios');
  await page.locator('.glass-card')
    .filter({ hasText: 'Metro Delay' })
    .getByRole('button', { name: /Trigger Scenario/i })
    .click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });

  const deployButton = page.getByRole('button', { name: /Approve & Deploy Playbook/i });
  await expect(deployButton).toBeVisible({ timeout: 15000 });
  await deployButton.click();

  // System should resolve to nominal
  await expect(page.getByText('System Nominal')).toBeVisible({ timeout: 20000 });
});

test('Dashboard shows SAFETY SCORE KPI throughout AI workflow', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 15000 });
  // Safety score KPI must always be visible
  await expect(page.getByText('SAFETY SCORE', { exact: true })).toBeVisible();
  await expect(page.getByText('AI CONFIDENCE', { exact: true })).toBeVisible();
});
