import dotenv from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 * See https://playwright.dev/docs/test-configuration.
 */
dotenv.config({
  path: `.env`,
});

export const runtimeConfig = {
  storageState: process.env.PLAYWRIGHT_STORAGE_STATE || 'storage/default.json',
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
}
