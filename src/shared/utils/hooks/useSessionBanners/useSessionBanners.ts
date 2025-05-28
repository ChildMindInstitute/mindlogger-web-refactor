import { useEffect, useRef } from 'react';

import { useRebrandBanner } from '../useRebrandBanner';

import { useBanners } from '~/entities/banner/model';
import { userModel } from '~/entities/user';

export const useSessionBanners = () => {
  const { isAuthorized } = userModel.hooks.useAuthorization();
  const { removeAllBanners } = useBanners();

  const prevIsAuthorized = useRef(isAuthorized);

  useRebrandBanner();

  useEffect(() => {
    if (prevIsAuthorized.current !== isAuthorized && !isAuthorized) {
      removeAllBanners();
    }

    prevIsAuthorized.current = isAuthorized;
  }, [isAuthorized, removeAllBanners]);
};
