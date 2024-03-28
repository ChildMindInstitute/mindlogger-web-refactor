import { useMemo } from 'react';

import { StackedItemsGrid } from './StackedItemsGrid';
import { MatrixMultiSelectAnswer, MultiSelectionRowsItem } from '../../../lib';

type Props = {
  item: MultiSelectionRowsItem;
  values: MatrixMultiSelectAnswer;

  onValueChange: (value: MatrixMultiSelectAnswer) => void;
  replaceText: (value: string) => string;
};

export const MatrixCheckboxItem = ({ item, values, onValueChange, replaceText }: Props) => {
  const { options, rows } = item.responseValues;

  const memoizedOptions = useMemo(() => {
    return options.map((el) => ({
      ...el,
      tooltip: el.tooltip ? replaceText(el.tooltip) : null,
    }));
  }, [options, replaceText]);

  const memoizedRows = useMemo(() => {
    return rows.map((el) => ({
      ...el,
      tooltip: el.tooltip ? replaceText(el.tooltip) : null,
    }));
  }, [replaceText, rows]);

  const memoizedValues = useMemo(() => {
    const initialAnswer = memoizedRows.map(() => memoizedOptions.map(() => null));

    return values.length ? values : initialAnswer;
  }, [memoizedOptions, memoizedRows, values]);

  const handleValueChange = (rowIndex: number, optionIndex: number, value: string) => {
    const newValues = memoizedValues.map((row, i) => {
      if (i === rowIndex) {
        return row.map((option, j) => {
          if (j === optionIndex) {
            if (typeof option === 'string') {
              return null;
            } else {
              return value;
            }
          }

          return option;
        });
      }

      return row;
    });

    onValueChange(newValues);
  };

  return (
    <StackedItemsGrid
      options={memoizedOptions}
      rows={memoizedRows}
      onChange={handleValueChange}
      values={memoizedValues}
    />
  );
};
