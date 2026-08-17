import { renderHook } from '@testing-library/react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { useSessionAdoption } from './useSessionAdoption';

import {
  clearSessionState,
  closeSessionSync,
  MS_IN_MIN,
  RELOAD_ATTEMPTED_KEY,
  SESSION_CHANNEL_NAME,
  SESSION_REQUEST_WINDOW_MS,
  setLastActivityAt,
} from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';
import { InMemoryBroadcastChannel, resetInMemoryBroadcastChannels } from '~/test/utils';

vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: vi.fn() }));

vi.mock('~/shared/utils/storage/secureTokensStorage', () => ({
  secureTokensStorage: { getTokens: vi.fn(), setTokens: vi.fn(), clearTokens: vi.fn() },
}));

const ANNOUNCED = {
  type: 'SESSION_STATE',
  payload: {
    sessionId: 'family-1',
    accessToken: 'their-access',
    refreshToken: 'their-refresh',
  },
};

const reload = vi.fn();
const START = 1893456000000;

const enableSync = (enabled: boolean) =>
  vi.mocked(useFlags).mockReturnValue({ enableSessionKeepAlive: enabled });

const holdSession = () =>
  vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
    accessToken: 'my-access',
    refreshToken: 'my-refresh',
    tokenType: 'Bearer',
  });

const openSiblingTab = () => new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);

describe('useSessionAdoption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(START);
    // Pinned here rather than inherited from .env, which vitest also loads.
    vi.stubEnv('VITE_IDLE_TIMEOUT_MIN', '10');
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    vi.stubGlobal('location', { ...window.location, reload });
    enableSync(true);
    // What a signed-out tab reads: its snapshot was taken before anyone signed in.
    vi.mocked(secureTokensStorage.getTokens).mockReturnValue(null);
    // A live session always has one, written by the tracker in whichever tab is signed in.
    setLastActivityAt(START);
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('reloads into a session another tab announces', async () => {
    renderHook(() => useSessionAdoption());

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads once when several announcements land together', async () => {
    renderHook(() => useSessionAdoption());
    const sibling = openSiblingTab();

    sibling.postMessage(ANNOUNCED);
    sibling.postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('ignores a request from another tab that is also signed out', async () => {
    renderHook(() => useSessionAdoption());

    // Two login-page tabs both listening. Reloading on this would bounce them off each other.
    openSiblingTab().postMessage({ type: 'SESSION_REQUEST' });
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(reload).not.toHaveBeenCalled();
  });

  it('leaves a tab that already holds a session alone', async () => {
    holdSession();
    renderHook(() => useSessionAdoption());

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(reload).not.toHaveBeenCalled();
  });

  it('ignores announcements while the flag is off', async () => {
    enableSync(false);
    renderHook(() => useSessionAdoption());

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(reload).not.toHaveBeenCalled();
  });

  it('asks for a session when the tab comes back into focus', () => {
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    renderHook(() => useSessionAdoption());

    document.dispatchEvent(new Event('visibilitychange'));

    expect(onSiblingMessage).toHaveBeenCalledWith({ data: { type: 'SESSION_REQUEST' } });
  });

  // Nobody replies, so the fallback window runs out.
  const wakeUnanswered = async () => {
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);
  };

  it('reloads into a live session when the last tab holding it has closed', async () => {
    renderHook(() => useSessionAdoption());

    await wakeUnanswered();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload when no session was ever left behind', async () => {
    clearSessionState();
    renderHook(() => useSessionAdoption());

    await wakeUnanswered();

    expect(reload).not.toHaveBeenCalled();
  });

  it('does not reload for a session already past its idle deadline', async () => {
    setLastActivityAt(START - 11 * MS_IN_MIN);
    renderHook(() => useSessionAdoption());

    await wakeUnanswered();

    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads only once, so a session it cannot read does not loop', async () => {
    renderHook(() => useSessionAdoption());

    await wakeUnanswered();
    await wakeUnanswered();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('forgets the attempt once it holds a session, so a later gap can reload again', () => {
    sessionStorage.setItem(RELOAD_ATTEMPTED_KEY, 'true');
    holdSession();

    renderHook(() => useSessionAdoption());

    expect(sessionStorage.getItem(RELOAD_ATTEMPTED_KEY)).toBeNull();
  });

  it('stays quiet on focus once it holds a session, leaving catch-up to the engine', () => {
    holdSession();
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    renderHook(() => useSessionAdoption());

    document.dispatchEvent(new Event('visibilitychange'));

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });
});
