import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import { Theme } from '~/shared/constants';
import { useCustomMediaQuery } from '~/shared/utils';

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

  const { lessThanSM } = useCustomMediaQuery();

  const defaultStep = 1;

  const marksAndLabelsList = useMemo(() => {
    const stickLabels = [];

    for (let i = minValue; i <= maxValue; i++) {
      stickLabels.push({ value: i, label: i });
    }

    return stickLabels;
  }, [maxValue, minValue]);

  return (
    <Box width="100%" margin="auto" className={`slider-widget ${value ? 'no-value' : ''}`}>
      <Slider
        size="medium"
        min={minValue}
        max={maxValue}
        value={Number(value) ?? minValue}
        disabled={disabled}
        marks={showStickLabel ? marksAndLabelsList : true} // The settings behavior: If boolean, marks will be evenly spaced based on the value of step. If an array, it should contain objects with value and an optional label keys.
        step={continiusSlider ? 0.1 : defaultStep}
        valueLabelDisplay={continiusSlider ? 'off' : 'auto'}
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
            fontFamily: 'Atkinson',
          },
          '& .MuiSlider-valueLabel': {
            color: Theme.colors.light.onPrimary,
            fontFamily: 'Atkinson',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: '28px',
            backgroundColor: Theme.colors.light.primary,
            borderRadius: '8px',
            padding: '8px',
            '&::before': {
              backgroundColor: Theme.colors.light.primary,
            },
          },
          [`& .MuiSlider-markLabel[data-index="${value}"]`]: {
            color: Theme.colors.light.primary,
            fontWeight: 700,
          },
        }}
      />

      <Box display="flex" justifyContent="space-between">
        <Box
          position="relative"
          sx={{
            maxWidth: lessThanSM ? '44px' : '64px',
            transform: 'translateX(-50%)',
            '& > img': { borderRadius: '8px', overflow: 'hidden' },
          }}
        >
          {minImage && <img src={minImage} width="100%"></img>}

          {minLabel && (
            <Box textAlign="center" fontSize={lessThanSM ? '14px' : '18px'}>
              {minLabel}
            </Box>
          )}
        </Box>
        <Box
          position="relative"
          sx={{
            maxWidth: lessThanSM ? '44px' : '64px',
            transform: 'translateX(50%)',
            '& > img': { borderRadius: '8px', overflow: 'hidden' },
          }}
        >
          {maxImage && <img src={maxImage} width="100%"></img>}

          {maxLabel && (
            <Box textAlign="center" fontSize={lessThanSM ? '14px' : '18px'}>
              {maxLabel}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
