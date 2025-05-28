import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useBanners } from '~/entities/banner/model';

/**
 * Hook to display the rebranding banner on the appropriate pages
 * This hook adds the RebrandBanner to the application
 */
export const useRebrandBanner = () => {
  const { addBanner } = useBanners();
  const location = useLocation();

  useEffect(() => {
    // Using a small timeout to ensure this runs after any other banners are added
    // This will make the RebrandBanner appear on top
    const timeoutId = setTimeout(() => {
      addBanner('RebrandBanner', {});
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [addBanner, location.pathname]);
};

export default useRebrandBanner;
