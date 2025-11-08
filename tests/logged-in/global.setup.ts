import { test as setup } from "@playwright/test";
import path from 'path';
import dotenv from 'dotenv';
import { UIlogin } from "../utils/loginPage";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Define the path to the authentication file 
const authFile = 'tests/.auth/session.json'

// Define a setup test to authenticate and save storage state into an auth file
setup("authenticate", async ({ page }) => {
    await UIlogin(page, '/login', process.env.PLAYWRIGHT_ADMIN_EMAIL || '', process.env.PLAYWRIGHT_ADMIN_PASSWORD || '');
    // Wait for navigation to the protected page
    // await page.waitForURL('**/protected/applets');
    // write storage and session data to disk
    await page.context().storageState({ path: authFile })
});