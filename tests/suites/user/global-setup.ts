
// global-setup.ts
import { request } from '@playwright/test';
import {runtimeConfig} from "../../config";
import {writeStorageFile} from "../../utils/file";

/**
 * Perform an API authentication and return an access token on success
 * @param email
 * @param password
 */
const performLogin = async (email: string, password:string): Promise<string> => {
  const api = await request.newContext({ baseURL: runtimeConfig.baseURL });
  const res = await api.post('/auth/login', {
    data: { email: runtimeConfig.userEmail, password: runtimeConfig.userPassword },
  });

  if (!res.ok()) throw new Error(`Login failed: ${res.status()} ${await res.text()}`);

  const { accessToken } = await res.json();
  await api.dispose();

  return accessToken;
}

export default async () => {
  const userAccessToken = await performLogin(runtimeConfig.userEmail, runtimeConfig.userPassword)
  writeStorageFile(JSON.stringify({ accessToken: userAccessToken }, null, 2), runtimeConfig.userTokenFile)

  const adminAccessToken = await performLogin(runtimeConfig.adminUserEmail, runtimeConfig.adminUserPassword)
  writeStorageFile(JSON.stringify({ accessToken: adminAccessToken }, null, 2), runtimeConfig.adminTokenFile)
};
