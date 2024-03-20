import { useMemo } from 'react';

import Slider from '@mui/material/Slider';

import { Theme } from '~/shared/constants';

import './style.css';

type Props = {
  minImage: string | null;
  minLabel: string | null;
  minValue: number;

  maxImage: string | null;
  maxLabel: string | null;
  maxValue: number;

  value?: string;

  disabled?: boolean;
  continiusSlider?: boolean;
  showStickLabel?: boolean;
  showStickMarks?: boolean;

  onChange: (value: string) => void;
};

export const SliderItemBase = (props: Props) => {
  const {
    minLabel,
    minImage,
    minValue,
    maxLabel,
    maxImage,
    maxValue,
    value,
    onChange,
    disabled,
    continiusSlider,
    showStickLabel,
    showStickMarks,
  } = props;

  const defaultStep = 1;

  const marksAndLabelsList = useMemo(() => {
    const stickLabels = [];

    for (let i = minValue; i <= maxValue; i++) {
      stickLabels.push({ value: i, label: i });
    }

    return stickLabels;
  }, [maxValue, minValue]);

  return (
    <div className={`slider-widget ${value ? 'no-value' : ''}`}>
      <Slider
        size="medium"
        min={minValue}
        max={maxValue}
        value={Number(value) ?? minValue}
        disabled={disabled}
        marks={showStickLabel ? marksAndLabelsList : true} // The settings behavior: If boolean, marks will be evenly spaced based on the value of step. If an array, it should contain objects with value and an optional label keys.
        step={continiusSlider ? 0.1 : defaultStep}
        onChange={(e, value) => onChange(String(value))}
        sx={{
          height: '8px',
          opacity: 1,
          color: Theme.colors.light.surfaceVariant,
          '& .MuiSlider-thumb': {
            backgroundColor: Theme.colors.light.primary,
            width: '24px',
            height: '24px',
          },
          '& .MuiSlider-rail': {
            width: '102%',
            left: '-1%',
            opacity: 1,
          },
          '& .MuiSlider-track': {
            opacity: 1,
            color: Theme.colors.light.primary,
            left: '-1% !important',
          },
          '& .MuiSlider-mark': {
            width: '4px',
            height: '4px',
            color: Theme.colors.light.outline,
            borderRadius: '50%',
            opacity: showStickMarks ? 1 : 0,
          },
          '& .MuiSlider-markLabel': {
            opacity: showStickLabel ? 1 : 0,
          },
        }}
      />

      <div className="slider-description">
        <div className="first" style={{ maxWidth: `100px` }}>
          {minImage && <img src={minImage} width="100%"></img>}

          {minLabel && <div className="label">{minLabel}</div>}
        </div>
        <div className="last" style={{ maxWidth: `100px` }}>
          {maxImage && <img src={maxImage} width="100%"></img>}

          {maxLabel && <div className="label">{maxLabel}</div>}
        </div>
      </div>
    </div>
  );
};
