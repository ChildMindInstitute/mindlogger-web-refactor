import { useSessionAdoption } from './useSessionAdoption';

import { BannerOrder } from '~/entities/banner/model';
import { ROUTES } from '~/shared/constants';
import {
  clearSessionEnded,
  clearSessionState,
  closeSessionSync,
  MS_IN_MIN,
  SESSION_CHANNEL_NAME,
  SESSION_ELSEWHERE_KEY,
  SESSION_ENDED_KEY,
  SESSION_REQUEST_WINDOW_MS,
  setLastActivityAt,
} from '~/shared/utils';
import { secureTokensStorage } from '~/shared/utils/storage/secureTokensStorage';
import {
  InMemoryBroadcastChannel,
  renderHookWithProviders,
  resetInMemoryBroadcastChannels,
} from '~/test/utils';

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

const holdSession = () =>
  vi.mocked(secureTokensStorage.getTokens).mockReturnValue({
    accessToken: 'my-access',
    refreshToken: 'my-refresh',
    tokenType: 'Bearer',
  });

const openSiblingTab = () => new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);

const renderAdoption = (route?: string) =>
  renderHookWithProviders(() => useSessionAdoption(), route ? { route, routePath: route } : {});

type Store = ReturnType<typeof renderAdoption>['store'];

const bannersIn = (store: Store) => store.getState().banners.banners;

