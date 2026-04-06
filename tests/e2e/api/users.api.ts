import type { APIRequestContext } from '@playwright/test';

/**
 * Payload to create a new user via the API.
 */
export interface CreateUserPayload {
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

/**
 * The expected response shape for a user creation request.
 */
export interface CreateUserResponse {
  result: {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
  };
}

/**
 * The expected response shape for a login request.
 */
export type LoginResponse = {
  result: {
    token: { accessToken: string };
  };
};

/**
 * API helper for user-related operations.
 */
export class UsersApi {
  constructor(private readonly api: APIRequestContext) {}

  /**
   * Authenticate a user via the API and return login information.
   *
   * @param email - The email to authenticate.
   * @param password - The password to authenticate.
   * @returns The login response payload.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await this.api.post('/auth/login', { data: { email, password } });
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`Login failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json() as Promise<LoginResponse>;
  }


  /**
   * Create a new user account via the API.
   *
   * @param payload - The new user details.
   * @returns The created user response.
   */
  async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    const res = await this.api.post('/users', { data: payload });
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`Create user failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json() as Promise<CreateUserResponse>;
  }
}
