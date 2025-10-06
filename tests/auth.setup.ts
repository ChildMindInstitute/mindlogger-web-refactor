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
    // await requestContext.storageState({ path: authFile });
    expect(response.status()).toBe(200); 
    const body = await response.json();   
    const token = body.result.token.accessToken;
    expect(body.result.token.tokenType).toBe('Bearer');  
    process.env.API_TOKEN = token;
    // await page.context().storageState({ path: 'playwright/.auth/user.json' })
    await requestContext.storageState({ path: 'playwright/.auth/user.json' });
    console.log('API Token:', token);

    // Save the authentication state (e.g., cookies, tokens)
    // await requestContext.storageState({ path: authFile });
    // const body = await response.json();
    // // console.log(body.result.token.accessToken)
    // process.env.API_TOKEN = body.result.token.accessToken;
}

export default globalSetup;
// copied from other test
// import { request, expect } from '@playwright/test';
// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '.env') });

// const authFile = path.join(__dirname, 'playwright/.auth/user.json');
// let apiToken = '';

// async function globalSetup() {
//     const requestContext = await request.newContext({
//         baseURL: process.env.BASE_URL, // Ensure this matches baseURL in config
//     });

//     // Perform API login
//     const response = await requestContext.post('/auth/login', {
//         data: {
//             'email': process.env.EMAIL,
//             'password': process.env.PASSWORD,
//         },
//         headers: {
//             // authorization: `Bearer ${VALUE}`,
//             'accept': 'application/json',
//             'Content-Type': 'application/json',
//         }
//     });

//     expect(response.status()).toBe(200); 
//     console.log(response);   
//     // const body = JSON.parse(await response.json());   
//     // console.log(body); 
//     // const token = body.result.token.accessToken;
//     // console.log(token);
//     // // expect(resBody.token_type).toBe('Bearer');   
//     // process.env.TOKEN = token;
//     // console.log(await token);

//     // expect(response.ok()).toBeTruthy();

//     // Save the authentication state (e.g., cookies, tokens)
//     // await requestContext.storageState({ path: authFile });
//     // const body = await response.json();
//     // // console.log(body.result.token.accessToken)
//     // process.env.API_TOKEN = body.result.token.accessToken;
// }

// export default globalSetup;