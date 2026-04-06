import { APIRequestContext } from "@playwright/test";

/**
 * Standard API request model describing URL, payload, and HTTP method.
 */
interface APIRequestModel {
    url: string;
    data: object;
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
}

/**
 * Normalize and construct an API endpoint URL.
 *
 * @param baseUrl - The base URL for the API.
 * @param endpoint - The endpoint path to append.
 */
export const constructApiUrl = (baseUrl: string, endpoint: string): string => {
    return `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
};

/**
 * Send an API request using Playwright's APIRequestContext.
 *
 * @param apiRequestContext - The request context.
 * @param url - The request URL.
 * @param data - The request payload.
 * @param method - The HTTP method to use.
 * @returns The parsed JSON response.
 */
export const postToApi = async (apiRequestContext: APIRequestContext, { url, data, method }: APIRequestModel): Promise<any> => {
    const response = await apiRequestContext.fetch(url, {
        method,
        data: data ? JSON.stringify(data) : undefined,
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status()} ${response.statusText()} - ${errorText}`);
    }

    return response.json();
}




