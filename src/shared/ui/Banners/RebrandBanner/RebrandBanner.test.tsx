import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { MockInstance, vi } from 'vitest';

import { getDismissedKey, GLOBAL_DISMISSED_KEY, RebrandBanner } from './index';

import { userModel } from '~/entities/user';
import { renderWithProviders } from '~/test/utils';

// Mock react-router-dom's useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock useAuthorization hook
vi.mock('~/entities/user/model/hooks', () => ({
  useAuthorization: vi.fn(),
}));

const mockUseAuthorization = userModel.hooks.useAuthorization as unknown as MockInstance;
const mockUseLocation = useLocation as unknown as MockInstance;

describe('RebrandBanner', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('Route matching', () => {
    test('renders on login route when not authorized', () => {
      mockUseLocation.mockReturnValue({ pathname: '/login' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: false,
        user: null,
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      expect(screen.getByTestId('rebrand-banner')).toBeInTheDocument();
    });

    test('renders on signup route when not authorized', () => {
      mockUseLocation.mockReturnValue({ pathname: '/signup' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: false,
        user: null,
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      expect(screen.getByTestId('rebrand-banner')).toBeInTheDocument();
    });

    test('renders on /protected/ route when authorized', () => {
      mockUseLocation.mockReturnValue({ pathname: '/protected/profile' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: 'user-123' },
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      expect(screen.getByTestId('rebrand-banner')).toBeInTheDocument();
    });

    test('renders on /protected/applets/123 route when authorized', () => {
      mockUseLocation.mockReturnValue({ pathname: '/protected/applets/123' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: 'user-123' },
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      expect(screen.getByTestId('rebrand-banner')).toBeInTheDocument();
    });

    test('does not render on excluded route', () => {
      mockUseLocation.mockReturnValue({
        pathname: '/protected/applets/123/activityId/456/event/789/entityType/regular',
      });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: 'user-123' },
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      expect(screen.queryByTestId('rebrand-banner')).not.toBeInTheDocument();
    });
  });

  describe('Dismissal functionality', () => {
    test('sets global localStorage when dismissed by non-authorized user', async () => {
      mockUseLocation.mockReturnValue({ pathname: '/login' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: false,
        user: null,
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      expect(localStorageMock.getItem(GLOBAL_DISMISSED_KEY)).toBe('true');
    });

    test('sets user-specific localStorage when dismissed by authorized user', async () => {
      const userId = 'user-123';
      mockUseLocation.mockReturnValue({ pathname: '/protected/profile' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: userId },
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      expect(localStorageMock.getItem(getDismissedKey(userId))).toBe('true');
    });

    test('banner collapses after dismissal', async () => {
      mockUseLocation.mockReturnValue({ pathname: '/protected/profile' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: 'user-123' },
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      const banner = screen.getByTestId('rebrand-banner');
      expect(banner).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      // Wait for the collapse animation to complete
      await waitFor(() => {
        expect(screen.queryByTestId('rebrand-banner')).not.toBeInTheDocument();
      });
    });

    test('calls onClose prop when provided and banner is dismissed', async () => {
      const onCloseMock = vi.fn();
      mockUseLocation.mockReturnValue({ pathname: '/protected/profile' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: 'user-123' },
      });

      renderWithProviders(<RebrandBanner onClose={onCloseMock} />, { disableRouter: true });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe('localStorage persistence', () => {
    test('does not show banner when global dismissal is in localStorage', () => {
      mockUseLocation.mockReturnValue({ pathname: '/login' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: false,
        user: null,
      });

      localStorageMock.setItem(GLOBAL_DISMISSED_KEY, 'true');

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      expect(screen.queryByTestId('rebrand-banner')).not.toBeInTheDocument();
    });

    test('does not show banner when user-specific dismissal is in localStorage', () => {
      const userId = 'user-123';
      mockUseLocation.mockReturnValue({ pathname: '/protected/profile' });
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: userId },
      });

      localStorageMock.setItem(getDismissedKey(userId), 'true');

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      expect(screen.queryByTestId('rebrand-banner')).not.toBeInTheDocument();
    });

    test('shows banner when different user logs in', () => {
      const userId1 = 'user-123';
      const userId2 = 'user-456';
      mockUseLocation.mockReturnValue({ pathname: '/protected/profile' });

      // Set dismissal for first user
      localStorageMock.setItem(getDismissedKey(userId1), 'true');

      // Log in as second user
      mockUseAuthorization.mockReturnValue({
        isAuthorized: true,
        user: { id: userId2 },
      });

      renderWithProviders(<RebrandBanner />, { disableRouter: true });

      // Banner should be visible for second user
      expect(screen.getByTestId('rebrand-banner')).toBeInTheDocument();
    });
  });
});
