import { test, expect } from '@playwright/test';

// test.use({ storageState: 'playwright/.auth/user.json' });

test('Can log into the app and verify the main landing page', async ({ page }) => {
  await page.goto('https://web-uat.cmiml.net/protected/applets');

  // Expect a title "to contain" a substring.
  await page.waitForSelector('title', {state:'visible'});
  await expect(page).toHaveTitle('Curious');

  const myTestElement = page.getByTestId('my-test-element')
  await expect(myTestElement).toBeVisible();

});