import { Page } from '@playwright/test';
import { UserAPI } from './userApi'; // Import the improved class

export const UIlogin = async (page: Page, url: any, email: string, password: string) => {
    await page.goto(url);
    // Fill in login form
    await page.fill('input[name="email"]', email || '');
    await page.fill('input[name="password"]', password || '');
    // Submit the form
    await page.click('button[type="submit"]');
};
export const apiAdminLogin = async (page: Page, email: string, password: string) => {
    const userApi = new UserAPI();
    await userApi.init();

    try {
        // Perform login using the API context from UserAPI
        const loginResponse = await userApi.login(email, password);
        const token = loginResponse.result.token.accessToken;

        if (!loginResponse.ok()) {
            throw new Error(`Login failed: ${loginResponse.status()} - ${await loginResponse.text()}`);
        }

        // Inject token into localStorage for browser context
        await page.addInitScript((tokenValue) => {
            localStorage.setItem('Bearer', tokenValue);
        }, token);

        return token; // Return token for further use if needed
    } catch (error) {
        console.error('Error during admin login:', error);
        throw error;
    } finally {
        await userApi.dispose();
    }
};

export const createAccountForm = async (page: Page, email: string, password: string) => {
    await page.goto('/login');
    await page.getByText('Create an account').click();
    await page.waitForURL('/signup');
    await page.fill('input[name="email"]', `${email + Date.now()}@example.com`);
    await page.fill('input[name="firstName"]', 'Automation');
    await page.fill('input[name="lastName"]', 'Tester');
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.getByRole('checkbox', { name: 'I agree to the Terms of Service' }).check();
    await page.getByRole('button', { name: 'Create Account' }).click();
};
