import { getSessionId } from './sessionSync.utils';

import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn() },
}));

const holdRefreshToken = (refreshToken: string | null) =>
  vi
    .mocked(secureTokensStorage.getTokens)
    .mockReturnValue(refreshToken ? { accessToken: 'a', refreshToken, tokenType: 'Bearer' } : null);

const tokenWithClaims = (claims: Record<string, unknown>) =>
  `header.${window.btoa(JSON.stringify(claims))}.signature`;

describe('getSessionId', () => {
  beforeEach(() => vi.clearAllMocks());

  it('prefers the family claim, which survives rotation', () => {
    holdRefreshToken(tokenWithClaims({ family: 'family-1', jti: 'jti-1' }));

    expect(getSessionId()).toBe('family-1');
  });

  it('falls back to jti until rotation ships', () => {
    holdRefreshToken(tokenWithClaims({ jti: 'jti-1' }));

    expect(getSessionId()).toBe('jti-1');
  });

  it('returns null when neither claim is present, leaving sync inert', () => {
    holdRefreshToken(tokenWithClaims({ sub: 'user-1' }));

    expect(getSessionId()).toBeNull();
  });

  it('returns null without a refresh token', () => {
    holdRefreshToken(null);

    expect(getSessionId()).toBeNull();
  });
});
