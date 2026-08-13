import authorizationService from './authorization.service';
import { refreshTokens } from './axios';

import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';

vi.mock('./authorization.service', () => ({
  default: { refreshToken: vi.fn() },
}));

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn(), setTokens: vi.fn(), clearTokens: vi.fn() },
}));

const mockRefreshToken = vi.mocked(authorizationService.refreshToken);
const mockGetTokens = vi.mocked(secureTokensStorage.getTokens);
const mockSetTokens = vi.mocked(secureTokensStorage.setTokens);

const newPair = { accessToken: 'access-2', refreshToken: 'refresh-2', tokenType: 'Bearer' };

// Held open so two callers can overlap deliberately.
const deferred = () => {
  let resolve!: (value: unknown) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

describe('refreshTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTokens.mockReturnValue({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      tokenType: 'Bearer',
    });
  });

  it('stores the pair it is given back', async () => {
    mockRefreshToken.mockResolvedValue({ data: { result: newPair } } as never);

    await expect(refreshTokens()).resolves.toEqual(newPair);
    expect(mockSetTokens).toHaveBeenCalledWith(newPair);
  });

  it('makes one request for callers that overlap, and answers them all', async () => {
    const pending = deferred();
    mockRefreshToken.mockReturnValue(pending.promise as never);

    const first = refreshTokens();
    const second = refreshTokens();

    pending.resolve({ data: { result: newPair } });

    expect(await first).toEqual(newPair);
    expect(await second).toEqual(newPair);
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
  });

  it('starts a new request once the previous one has settled', async () => {
    mockRefreshToken.mockResolvedValue({ data: { result: newPair } } as never);

    await refreshTokens();
    await refreshTokens();

    expect(mockRefreshToken).toHaveBeenCalledTimes(2);
  });

  it('does not wedge on a failure, so the next caller can try again', async () => {
    mockRefreshToken.mockRejectedValueOnce(new Error('network'));

    await expect(refreshTokens()).rejects.toThrow('network');

    mockRefreshToken.mockResolvedValue({ data: { result: newPair } } as never);

    await expect(refreshTokens()).resolves.toEqual(newPair);
  });

  it('refuses to call the endpoint with no refresh token to spend', async () => {
    mockGetTokens.mockReturnValue(null);

    await expect(refreshTokens()).rejects.toThrow('No refresh token');
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });
});
