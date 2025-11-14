import { APIRequestContext } from "@playwright/test";

// Example interface for the request parameters
interface APIRequestModel {
    url: string;
    data: object;
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
}

// construct a URL for API endpoints
export const constructApiUrl = (baseUrl: string, endpoint: string): string => {
    return `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
};

// Create a post request to the constructed URL using the provided APIRequestContext and the payload data
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




