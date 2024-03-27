import { useMemo } from 'react';

import { StackedItemsGrid } from './StackedItemsGrid';
import { MultiSelectionRowsItem } from '../../../lib';

type Props = {
  item: MultiSelectionRowsItem;
  values: string[];

  onValueChange: (value: string[]) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const MatrixCheckboxItem = ({
  item,
  values,
  onValueChange,
  replaceText,
  isDisabled,
}: Props) => {
  const { options, rows } = item.responseValues;

  const optionLength = options.length;

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

  console.log(optionLength);

  return <StackedItemsGrid options={memoizedOptions} rows={memoizedRows} />;
};
