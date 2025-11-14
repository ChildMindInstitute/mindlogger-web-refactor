import { expect, test } from '@playwright/test';
import { UIlogin } from '../utils/loginPage.ts';

test('User recieves error message when no login credentials are used', async ({ page }) => {
    // Attempt to log in without entering any credentials
    await UIlogin(page, '/login', '', '');
    const emailErrorMessage = page.getByText('Email must be valid.');
    await expect(emailErrorMessage).toHaveText('Email must be valid.');
    const passwordErrorMessage = page.getByText('Password is required.')
    await expect(passwordErrorMessage).toHaveText('Password is required.');
})

test('User receives an error message when using incorrect login credentials', async ({ page }) => {
    // Attempt to log in with incorrect credentials
    await UIlogin(page, '/login', 'wrongemail@email.com', 'wrongpassword');
    await expect(page.getByTestId('error-banner')).toBeVisible();
});

test('Unauthenticated user is redirected to the /login page when attempting to access a protected page', async ({ page }) => {
    // Attempt to access a protected page without being logged in.
    await page.goto('/protected/applets');
    // Assuming a redirect to login happens
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
});

test('Authenticated user can navigate directly to a protected page', async ({ page }) => {
    // Log in with valid credentials
    await UIlogin(page, '/login', process.env.uat.PLAYWRIGHT_EMAIL || '', process.env.uat.PLAYWRIGHT_PASSWORD || '')
    // Wait for navigation to the protected page
    await page.waitForURL('/protected/applets');
    const appletList = page.getByTestId('applet-list');
    await expect(appletList).toBeVisible();
    await page.goto('/protected/profile');
    const profilePageText = 'Thank you for creating an account with Curious. Download Curious on an iOS or Android device to get started.'
    await expect(page.getByText(profilePageText)).toBeVisible();
});
