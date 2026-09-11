type JwtClaims = {
  exp?: number;
  [claim: string]: unknown;
};

const SECONDS_TO_MILLISECONDS_MULTIPLIER = 1000;

const isPlainObject = (value: unknown) =>
  Object.prototype.toString.call(value) === '[object Object]';

// JWT payloads are base64url-encoded, which atob does not accept directly.
export const parseJwtClaims = (token: string | null | undefined): JwtClaims | null => {
  const payload = token?.split('.')[1];
  if (!payload) return null;

  try {
    const claims: unknown = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

    return isPlainObject(claims) ? (claims as JwtClaims) : null;
  } catch {
    return null;
  }
};

// Returns milliseconds, to compare against Date.now(). The exp claim itself is in seconds.
export const getTokenExpiration = (token: string | null | undefined): number | null => {
  const { exp } = parseJwtClaims(token) ?? {};

  return typeof exp === 'number' && Number.isFinite(exp)
    ? exp * SECONDS_TO_MILLISECONDS_MULTIPLIER
    : null;
};
