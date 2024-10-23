import { useRef } from 'react';

import { useBanners } from '~/entities/banner/model';
import { userModel } from '~/entities/user';

export const useSessionBanners = () => {
  const { isAuthorized } = userModel.hooks.useAuthorization();
  const { removeAllBanners } = useBanners();

  const prevIsAuthorized = useRef(isAuthorized);

  if (prevIsAuthorized.current !== isAuthorized && !isAuthorized) {
    removeAllBanners();
  }

  prevIsAuthorized.current = isAuthorized;
};
