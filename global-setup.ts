import { request, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');

async function globalSetup() {
    const requestContext = await request.newContext({
        baseURL: 'https://api-uat.cmiml.net', // Ensure this matches baseURL in config
    });

    // Perform API login
    const response = await requestContext.post('/auth/login', {
        data: {
            'email': 'email',
            'password': 'password',
        },
    });

    expect(response.ok()).toBeTruthy();

    // Save the authentication state (e.g., cookies, tokens)
    await requestContext.storageState({ path: authFile });
    await requestContext.dispose();
}

export default globalSetup;