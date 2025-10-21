import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * See https://playwright.dev/docs/test-configuration.
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.join(__dirname, '.auth/session.json')

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.BASE_URL,
    storageState: authFile, // Path to store/load authentication state
    trace: 'on-first-retry', // Collect trace when retrying failed tests
    // Other common options like headless, viewport, etc. can be added here
  },  
  projects: [
    // Setup project that authenticates and saves storage state
    {
      name: "setup",
      testMatch: '*.setup.ts',
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
    // Project for Chrome browser
      name: "chrome",
      testMatch: '/**/*.spec.ts',
      use: {
        ...devices["Desktop Chrome"],
        // Use prepared auth state.
        storageState: authFile,
      },
      dependencies: ["setup"],
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
