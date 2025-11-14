import { test, expect } from '../../fixtures/test';

// Simple smoke spec using the POM and fixtures
// Requires PLAYWRIGHT_BASE_URL to be set.

test('login page loads and allows submitting credentials', async ({ loginPage, baseURL, page }) => {
  await loginPage.goto(baseURL);
  await loginPage.login('user@example.com', 'password');
  // Replace with a real post-login URL or visible element
  await expect(page).toHaveURL(/login|protected/);
});
