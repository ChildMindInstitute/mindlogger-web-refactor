import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { SettingsPage } from '../pages/settings.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { AppletListPage } from '../pages/applet-list.page';
import { AppletDetailsPage } from '../pages/applet-details.page';
import { newApiContext } from '../api/client';
import { UsersApi } from '../api/users.api';
import { AppletsApi } from '../api/applets.api';
import { InvitationsApi } from '../api/invitations.api';

/**
 * Shared Playwright fixtures for E2E tests.
 */
export type Fixtures = {
  baseURL: string;
  loginPage: LoginPage;
  signupPage: SignupPage;
  settingsPage: SettingsPage;
  forgotPasswordPage: ForgotPasswordPage;
  appletListPage: AppletListPage;
  appletDetailsPage: AppletDetailsPage;
  usersApi: UsersApi;
  appletsApi: AppletsApi;
  invitationsApi: InvitationsApi;
};

/**
 * Extended test fixture that provides page objects and API helpers.
 */
export const test = base.extend<Fixtures>({
  baseURL: async ({}, use) => {
    await use(process.env.PLAYWRIGHT_BASE_URL ?? 'https://web-uat.cmiml.net');
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  appletListPage: async ({ page }, use) => {
    await use(new AppletListPage(page));
  },

  appletDetailsPage: async ({ page }, use) => {
    await use(new AppletDetailsPage(page));
  },

  usersApi: async ({}, use) => {
    const api = await newApiContext();
    const users = new UsersApi(api);
    await use(users);
    await api.dispose();
  },
  appletsApi: async ({}, use) => {
    const api = await newApiContext();
    const applets = new AppletsApi(api);
    await use(applets);
    await api.dispose();
  },
  invitationsApi: async ({}, use) => {
    const api = await newApiContext();
    const invitations = new InvitationsApi(api);
    await use(invitations);
    await api.dispose();
  },
});

export { expect } from '@playwright/test';
