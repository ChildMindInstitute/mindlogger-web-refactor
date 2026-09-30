import { devices, request, test as base } from '@playwright/test';

import { runtimeConfig } from '../config';
import { mockFeatureFlags, MockedFlagValues } from '../utils/feature-flags';
import { performUiLogin } from '../utils/ui';

// Fixed accounts, one per parallel slot, so logging in on one worker doesn't log out another.

const AF_RESUME_PASSWORD = 'AfResumeSuite123!';

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

// Email of the fixed account for a role ('w' or 'resp-w') and parallel slot.
export const afAccountEmail = (role: string, slot: number): string => {
  if (slot >= runtimeConfig.afResumePoolSize) {
    throw new Error(
      `Parallel slot ${slot} has no af-resume account; run with --workers=${runtimeConfig.afResumePoolSize} or fewer`,
    );
  }
  return `${runtimeConfig.afResumeUserPrefix}-${role}${slot}@example.com`;
};

// Logs in a fixed test account, creating it on first use.
export const getOrCreateUser = async (email: string, lastName: string): Promise<AfUser> => {
  const api = await request.newContext({ baseURL: runtimeConfig.apiBaseURL });
  const password = AF_RESUME_PASSWORD;

  let login = await api.post('/auth/login', { data: { email, password } });
  if (!login.ok()) {
    const created = await api.post('/users', {
      data: { email, firstName: 'AF', lastName, password },
    });
    if (!created.ok()) {
      throw new Error(`Failed to create test user: ${created.status()} ${await created.text()}`);
    }
    login = await api.post('/auth/login', { data: { email, password } });
  }
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
      const slot = workerInfo.parallelIndex;
      await use(await getOrCreateUser(afAccountEmail('w', slot), `Worker${slot}`));
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

      const path = `storage/.auth/af-resume-w${workerInfo.parallelIndex}.json`;
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
  // Empty session: test contexts otherwise inherit the worker's saved login.
  const context = await browser.newContext({
    ...devices['Desktop Chrome'],
    storageState: { cookies: [], origins: [] },
    ...contextOptions,
  });
  await mockFeatureFlags(context, flags);
  const page = await context.newPage();
  await performUiLogin(page, `${runtimeConfig.baseURL}/login`, afUser.email, afUser.password);
  await page.waitForURL(/protected/, { timeout: 30000 });

  return { context, page };
};

export { expect } from '@playwright/test';
