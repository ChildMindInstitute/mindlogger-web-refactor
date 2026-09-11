import { useState } from 'react';

import { BannerOrder, actions, bannersSelector } from '~/entities/banner/model';
import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';
import { useAppDispatch, useAppSelector } from '~/shared/utils/store';

// One browser holds one session. While another tab is signed in and this one is not, nothing here
// may start a second: the way forward is the banner's reload, into the session already running.
// Keyed off the marker rather than the banner, which the user can dismiss without consenting to
// anything. Controls start enabled and go quiet on the press that is refused.
export const useSessionElsewhereGuard = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(bannersSelector);
  const [wasRefused, setWasRefused] = useState(false);

  // Not remembered on its own: a control must not stay grey once the session elsewhere has ended.
  const isBlocked = wasRefused && !!sessionStorage.getItem(SESSION_ELSEWHERE_KEY);

  // True when the action was refused, so the caller bails out.
  const refuse = () => {
    if (!sessionStorage.getItem(SESSION_ELSEWHERE_KEY)) return false;

    setWasRefused(true);

    // A control that goes quiet on its own says nothing about why. The message comes back if it was
    // dismissed, checked first because adding appends and would otherwise show a second copy.
    if (!banners.some(({ key }) => key === 'SessionElsewhereBanner')) {
      dispatch(actions.addBanner({ key: 'SessionElsewhereBanner', order: BannerOrder.Top }));
    }

    return true;
  };

  return { isBlocked, refuse };
};
