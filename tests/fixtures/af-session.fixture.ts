import { devices, request, test as base } from '@playwright/test';

import { runtimeConfig } from '../config';
import { mockFeatureFlags, MockedFlagValues } from '../utils/feature-flags';
import { performUiLogin } from '../utils/ui';

// Each worker gets its own user, so logging in on one worker doesn't log out another.

export type AfUser = {
  id: string;
  email: string;
  password: string;
  accessToken: string;
};

type AfSessionWorkerFixtures = {
  afUser: AfUser;
  afStorageState: string;
};

// Creates and logs in a fresh backend user; returns its identity + token.
export const createTestUser = async (
  namePrefix: string,
  lastName = 'User',
): Promise<AfUser> => {
  const api = await request.newContext({ baseURL: runtimeConfig.apiBaseURL });
  const email = `${namePrefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
  const password = 'AfResumeSuite123!';

  const created = await api.post('/users', {
    data: { email, firstName: 'AF', lastName, password },
  });
  if (!created.ok()) {
    throw new Error(`Failed to create test user: ${created.status()} ${await created.text()}`);
  }

  const login = await api.post('/auth/login', { data: { email, password } });
  if (!login.ok()) {
    throw new Error(`Failed to log in test user: ${login.status()} ${await login.text()}`);
  }
  const result = (await login.json()).result;
  await api.dispose();

  return { id: result.user.id, email, password, accessToken: result.token.accessToken };
};

export const test = base.extend<object, AfSessionWorkerFixtures>({
  afUser: [
    async ({}, use, workerInfo) => {
      await use(await createTestUser(`af-resume-w${workerInfo.workerIndex}`, `Worker${workerInfo.workerIndex}`));
    },
    { scope: 'worker' },
  ],

  afStorageState: [
    async ({ browser, afUser }, use, workerInfo) => {
      // Must use the same browser settings as the tests, or the saved login won't work.
      const context = await browser.newContext({ ...devices['Desktop Chrome'] });
      const page = await context.newPage();
      await performUiLogin(page, `${runtimeConfig.baseURL}/login`, afUser.email, afUser.password);
      await page.waitForURL(/protected/, { timeout: 30000 });

      const path = `storage/.auth/af-resume-w${workerInfo.workerIndex}.json`;
      await context.storageState({ path });
      await context.close();
      await use(path);
    },
    { scope: 'worker' },
  ],

  // Route every test context in the af-resume suite to the worker's session.
  storageState: async ({ afStorageState }, use) => {
    await use(afStorageState);
  },
});

// Authenticated API request context acting as the worker user.
export const afApiContext = async (afUser: AfUser) =>
  await request.newContext({
    baseURL: runtimeConfig.apiBaseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${afUser.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

// Opens a second logged-in browser, acting as another device for the same user.
export const openWebDevice = async (
  browser: import('@playwright/test').Browser,
  afUser: AfUser,
  options: { timezoneId?: string; flags?: MockedFlagValues } = {},
) => {
  const { flags, ...contextOptions } = options;
  const context = await browser.newContext({ ...devices['Desktop Chrome'], ...contextOptions });
  await mockFeatureFlags(context, flags);
  const page = await context.newPage();
  await performUiLogin(page, `${runtimeConfig.baseURL}/login`, afUser.email, afUser.password);
  await page.waitForURL(/protected/, { timeout: 30000 });

  return { context, page };
};

export { expect } from '@playwright/test';
