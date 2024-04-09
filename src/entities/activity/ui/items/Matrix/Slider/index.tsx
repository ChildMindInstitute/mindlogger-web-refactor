import { useCallback } from 'react';

import Box from '@mui/material/Box';

import { SliderRow } from './SliderRow';
import { SliderRowsAnswer, SliderRowsItem } from '../../../../lib';

type Props = {
  item: SliderRowsItem;
  values: SliderRowsAnswer;
  onValueChange: (value: SliderRowsAnswer) => void;
};

export const SliderRows = (props: Props) => {
  const onHandleValueChange = useCallback(
    (value: string, index: number) => {
      if (props.values.length === 0) {
        props.onValueChange(
          Array.from({ length: props.item.responseValues.rows.length }, () => null),
        );
        return;
      }

      const newValues = [...props.values];
      newValues[index] = Number(value);
      return props.onValueChange(newValues);
    },
    [props],
  );

  return (
    <Box display="flex" flexDirection="column">
      {props.item.responseValues.rows.map((row, index) => {
        const value = props.values[index];

        return (
          <SliderRow
            key={row.id}
            label={row.label}
            value={value ? value : row.minValue}
            minValue={row.minValue}
            minLabel={row.minLabel}
            minImage={row.minImage}
            maxValue={row.maxValue}
            maxLabel={row.maxLabel}
            maxImage={row.maxImage}
            onChange={(value: string) => onHandleValueChange(value, index)}
            isEven={index % 2 === 0}
          />
        );
      })}
    </Box>
  );
};
