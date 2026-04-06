import { test, expect } from '../../fixtures/test';
import { requirePlaywrightUserCredentials } from '../../../utils/credentials';

test.describe('User Authentication', () => {
  test('User receives error message when no login credentials are used', async ({ loginPage, page, baseURL }) => {
    await loginPage.goto(baseURL);
    await loginPage.login('', '');

    await expect(page.getByText('Email must be valid.')).toHaveText('Email must be valid.');
    await expect(page.getByText('Password is required.')).toHaveText('Password is required.');
  });

  test('User receives an error message when using incorrect login credentials', async ({ loginPage, page, baseURL }) => {
    await loginPage.goto(baseURL);
    await loginPage.login('wrongemail@email.com', 'wrongpassword');

    await expect(page.getByTestId('error-banner')).toBeVisible();
  });

  test('Unauthenticated user is redirected to /login when accessing protected page', async ({ page }) => {
    await page.goto('/protected/applets');
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });

  test('Authenticated user can navigate directly to a protected page', async ({ loginPage, page, baseURL }) => {
    const { email, password } = requirePlaywrightUserCredentials();

    await loginPage.goto(baseURL);
    await loginPage.login(email, password);

    // Wait for redirect with a more flexible pattern
    await page.waitForURL('**/protected/**', { timeout: 10000 });
    await expect(page.getByTestId('applet-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/protected/profile');
    const profileText = 'Thank you for creating an account with Curious. Download Curious on an iOS or Android device to get started.';
    await expect(page.getByText(profileText)).toBeVisible();
  });
});
