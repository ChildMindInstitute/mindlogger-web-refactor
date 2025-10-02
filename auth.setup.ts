
import { request, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.join(__dirname, 'playwright/.auth/user.json');
let apiToken = '';

async function globalSetup() {
    const requestContext = await request.newContext({
        baseURL: process.env.BASE_URL, // Ensure this matches baseURL in config
    });

    // Perform API login
    const response = await requestContext.post('/auth/login', {
        data: {
            'email': process.env.EMAIL,
            'password': process.env.PASSWORD,
        },
        headers: {
            // authorization: `Bearer ${VALUE}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    expect(response.ok()).toBeTruthy();

    // Save the authentication state (e.g., cookies, tokens)
    await requestContext.storageState({ path: authFile });
    const body = await response.json();
    // console.log(body.result.token.accessToken);

    process.env.API_TOKEN = body.result.token.accessToken;
}

export default globalSetup;