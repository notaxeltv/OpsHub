/**
 * Captures marketing screenshots and a demo walkthrough video.
 * Run with: npx playwright test scripts/capture-marketing.ts --config=playwright.marketing.config.ts
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.join(__dirname, '../../../docs/marketing/screenshots');
const DEMO_EMAIL = 'demo@opshub.local';
const DEMO_PASSWORD = 'password123';

test.beforeAll(() => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
});

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(DEMO_EMAIL);
  await page.getByLabel('Password').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test.describe('marketing assets', () => {
  test('capture screenshots and demo video', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT_DIR, '01-landing.png'), fullPage: true });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT_DIR, '02-login.png'), fullPage: true });

    await login(page);
    await page.screenshot({ path: path.join(OUT_DIR, '03-dashboard.png'), fullPage: true });

    const pages = [
      { url: '/customers', file: '04-customers.png' },
      { url: '/orders', file: '05-orders.png' },
      { url: '/production', file: '06-production.png' },
      { url: '/inventory', file: '07-inventory.png' },
      { url: '/reports', file: '08-reports.png' },
      { url: '/settings', file: '09-settings.png' },
    ];

    for (const { url, file } of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
    }

    // Order detail with margins
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    const detailLink = page.getByRole('link', { name: 'Details' }).first();
    if (await detailLink.isVisible()) {
      await detailLink.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: path.join(OUT_DIR, '10-order-detail.png'), fullPage: true });
    }
  });
});
