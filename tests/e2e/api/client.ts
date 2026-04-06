import { APIRequestContext, request } from '@playwright/test';

/**
 * Create a new Playwright APIRequestContext with optional bearer authentication.
 *
 * @param token - Optional bearer token for Authorization header.
 * @returns A configured Playwright APIRequestContext.
 */
export async function newApiContext(token?: string): Promise<APIRequestContext> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  return await request.newContext({
    baseURL: process.env.API_BASE_URL ?? 'https://api-uat.cmiml.net',
    extraHTTPHeaders: headers,
  });
}
