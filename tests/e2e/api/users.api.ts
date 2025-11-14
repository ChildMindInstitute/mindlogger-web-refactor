import type { APIRequestContext } from '@playwright/test';

export interface CreateUserPayload {
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateUserResponse {
  result: {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
  };
}

export type LoginResponse = {
  result: {
    token: { accessToken: string };
  };
};

export class UsersApi {
  constructor(private readonly api: APIRequestContext) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await this.api.post('/auth/login', { data: { email, password } });
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`Login failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json() as Promise<LoginResponse>;
  }

  async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    const res = await this.api.post('/users', { data: payload });
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`Create user failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json() as Promise<CreateUserResponse>;
  }
}
