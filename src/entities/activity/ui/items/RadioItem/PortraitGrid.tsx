import RadioGroup from '@mui/material/RadioGroup';

import { PortraitRadioOption } from './PortraitRadioOption';
import { RadioItem } from '../../../lib';

import Box from '~/shared/ui/Box';
import { useCustomMediaQuery } from '~/shared/utils';

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

  const { lessThanSM } = useCustomMediaQuery();

  return (
    <RadioGroup name={`${itemId}-radio portait-mode`}>
      <Box
        display="flex"
        flex="1"
        gap="16px"
        justifyContent="flex-start"
        flexWrap="wrap"
        width={lessThanSM ? '320px' : undefined}
        alignSelf={lessThanSM ? 'center' : undefined}
      >
        {options.map((option) => (
          <PortraitRadioOption
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
        ))}
      </Box>
    </RadioGroup>
  );
};
