import { useMemo } from 'react';

import { PortraitGrid } from './PortraitGrid';
import { RegularGrid } from './RegularGrid';
import { CheckboxItem as CheckboxItemType } from '../../../lib/types/item';

import { randomizeArray } from '~/shared/utils';

type Props = {
  item: CheckboxItemType;
  values: string[];

  onValueChange: (value: string[]) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const CheckboxItem = ({ item, values, onValueChange, isDisabled, replaceText }: Props) => {
  const isPortraitMode = item.config.portraitLayout;

  const options = useMemo(() => {
    if (item.config.randomizeOptions) {
      return randomizeArray(item.responseValues.options).filter((x) => !x.isHidden);
    }

    return item.responseValues.options.filter((x) => !x.isHidden);
  }, [item?.config?.randomizeOptions, item?.responseValues?.options]);

  const noneAboveOptionChecked = options.some(
    (x) => x.isNoneAbove && values.includes(String(x.value)),
  );

  const onHandleValueChange = (value: string, isNoneAbove: boolean) => {
    const preparedValues = [...values];

    const changedValueIndex = preparedValues.findIndex((x) => x === value);
    const isChangedIndexExist = changedValueIndex !== -1;

    if (isChangedIndexExist) {
      preparedValues.splice(changedValueIndex, 1);
    }

    if (noneAboveOptionChecked) {
      return onValueChange([...value]);
    }

    if (!isChangedIndexExist && !isNoneAbove) {
      preparedValues.push(value);
    }

    if (!isChangedIndexExist && isNoneAbove) {
      preparedValues.splice(0, preparedValues.length);
      preparedValues.push(value);
    }

    onValueChange(preparedValues);
  };

  if (isPortraitMode) {
    return (
      <PortraitGrid
        options={options}
        itemId={item.id}
        onValueChange={onHandleValueChange}
        replaceText={replaceText}
        isDisabled={isDisabled}
        values={values}
      />
    );
  }

  return (
    <RegularGrid
      options={options}
      onValueChange={onHandleValueChange}
      itemId={item.id}
      replaceText={replaceText}
      isDisabled={isDisabled}
      values={values}
    />
  );
};
