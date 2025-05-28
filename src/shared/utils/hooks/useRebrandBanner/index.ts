import { useEffect } from 'react';

import { useBanners } from '~/entities/banner/model';

/**
 * Hook to display the rebranding banner on the appropriate pages
 * This hook adds the RebrandBanner to the application
 */
export const useRebrandBanner = () => {
  const { addBanner } = useBanners();

  useEffect(() => {
    // Use a timeout to ensure this runs after any other banners are added
    // This will make the RebrandBanner appear on top
    setTimeout(() => {
      addBanner('RebrandBanner', {});
    }, 0);
  }, [addBanner]);
};

export default useRebrandBanner;
