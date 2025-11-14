import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * See https://playwright.dev/docs/test-configuration.
 */

// Determine which environment file to load
const environmentPath = process.env.ENVIRONMENT 
    ? `./env/.env.${process.env.ENVIRONMENT}`
    : `./env/.env.uat`; // Default to dev environment

dotenv.config({ path: path.resolve(__dirname, environmentPath) });

const authFile = path.join(__dirname, 'tests/.auth/session.json')

export default defineConfig({
  testDir: './tests',
  // Run a lightweight global setup to generate a reusable storageState
  // without relying on a dedicated "setup" project test.
  globalSetup: 'tests/e2e/setup/global.setup.ts',
  // Clean up storage state artifacts after the run
  globalTeardown: 'tests/e2e/setup/global.teardown.ts',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: 'on-first-retry', // Collect trace when retrying failed tests
    // Other common options like headless, viewport, etc. can be added here
  },
  projects: [
    // Old setup project (disabled - using globalSetup instead)
    // {
    //   name: 'setup',
    //   testMatch: /global\.setup\.ts/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //   },
    //   teardown: 'teardown',
    // },
    // {
    //   name: 'teardown',
    //   testMatch: /global\.teardown\.ts/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //   },
    // },
    {
      name: 'loggedOut-chrome',
      testMatch: '/logged-out/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        // Clears storage state for logged out tests
        storageState: undefined,
      },
    },
    {
      // Old logged-in project (uses old UI-based setup)
      name: 'loggedIn-chrome',
      testMatch: '/logged-in/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: [],  // Removed dependency on old setup
    },
    {
      // New e2e tests with admin storage state from globalSetup
      name: 'e2e',
      testMatch: '/e2e/specs/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(__dirname, 'tests/.auth/admin.json'),
      },
    },
    //TODO: Enable other browsers when needed.
    //At the moment all browsers but Chrome fail.
    //
    // {
    //   // Project for Firefox browser
    //   name: 'firefox',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     // Use prepared auth state.
    //     storageState: authFile,
    //   },
    //   dependencies: ['setup'],
    // },
    // // Project for Safari browser
    // {
    //   name: 'safari',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Safari'],
    //     // Use prepared auth state.
    //     storageState: authFile,
    //   },
    //   dependencies: ['setup'],
    // },
  ],
});