
export interface UserData {
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

/**
 * Generate a random user object for test data.
 *
 * @param password - Optional password, defaulting to a strong sample password.
 * @returns A user object suitable for account creation.
 */
export function generateRandomUser(password?: string): UserData {
  const uid = crypto.randomUUID();

  return {
    email: `user-${uid}@example.com`,
    firstName: 'Test',
    lastName: `User ${uid}`,
    password: password || 'DefaultPassword123!',
  };
}

/**
 * Create a unique email address based on an optional base email.
 *
 * @param baseEmail - An optional base email to preserve the domain.
 * @returns A unique email string.
 */
export function generateUniqueEmail(baseEmail?: string): string {
  if (baseEmail && baseEmail.includes('@')) {
    const [local, domain] = baseEmail.split('@');
    return `${local}${Date.now()}@${domain}`;
  }

  return `user${Date.now()}@example.com`;
}
