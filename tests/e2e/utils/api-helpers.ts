import type { APIRequestContext } from '@playwright/test';

// Construct a URL for API endpoints
export const constructApiUrl = (baseUrl: string, endpoint: string): string => {
  return `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
};

// Generic POST request helper
export const postToApi = async (
  apiRequestContext: APIRequestContext,
  url: string,
  data: object,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST'
): Promise<any> => {
  const response = await apiRequestContext.fetch(url, {
    method,
    data: data ? JSON.stringify(data) : undefined,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok()) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status()} ${response.statusText()} - ${errorText}`);
  }

  return response.json();
};
