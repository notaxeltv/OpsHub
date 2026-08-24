/**
 * Captures marketing screenshots (English locale).
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

const LOCALE_PREFIX = '/en';

async function login(page: import('@playwright/test').Page) {
  await page.goto(`${LOCALE_PREFIX}/login`);
  await page.waitForLoadState('networkidle');
  await page.locator('#email').fill(DEMO_EMAIL);
  await page.locator('#password').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: /Sign in/i }).click();
  await page.waitForURL(/\/en\/dashboard/, { timeout: 20000 });
  await expect(page.getByRole('heading', { name: 'Dashboard', level: 2 })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/Monthly revenue/i)).toBeVisible({ timeout: 15000 });
}

test.describe('marketing assets', () => {
  test('capture screenshots', async ({ page, context }) => {
    test.setTimeout(180000);
    await context.clearCookies();

    await page.goto('http://localhost:3000/en');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h1', { timeout: 15000 });
    await page.screenshot({ path: path.join(OUT_DIR, '01-landing.png'), fullPage: true });

    await page.goto(`${LOCALE_PREFIX}/login`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Sign in to OpsHub/i })).toBeVisible();
    await page.screenshot({ path: path.join(OUT_DIR, '02-login.png'), fullPage: true });

    await login(page);
    await page.screenshot({ path: path.join(OUT_DIR, '03-dashboard.png'), fullPage: true });

    const pages = [
      { url: `${LOCALE_PREFIX}/customers`, file: '04-customers.png', heading: 'Customers' },
      { url: `${LOCALE_PREFIX}/orders`, file: '05-orders.png', heading: 'Orders' },
      { url: `${LOCALE_PREFIX}/production`, file: '06-production.png', heading: 'Production' },
      { url: `${LOCALE_PREFIX}/inventory`, file: '07-inventory.png', heading: 'Inventory' },
      { url: `${LOCALE_PREFIX}/reports`, file: '08-reports.png', heading: 'Reports' },
      { url: `${LOCALE_PREFIX}/settings`, file: '09-settings.png', heading: 'Settings' },
    ];

    for (const { url, file, heading } of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: heading, level: 2 })).toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
    }

    await page.goto(`${LOCALE_PREFIX}/orders`);
    await page.waitForLoadState('networkidle');
    const detailLink = page.getByRole('link', { name: 'Details' }).first();
    await expect(detailLink).toBeVisible({ timeout: 10000 });
    await detailLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Margins|Margini/i).first()).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: path.join(OUT_DIR, '10-order-detail.png'), fullPage: true });
  });
});
