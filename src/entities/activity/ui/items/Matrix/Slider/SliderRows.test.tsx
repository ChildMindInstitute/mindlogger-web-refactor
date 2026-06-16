import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';

import { SliderRowsItem } from '../../../../lib';

import { SliderRows } from './index';

const theme = createTheme();

const mockSliderRowsItem: SliderRowsItem = {
  id: 'slider-rows-1',
  name: 'test-slider-rows',
  question: 'Rate the following',
  order: 1,
  responseType: 'sliderRows',
  config: {
    removeBackButton: false,
    skippableItem: false,
    timer: null,
    addScores: false,
    setAlerts: false,
  },
  responseValues: {
    rows: [
      {
        id: 'row-1',
        label: 'Energy',
        minLabel: 'Low',
        maxLabel: 'High',
        minValue: 0,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        alerts: null,
      },
      {
        id: 'row-2',
        label: 'Mood',
        minLabel: 'Sad',
        maxLabel: 'Happy',
        minValue: 0,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        alerts: null,
      },
    ],
  },
  answer: [],
  conditionalLogic: null,
  isHidden: false,
};

function renderSliderRows(overrides: { values?: (number | null)[]; item?: SliderRowsItem } = {}) {
  const onValueChange = vi.fn();
  const item = overrides.item ?? mockSliderRowsItem;
  const values = overrides.values ?? [];

  const result = render(
    <ThemeProvider theme={theme}>
      <SliderRows item={item} values={values} onValueChange={onValueChange} />
    </ThemeProvider>,
  );

  return { ...result, onValueChange };
}

describe('SliderRows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a slider for each row', () => {
      renderSliderRows();
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('renders row labels', () => {
      renderSliderRows();
      expect(screen.getByText('Energy')).toBeInTheDocument();
      expect(screen.getByText('Mood')).toBeInTheDocument();
    });
  });

  describe('Value handling', () => {
    it('has no-value class on all rows when values are empty', () => {
      renderSliderRows({ values: [] });
      const containers = screen.getAllByTestId('slider-container');
      containers.forEach((container) => {
        expect(container).toHaveClass('no-value');
      });
    });

    it('has no-value class only on unanswered rows', () => {
      renderSliderRows({ values: [3, null] });
      const containers = screen.getAllByTestId('slider-container');
      expect(containers[0]).not.toHaveClass('no-value');
      expect(containers[1]).toHaveClass('no-value');
    });

    it('does not have no-value class when all values are set', () => {
      renderSliderRows({ values: [3, 4] });
      const containers = screen.getAllByTestId('slider-container');
      containers.forEach((container) => {
        expect(container).not.toHaveClass('no-value');
      });
    });
  });

  describe('onChange behavior', () => {
    it('calls onValueChange with the correct index updated', () => {
      const { onValueChange } = renderSliderRows({ values: [] });
      const sliders = screen.getAllByRole('slider');

      fireEvent.change(sliders[0], { target: { value: '3' } });

      expect(onValueChange).toHaveBeenCalledWith([3, null]);
    });

    it('preserves existing values when updating a single row', () => {
      const { onValueChange } = renderSliderRows({ values: [2, null] });
      const sliders = screen.getAllByRole('slider');

      fireEvent.change(sliders[1], { target: { value: '4' } });

      expect(onValueChange).toHaveBeenCalledWith([2, 4]);
    });
  });
});
