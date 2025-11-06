import { test as base } from '@playwright/test';
import { UserAPI } from '../utils/userApi.ts' 

type Fixtures = {
  api: UserAPI;
};

export const test = base.extend<Fixtures>({
  api: async ({}: any, use: (arg0: any) => any) => {
    const api = new UserAPI();
    // auto login
    await api.init();
    await use(api);
    await api.dispose();
  }
});