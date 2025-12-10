import { test, expect } from '@playwright/test';
import {performLogin} from "../utils/fixtures/auth.fixture";
import {runtimeConfig} from "../config";
import {AuthSelectors} from "../utils/selectors/auth.selectors";

test('login and save storage state', async ({ page }) => {
  await performLogin(page, `${runtimeConfig.baseURL}/login`, process.env.PLAYWRIGHT_USER_EMAIL || '', process.env.PLAYWRIGHT_USER_PASSWORD || '');

  await expect(page).toHaveURL(AuthSelectors.loggedInPath);

  await page.context().storageState({ path: runtimeConfig.storageState });
});
