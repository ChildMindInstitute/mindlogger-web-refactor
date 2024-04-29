import { useCallback } from 'react';

import { SliderRow } from './SliderRow';
import { SliderRowsAnswer, SliderRowsItem } from '../../../../lib';

import { Box } from '~/shared/ui';

type Props = {
  item: SliderRowsItem;
  values: SliderRowsAnswer;
  onValueChange: (value: SliderRowsAnswer) => void;
};

export const SliderRows = (props: Props) => {
  const onHandleValueChange = useCallback(
    (value: string, index: number) => {
      let values = [...props.values];

      if (values.length === 0) {
        values = Array.from({ length: props.item.responseValues.rows.length }, () => null);
      }

      values[index] = Number(value);
      return props.onValueChange(values);
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
