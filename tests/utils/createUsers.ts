import { APIRequestContext, request } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });
const token = 'tests/.auth/session.json'

// User creation payload should match the API requirements.
// Enforces type safety for the user creation request. 
interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// UserAPI class to handle user-related API operations
export class UserAPI {
  // Stores baseUrl and apiContext.
  private apiContext!: APIRequestContext; //Define assignment
  private baseUrl: string;

  constructor(baseUrl: string = process.env.PLAYWRIGHT_BASE_URL_API || 'https://api-uat.cmiml.net') {
    this.baseUrl = baseUrl;
  }

  // init() initializes the API context with headers.
  async init() {
    this.apiContext = await request.newContext({
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        // Add Authorization header if required:
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async login(email: string, password: string) {
    const response = await this.apiContext.post(`${this.baseUrl}/auth/login`, {
      data: { email, password }
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} - ${await response.text()}`);
    }

    return response.json();
  }

  // createUser() sends a POST request to /users with the payload.
  async createUser(payload: CreateUserPayload) {
    try {
      const response = await this.apiContext.post(`${this.baseUrl}/users`, {
        data: payload
      });

      if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${response.status()} ${response.statusText()} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // dispose() cleans up the API context.
  async dispose() {
    await this.apiContext.dispose();
  }
}

// ✅ Utility to generate random user data
export function generateRandomUser(): CreateUserPayload {
  const random = Math.floor(Math.random() * 100000);
  return {
    email: `user${random}@example.com`,
    firstName: 'Test',
    lastName: `User${random}`,
    password: 'SecurePass123!'
  };
}
