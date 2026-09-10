import { useEffect, useState } from 'react';

import { BannerOrder, actions } from '~/entities/banner/model';
import { clearSessionReturn, getSessionReturn } from '~/shared/utils/session/sessionReturn';
import { useAppDispatch } from '~/shared/utils/store';

const KEY = 'SoftLockWarningBanner';

// A session that ended on its own leaves the login page looking unexplained, and the field it wants
// filled belongs to whoever was signed in. Both come from the record the logout left behind. Held
// by the page rather than the form, so the banner is raised once however many controls read it.
export const useSoftLockBanner = () => {
  const dispatch = useAppDispatch();

  // Read once: dismissing must not empty the field out from under the form.
  const [sessionReturn] = useState(getSessionReturn);

  // Raised here rather than at logout, which is followed by every banner being cleared as the tab
  // leaves the session. On mount alone, so a dismissal is not undone on the next render.
  useEffect(() => {
    if (sessionReturn) dispatch(actions.addBanner({ key: KEY, order: BannerOrder.Top }));
  }, [sessionReturn, dispatch]);

  // Heading for a password reset or a new account is not resuming, so the offer is withdrawn.
  const dismiss = () => {
    if (!sessionReturn) return;

    clearSessionReturn();
    dispatch(actions.removeBanner({ key: KEY }));
  };

  return { softLockEmail: sessionReturn?.email ?? '', dismiss };
};
