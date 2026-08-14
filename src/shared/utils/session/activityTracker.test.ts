import { startActivityTracking, stopActivityTracking } from './activityTracker';
import { ACTIVITY_THROTTLE_MS } from './session.const';
import { getLastActivityAt } from './sessionStore';

describe('activityTracker', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(1893456000000);
  });

  afterEach(() => {
    stopActivityTracking();
    vi.useRealTimers();
  });

  it('seeds the clock on start, so a session already under way has a deadline', () => {
    startActivityTracking();

    expect(getLastActivityAt()).toBe(1893456000000);
  });

  it('leaves an existing timestamp alone, so another tab does not lose its place', () => {
    localStorage.setItem('lastActivityAt', '1000');
    startActivityTracking();

    expect(getLastActivityAt()).toBe(1000);
  });

  it('moves the clock forward on interaction and tells the caller', () => {
    const onActivity = vi.fn();
    startActivityTracking(onActivity);

    vi.setSystemTime(1893456060000);
    window.dispatchEvent(new Event('keydown'));

    expect(getLastActivityAt()).toBe(1893456060000);
    expect(onActivity).toHaveBeenCalledTimes(1);
  });

  it('throttles, so a moving mouse does not write on every frame', () => {
    const onActivity = vi.fn();
    startActivityTracking(onActivity);

    vi.setSystemTime(1893456060000);
    window.dispatchEvent(new Event('mousemove'));
    vi.setSystemTime(1893456060000 + ACTIVITY_THROTTLE_MS - 1);
    window.dispatchEvent(new Event('mousemove'));

    expect(getLastActivityAt()).toBe(1893456060000);
    expect(onActivity).toHaveBeenCalledTimes(1);
  });

  it('stops listening once stopped', () => {
    startActivityTracking();
    stopActivityTracking();

    vi.setSystemTime(1893456060000);
    window.dispatchEvent(new Event('keydown'));

    expect(getLastActivityAt()).toBe(1893456000000);
  });
});
