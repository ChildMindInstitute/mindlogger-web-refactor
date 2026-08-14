import { ACTIVITY_EVENTS, ACTIVITY_THROTTLE_MS } from './session.const';
import { getLastActivityAt, setLastActivityAt } from './sessionStore';

let stopTracking: (() => void) | null = null;

export const startActivityTracking = (onActivity?: () => void) => {
  stopActivityTracking();

  // Seeds the clock for a session that started before this ran, so the deadline is not open-ended.
  if (!getLastActivityAt()) setLastActivityAt(Date.now());

  let lastWriteAt = 0;
  const handleActivity = () => {
    const now = Date.now();
    if (now - lastWriteAt < ACTIVITY_THROTTLE_MS) return;

    lastWriteAt = now;
    setLastActivityAt(now);
    onActivity?.();
  };

  ACTIVITY_EVENTS.forEach((event) =>
    window.addEventListener(event, handleActivity, { passive: true }),
  );

  stopTracking = () =>
    ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
};

export const stopActivityTracking = () => {
  stopTracking?.();
  stopTracking = null;
};
