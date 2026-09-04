import { AxiosRequestConfig } from 'axios';

import authorizationService from './authorization.service';
import axiosService, { refreshTokens } from './axios';

import {
  closeSessionSync,
  eventEmitter,
  SESSION_CHANNEL_NAME,
  subscribeSessionSync,
} from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';
import { InMemoryBroadcastChannel, resetInMemoryBroadcastChannels } from '~/test/utils';

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

  // Logging out mid-flight, here or in a sibling that broadcast it, clears the store. Storing the
  // answer that arrives afterwards would put the session back on its feet.
  it('discards tokens that arrive after the session has ended', async () => {
    const pending = deferred();
    mockRefreshToken.mockReturnValue(pending.promise as never);

    const refreshing = refreshTokens();
    // The logout lands while the request is still out.
    mockGetTokens.mockReturnValue(null);
    pending.resolve({ data: { result: newPair } });

    await expect(refreshing).rejects.toThrow('Session ended before');
    expect(mockSetTokens).not.toHaveBeenCalled();
  });
});

// Drives the interceptor by answering from a scripted list rather than the network. Capped, because
// a retry loop here would otherwise run until the worker runs out of memory and takes the suite out
// with it, rather than failing the one test that is wrong.
const CALL_CAP = 5;

const answerWith = (script: Array<401 | 200>) => {
  let call = 0;
  const adapter = (config: AxiosRequestConfig) => {
    const status = script[Math.min(call, script.length - 1)];
    call += 1;

    if (call > CALL_CAP) return Promise.reject(new Error('the interceptor looped'));

    return status === 200
      ? Promise.resolve({ status, data: 'ok', config, headers: {}, statusText: 'OK' })
      : Promise.reject({ response: { status }, config });
  };

  axiosService.defaults.adapter = adapter as never;

  return () => call;
};

describe('the 401 interceptor', () => {
  const originalAdapter = axiosService.defaults.adapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTokens.mockReturnValue({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      tokenType: 'Bearer',
    });
  });

  afterEach(() => {
    axiosService.defaults.adapter = originalAdapter;
  });

  it('refreshes once and replays the request with the new token', async () => {
    mockRefreshToken.mockResolvedValue({ data: { result: newPair } } as never);
    // The replay reads its header back out of storage, so the store has to move with the refresh.
    mockSetTokens.mockImplementation((pair) => mockGetTokens.mockReturnValue(pair));
    const calls = answerWith([401, 200]);

    const response = await axiosService.get('/applets');

    expect(response.status).toBe(200);
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    expect(calls()).toBe(2);
    expect(response.config.headers?.Authorization).toBe('Bearer access-2');
  });

  it('ends the session when the refresh it needed fails', async () => {
    const onLogout = vi.spyOn(eventEmitter, 'emit');
    mockRefreshToken.mockRejectedValue(new Error('revoked'));
    answerWith([401]);

    await expect(axiosService.get('/applets')).rejects.toBeDefined();
    expect(onLogout).toHaveBeenCalledWith('onLogout');
  });

  it('leaves MFA verification to its own flow rather than logging out mid-sign-in', async () => {
    const onLogout = vi.spyOn(eventEmitter, 'emit');
    mockRefreshToken.mockRejectedValue(new Error('revoked'));
    answerWith([401]);

    await expect(axiosService.post('/auth/mfa/totp/verify')).rejects.toBeDefined();
    expect(onLogout).not.toHaveBeenCalledWith('onLogout');
  });

  it('does not try to refresh, or log out, with no refresh token to spend', async () => {
    const onLogout = vi.spyOn(eventEmitter, 'emit');
    mockGetTokens.mockReturnValue(null);
    answerWith([401]);

    await expect(axiosService.get('/applets')).rejects.toBeDefined();
    expect(mockRefreshToken).not.toHaveBeenCalled();
    expect(onLogout).not.toHaveBeenCalledWith('onLogout');
  });

  it('gives up rather than looping when the replayed request 401s too', async () => {
    mockRefreshToken.mockResolvedValue({ data: { result: newPair } } as never);
    const calls = answerWith([401, 401]);

    await expect(axiosService.get('/applets')).rejects.toBeDefined();
    expect(calls()).toBe(2);
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
  });
});

const tokenWithClaims = (claims: Record<string, unknown>) =>
  `header.${window.btoa(JSON.stringify(claims))}.signature`;

const heldPair = (refreshToken: string) => ({
  accessToken: 'access-1',
  refreshToken,
  tokenType: 'Bearer',
});

describe('the rotation broadcast', () => {
  // Listens as a second tab would. The subscriber stands in for this tab's engine, without which
  // nothing is broadcast at all.
  const openSiblingTab = () => {
    subscribeSessionSync(vi.fn());
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    return onSiblingMessage;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    // The session id is read out of storage, so the store has to move with the refresh.
    mockSetTokens.mockImplementation((pair) => mockGetTokens.mockReturnValue(pair));
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
  });

  it('tells same-session tabs about the pair it just rotated', async () => {
    const onSiblingMessage = openSiblingTab();
    const rotated = { ...newPair, refreshToken: tokenWithClaims({ family: 'family-1' }) };
    mockGetTokens.mockReturnValue(heldPair(tokenWithClaims({ family: 'family-1' })));
    mockRefreshToken.mockResolvedValue({ data: { result: rotated } } as never);

    await refreshTokens();

    expect(onSiblingMessage).toHaveBeenCalledWith({
      data: {
        type: 'TOKENS_UPDATED',
        payload: {
          sessionId: 'family-1',
          accessToken: rotated.accessToken,
          refreshToken: rotated.refreshToken,
        },
      },
    });
  });

  it('names the session by the token it is replacing, not the one it just minted', async () => {
    const onSiblingMessage = openSiblingTab();
    // Without a family claim the id is the jti, which every rotation renews. Siblings still hold
    // the outgoing generation, so that is the one they have to be addressed by.
    mockGetTokens.mockReturnValue(heldPair(tokenWithClaims({ jti: 'jti-1' })));
    mockRefreshToken.mockResolvedValue({
      data: { result: { ...newPair, refreshToken: tokenWithClaims({ jti: 'jti-2' }) } },
    } as never);

    await refreshTokens();

    expect(onSiblingMessage.mock.calls[0][0].data.payload.sessionId).toBe('jti-1');
  });

  it('stays silent when the token carries no session id, leaving sync inert', async () => {
    const onSiblingMessage = openSiblingTab();
    mockGetTokens.mockReturnValue(heldPair(tokenWithClaims({ sub: 'user-1' })));
    mockRefreshToken.mockResolvedValue({ data: { result: newPair } } as never);

    await refreshTokens();

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  it('stays silent about a rotation it discarded', async () => {
    const onSiblingMessage = openSiblingTab();
    mockGetTokens.mockReturnValue(heldPair(tokenWithClaims({ family: 'family-1' })));
    const pending = deferred();
    mockRefreshToken.mockReturnValue(pending.promise as never);

    const refreshing = refreshTokens();
    mockGetTokens.mockReturnValue(null);
    pending.resolve({ data: { result: newPair } });

    await expect(refreshing).rejects.toThrow('Session ended before');
    expect(onSiblingMessage).not.toHaveBeenCalled();
  });
});
