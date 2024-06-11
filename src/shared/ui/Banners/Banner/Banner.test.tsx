import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Banner } from './Banner';

import { BannerProps } from '~/shared/ui/Banners/Banner/lib/types';
import * as hooks from '~/shared/utils/hooks';

const mockOnClose = jest.fn();

const props = {
  children: 'Test banner',
  onClose: mockOnClose,
  duration: 5000,
};

describe('Banner', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render component', async () => {
    render(<Banner {...props} />);

    // Wait for markdown to be processed asynchronously
    await waitFor(() => {
      expect(screen.queryByText(props.children)).toBeVisible();
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeVisible();
      expect(closeButton).toHaveAccessibleName('Close');
    });
  });

  test('clicking the close button calls onClose callback', () => {
    render(<Banner {...props} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('banner auto-closes after 5 seconds if window in focus', () => {
    jest.useFakeTimers();
    jest.spyOn(hooks, 'useWindowFocus').mockReturnValue(true);

    render(<Banner {...props} />);

    jest.advanceTimersByTime(props.duration + 2000);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('banner does not auto-close if window unfocused', () => {
    jest.useFakeTimers();
    jest.spyOn(hooks, 'useWindowFocus').mockReturnValue(false);

    render(<Banner {...props} />);

    jest.advanceTimersByTime(props.duration + 1000);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test.each`
    severity     | text
    ${'success'} | ${'success banner'}
    ${'info'}    | ${'info banner'}
    ${'warning'} | ${'warning banner'}
    ${'error'}   | ${'error banner'}
  `(
    'has text that matches severity $severity',
    async ({ severity, text }: { severity: BannerProps['severity']; text: string }) => {
      render(
        <Banner {...props} severity={severity}>
          {text}
        </Banner>,
      );

      // Wait for markdown to be processed asynchronously
      await waitFor(() => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    },
  );
});
