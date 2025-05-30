import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDefaultBanners } from './useDefaultBanners';
import { useRebrandBanner } from './useRebrandBanner';

import { dismissedBannersSelector } from '~/entities/defaultBanners/model/selectors';
import { userModel } from '~/entities/user';
import { useAppSelector } from '~/shared/utils';

// Mock dependencies
vi.mock('~/entities/user', () => ({
  userModel: {
    hooks: {
      useAuthorization: vi.fn(),
    },
  },
}));

vi.mock('~/shared/utils', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('~/entities/defaultBanners/model/selectors', () => ({
  dismissedBannersSelector: 'dismissedBannersSelector',
}));

vi.mock('./useRebrandBanner', () => ({
  useRebrandBanner: vi.fn(),
}));

describe('useDefaultBanners', () => {
  // Setup mock values
  const mockUserId = 'test-user-123';
  const mockDismissedBanners = {
    [`user-${mockUserId}`]: ['RebrandBanner'],
    global: [],
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock returns
    (userModel.hooks.useAuthorization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthorized: false,
      user: null,
    });

    (useAppSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockDismissedBanners);

    (useRebrandBanner as unknown as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
  });

  it('should use global banner scope when user is not authorized', () => {
    // Setup
    (userModel.hooks.useAuthorization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthorized: false,
      user: null,
    });

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(useAppSelector).toHaveBeenCalledWith(dismissedBannersSelector);
    expect(useRebrandBanner).toHaveBeenCalledWith(mockDismissedBanners, 'global');
  });

  it('should use user-specific banner scope when user is authorized', () => {
    // Setup
    (userModel.hooks.useAuthorization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthorized: true,
      user: { id: mockUserId },
    });

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(useAppSelector).toHaveBeenCalledWith(dismissedBannersSelector);
    expect(useRebrandBanner).toHaveBeenCalledWith(mockDismissedBanners, `user-${mockUserId}`);
  });

  it('should handle undefined user id when authorized', () => {
    // Setup
    (userModel.hooks.useAuthorization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthorized: true,
      user: { id: undefined },
    });

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(useRebrandBanner).toHaveBeenCalledWith(mockDismissedBanners, 'user-undefined');
  });

  it('should handle null user when authorized', () => {
    // Setup
    (userModel.hooks.useAuthorization as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthorized: true,
      user: null,
    });

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(useRebrandBanner).toHaveBeenCalledWith(mockDismissedBanners, 'user-undefined');
  });

  it('should handle empty dismissed banners', () => {
    // Setup
    const emptyDismissedBanners = {};
    (useAppSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue(emptyDismissedBanners);

    // Execute
    renderHook(() => useDefaultBanners());

    // Verify
    expect(useRebrandBanner).toHaveBeenCalledWith(emptyDismissedBanners, 'global');
  });
});
