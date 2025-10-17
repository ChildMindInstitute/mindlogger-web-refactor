import { request, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.join(__dirname, 'playwright/.auth/token.json');

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

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    const token = body.result.token.accessToken;
    expect(body.result.token.tokenType).toBe('Bearer');
    //modify in memory the environment variable through assignment for API_TOKEN variable without changing the original .env value
    process.env.API_TOKEN = token;
    //Save the authentication state (e.g., cookies, tokens) to a file using the fs module
    const tokenFilePath = 'playwright/.auth/token.json';
    const writeFileSync = fs.writeFileSync(tokenFilePath, JSON.stringify({ 'Bearer': token }), 'utf8');

}
export default globalSetup;