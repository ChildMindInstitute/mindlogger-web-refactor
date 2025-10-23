import { test, expect } from '@playwright/test';
import { login } from '../utils/loginPage';

test.describe('Log in tests that require cleared storageState', () => {

    // Clears storageState for tests in this describe block
    test.use({ storageState: undefined });

    test('User recieves error message when attempting to log in without entering any credentials', async ({ page }) => {
        // Attempt to log in without entering any credentials
        await login(page, '/login', '', '');
        const emailErrorMessage = page.getByText('Email must be valid.');
        await expect(emailErrorMessage).toHaveText('Email must be valid.');
        const passwordErrorMessage = page.getByText('Password is required.')
        await expect(passwordErrorMessage).toHaveText('Password is required.');
    })

    test('User receives an error message when using incorrect web log in credentials', async ({ page }) => {
        await login(page, '/login', 'wrongemail@email.com', 'wrongpassword');
        await expect(page.getByTestId('error-banner')).toBeVisible();
    });

    test.fixme('User is unable to access protected page without authenticating and is redirected to the login page', async ({ page }) => {
        // test currently fails because authentication state is preserved between tests?
        // await page.context().storageState({ path: undefined });
        await page.goto('/protected/applets');
        // Assuming a redirect to login happens
        await page.waitForURL('/login');
        await expect(page).toHaveURL('/login');
    });

    test('User authenticates through the web log in page and can successfully navigate directly to a protected page', async ({ page }) => {
        await login(page, '/login', process.env.EMAIL || '', process.env.PASSWORD || '')
        // Wait for navigation to the protected page
        await page.waitForURL('/protected/applets');
        const appletList = page.getByTestId('applet-list');
        await expect(appletList).toBeVisible();
        await page.goto('/protected/profile');
        const profilePageText = 'Thank you for creating an account with Curious. Download Curious on an iOS or Android device to get started.'
        await expect(page.getByText(profilePageText)).toBeVisible();
    });

    test('User can reset their password through the web interface', async ({ page }) => {
        await page.goto('/login');
        await page.click('text=Forgot Password?');
        // await expect(page).toHaveURL('/forgotpassword');
        await page.fill('input[name="email"]', process.env.EMAIL || '');
        await page.click('button[type="submit"]');
        const confirmationMessage = `Password reset link is sent to ${process.env.EMAIL}`;
        await expect(page.getByText(confirmationMessage)).toBeVisible();
    });
});