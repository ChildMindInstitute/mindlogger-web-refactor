import { useState } from 'react';

import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';

// One browser holds one session. While another tab is signed in and this one is not, nothing here
// may start a second: the way forward is the banner's reload, into the session already running.
// Keyed off the marker rather than the banner, which the user can dismiss without consenting to
// anything. Controls start enabled and go quiet on the press that is refused.
export const useSessionElsewhereGuard = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  // True when the action was refused, so the caller bails out.
  const refuse = () => {
    if (!sessionStorage.getItem(SESSION_ELSEWHERE_KEY)) return false;

    setIsBlocked(true);

    return true;
  };

  return { isBlocked, refuse };
};
