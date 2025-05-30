import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RebrandBanner } from './index';

import { BannerPayload } from '~/entities/banner/model';
import { defaultBannersModel } from '~/entities/defaultBanners';

// Mock dispatch function
const mockDispatch = vi.fn();

// Mock dependencies
vi.mock('~/shared/utils', async () => {
  const actual = await vi.importActual('~/shared/utils');
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});

vi.mock('~/entities/defaultBanners', () => ({
  defaultBannersModel: {
    actions: {
      dismissBanner: vi.fn((payload: Omit<BannerPayload, 'order'>) => ({
        type: 'defaultBanners/dismissBanner',
        payload,
      })),
    },
  },
}));

// Mock the Trans component from react-i18next
vi.mock('react-i18next', () => ({
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RebrandBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct styling and content', () => {
    // Render the component
    render(<RebrandBanner />);

    // Check that the banner is rendered with the correct test ID
    const banner = screen.getByTestId('rebrand-banner');
    expect(banner).toBeInTheDocument();

    // Check that the banner has the correct background color
    expect(banner).toHaveStyle('background-color: #0b0907');
    expect(banner).toHaveStyle('color: #fdfcfc');

    // Check that the banner contains the expected text
    expect(screen.getByText(/We are rebranding!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Design updates are on the way—same great app, fresh new look./i),
    ).toBeInTheDocument();
  });

  it('dispatches dismissBanner action with global scope when closed', () => {
    // Render the component
    render(<RebrandBanner />);

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Check that the dismissBanner action was dispatched with the correct payload
    expect(defaultBannersModel.actions.dismissBanner).toHaveBeenCalledWith({
      key: 'global',
      bannerType: 'RebrandBanner',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'defaultBanners/dismissBanner',
      payload: {
        key: 'global',
        bannerType: 'RebrandBanner',
      },
    });
  });

  it('dispatches dismissBanner action with custom scope when provided', () => {
    // Render the component with a custom bannerScope
    const customScope = 'user-123';
    render(<RebrandBanner bannerScope={customScope} />);

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Check that the dismissBanner action was dispatched with the correct payload
    expect(defaultBannersModel.actions.dismissBanner).toHaveBeenCalledWith({
      key: customScope,
      bannerType: 'RebrandBanner',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'defaultBanners/dismissBanner',
      payload: {
        key: customScope,
        bannerType: 'RebrandBanner',
      },
    });
  });

  it('passes additional props to the Banner component', () => {
    // Render the component with additional props
    render(<RebrandBanner data-custom="test-value" />);

    // Check that the additional props were passed to the Banner component
    const banner = screen.getByTestId('rebrand-banner');
    expect(banner).toHaveAttribute('data-custom', 'test-value');
  });

  it('renders with the correct icon', () => {
    // Render the component
    render(<RebrandBanner />);

    // Check that the banner contains an image
    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
  });

  it('calls custom onClose handler when banner is closed', () => {
    // Create a mock onClose handler
    const mockOnClose = vi.fn();

    // Render the component with the custom onClose handler
    render(<RebrandBanner onClose={mockOnClose} />);

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Verify that both the dismissBanner action and custom onClose handler were called
    expect(defaultBannersModel.actions.dismissBanner).toHaveBeenCalledWith({
      key: 'global',
      bannerType: 'RebrandBanner',
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
