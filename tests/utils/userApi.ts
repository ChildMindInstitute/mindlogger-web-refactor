import { APIRequestContext, request } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class UserAPI {
  private apiContext!: APIRequestContext;
  private readonly baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = process.env.API_BASE_URL || 'https://api-uat.cmiml.net') {
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
      const email = process.env.PLAYWRIGHT_ADMIN_EMAIL || 'admin@example.com';
      const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD || 'AdminPass123!';
      const loginResponse = await this.login(email, password);
      this.token = loginResponse.result.token.accessToken;

      // Dispose old context and create new one with token
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

  async createUser(payload: CreateUserPayload) {
    try {
      this.log(`Creating user: ${payload.email}`);
      const response = await this.apiContext.post(`${this.baseUrl}/users`, { data: payload });

      if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`Failed to create user: ${response.status()} ${response.statusText()} - ${errorText}`);
      }

      const result = await response.json();
      this.log(`User created successfully: ${payload.email}`);
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
    password: 'SecurePass123!'
  };
}