describe('useSessionAdoption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    // The note is read once per boot, and each test is a fresh one.
    clearSessionEnded();
    vi.useFakeTimers();
    vi.setSystemTime(START);
    // Pinned here rather than inherited from .env, which vitest also loads.
    vi.stubEnv('VITE_IDLE_TIMEOUT_MIN', '10');
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    vi.stubGlobal('location', { ...window.location, reload });
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

  it('raises the banner when another tab announces a session', async () => {
    const { store } = renderAdoption();

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(1);
    expect(bannersIn(store)[0].key).toBe('SessionElsewhereBanner');
    expect(sessionStorage.getItem(SESSION_ELSEWHERE_KEY)).toBe('true');
  });

  it('never takes itself into the session', async () => {
    renderAdoption();

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(reload).not.toHaveBeenCalled();
  });

  it('raises the banner once when several announcements land together', async () => {
    const { store } = renderAdoption();
    const sibling = openSiblingTab();

    sibling.postMessage(ANNOUNCED);
    sibling.postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(1);
  });

  it('does not treat a request from another signed-out tab as an answer', async () => {
    // No clock either, so the fallback below cannot speak up on the session's behalf.
    clearSessionState();
    const { store } = renderAdoption();

    // Two login-page tabs both listening. Answering this would bounce them off each other.
    openSiblingTab().postMessage({ type: 'SESSION_REQUEST' });
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(0);
  });

  it('leaves a tab that already holds a session alone', async () => {
    holdSession();
    const { store } = renderAdoption();

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(0);
  });

  // A tab reloaded out of a session it no longer owns is already visible, so no visibilitychange
  // is coming. Without this it would sit there silently, waiting for an announcement.
  it('asks for a session as soon as it mounts', () => {
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    renderAdoption();

    expect(onSiblingMessage).toHaveBeenCalledWith({ data: { type: 'SESSION_REQUEST' } });
  });

  it('asks again when the tab comes back into focus', () => {
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    renderAdoption();
    onSiblingMessage.mockClear();

    document.dispatchEvent(new Event('visibilitychange'));

    expect(onSiblingMessage).toHaveBeenCalledWith({ data: { type: 'SESSION_REQUEST' } });
  });

  it('raises the banner when the last tab holding the session has closed', async () => {
    const { store } = renderAdoption();

    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(1);
    expect(reload).not.toHaveBeenCalled();
  });

  it('stays quiet when no session was ever left behind', async () => {
    clearSessionState();
    const { store } = renderAdoption();

    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(0);
    expect(sessionStorage.getItem(SESSION_ELSEWHERE_KEY)).toBeNull();
  });

  it('stays quiet for a session already past its idle deadline', async () => {
    setLastActivityAt(START - 11 * MS_IN_MIN);
    const { store } = renderAdoption();

    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(0);
  });

  it('raises the banner once however often the tab is woken', async () => {
    const { store } = renderAdoption();

    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(1);
  });

  // Both outlive a reload, so a tab that has reached the session would otherwise carry them in.
  it('clears the banner and the marker once it holds a session', () => {
    sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true');
    holdSession();

    // What the tab was showing before the reload took it into the session.
    const { store } = renderHookWithProviders(() => useSessionAdoption(), {
      preloadedState: {
        banners: { banners: [{ key: 'SessionElsewhereBanner', order: BannerOrder.Top }] },
      },
    });

    expect(sessionStorage.getItem(SESSION_ELSEWHERE_KEY)).toBeNull();
    expect(sessionStorage.getItem(SESSION_ENDED_KEY)).toBeNull();
    expect(bannersIn(store)).toHaveLength(0);
  });

  // Sent here by leaveEndedSession: the tokens it can still read belong to the session that
  // replaced it, so it behaves as a signed-out tab despite holding them.
  it('speaks up for a tab whose session ended, even though it still holds tokens', async () => {
    holdSession();
    sessionStorage.setItem(SESSION_ENDED_KEY, 'true');
    const { store } = renderAdoption();

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(1);
  });

  it('stays quiet on focus once it holds a session, leaving catch-up to the engine', () => {
    holdSession();
    const sibling = openSiblingTab();
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    renderAdoption();

    document.dispatchEvent(new Event('visibilitychange'));

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  // The marker and the banner both outlive a reload, but the session they describe does not.
  it('retracts a banner left over from a session that has since ended', async () => {
    sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true');
    // Signed out elsewhere while this tab sat on the login page, so the clock is gone with it.
    clearSessionState();

    const { store } = renderHookWithProviders(() => useSessionAdoption(), {
      preloadedState: {
        banners: { banners: [{ key: 'SessionElsewhereBanner', order: BannerOrder.Top }] },
      },
    });
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(0);
    expect(sessionStorage.getItem(SESSION_ELSEWHERE_KEY)).toBeNull();
  });

  it('retracts it when the session it named has passed its idle deadline', async () => {
    sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true');
    setLastActivityAt(START - 11 * MS_IN_MIN);

    const { store } = renderHookWithProviders(() => useSessionAdoption(), {
      preloadedState: {
        banners: { banners: [{ key: 'SessionElsewhereBanner', order: BannerOrder.Top }] },
      },
    });
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(0);
    expect(sessionStorage.getItem(SESSION_ELSEWHERE_KEY)).toBeNull();
  });

  // A live session still answers, so nothing is retracted from under a tab that can still join.
  it('leaves the banner alone while the session is still running', async () => {
    const { store } = renderAdoption();

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(1);
    expect(sessionStorage.getItem(SESSION_ELSEWHERE_KEY)).toBe('true');
  });

  // Without this the banner sits there until the tab is reloaded or comes back into focus.
  it('takes the banner down as soon as the session is signed out elsewhere', async () => {
    const { store } = renderAdoption();
    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    openSiblingTab().postMessage({
      type: 'LOGOUT',
      payload: { sessionId: 'family-1', reason: 'manual' },
    });

    expect(bannersIn(store)).toHaveLength(0);
    expect(sessionStorage.getItem(SESSION_ELSEWHERE_KEY)).toBeNull();
  });

  // Whoever is filling this in has no account, so a message about somebody else's sign-in in this
  // browser would mean nothing to them.
  it('stays out of it entirely on a public-link survey', async () => {
    const { store } = renderAdoption(ROUTES.publicSurvey.path);

    openSiblingTab().postMessage(ANNOUNCED);
    await vi.advanceTimersByTimeAsync(SESSION_REQUEST_WINDOW_MS);

    expect(bannersIn(store)).toHaveLength(0);
    expect(reload).not.toHaveBeenCalled();
  });
});
