import { parseJwtClaims } from '../jwt';
import { secureTokensStorage } from '../storage/secureTokensStorage';

// Rotation preserves family across refreshes; jti is the fallback until it ships.
export const getSessionId = (): string | null => {
  const { family, jti } = parseJwtClaims(secureTokensStorage.getTokens()?.refreshToken) ?? {};

  if (typeof family === 'string' && family) return family;
  if (typeof jti === 'string' && jti) return jti;

  return null;
};
