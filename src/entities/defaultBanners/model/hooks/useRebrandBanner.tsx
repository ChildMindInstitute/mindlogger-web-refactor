import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { BannerOrder, useBanners } from '~/entities/banner/model';
import { DismissedBannersStore } from '~/entities/defaultBanners/model';
import { REBRAND_BANNER_EXCLUDED_ROUTES } from '~/shared/ui/Banners/lib/const';
import { matchPaths } from '~/shared/utils/matchPaths';

export const useRebrandBanner = (dismissed: DismissedBannersStore, bannerScope: string) => {
  const { addBanner, removeBanner } = useBanners();
  const { i18n } = useTranslation();
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
  }, [location.pathname, dismissed, bannerScope, isExcludedRoute, addBanner, removeBanner, i18n]);
};

export default useRebrandBanner;
