import {request, test as base} from '@playwright/test';
import {UserAPI} from "../util/user-api";
import {AppletAPI} from "../util/applet-api";
import {runtimeConfig} from "../../../config";
import {readStorageFile} from "../../../utils/file";

type Fixtures = {
  userApi: UserAPI;
  adminUserApi: UserAPI
  appletApi: AppletAPI
};


const initContext = async (storageFile: string) => {
  const { accessToken } = JSON.parse(
    readStorageFile(runtimeConfig.userTokenFile)
  );

  return await request.newContext({
    baseURL: runtimeConfig.baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}

export const test = base.extend<Fixtures>({
  userApi: async ({}: any, use: (arg0: any) => any) => {
    const context = await initContext(runtimeConfig.userTokenFile)

    const api = new UserAPI(context);
    await use(api);
    await api.dispose();
  },

  adminUserApi: async ({}: any, use: (arg0: any) => any) => {
    const context = await initContext(runtimeConfig.adminTokenFile)

    const api = new UserAPI(context);
    await use(api);
    await api.dispose();
  },


  appletApi: async ({}: any, use: (arg0: any) => any) => {
    const context = await initContext(runtimeConfig.userTokenFile)

    const api = new AppletAPI(context);
    await use(api);
    await api.dispose();
  },

});


export { expect } from '@playwright/test';
