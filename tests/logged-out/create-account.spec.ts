import { test, expect } from '@playwright/test';

test('User can create an account through the web interface', async ({ page }) => {
    
    const uniqueEmail = `${process.env.EMAIL || ''}+${Date.now()}@childmind.org`;
    const header = page.getByRole('heading', { name: 'Create Account' });

    await page.goto('/login');
    await page.getByText('Create an account').click();
    await page.waitForURL('/signup');
    await expect(header).toBeVisible();
    await page.fill('input[name="email"]', uniqueEmail);
    // TODO : Use a stronger password generator for more robust testing
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.getByRole('checkbox', { name: 'I agree to the Terms of Service' }).check();
    await page.getByRole('button', { name: 'Create Account' }).click();
});

test('User receives form validations when attempting to create an account without any form fields filled out', async ({ page }) => {
    const header = page.getByRole('heading', { name: 'Create Account' });
    await page.goto('/login');
    await page.getByText('Create an account').click();
    await page.waitForURL('/signup');
    // Get the header to ensure we're on the correct page
    await expect(header).toBeVisible();
    await page.fill('input[name="email"]', '');
    await page.fill('input[name="firstName"]', '');
    await page.fill('input[name="lastName"]', '');
    await page.fill('input[name="password"]', '');
    await page.fill('input[name="confirmPassword"]', '');
    await page.getByRole('checkbox', { name: 'I agree to the Terms of Service' }).check();
    await page.getByRole('button', { name: 'Create Account' }).click();

    //List of expected validation messages
    const mylist =
        [
            page.getByText('Email must be valid.'),
            page.getByText('First name is required.'),
            page.getByText('Last name is required.'),
            page.getByText('Password must be at least 6').first(),
            page.getByText('Password must be at least 6').nth(1)
        ];
    
        //Check for each validation message
    for (const message of mylist) {
        await expect(message).toBeVisible();
    }
});

