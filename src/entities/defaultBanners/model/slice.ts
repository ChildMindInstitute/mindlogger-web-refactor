import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BannerType } from '~/entities/banner/model';

export type DismissedBannersStore = Record<string, BannerType[]>;

export type DefaultBannersStore = {
  dismissedBanners: Record<string, BannerType[]>;
};

const initialState: DefaultBannersStore = {
  dismissedBanners: {},
};

const defaultBannersSlice = createSlice({
  name: 'defaultBanners',
  initialState,
  reducers: {
    dismissBanner: (state, action: PayloadAction<{ key: string; bannerType: BannerType }>) => {
      const banners = state.dismissedBanners[action.payload.key] || [];
      state.dismissedBanners[action.payload.key] = [...banners, action.payload.bannerType];
    },
  },
});

export const actions = defaultBannersSlice.actions;
export const reducer = defaultBannersSlice.reducer;
