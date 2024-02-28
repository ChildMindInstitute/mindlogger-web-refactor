import { useMemo } from 'react';

import Box from '@mui/material/Box';
import RadioGroup from '@mui/material/RadioGroup';

import { RadioItemOption } from './RadioItemOption';
import { RadioItem as RadioItemType } from '../../../lib';

import { randomizeArray, splitList, useCustomMediaQuery } from '~/shared/utils';

type RadioItemProps = {
  item: RadioItemType;
  value: string;

  onValueChange: (value: string[]) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const RadioItem = ({
  item,
  value,
  onValueChange,
  isDisabled,
  replaceText,
}: RadioItemProps) => {
  const { lessThanSM } = useCustomMediaQuery();

  const options = useMemo(() => {
    if (item.config.randomizeOptions) {
      return randomizeArray(item.responseValues.options).filter((x) => !x.isHidden);
    }

    return item.responseValues.options.filter((x) => !x.isHidden);
  }, [item?.config?.randomizeOptions, item?.responseValues?.options]);

  const [evenColumn, oddColumn] = useMemo(() => {
    return splitList(options);
  }, [options]);

  const onHandleValueChange = (value: string) => {
    return onValueChange([value]);
  };

  return (
    <RadioGroup name={`${item.id}-radio`}>
      <Box display="flex" flex={1} gap="16px" flexDirection={lessThanSM ? 'column' : 'row'}>
        <Box display="flex" flex={1} gap="16px" flexDirection="column">
          {evenColumn.map((option) => {
            return (
              <RadioItemOption
                key={option.id}
                id={option.id}
                name={item.id}
                value={option.value}
                label={option.text}
                onChange={onHandleValueChange}
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
              <RadioItemOption
                key={option.id}
                id={option.id}
                name={item.id}
                value={option.value}
                label={option.text}
                onChange={onHandleValueChange}
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
