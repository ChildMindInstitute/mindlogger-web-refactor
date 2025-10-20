import { expect, test as setup } from "@playwright/test";
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });
// Define the path to the authentication file 
const authFile = '.auth/session.json'

// Define a setup test to authenticate and save storage state into an auth file
setup("authenticate", async ({ page }) => {
    await page.goto('/login');
    // Fill in login form
    await page.fill('input[name="email"]', process.env.EMAIL || '');
    await page.fill('input[name="password"]', process.env.PASSWORD || '');
    // Submit the form
    await page.click('button[type="submit"]');
    // Wait for navigation to the protected page
    await page.waitForURL('**/protected/applets');
    // Verify that we are on the protected page
    await expect(page).toHaveURL(/.*\/protected\/applets/);
    // Optionally, check for an element that is only visible when logged in
    const myTestElement = page.getByTestId('applet-list');
    await expect(myTestElement).toBeVisible();
    // write storage and session data to disk
    await page.context().storageState({ path: authFile })
});