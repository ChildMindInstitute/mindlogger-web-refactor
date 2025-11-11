import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { createEmailUI } from '../utils/loginPage';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

test('User can create an account through the web interface', async ({ page }) => {
    
    const header = page.getByRole('heading', { name: 'Create Account' });

    await page.goto('/login');
    await page.getByText('Create an account').click();
    await page.waitForURL('/signup');
    await expect(header).toBeVisible();
    createEmailUI(page, `${process.env.PLAYWRIGHT_AUTOMATION_TEST_USER_EMAIL}`, `${process.env.PLAYWRIGHT_AUTOMATION_TEST_USER_PASSWORD}`);
    await page.getByRole('checkbox', { name: 'I agree to the Terms of Service' }).check();
    await page.getByRole('button', { name: 'Create Account' }).click();
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
