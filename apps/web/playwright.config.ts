import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run start -w @opshub/api',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run start -w @opshub/web',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
