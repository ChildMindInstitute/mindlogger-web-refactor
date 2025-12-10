import { Page } from '@playwright/test';
import { UserAPI } from './userApi';


// Function to perform admin login via API and set token in localStorage
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

// Function to create an account via UI
export const createAccountForm = async (page: Page, email: string, password: string) => {
    await page.goto('/signup');
    await page.waitForURL('/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="firstName"]', 'Automation');
    await page.fill('input[name="lastName"]', 'Tester');
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.getByRole('checkbox', { name: 'I agree to the Terms of Service' }).click();
    await page.getByRole('button', { name: 'Create Account' }).click();
};
