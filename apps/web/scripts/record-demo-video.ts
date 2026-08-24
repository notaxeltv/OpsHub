/**
 * Records a ~75s demo walkthrough for marketplace listings.
 */
import { test, expect } from '@playwright/test';

const DEMO_EMAIL = 'demo@opshub.local';
const DEMO_PASSWORD = 'password123';

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('demo walkthrough video', async ({ page }) => {
  test.setTimeout(180000);

  await page.goto('/');
  await pause(4000);

  await page.goto('/login');
  await pause(1500);
  await page.getByLabel('Email').fill(DEMO_EMAIL);
  await pause(800);
  await page.getByLabel('Password').fill(DEMO_PASSWORD);
  await pause(800);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  await pause(4000);

  await page.goto('/customers');
  await page.waitForLoadState('networkidle');
  await pause(3500);

  const customerDetail = page.getByRole('link', { name: 'Details' }).first();
  if (await customerDetail.isVisible()) {
    await customerDetail.click();
    await page.waitForLoadState('networkidle');
    await pause(3500);
  }

  await page.goto('/orders');
  await page.waitForLoadState('networkidle');
  await pause(2500);

  const orderDetail = page.getByRole('link', { name: 'Details' }).first();
  if (await orderDetail.isVisible()) {
    await orderDetail.click();
    await page.waitForLoadState('networkidle');
    await pause(5000);
  }

  await page.goto('/production');
  await page.waitForLoadState('networkidle');
  await pause(3000);

  await page.goto('/inventory');
  await page.waitForLoadState('networkidle');
  await pause(2500);
  await page.getByRole('button', { name: 'Movements' }).click();
  await pause(2500);
  await page.getByRole('button', { name: 'Materials' }).click();
  await pause(2000);

  await page.goto('/reports');
  await page.waitForLoadState('networkidle');
  await pause(3500);

  await page.goto('/settings');
  await page.waitForLoadState('networkidle');
  await pause(3000);

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  await pause(4000);
});
