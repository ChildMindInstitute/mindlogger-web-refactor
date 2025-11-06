
import { test as base } from '@playwright/test';
import { UserAPI } from '../utils/createUsers.ts' 


type Fixtures = {
  userApi: UserAPI;
  adminApi: UserAPI;
};

export const test = base.extend<Fixtures>({
  userApi: async ({}: any, use: (arg0: any) => any) => {
    const api = new UserAPI();
    await api.init();
    await use(api);
    await api.dispose();
  },

  adminApi: async ({}: any, use: (arg0: any) => any) => {
    const api = new UserAPI(process.env.ADMIN_API_BASE_URL || 'https://api-uat.cmiml.net');
    await api.init();

    // Optional: Perform admin login automatically
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      await api.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    }

    await use(api);
    await api.dispose();
  }
});
