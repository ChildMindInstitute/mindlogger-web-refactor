import { request, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.join(__dirname, 'playwright/.auth/user.json');

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
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });

    // Save the authentication state (e.g., cookies, tokens)
    expect(response.status()).toBe(200);
    const body = await response.json();
    const token = body.result.token.accessToken;
    expect(body.result.token.tokenType).toBe('Bearer');  
    process.env.API_TOKEN = token;
    await requestContext.storageState({ path: 'playwright/.auth/user.json' });

    // TODO:Save the authentication state (e.g., cookies, tokens)
}

export default globalSetup;