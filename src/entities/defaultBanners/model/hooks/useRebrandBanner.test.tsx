import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DismissedBannersStore } from '../slice';
import { useRebrandBanner } from './useRebrandBanner';

import { BannerOrder, useBanners } from '~/entities/banner/model';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

// Mock dispatch function
const mockDispatch = vi.fn();

// Mock hooks and utilities
vi.mock('~/shared/utils', async () => {
  const actual = await vi.importActual('~/shared/utils');
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});

vi.mock('~/entities/banner/model', async () => {
  const actual = await vi.importActual('~/entities/banner/model');
  return {
    ...actual,
    BannerOrder: {
      Top: 'top',
    },
    useBanners: vi.fn(),
  };
});

describe('useRebrandBanner', () => {
  // Setup mock values
  const mockBannerScope = 'user-123';

  // Setup mock functions
  const mockAddBanner = vi.fn();
  const mockRemoveBanner = vi.fn();
  const mockLocation = { pathname: '/protected/applets' };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock returns
    (useBanners as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addBanner: mockAddBanner,
      removeBanner: mockRemoveBanner,
    });

    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockLocation);
  });

  it('should add banner when not previously dismissed', () => {
    // Setup
    const dismissed = {};

    // Execute
    const { unmount } = renderHook(() => useRebrandBanner(dismissed, mockBannerScope));

    // Verify
    expect(mockAddBanner).toHaveBeenCalledTimes(1);
    expect(mockAddBanner).toHaveBeenCalledWith(
      'RebrandBanner',
      {
        severity: undefined,
        duration: null,
        bannerScope: mockBannerScope,
      },
      BannerOrder.Top,
    );

    // Cleanup
    unmount();
    expect(mockRemoveBanner).toHaveBeenCalledWith('RebrandBanner');
  });

  it('should not add banner when previously dismissed', () => {
    // Setup
    const dismissed = {
      [mockBannerScope]: ['RebrandBanner'],
    } as DismissedBannersStore;

    // Execute
    renderHook(() => useRebrandBanner(dismissed, mockBannerScope));

    // Verify
    expect(mockAddBanner).not.toHaveBeenCalled();
  });

  it('should not add banner when on an excluded route', () => {
    // Setup
    const dismissed = {};

    // Use one of the actual excluded routes from REBRAND_BANNER_EXCLUDED_ROUTES
    const excludedRoutePath = '/protected/applets/123/activityId/456/event/789/entityType/regular';

    // Mock location with an excluded route
    (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pathname: excludedRoutePath,
    });

    // Execute
    renderHook(() => useRebrandBanner(dismissed, mockBannerScope));

    // Verify
    expect(mockAddBanner).not.toHaveBeenCalled();
  });

  it('should handle empty dismissed banners object', () => {
    // Setup
    const dismissed = {};

    // Execute
    renderHook(() => useRebrandBanner(dismissed, mockBannerScope));

    // Verify
    expect(mockAddBanner).toHaveBeenCalledTimes(1);
  });

  it('should handle undefined dismissed banners for scope', () => {
    // Setup - Use an object without the specific scope
    const dismissed = { 'other-scope': ['RebrandBanner'] } as DismissedBannersStore;

    // Execute
    renderHook(() => useRebrandBanner(dismissed, mockBannerScope));

    // Verify
    expect(mockAddBanner).toHaveBeenCalledTimes(1);
  });

  it('should remove banner on unmount', () => {
    // Setup
    const dismissed = {};

    // Execute
    const { unmount } = renderHook(() => useRebrandBanner(dismissed, mockBannerScope));

    // Unmount to trigger cleanup
    unmount();

    // Verify
    expect(mockRemoveBanner).toHaveBeenCalledWith('RebrandBanner');
  });
});
