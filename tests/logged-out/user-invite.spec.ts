import { test,expect } from '@playwright/test';
// import { v4 as uuidv4 } from 'uuid';
import {UserAPI} from '../utils/userApi';
// import dotenv from 'dotenv';
// import path from 'path';
// import { generateRandomUser } from '../utils/userApi';
// import { UIlogin } from '../utils/loginPage';
// import { AppletAPI } from '../utils/appletAPI';


// dotenv.config({ path: path.resolve(__dirname, '.env.uat') });

// test.describe('User Invite Tests', () => {
//     let createdUserEmail: string;
//     let createdUserPassword: string;
//     let createdUserName: string;
//     let api: UserAPI;

//     test.beforeAll(async ({ request }) => {
//         api = new UserAPI('');
//         api.setRequest?.(request);
//         //create applet through API for the invite tests
//         // create applet API instance
//         const appletAPI = new AppletAPI(request);
//         appletAPI.setRequest(request);
//         // Create the applet via API
//         createAppletPayload()
//         const payload = await appletAPI.createAppletPayload();
//         const createdApplet = await appletAPI.createApplet(payload);
//         console.log('Created applet:', createdApplet);

//         // create the data and user via API, login through the API and save the bearer token
//         // Generate a new random users data
//         const newUser = generateRandomUser();
//         // Create the user via API
//         const createdUser = await api.createUser(newUser);
//         // Extract the email, password, and name of the new user
//         createdUserEmail = createdUser.result.email;
//         createdUserPassword = newUser.password || '';
//         createdUserName = `${createdUser.result.firstName} ${createdUser.result.lastName}`;
//         // Reinitialize API with new user credentials to ensure any other API requests has the right bearer token values
//         await api.init();

        

//     });

//     // // Log in with valid credentials
//     //     await api.login(createdUserEmail, createdUserPassword);
//     //     // Log in via UI to set session state for further tests
//     //     await UIlogin(page, '/login', createdUserEmail, createdUserPassword);

//     test.skip('Create Applet API Test', async () => {

//     //Define the API endpoint URL with a placeholder for the applet ID
//     const appletCreateAPIURL = 'https://api-uat.cmiml.net/applets/{applet_id}/publish';
//     function generateUUIDWithLibrary() {
//         return uuidv4();
//     }

//     // Generate a new UUID for the applet ID
//     const appletId = generateUUIDWithLibrary();
//     // Replace the placeholder in the URL with the generated applet ID
//     const fullURL = appletCreateAPIURL.replace('{applet_id}', appletId);
//     const myData = api.createAppletPayload;

//     // TODO need to add headers if the API request login 
//     // from the setup file is not working
//     // Call the function to post data
//     dataToAPI({ url: fullURL, data: myData, method: 'POST' })
//         .then(() => {
//             // Handle the response data as needed
//             console.log('Applet created with ID:', appletId);
//         })
//         .catch(error => {
//             // Handle errors as needed
//             console.error('Failed to create applet:', error);
//         });
// });


// // import { test, expect } from '@playwright/test'; 
// // import { ApiUtils } from '../utils/apiUtils'; // Adjust path as necessary

// //Todo: Implement invite tests
// // TODO: Create an API login function to get auth token for API requests
// // API Endpoint POST, https://api-uat.cmiml.net/invitations/4f1c4d70-4441-405d-92fc-1d47d80c3788/managers
// // Payload {"role":"manager","subjects":[],"email":"phillipe.bojorquez+automationtest123@childmind.org","firstName":"Phillipe","lastName":"Bojorquez","language":"en","title":"This is my title"}
// // Response 200 OK
// // 

// // const authFile = '.auth/session.json';

// // test.describe('Create Account API Tests', () => {
// //     let apiUtils: ApiUtils;

// //     test.beforeEach(async ({ request }) => {
// //         apiUtils = new ApiUtils(request);
// //     });

// //     test.use({ storageState: authFile });

// //     test('should create and retrieve an invite', async () => {
// //         const newinviteData = {
// //             "email": `{process.env.uat.EMAIL || ''}+${Date.now()}${Math.floor(Math.random() * 1000)}`,
// //             "firstName": 'Automation',
// //             "lastName": 'Test',
// //             "language": 'en',
// //             "role": 'manager',
// //             "workspacePrefix": '',
// //             "title": 'This is my title',
// //         };

// //         const appletID = '4f1c4d70-4441-405d-92fc-1d47d80c3788'; // Replace with a valid applet ID

// //         const createdAccount = await apiUtils.createManagerInvite(newinviteData, appletID);
// //         console.log('createdAccount' + createdAccount);
// //         // expect(createdAccount).toHaveProperty('status');

// //         const retrievedAccount = await apiUtils.getAppletInvitations(appletID);
// //         console.log('retrievedAccount' + retrievedAccount);
// //         // expect(retrievedAccount.firstname).toBe('Automation');
// //         // expect(retrievedAccount.lastname).toBe('Test');
// //     });

// //     // Add more tests utilizing your API utility methods
// // })
