/**
 * Records a ~60s demo walkthrough for marketplace listings (English).
 */
import { test } from '@playwright/test';

const LOCALE_PREFIX = '/en';
const DEMO_EMAIL = 'demo@opshub.local';
const DEMO_PASSWORD = 'password123';

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('demo walkthrough video', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto(`${LOCALE_PREFIX}/`);
  await pause(3000);

  await page.goto(`${LOCALE_PREFIX}/login`);
  await page.waitForLoadState('networkidle');
  await pause(1000);
  await page.locator('#email').fill(DEMO_EMAIL);
  await page.locator('#password').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: /Sign in/i }).click();
  await page.waitForURL(/\/en\/dashboard/, { timeout: 20000 });
  await pause(3000);

  for (const path of ['/customers', '/orders', '/production', '/inventory', '/reports', '/settings']) {
    await page.goto(`${LOCALE_PREFIX}${path}`);
    await page.waitForLoadState('networkidle');
    await pause(2500);
  }

  await page.goto(`${LOCALE_PREFIX}/orders`);
  await page.waitForLoadState('networkidle');
  const orderDetail = page.getByRole('link', { name: 'Details' }).first();
  if (await orderDetail.isVisible()) {
    await orderDetail.click();
    await page.waitForLoadState('networkidle');
    await pause(4000);
  }

  await page.goto(`${LOCALE_PREFIX}/dashboard`);
  await page.waitForLoadState('networkidle');
  await pause(3000);
});
