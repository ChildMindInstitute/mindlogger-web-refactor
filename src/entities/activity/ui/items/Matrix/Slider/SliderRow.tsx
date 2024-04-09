import Box from '@mui/material/Box';

import { Theme } from '~/shared/constants';
import { SliderItemBase, Text } from '~/shared/ui';

type Props = {
  label: string;

  value: number;
  minValue: number;
  maxValue: number;

  minLabel: string | null;
  minImage: string | null;

  maxLabel: string | null;
  maxImage: string | null;

  isEven: boolean;

  onChange: (value: string) => void;
};

export const SliderRow = ({
  label,
  value,
  minImage,
  minLabel,
  minValue,
  maxImage,
  maxLabel,
  maxValue,
  onChange,
  isEven,
}: Props) => {
  return (
    <Box bgcolor={isEven ? Theme.colors.light.surface3 : undefined} padding="50px">
      <Text
        variant="body1"
        fontSize="20px"
        fontWeight="400"
        padding="0px 0px 50px 0px" // Bottom padding
        sx={{ textAlign: 'center' }}
      >
        {label}
      </Text>

      <SliderItemBase
        value={String(value)}
        minValue={minValue}
        minLabel={minLabel}
        minImage={minImage}
        maxValue={maxValue}
        maxLabel={maxLabel}
        maxImage={maxImage}
        onChange={onChange}
        showStickLabel={true}
        showStickMarks={true}
      />
    </Box>
  );
};
