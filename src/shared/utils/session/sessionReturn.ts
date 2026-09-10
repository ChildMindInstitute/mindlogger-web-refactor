import { SESSION_RETURN_KEY } from './session.const';

type SessionReturn = {
  path: string;
  userId: string;
  // Only to fill the login field back in. Null where the store never held one.
  email: string | null;
};

// Where a session that ended on its own left off. Kept in session storage rather than router state:
// the route tree swaps a render before the navigation to the login page lands, and the redirect that
// fires in between carries no state with it. Nor could state hold why the session ended or whose it
// was, which is what decides whether the page is offered back at all.
export const setSessionReturn = (value: SessionReturn) =>
  sessionStorage.setItem(SESSION_RETURN_KEY, JSON.stringify(value));

export const getSessionReturn = (): SessionReturn | null => {
  const stored = sessionStorage.getItem(SESSION_RETURN_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as SessionReturn;
  } catch {
    return null;
  }
};

// The user is named as well as the page: someone else signing in at this tab starts fresh.
export const getSessionReturnPath = (userId: string): string | null => {
  const stored = getSessionReturn();

  return stored && userId && stored.userId === userId ? stored.path : null;
};

// Cleared once a session is running rather than as it is read: the redirect that consumes it runs
// again while the sign-in settles, and every pass has to reach the same page.
export const clearSessionReturn = () => sessionStorage.removeItem(SESSION_RETURN_KEY);
