import RadioGroup from '@mui/material/RadioGroup';

import { PortraitCheckboxOption } from './PortraitCheckboxOption';
import { CheckboxItem } from '../../../lib/types';

import Box from '~/shared/ui/Box';

type Props = {
  options: CheckboxItem['responseValues']['options'];
  itemId: string;
  values: string[];

  onValueChange: (value: string, isNoneAbove: boolean) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const PortraitGrid = (props: Props) => {
  const { itemId, options, onValueChange, isDisabled, replaceText, values } = props;

  return (
    <RadioGroup name={`${itemId}-radio portait-mode`} sx={{ display: 'block' }}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, 148px)"
        gap="16px"
        justifyContent="center"
      >
        {options.map((option) => {
          const isChecked = values.includes(String(option.value));
          const isNoneAbove = option.isNoneAbove;

          return (
            <PortraitCheckboxOption
              key={option.id}
              id={option.id}
              name={itemId}
              value={option.value}
              label={option.text}
              onChange={() => onValueChange(String(option.value), isNoneAbove)}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={isChecked}
              color={option.color}
              replaceText={replaceText}
            />
          );
        })}
      </Box>
    </RadioGroup>
  );
};
