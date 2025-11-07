import { expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { test } from '../fixtures/fixtures.ts';
import { UIlogin } from '../utils/loginPage.ts';
import { generateRandomUser } from '../utils/userApi.ts';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

test('User can reset their password when logged in', async ({ page, api }) => {
    // Generate a new random user
    const newUser = generateRandomUser();
    // Create the user via API
    const createdUser = await api.createUser(newUser);
    // Extract the email of the created user
    let createdUserEmail: string = createdUser.result.email;
    let createdUserPassword: string = newUser.password || '';
    let createdUserName: string = `${createdUser.result.firstName} ${createdUser.result.lastName}`;
    // Reinitialize API with new user credentials
    await api.init();
    // Log in with valid credentials
    await api.login(createdUserEmail, createdUserPassword);
    // Navigate to settings page
    await UIlogin(page, '/login', createdUserEmail, createdUserPassword);
    await page.getByRole('button', { name: `${createdUserName}` }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    // Verify navigation to settings page
    await page.waitForURL('/protected/settings');
    await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible();
    await expect(page.getByText(`Create the new password for ${createdUserEmail}`)).toBeVisible();

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
    await page.getByRole('textbox', { name: 'Old Password' }).fill(createdUserPassword);
    await page.getByRole('textbox', { name: 'New Password' }).fill('newpassword123');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('differentpassword123');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Passwords Do Not Match')).toBeVisible();

    // Add password change steps that use the same old and new password 
    await page.getByRole('textbox', { name: 'Old Password' }).fill(createdUserPassword || '');
    //todo new password 
    await page.getByRole('textbox', { name: 'New Password' }).fill(createdUserPassword || '');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(createdUserPassword || '');
    // Submit the password change form using the same old and new password
    await page.getByRole('button', { name: 'Submit' }).click();
    // Assert that system success message is displayed
    await expect(page.getByTestId('system-success-message')).toHaveText('Password is updated successfully');
});

test('User can reset their password through the web interface when logged out', async ({ page }) => {
    //TODO: Mock email sending and receiving for password reset link
    //TODO: Use a different user than the previous test user
    await page.goto('/login');
    await page.click('text=Forgot Password?');
    await page.fill('input[name="email"]', process.env.PLAYWRIGHT_EMAIL || '');
    await page.click('button[type="submit"]');
    const confirmationMessage = `Password reset link is sent to ${process.env.PLAYWRIGHT_EMAIL}`;
    await expect(page.getByText(confirmationMessage)).toBeVisible();
});
