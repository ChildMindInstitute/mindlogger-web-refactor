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

const softLockState: PreloadedState<RootState> = {
  banners: {
    banners: [
      { key: 'SoftLockWarningBanner', order: 0 },
      { key: 'AnnouncementBanner', bannerProps: { children: 'rebrand' }, order: 1 },
    ],
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

  // Raised on the login page to explain the session that ended. Signing in is the user having read
  // it, and nothing carries it into the app.
  test('should take down the soft lock warning once the user is signed in', () => {
    spyUseAuthorization.mockReturnValue({ isAuthorized: false } as useAuthorizationReturn);

    const { rerender, store } = renderHookWithProviders(useSessionBanners, {
      preloadedState: softLockState,
    });

    spyUseAuthorization.mockReturnValue({ isAuthorized: true } as useAuthorizationReturn);

    rerender();

    expect(store.getState().banners.banners.map(({ key }) => key)).toEqual(['AnnouncementBanner']);
  });
});
