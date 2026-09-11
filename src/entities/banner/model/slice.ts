import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BannerPayload, BannerType } from './types';

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
    // `keep` is for banners that outlive the session rather than belonging to it: the soft-lock
    // notice is raised to explain the logout, so the logout must not take it down with everything
    // else. Without it the clear races the login page's raise and usually wins.
    removeAllBanners: (
      state,
      { payload }: PayloadAction<{ keep?: BannerType[] } | undefined>,
    ): void => {
      const keep = payload?.keep ?? [];

      state.banners = state.banners.filter(({ key }) => keep.includes(key));
    },
  },
});

export const actions = bannersSlice.actions;
export const reducer = bannersSlice.reducer;
