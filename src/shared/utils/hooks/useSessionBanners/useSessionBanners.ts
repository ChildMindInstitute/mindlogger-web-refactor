import { useEffect, useRef } from 'react';

import { useBanners } from '~/entities/banner/model';
import { userModel } from '~/entities/user';

export const useSessionBanners = () => {
  const { removeAllBanners, removeBanner } = useBanners();
  const { isAuthorized } = userModel.hooks.useAuthorization();

  const prevIsAuthorized = useRef(isAuthorized);
  useEffect(() => {
    if (prevIsAuthorized.current !== isAuthorized) {
      if (isAuthorized) {
        // Raised on the login page to explain the session that ended. It has been read by now, and
        // it is the only banner a sign-in has any business taking down.
        removeBanner('SoftLockWarningBanner');
      } else {
        removeAllBanners();
      }
    }

    prevIsAuthorized.current = isAuthorized;
  }, [isAuthorized, removeAllBanners, removeBanner]);
};
