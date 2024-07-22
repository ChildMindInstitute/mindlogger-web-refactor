import RadioGroup from '@mui/material/RadioGroup';

import { PortraitRadioOption } from './PortraitRadioOption';
import { RadioItem } from '../../../lib';

import Box from '~/shared/ui/Box';

type Props = {
  options: RadioItem['responseValues']['options'];
  itemId: string;
  value: string;

  onValueChange: (value: string) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const PortraitGrid = (props: Props) => {
  const { itemId, options, onValueChange, isDisabled, replaceText, value } = props;

  return (
    <RadioGroup name={`${itemId}-radio portait-mode`}>
      <Box display="flex" flex="1" gap="16px" justifyContent="flex-start" flexWrap="wrap">
        {options.map((option) => (
          <PortraitRadioOption
            key={option.id}
            id={option.id}
            name={itemId}
            value={option.value}
            label={option.text}
            onChange={onValueChange}
            description={option.tooltip}
            image={option.image}
            disabled={isDisabled}
            defaultChecked={String(option.value) === value}
            color={option.color}
            replaceText={replaceText}
          />
        ))}
      </Box>
    </RadioGroup>
  );
};
