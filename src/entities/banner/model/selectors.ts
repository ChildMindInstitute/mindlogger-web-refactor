import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/shared/utils';

export const bannersSelector = createSelector(
  (state: RootState) => state.banners,
  (state) => state.banners,
);
