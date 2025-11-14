import { APIRequestContext, request } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.uat file
dotenv.config({ path: path.resolve(__dirname, '.env.uat') });

interface CreateUserPayload {
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface CreateUserResponse {
  result: {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
  };
}

export class UserAPI {
  private apiContext!: APIRequestContext;
  private readonly baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = process.env.uat.API_BASE_URL || 'https://api-uat.cmiml.net') {
    this.baseUrl = baseUrl;
  }

  async init() {
    try {
      // Create initial context for login
      this.apiContext = await request.newContext({
        extraHTTPHeaders: {
          'Content-Type': 'application/json'
        }
      });

      // Perform admin login
      const email = process.env.uat.PLAYWRIGHT_ADMIN_EMAIL || 'admin@example.com';
      const password = process.env.uat.PLAYWRIGHT_ADMIN_PASSWORD || 'noPassword!';
      const loginResponse = await this.login(email, password);
      this.token = loginResponse.result.token.accessToken;

      // Dispose old context and create new one with the token derived from the previous api context
      await this.apiContext.dispose();
      this.apiContext = await request.newContext({
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      });

      this.log('API context initialized with admin token.');
    } catch (error) {
      this.log(`Error during init: ${error}`);
      throw error;
    }
  }

  async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    try {
      this.log(`Creating user: ${payload.email}`);
      const response = await this.apiContext.post(`${this.baseUrl}/users`, { data: payload });

      if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${response.status()} ${response.statusText()} - ${errorText}`);
      }
      // The response object is from Playwright’s APIRequestContext.post() call.
      // const result: CreateUserResponse This ensures type safety: if the API response doesn’t match this structure, TypeScript will warn you during development.
      const result: CreateUserResponse = await response.json();
      this.log(`User created successfully: ${result.result.email} (ID: ${result.result.id})`);
      return result;
    } catch (error) {
      this.log(`Error creating user: ${error}`);
      throw error;
    } 
  }

  async login(email: string, password: string, retries = 3, delayMs = 1000) {
    this.log(`Attempting login for ${email} with ${retries} retries`);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.apiContext.post(`${this.baseUrl}/auth/login`, {
          data: { email, password }
        });

        if (!response.ok()) {
          const errorText = await response.text();
          throw new Error(`Login failed: ${response.status()} ${response.statusText()} - ${errorText}`);
        }

        const result = await response.json();
        this.log(`Login successful for ${email}`);
        return result;
      } catch (error) {
        this.log(`Login attempt ${attempt} failed: ${error}`);
        if (attempt < retries) {
          this.log(`Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          this.log(`All login attempts failed for ${email}`);
          throw error;
        }
      }
    }
  }

  async dispose() {
    try {
      await this.apiContext.dispose();
      this.log('API context disposed');
    } catch (error) {
      this.log(`Error disposing API context: ${error}`);
    }
  }

  private log(message: string) {
    console.log(`[UserAPI] ${new Date().toISOString()} - ${message}`);
  }
}

// Utility for random user generation
export function generateRandomUser(): CreateUserPayload {
  const random = Math.floor(Math.random() * 100000);
  return {
    email: `user${random}@example.com`,
    firstName: 'Test',
    lastName: `User${random}`,
    password: process.env.uat.PLAYWRIGHT_GENERAL_PASSWORD || 'DefaultPassword123!'
  };
}

import type { 
  LoginPayload, 
  LoginSuccessResponse,
  SignupPayload,
  UserDTO 
} from '../src/shared/api/types/authorization';

import type { 
  InvitationDetails 
} from '../src/entities/invitation/lib/types';

import type { 
  BaseSuccessResponse 
} from '../src/shared/api/types/base';