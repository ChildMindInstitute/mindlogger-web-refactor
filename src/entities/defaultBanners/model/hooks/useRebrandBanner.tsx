import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { BannerOrder, useBanners } from '~/entities/banner/model';
import { DismissedBannersStore } from '~/entities/defaultBanners/model';
import { REBRAND_BANNER_EXCLUDED_ROUTES } from '~/shared/ui/Banners/lib/const';
import { useAppDispatch } from '~/shared/utils';
import { matchPaths } from '~/shared/utils/matchPaths';

export const useRebrandBanner = (dismissed: DismissedBannersStore, bannerScope: string) => {
  const dispatch = useAppDispatch();
  const { addBanner, removeBanner } = useBanners();
  const location = useLocation();

  const isExcludedRoute = matchPaths(REBRAND_BANNER_EXCLUDED_ROUTES, location.pathname).some(
    Boolean,
  );

  useEffect(() => {
    // If the banner has been dismissed or the route is excluded, don't add the banner
    if (dismissed[bannerScope]?.includes('RebrandBanner') || isExcludedRoute) {
      return;
    }

    addBanner(
      'RebrandBanner',
      {
        severity: undefined,
        duration: null,
        bannerScope,
      },
      BannerOrder.Top,
    );

    return () => {
      removeBanner('RebrandBanner');
    };
  }, [
    location.pathname,
    dismissed,
    bannerScope,
    isExcludedRoute,
    dispatch,
    addBanner,
    removeBanner,
  ]);
};

export default useRebrandBanner;
