import { useEffect, useRef } from 'react';

import { useBanners } from '~/entities/banner/model';
import { userModel } from '~/entities/user';

export const useSessionBanners = () => {
  const { removeAllBanners } = useBanners();
  const { isAuthorized } = userModel.hooks.useAuthorization();

  const prevIsAuthorized = useRef(isAuthorized);
  useEffect(() => {
    if (prevIsAuthorized.current !== isAuthorized && !isAuthorized) {
      // The soft-lock notice is raised by the login page this logout is on its way to, and child
      // effects run before parent ones, so an unqualified clear lands on top of it.
      removeAllBanners(['SoftLockWarningBanner']);
    }

    prevIsAuthorized.current = isAuthorized;
  }, [isAuthorized, removeAllBanners]);
};
