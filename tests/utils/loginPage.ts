import { Page } from '@playwright/test';
import { UserAPI } from './createUsers'; // Import the improved class

// Function to perform login
export const login = async (page: Page, url: any, email: string, password: string) => {
    await page.goto(url);
    // Fill in login form
    await page.fill('input[name="email"]', email || '');
    await page.fill('input[name="password"]', password || '');
    // Submit the form
    await page.click('button[type="submit"]');
};
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
