import { test, expect } from '@playwright/test';

test('No console errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter out expected WebSocket/Socket.io connection warnings or external profile image failures
      if (
        text.includes('socket.io') || 
        text.includes('WebSocket') || 
        text.includes('connect_error') ||
        text.includes('reconnect_failed') ||
        text.includes('googleusercontent.com') ||
        text.includes('403')
      ) {
        return;
      }
      errors.push(text);
    }
  });

  await page.goto('/dashboard');
  
  // Wait for telemetry data to load
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 10000 });
  
  // Wait a short duration to capture any post-load console errors
  await page.waitForTimeout(1000);

  expect(errors).toEqual([]);
});
