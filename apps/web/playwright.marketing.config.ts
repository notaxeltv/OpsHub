import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './scripts',
  testMatch: 'capture-marketing.ts',
  timeout: 120000,
  use: {
    baseURL: process.env.MARKETING_BASE_URL ?? 'http://localhost:3000/en',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
    video: {
      mode: 'on',
      size: { width: 1440, height: 900 },
    },
    screenshot: 'off',
    trace: 'off',
  },
  outputDir: '../../docs/marketing/playwright-output',
  reporter: [['list']],
});
