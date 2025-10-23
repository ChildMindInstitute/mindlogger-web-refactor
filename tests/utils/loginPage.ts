import { Page } from '@playwright/test';

// Function to perform login
export const login = async (page:Page, url:any, email: string, password:string) => {
    await page.goto(url);
    // Fill in login form
    await page.fill('input[name="email"]', email || '');
    await page.fill('input[name="password"]', password || '');
    // Submit the form
    await page.click('button[type="submit"]');
};