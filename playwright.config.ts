import { defineConfig, devices } from '@playwright/test';
import {runtimeConfig} from './tests/config'


export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: 'on-first-retry', // Collect trace when retrying failed tests
    headless: true,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /tests\/setup\/auth\.setup\.ts/,
    },
    {
      name: 'e2e',
      testMatch: 'e2e/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: runtimeConfig.storageState,
      },
      dependencies: ['setup'],
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
