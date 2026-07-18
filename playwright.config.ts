import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Single worker to avoid overloading/rate-limiting the deployed Vercel site
  reporter: 'html',
  timeout: 45000, // 45 seconds test timeout

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15000, // 15 seconds action timeout
    navigationTimeout: 20000, // 20 seconds navigation timeout
  },
});
