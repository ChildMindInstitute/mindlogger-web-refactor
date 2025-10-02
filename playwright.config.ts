import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.join(__dirname, 'playwright/.auth/user.json')

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Global setup for authentication
  globalSetup: require.resolve('./auth.setup.ts'),

  // Base URL for HTTP requests
  use: {
    baseURL: process.env.BASE_URL, // Your API or web application base URL
    extraHTTPHeaders: {
      // Add authorization token to all requests. authHeader, content type.  Reference the locust headers
      // Assuming personal access token available in the environment.
      'Authorization': `bearer ${process.env.API_TOKEN}`,
    },
    storageState: authFile, // Path to store/load authentication state
    trace: 'on-first-retry', // Collect trace when retrying failed tests
    // Other common options like headless, viewport, etc. can be added here
  },

  /* Configure projects for major browsers */
  projects: [

    // Setup project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/, //Matches the authentication setup file
    },
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'safari',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    // Add other browsers or device configurations as needed
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
    /* Run your local dev server before starting the tests */
    //
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },

  ],

  // Other configuration options
  testDir: 'tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

});
