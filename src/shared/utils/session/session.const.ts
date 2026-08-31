export const MS_IN_SEC = 1000;
export const MS_IN_MIN = 60 * MS_IN_SEC;

// Overridden by VITE_IDLE_TIMEOUT_MIN.
export const DEFAULT_IDLE_TIMEOUT_MIN = 30;

// Headroom before token expiry. Overridden by VITE_REFRESH_LEAD_SEC.
export const DEFAULT_REFRESH_LEAD_SEC = 90;

// How long the warning counts down for. Overridden by VITE_IDLE_WARNING_MIN.
export const DEFAULT_IDLE_WARNING_MIN = 5;

// How often the countdown redraws while the warning is open.
export const COUNTDOWN_TICK_MS = MS_IN_SEC;

// mousemove fires continuously, so writes are throttled well below the timeout's precision.
export const ACTIVITY_THROTTLE_MS = 5 * MS_IN_SEC;

// Kept apart from interactionEvents, which drives the applet's auto-completion timer. Scroll and
// wheel belong here — someone reading a long activity is still present — but adding them there
// would change when an activity auto-completes.
export const ACTIVITY_EVENTS = [
  'mousemove',
  'pointerdown',
  'keydown',
  'scroll',
  'wheel',
  'touchstart',
] as const;

// Plain, unencrypted, and read live by every tab. See sessionStore.
export const LAST_ACTIVITY_AT_KEY = 'lastActivityAt';

// Which session the browser belongs to. Read live for the same reason as the clock above: a tab
// that slept through a sign-in holds an encrypted snapshot naming the session before it.
export const ACTIVE_SESSION_ID_KEY = 'activeSessionId';

// In session storage, so it is per tab and survives the reload it guards against repeating.
export const RELOAD_ATTEMPTED_KEY = 'reloadAttempted';

// Per tab: a live session exists that this tab is not in. Signing in from here is refused while it
// is set, so it has to outlive the banner, which the user can dismiss.
export const SESSION_ELSEWHERE_KEY = 'sessionElsewhere';
