import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';

import { SliderItem } from './SliderItem';
import { SliderItem as SliderItemType } from '../../lib';

const theme = createTheme();

const mockSliderItem: SliderItemType = {
  id: 'slider-1',
  name: 'test-slider',
  question: 'Rate your mood',
  order: 1,
  responseType: 'slider',
  config: {
    removeBackButton: false,
    skippableItem: false,
    timer: null,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    addScores: false,
    setAlerts: false,
    showTickMarks: true,
    showTickLabels: true,
    continuousSlider: false,
  },
  responseValues: {
    minLabel: 'Sad',
    maxLabel: 'Happy',
    minValue: 0,
    maxValue: 10,
    minImage: null,
    maxImage: null,
    scores: null,
    alerts: null,
  },
  answer: [],
  conditionalLogic: null,
  isHidden: false,
};

function renderSliderItem(
  overrides: { value?: string; isDisabled?: boolean; item?: SliderItemType } = {},
) {
  const onValueChange = vi.fn();
  const item = overrides.item ?? mockSliderItem;

  const result = render(
    <ThemeProvider theme={theme}>
      <SliderItem
        item={item}
        value={overrides.value as string}
        onValueChange={onValueChange}
        isDisabled={overrides.isDisabled ?? false}
      />
    </ThemeProvider>,
  );

  return { ...result, onValueChange };
}

describe('SliderItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Config mapping', () => {
    it('maps responseValues labels to SliderItemBase', () => {
      renderSliderItem({ value: '5' });
      expect(screen.getByTestId('slider-min-label')).toHaveTextContent('Sad');
      expect(screen.getByTestId('slider-max-label')).toHaveTextContent('Happy');
    });

    it('maps responseValues min/max values to slider range', () => {
      renderSliderItem({ value: '5' });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '10');
    });
  });

  describe('Value handling', () => {
    it('has no-value class when value is undefined', () => {
      renderSliderItem({ value: undefined });
      expect(screen.getByTestId('slider-container')).toHaveClass('no-value');
    });

    it('does not have no-value class when value is set', () => {
      renderSliderItem({ value: '5' });
      expect(screen.getByTestId('slider-container')).not.toHaveClass('no-value');
    });

    it('wraps onChange value in an array before calling onValueChange', () => {
      const { onValueChange } = renderSliderItem({ value: '2' });
      fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } });
      expect(onValueChange).toHaveBeenCalledWith(['7']);
    });
  });
});
