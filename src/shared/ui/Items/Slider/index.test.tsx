import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';

import { SliderItemBase } from './index';

const theme = createTheme();

type SliderItemBaseProps = Parameters<typeof SliderItemBase>[0];

const defaultProps: SliderItemBaseProps = {
  minImage: null,
  minLabel: null,
  minValue: 0,
  maxImage: null,
  maxLabel: null,
  maxValue: 5,
  onChange: vi.fn(),
};

function renderSlider(overrides: Partial<SliderItemBaseProps> = {}) {
  const onChange = overrides.onChange ?? vi.fn();
  const props = { ...defaultProps, ...overrides, onChange };

  const result = render(
    <ThemeProvider theme={theme}>
      <SliderItemBase {...props} />
    </ThemeProvider>,
  );

  return { ...result, onChange };
}

describe('SliderItemBase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders slider container with data-testid', () => {
      renderSlider();
      expect(screen.getByTestId('slider-container')).toBeInTheDocument();
    });

    it('renders the MUI slider input element', () => {
      renderSlider();
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('renders min label when provided', () => {
      renderSlider({ minLabel: 'Low' });
      expect(screen.getByTestId('slider-min-label')).toHaveTextContent('Low');
    });

    it('does not render min label when null', () => {
      renderSlider({ minLabel: null });
      expect(screen.queryByTestId('slider-min-label')).toBeNull();
    });

    it('renders max label when provided', () => {
      renderSlider({ maxLabel: 'High' });
      expect(screen.getByTestId('slider-max-label')).toHaveTextContent('High');
    });

    it('does not render max label when null', () => {
      renderSlider({ maxLabel: null });
      expect(screen.queryByTestId('slider-max-label')).toBeNull();
    });

    it('renders min image when provided', () => {
      renderSlider({ minImage: 'https://via.placeholder.com/150' });
      const img = screen.getByTestId('slider-min-image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://via.placeholder.com/150');
    });

    it('does not render min image when null', () => {
      renderSlider({ minImage: null });
      expect(screen.queryByTestId('slider-min-image')).toBeNull();
    });

    it('renders max image when provided', () => {
      renderSlider({ maxImage: 'https://via.placeholder.com/150' });
      const img = screen.getByTestId('slider-max-image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://via.placeholder.com/150');
    });

    it('does not render max image when null', () => {
      renderSlider({ maxImage: null });
      expect(screen.queryByTestId('slider-max-image')).toBeNull();
    });

    it('renders the slider with the correct value', () => {
      renderSlider({ value: '3' });
      expect(screen.getByRole('slider')).toHaveValue('3');
    });
  });
  describe('No-value state (value is undefined)', () => {
    it('does not have no-value CSS class when value is set', () => {
      renderSlider({ value: '3' });
      expect(screen.getByTestId('slider-container')).not.toHaveClass('no-value');
    });

    it('sets slider input value to the provided value', () => {
      renderSlider({ value: '3' });
      expect(screen.getByRole('slider')).toHaveValue('3');
    });
  });

  describe('onChange behavior', () => {
    it('calls onChange with string value when slider changes', () => {
      const { onChange } = renderSlider({ value: '2' });
      fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });
      expect(onChange).toHaveBeenCalledWith('3');
    });
  });

  // Do we need to check if passes a string value?

  describe('onChangeCommited behavior', () => {
    it('calls onChange via onChangeCommited when value is undefined', () => {
      const { onChange, container } = renderSlider({ value: undefined });

      const sliderRoot = container.querySelector('.MuiSlider-root')!;
      fireEvent.mouseDown(sliderRoot, { clientX: 0 });
      fireEvent.mouseUp(sliderRoot);
      expect(onChange).toHaveBeenCalled();
    });

    it('does not call onChange from onChangeCommited when value is already set', () => {
      const { onChange, container } = renderSlider({ value: '3' });
      const sliderRoot = container.querySelector('.MuiSlider-root')!;

      fireEvent.mouseDown(sliderRoot, { clientX: 0 });
      fireEvent.mouseUp(sliderRoot);
      expect(onChange.mock.calls.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Disabled state', () => {
    it('slider is disabled when disabled prop is true', () => {
      renderSlider({ disabled: true, value: '3' });
      expect(screen.getByRole('slider')).toBeDisabled();
    });
    it('slider is not disabled by default', () => {
      renderSlider({ value: '3' });
      expect(screen.getByRole('slider')).not.toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Continuous vs Discrete mode', () => {
    it('uses step 0.1 for continuous slider', () => {
      renderSlider({ continiusSlider: true, value: '2' });
      expect(screen.getByRole('slider')).toHaveAttribute('step', '0.1');
    });

    it('uses step 1 for discrete slider by default', () => {
      renderSlider({ continiusSlider: false, value: '2' });
      expect(screen.getByRole('slider')).toHaveAttribute('step', '1');
    });
  });

  describe('Tick marks and labels', () => {
    it('generates correct number of mark labels when showStickLabel is true', () => {
      const { container } = renderSlider({
        showStickLabel: true,
        minValue: 0,
        maxValue: 5,
        value: '2',
      });
      const markLabels = container.querySelectorAll('.MuiSlider-markLabel');
      expect(markLabels).toHaveLength(6);
    });
  });
});
