import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { dataToAPI, createAppletPayload } from '../utils/API-methods';
import fs from 'fs';

const authFile = 'playwright/.auth/token.json';
let token = '';

// moving the auth.setup and playwright config logic to the test file to see if I can log in at the test spec level.
//test.use evaluates before the beforeAll function
//it is possible to modify the in memory API_TOKEN value without chaning the original .env variable value
test.use({
  baseURL: process.env.BASE_URL, // Your API or web application base URL
  extraHTTPHeaders: {
    // Add authorization token to all requests. authHeader, content type.  Reference the locust headers
    // Assuming personal access token available in the environment.
    'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
  },
  storageState: authFile, // Path to store/load authentication state
  trace: 'on-first-retry', // Collect trace when retrying failed tests
  // Other common options like headless, viewport, etc. can be added here
});

test.beforeAll(async ({ request }) => {
  const response = await request.post('/auth/login', {
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
  token = body.result.token.accessToken;
  expect(body.result.token.tokenType).toBe('Bearer');
  const tokenFilePath = 'playwright/.auth/token.json';
  const writeFileSync = fs.writeFileSync(tokenFilePath, JSON.stringify({ 'Bearer': token }), 'utf8');
});

// Define the API endpoint URL with a placeholder for the applet ID
const appletCreateAPIURL = 'https://api-uat.cmiml.net/applets/{applet_id}/publish';
function generateUUIDWithLibrary() {
  return uuidv4();
}

// Generate a new UUID for the applet ID
const appletId = generateUUIDWithLibrary();
// Replace the placeholder in the URL with the generated applet ID
const fullURL = appletCreateAPIURL.replace('{applet_id}', appletId);
const myData = createAppletPayload;

// TODO need to add headers if the API request login 
// from the setup file is not working
// Call the function to post data
dataToAPI({ url: fullURL, data: myData, method: 'POST' })
  .then(() => {
    // Handle the response data as needed
    console.log('Applet created with ID:', appletId);
  })
  .catch(error => {
    // Handle errors as needed
    console.error('Failed to create applet:', error);
  });

// unskip this test to test if the setup files bearer token is working
test.skip('Can log into the app and verify the main landing page', async ({ page }) => {
  await page.goto('https://web-uat.cmiml.net/protected/applets');
  // await page.waitForSelector('title', {state:'visible'});
  // await expect(page).toHaveTitle('Curious');
  const myTestElement = page.getByTestId('applet-list');
  await expect(myTestElement).toBeVisible();
});

test('User authenticates through the login page and is redirected to the applet list page', async ({ page }) => {
  await page.goto('https://web-uat.cmiml.net/login');
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
  // });

  // test('Verify that the applet list page displays applets', async ({ page }) => {
  // Assuming the user is already logged in from the previous test
  // Navigate to the applets list page
  // await page.goto('https://web-uat.cmiml.net/protected/applets');
  // Wait for the applet list to load and click on the first applet
  // TODO change this test step to use index 0 of the array of applets to ensure we select the first applet regardless of the name.
  await page.getByRole('heading', { name: 'Applets1 tests' }).click();
  //Wait for the applet details page to load and assert that there is an available activity
  await expect(page.getByRole('heading', { name: 'Available' })).toBeVisible();
  // Click the start button to start the applet activity
  await page.getByRole('button', { name: 'Start' }).click();
  // Wait for the first activity page to load and assert that the progress bar is visible
  const progressBar = page.getByRole('progressbar')
  await expect(progressBar).toBeVisible()
  // click the start button to navigate to the first activties question
  await page.getByRole('button', { name: 'Start' }).click();
  // click the next button without selecting an option to trigger the warning banner
  await page.getByRole('button', { name: 'Next' }).click();
  const warningBanner = page.getByTestId('warning-banner')
  await expect(warningBanner).toBeVisible();
  // select an option and click next to trigger the submit popup banner
  await page.getByTestId('select-box').click();
  await page.getByRole('button', { name: 'Next' }).click();
  // assert that the submit popup banner is visible and click the submit button
  const popupBannerSubmit = page.getByTestId('popup-primary-button')
  expect(popupBannerSubmit).toBeVisible()
  await popupBannerSubmit.click();
  // assert that the submit popup banner is hidden and the success banner is visible with the text 'Done'
  await expect(popupBannerSubmit).toBeHidden();
  const successBanner = page.getByTestId('success-banner')
  await expect(successBanner).toBeVisible()
  await expect(successBanner).toContainText('Done')
});

test.skip('Verify that a user can access an assessment on the web, completing it to submit the answers', async ({ page }) => {

})