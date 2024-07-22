import { useMemo } from 'react';

import { RegularCheckboxOption } from './RegularCheckboxOption';
import { CheckboxItem } from '../../../lib/types/item';

import { Box } from '~/shared/ui';
import { splitList, useCustomMediaQuery } from '~/shared/utils';

type Props = {
  options: CheckboxItem['responseValues']['options'];
  itemId: string;
  values: string[];

  onValueChange: (value: string, isNoneAbove: boolean) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const RegularGrid = ({
  values,
  onValueChange,
  isDisabled,
  replaceText,
  options,
  itemId,
}: Props) => {
  const { lessThanSM } = useCustomMediaQuery();

  const [evenColumn, oddColumn] = useMemo(() => {
    return splitList(options);
  }, [options]);

  return (
    <Box display="flex" flex={1} gap="16px" flexDirection={lessThanSM ? 'column' : 'row'}>
      <Box display="flex" flex={1} gap="16px" flexDirection="column">
        {evenColumn.map((option) => {
          const isChecked = values.includes(String(option.value));
          const isNoneAbove = option.isNoneAbove;

          return (
            <RegularCheckboxOption
              key={option.id}
              id={option.id}
              name={itemId}
              value={option.value}
              label={option.text}
              onChange={(value: string) => onValueChange(value, isNoneAbove)}
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

      <Box display="flex" flex={1} gap="16px" flexDirection="column">
        {oddColumn.map((option) => {
          const isChecked = values.includes(String(option.value));
          const isNoneAbove = option.isNoneAbove;

          return (
            <RegularCheckboxOption
              key={option.id}
              id={option.id}
              name={itemId}
              value={option.value}
              label={option.text}
              onChange={(value: string) => onValueChange(value, isNoneAbove)}
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
    </Box>
  );
};
