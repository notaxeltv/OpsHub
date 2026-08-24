import { test, expect } from '@playwright/test';

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/en/dashboard');
  await expect(page).toHaveURL(/\/en\/login/);
});

test('login page renders', async ({ page }) => {
  await page.goto('/en/login');
  await expect(page.getByRole('heading', { name: /Sign in to OpsHub/i })).toBeVisible();
});
