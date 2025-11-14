import type { CreateUserPayload } from '../api/users.api';

export function generateRandomUser(): CreateUserPayload {
  const random = Math.floor(Math.random() * 100000);
  return {
    email: `user${random}${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: `User${random}`,
    password: process.env.PLAYWRIGHT_GENERAL_PASSWORD || 'DefaultPassword123!',
  };
}

export function generateUniqueEmail(baseEmail?: string): string {
  if (baseEmail && baseEmail.includes('@')) {
    const [local, domain] = baseEmail.split('@');
    return `${local}${Date.now()}@${domain}`;
  }
  return `user${Date.now()}@example.com`;
}
