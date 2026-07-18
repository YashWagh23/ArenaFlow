import { test, expect } from '@playwright/test';

test('No failed requests for critical assets', async ({ page }) => {
  const failedRequests: { url: string; status: number }[] = [];

  page.on('response', response => {
    const status = response.status();
    const url = response.url();

    if (status >= 400) {
      // Ignore socket.io and googleusercontent.com profile image failures
      if (url.includes('socket.io') || url.includes('googleusercontent.com')) {
        return;
      }

      // Check if the request is an internal application resource
      try {
        const origin = new URL(page.url()).origin;
        if (url.startsWith(origin)) {
          failedRequests.push({ url, status });
        }
      } catch (e) {
        // Ignore malformed URLs
      }
    }
  });

  await page.goto('/dashboard');

  // Wait for telemetry data to load
  await expect(page.getByText('ArenaFlow Dashboard')).toBeVisible({ timeout: 10000 });
  
  // Wait for network requests to settle
  await page.waitForLoadState('networkidle');

  expect(failedRequests).toEqual([]);
});
