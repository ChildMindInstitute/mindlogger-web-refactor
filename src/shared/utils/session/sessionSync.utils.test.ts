import { clearSessionState, setActiveSessionId } from './sessionStore';
import { getSessionId, ownsActiveSession } from './sessionSync.utils';

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

describe('ownsActiveSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    holdRefreshToken(tokenWithClaims({ family: 'family-1' }));
  });

  it('owns the session it claimed', () => {
    setActiveSessionId('family-1');

    expect(ownsActiveSession()).toBe(true);
  });

  // What a tab that slept through a logout and someone else signing in wakes up to.
  it('does not own a session that started while it slept', () => {
    setActiveSessionId('family-2');

    expect(ownsActiveSession()).toBe(false);
  });

  // Sessions predating this check have nothing recorded, and are left to behave as they always did.
  it('claims nothing recorded, so an older session is left alone', () => {
    expect(ownsActiveSession()).toBe(true);
  });

  it('claims a session whose identity was cleared alongside its clock', () => {
    setActiveSessionId('family-2');
    clearSessionState();

    expect(ownsActiveSession()).toBe(true);
  });

  // A tab that cannot name its own session has no business clearing the shared store.
  it('does not own the browser when its own token is unreadable', () => {
    holdRefreshToken(null);
    setActiveSessionId('family-2');

    expect(ownsActiveSession()).toBe(false);
  });
});
