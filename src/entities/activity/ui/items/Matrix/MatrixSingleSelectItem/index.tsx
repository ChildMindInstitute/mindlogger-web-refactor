import { useMemo } from 'react';

import { RadioGrid } from './RadioGrid';
import { SingleMultiSelectAnswer, SingleSelectionRowsItem } from '../../../../lib';

type Props = {
  item: SingleSelectionRowsItem;
  values: SingleMultiSelectAnswer;

  onValueChange: (value: SingleMultiSelectAnswer) => void;
  replaceText: (value: string) => string;
};

export const MatrixRadioItem = ({ item, values, onValueChange, replaceText }: Props) => {
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
    const initialAnswer = memoizedRows.map(() => null);

    return values.length ? values : initialAnswer;
  }, [memoizedRows, values]);

  const handleValueChange = (rowIndex: number, value: string) => {
    const newValues = memoizedValues.map((row, i) => {
      if (i === rowIndex) {
        const hasAnswer = row !== null;
        const isSameAnswer = row === value;

        if (hasAnswer && isSameAnswer) {
          return null;
        } else {
          return value;
        }
      }

      return row;
    });

    onValueChange(newValues);
  };

  return (
    <RadioGrid
      options={memoizedOptions}
      rows={memoizedRows}
      onChange={handleValueChange}
      values={memoizedValues}
    />
  );
};
