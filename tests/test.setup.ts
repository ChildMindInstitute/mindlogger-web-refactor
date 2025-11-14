import { test, expect } from '@playwright/test';

// test.use({ storageState: 'playwright/.auth/user.json' });

// unskip this test to test local storage of bearer token is working
test.skip('Can log into the app and verify the main landing page', async ({ page }) => {
  await page.goto('https://web-uat.cmiml.net/protected/applets');
  // await page.waitForSelector('title', {state:'visible'});
  // await expect(page).toHaveTitle('Curious');
  const myTestElement = page.getByTestId('applet-list');
  await expect(myTestElement).toBeVisible();
});

//
test('User authenticates through the login page and is redirected to the applet list page', async ({ page }) => {
  await page.goto('https://web-uat.cmiml.net/login');

  // Fill in login form
  await page.fill('input[name="email"]', process.env.uat.EMAIL || '');
  await page.fill('input[name="password"]', process.env.uat.PASSWORD || '');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for navigation to the protected page
  await page.waitForURL('**/protected/applets');

  // Verify that we are on the protected page
  await expect(page).toHaveURL(/.*\/protected\/applets/);

  // Optionally, check for an element that is only visible when logged in
  const myTestElement = page.getByTestId('applet-list');
  await expect(myTestElement).toBeVisible();
});