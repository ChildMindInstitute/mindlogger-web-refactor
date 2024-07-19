import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BannerPayload } from './types';

export type BannersStore = {
  banners: Array<BannerPayload>;
};

const initialState: BannersStore = {
  banners: [],
};

const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    addBanner: (state, { payload }: PayloadAction<BannerPayload>): void => {
      state.banners.push(payload);
    },
    removeBanner: (state, { payload }: PayloadAction<Pick<BannerPayload, 'key'>>): void => {
      state.banners = state.banners.filter(({ key }) => key !== payload.key);
    },
    removeAllBanners: (state): void => {
      state.banners = [];
    },
  },
});

export const actions = bannersSlice.actions;
export const reducer = bannersSlice.reducer;
