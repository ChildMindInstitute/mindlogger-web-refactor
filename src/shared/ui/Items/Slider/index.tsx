import { useMemo } from 'react';

import Slider from '@mui/material/Slider';

import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';
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

  const selectedValueIndex = marksAndLabelsList.findIndex((item) => item.value === Number(value));

  return (
    <Box
      width="100%"
      margin="auto"
      className={`slider-widget ${value ? 'no-value' : ''}`}
      data-testid="slider-container"
    >
      <Slider
        size="medium"
        min={minValue}
        max={maxValue}
        value={value ? Number(value) : minValue}
        disabled={disabled}
        marks={showStickLabel ? marksAndLabelsList : true} // The settings behavior: If boolean, marks will be evenly spaced based on the value of step. If an array, it should contain objects with value and an optional label keys.
        step={continiusSlider ? 0.1 : defaultStep}
        valueLabelDisplay={continiusSlider ? 'off' : 'auto'}
        onChange={(e, value) => onChange(String(value))}
        sx={{
          height: '8px',
          opacity: 1,
          color: variables.palette.surfaceVariant,
          '& .MuiSlider-thumb': {
            backgroundColor: variables.palette.primary,
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
            color: variables.palette.primary,
            left: '-1% !important',
          },
          '& .MuiSlider-mark': {
            width: '4px',
            height: '4px',
            color: variables.palette.outline,
            borderRadius: '50%',
            opacity: showStickMarks ? 1 : 0,
          },
          '& .MuiSlider-markLabel': {
            opacity: showStickLabel ? 1 : 0,
          },
          '& .MuiSlider-valueLabel': {
            color: variables.palette.onPrimary,
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: '28px',
            backgroundColor: variables.palette.primary,
            borderRadius: '8px',
            padding: '8px',
            '&::before': {
              backgroundColor: variables.palette.primary,
            },
          },
          [`& .MuiSlider-markLabel[data-index="${selectedValueIndex}"]`]: {
            color: variables.palette.primary,
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
          {minImage && <img src={minImage} width="100%" data-testid="slider-min-image"></img>}

          {minLabel && (
            <Box
              textAlign="center"
              fontSize={lessThanSM ? '14px' : '18px'}
              data-testid="slider-min-label"
            >
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
          {maxImage && <img src={maxImage} width="100%" data-testid="slider-max-image"></img>}

          {maxLabel && (
            <Box
              textAlign="center"
              fontSize={lessThanSM ? '14px' : '18px'}
              data-testid="slider-max-label"
            >
              {maxLabel}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
