/**
 * Credentials used by Playwright end-to-end tests.
 *
 * `source` identifies whether the credentials were loaded for an admin
 * or regular user login.
 */
export type PlaywrightCredentials = {
  email: string;
  password: string;
  source: 'admin' | 'user';
};

/**
 * Read an environment variable from standard or nested `uat` format.
 *
 * @param key - The environment variable name to resolve.
 * @returns The string value if present, otherwise an empty string.
 */
const getEnvValue = (key: string): string => {
  const value = process.env[key] as string | undefined;
  if (value) return value;
  const uatValue = (process.env as any)?.uat?.[key];
  return typeof uatValue === 'string' ? uatValue : '';
};

/**
 * Load a pair of Playwright credentials if both email and password exist.
 *
 * @param emailKey - Environment key for the email address.
 * @param passwordKey - Environment key for the password.
 * @param source - Indicates whether these are admin or user credentials.
 * @returns The credentials object, or `null` if either value is missing.
 */
const loadCredentials = (
  emailKey: string,
  passwordKey: string,
  source: 'admin' | 'user',
): PlaywrightCredentials | null => {
  const email = getEnvValue(emailKey);
  const password = getEnvValue(passwordKey);
  return email && password ? { email, password, source } : null;
};

/**
 * Return Playwright user credentials if available.
 */
export const getPlaywrightUserCredentials = (): PlaywrightCredentials | null =>
  loadCredentials('PLAYWRIGHT_USER_EMAIL', 'PLAYWRIGHT_USER_PASSWORD', 'user');

/**
 * Return Playwright admin credentials if available.
 */
export const getPlaywrightAdminCredentials = (): PlaywrightCredentials | null =>
  loadCredentials('PLAYWRIGHT_ADMIN_USER_EMAIL', 'PLAYWRIGHT_ADMIN_USER_PASSWORD', 'admin');

/**
 * Prefer admin credentials, then fall back to user credentials.
 */
export const getPlaywrightAuthCredentials = (): PlaywrightCredentials | null => {
  return getPlaywrightAdminCredentials() ?? getPlaywrightUserCredentials();
};

/**
 * Require user credentials and throw a helpful error if they are missing.
 */
export const requirePlaywrightUserCredentials = (): PlaywrightCredentials => {
  const creds = getPlaywrightUserCredentials();
  if (!creds) {
    throw new Error(
      'Missing Playwright user credentials. Set PLAYWRIGHT_USER_EMAIL and PLAYWRIGHT_USER_PASSWORD or process.env.uat.PLAYWRIGHT_EMAIL / PLAYWRIGHT_PASSWORD.',
    );
  }
  return creds;
};

/**
 * Require admin or user auth credentials and throw a helpful error if they are missing.
 */
export const requirePlaywrightAuthCredentials = (): PlaywrightCredentials => {
  const creds = getPlaywrightAuthCredentials();
  if (!creds) {
    throw new Error(
      'Missing Playwright auth credentials. Set PLAYWRIGHT_ADMIN_USER_EMAIL / PLAYWRIGHT_ADMIN_USER_PASSWORD or PLAYWRIGHT_USER_EMAIL / PLAYWRIGHT_USER_PASSWORD (or process.env.uat equivalents).',
    );
  }
  return creds;
};
