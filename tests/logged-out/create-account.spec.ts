import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { createAccountForm } from '../utils/loginPage';

// Load environment variables from .env.uat file
dotenv.config({ path: path.resolve(__dirname, '.env.uat') });

test('User can create an account through the web interface', async ({ page }) => {
    // Generate a unique email for the test using a timestamp to ensure uniqueness
    const originalEmail: string | undefined = process.env.uat.EMAIL_ADDRESS;
    const email = originalEmail ? originalEmail.split('@')[0] + Date.now() + '@' + originalEmail.split('@')[1] : `user${Date.now()}@example.com`;
    // Use the helper function to navigate to /signup and create an account
    await createAccountForm(page, email, process.env.uat.PLAYWRIGHT_GENERAL_PASSWORD || '');
    // Verify successful account creation
    await page.getByTestId('success-banner').waitFor({ state: 'visible', timeout: 5000 });
    await expect(page.getByTestId('success-banner')).toContainText('Registration completed successfully');
    await page.waitForURL('/protected/applets', { timeout: 10_000  });
});

test('User receives form validation messages when attempting to create an account without filling out the form fields', async ({ page }) => {
    const header = page.getByRole('heading', { name: 'Create Account' });
    //List of expected validation messages
    const validationMessages =
        [
            page.getByText('Email must be valid.'),
            page.getByText('First name is required.'),
            page.getByText('Last name is required.'),
            page.getByText('Password must be at least 6').first(),
            page.getByText('Password must be at least 6').nth(1)
        ];
    
    await page.goto('/login');
    await page.getByText('Create an account').click();
    await page.waitForURL('/signup');
    // Get the form header to ensure we're on the correct page
    await expect(header).toBeVisible();
    await page.fill('input[name="email"]', '');
    await page.fill('input[name="firstName"]', '');
    await page.fill('input[name="lastName"]', '');
    await page.fill('input[name="password"]', '');
    await page.fill('input[name="confirmPassword"]', '');
    await page.getByRole('checkbox', { name: 'I agree to the Terms of Service' }).check();
    await page.getByRole('button', { name: 'Create Account' }).click();

    //Check for the visibility of each validation message
    for (const message of validationMessages) {
        await expect(message).toBeVisible();
    }
});