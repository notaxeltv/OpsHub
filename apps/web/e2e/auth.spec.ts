import { test, expect } from '@playwright/test';

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});

test('login page renders', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /Sign in to OpsHub/i })).toBeVisible();
});
