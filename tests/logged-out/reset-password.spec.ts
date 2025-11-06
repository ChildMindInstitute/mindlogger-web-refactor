import { expect } from '@playwright/test';
import { login } from '../utils/loginPage.ts';
import { generateRandomUser } from '../utils/userApi.ts';
import {test} from '../fixtures/fixtures.ts';
import dotenv from 'dotenv';
import path from 'path';


// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

test.beforeAll(async ({api}) => {
    const newUser = generateRandomUser();
    const response = await api.createUser(newUser);
    expect(response).toHaveProperty('result')
    // TODO take newly created user and use it in these tests instead of the default .env one
    // This will avoid email reset issues and encryption warnings.
    // Keep a known email from .env for the reset twice quickly to get encryption warning
});

test('User can reset their password when logged in', async ({ page }) => {
    // Log in with valid credentials
    await login(page, '/login', process.env.PLAYWRIGHT_EMAIL || '', process.env.PLAYWRIGHT_PASSWORD || '');
    // Navigate to settings page
    await page.getByRole('button', { name: 'Phillipe Bojorquez' }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    // Verify navigation to settings page
    await page.waitForURL('/protected/settings');
    await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible();
    await expect(page.getByText(`Create the new password for ${process.env.PLAYWRIGHT_EMAIL}`)).toBeVisible();

    // Error page elements for empty password fields
    const errorMessageOldPassword = page.getByText('Password must be at least 6').first();
    const errorMessageNewPassword = page.getByText('Password must be at least 6').nth(1);
    const errorMessageConfirmPassword = page.getByText('Password must be at least 6').nth(2);

    // Submit empty password fields to trigger validation errors
    await page.getByRole('button', { name: 'Submit' }).click();
    // Assert that error messages are displayed
    await expect(errorMessageOldPassword).toHaveText('Password must be at least 6 characters.');
    await expect(errorMessageNewPassword).toBeVisible();
    await expect(errorMessageConfirmPassword).toBeVisible();

    // Verify passwords that do not match trigger appropriate error
    await page.getByRole('textbox', { name: 'Old Password' }).fill('oldpassword123');
    await page.getByRole('textbox', { name: 'New Password' }).fill('newpassword123');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('differentpassword123');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Passwords Do Not Match')).toBeVisible();

    // Add password change steps that use the same old and new password 
    await page.getByRole('textbox', { name: 'Old Password' }).fill(process.env.PLAYWRIGHT_PASSWORD || '');
    //todo new password 
    await page.getByRole('textbox', { name: 'New Password' }).fill(process.env.PLAYWRIGHT_PASSWORD || '');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(process.env.PLAYWRIGHT_PASSWORD || '');
    // Submit the password change form using the same old and new password
    await page.getByRole('button', { name: 'Submit' }).click();
    // Assert that system success message is displayed
    await expect(page.getByTestId('system-success-message')).toHaveText('Password changed successfully.');

    // Attempt to change password during reencryption process
    await page.getByRole('textbox', { name: 'Old Password' }).fill(process.env.PLAYWRIGHT_PASSWORD || '');
    //todo new password 
    await page.getByRole('textbox', { name: 'New Password' }).fill(process.env.PLAYWRIGHT_PASSWORD || '');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(process.env.PLAYWRIGHT_PASSWORD || '');
    // Submit the password change form and verify using same password does not result in errors
    await page.getByRole('button', { name: 'Submit' }).click();
    // Assert that system error message is displayed
    await expect(page.getByTestId('system-error-message')).toHaveText('Cannot change password. Reencryption process in progress.');
});

test('User can reset their password through the web interface when logged out', async ({ page }) => {
    //TODO: Mock email sending and receiving for password reset link
    await page.goto('/login');
    await page.click('text=Forgot Password?');
    await page.fill('input[name="email"]', process.env.PLAYWRIGHT_EMAIL || '');
    await page.click('button[type="submit"]');
    const confirmationMessage = `Password reset link is sent to ${process.env.PLAYWRIGHT_EMAIL}`;
    await expect(page.getByText(confirmationMessage)).toBeVisible();
});
