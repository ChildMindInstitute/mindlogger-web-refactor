import { useMemo } from 'react';

import RadioGroup from '@mui/material/RadioGroup';

import { RegularRadioOption } from './RegularRadioOption';
import { RadioItem } from '../../../lib';

import { Box } from '~/shared/ui';
import { splitList, useCustomMediaQuery } from '~/shared/utils';

type Props = {
  options: RadioItem['responseValues']['options'];
  itemId: string;
  value: string;

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
  const { lessThanSM } = useCustomMediaQuery();

  const [evenColumn, oddColumn] = useMemo(() => {
    return splitList(options);
  }, [options]);

  return (
    <RadioGroup name={`${itemId}-radio regular-mode`}>
      <Box display="flex" flex={1} gap="16px" flexDirection={lessThanSM ? 'column' : 'row'}>
        <Box display="flex" flex={1} gap="16px" flexDirection="column">
          {evenColumn.map((option) => {
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

        <Box display="flex" flex={1} gap="16px" flexDirection="column">
          {oddColumn.map((option) => {
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
      </Box>
    </RadioGroup>
  );
};
