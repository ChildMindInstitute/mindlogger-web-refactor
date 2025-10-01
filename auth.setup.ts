import { request, expect } from '@playwright/test';
import path from 'path';

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
    });

    expect(response.ok()).toBeTruthy();

    // Save the authentication state (e.g., cookies, tokens)
    await requestContext.storageState({ path: authFile });
    const body = await response.json();
    process.env.TOKEN = body.data.accessToken;
}

export default globalSetup;

// import { test as setup } from '@playwright/test';
// import path from 'path';

// const authFile = path.join(__dirname, 'playwright/.auth/user.json');

// setup('authenticate', async ({ request }) => {
//     // Send authentication request.
//     // await request.post('/auth/login', {
//     //     // data: {
//     //     //     'email': 'email',
//     //     //     'password': 'password',
//     //     // }
//     // });
//     // await request.storageState({ path: authFile });
// });