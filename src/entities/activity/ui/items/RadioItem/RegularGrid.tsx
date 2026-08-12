import RadioGroup from '@mui/material/RadioGroup';

import { RegularRadioOption } from './RegularRadioOption';
import { RadioItem } from '../../../lib';

import { Box } from '~/shared/ui';

type Props = {
  options: RadioItem['responseValues']['options'];
  itemId: string;
  value: string | null;

  onValueChange: (value: string) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const RegularGrid = ({
  itemId,
  value,
  onValueChange,
  isDisabled,
  replaceText,
  options,
}: Props) => {
  return (
    <RadioGroup name={`${itemId}-radio regular-mode`}>
      <Box display="flex" flex={1} gap="16px" flexDirection="column">
        {options.map((option) => {
          return (
            <RegularRadioOption
              key={option.id}
              id={option.id}
              name={itemId}
              value={option.value}
              label={option.text}
              onChange={() => onValueChange(String(option.value))}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={String(option.value) === value}
              color={option.color}
              replaceText={replaceText}
            />
          );
        })}
      </Box>
    </RadioGroup>
  );
};
