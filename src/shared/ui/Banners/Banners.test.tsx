import { PreloadedState } from '@reduxjs/toolkit';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Banners } from './Banners';

import { RootState } from '~/shared/utils';
import { renderWithProviders } from '~/test/utils';

const preloadedState: PreloadedState<RootState> = {
  banners: {
    banners: [{ key: 'SuccessBanner', bannerProps: { children: 'test message' } }],
  },
};

describe('Banners', () => {
  test('should render test banner', () => {
    renderWithProviders(<Banners />, { preloadedState });

    expect(screen.getByText('test message')).toBeInTheDocument();
  });

  test('should no longer render banner when its close button clicked', async () => {
    renderWithProviders(<Banners />, { preloadedState });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    // Wait for Collapse transition to complete
    await waitFor(() => {
      expect(screen.queryByText('test message')).toBeNull();
    });
  });
});
