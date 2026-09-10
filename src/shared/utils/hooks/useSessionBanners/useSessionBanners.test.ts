import { PreloadedState } from '@reduxjs/toolkit';

import { useSessionBanners } from './useSessionBanners';

import { userModel } from '~/entities/user';
import { RootState } from '~/shared/utils/store';
import { renderHookWithProviders } from '~/test/utils/renderHookWithProviders';

type useAuthorizationReturn = ReturnType<typeof userModel.hooks.useAuthorization>;

const emptyState: PreloadedState<RootState> = {
  banners: {
    banners: [],
  },
};

const populatedState: PreloadedState<RootState> = {
  banners: {
    banners: [{ key: 'SuccessBanner', bannerProps: { children: 'test banner' }, order: 1 }],
  },
};

const spyUseAuthorization = jest.spyOn(userModel.hooks, 'useAuthorization');

describe('useSessionBanners', () => {
  test('should remove all banners when the session becomes invalid', () => {
    spyUseAuthorization.mockReturnValue({ isAuthorized: true } as useAuthorizationReturn);

    const { rerender, store } = renderHookWithProviders(useSessionBanners, {
      preloadedState: populatedState,
    });

    spyUseAuthorization.mockReturnValue({ isAuthorized: false } as useAuthorizationReturn);

    rerender();

    expect(store.getState().banners).toEqual(emptyState.banners);
  });
});
