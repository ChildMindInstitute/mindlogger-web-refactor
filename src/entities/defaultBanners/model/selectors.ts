import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/shared/utils';

const selectDefaultBanners = (state: RootState) => state.defaultBanners;

export const dismissedBannersSelector = createSelector(
  selectDefaultBanners,
  (banners) => banners.dismissedBanners,
);
