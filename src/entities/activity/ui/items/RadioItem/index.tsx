import { useCallback, useMemo } from 'react';

import { PortraitGrid } from './PortraitGrid';
import { RegularGrid } from './RegularGrid';
import { RadioItem as RadioItemType } from '../../../lib';

import { randomizeArray } from '~/shared/utils';

type Props = {
  item: RadioItemType;
  value: string;

  onValueChange: (value: string[]) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const RadioItem = (props: Props) => {
  const { item, value, onValueChange, replaceText, isDisabled } = props;

  const options = useMemo(() => {
    if (item.config.randomizeOptions) {
      return randomizeArray(item.responseValues.options).filter((x) => !x.isHidden);
    }

    return item.responseValues.options.filter((x) => !x.isHidden);
  }, [item?.config?.randomizeOptions, item?.responseValues?.options]);

  const onHandleValueChange = useCallback(
    (value: string) => {
      return onValueChange([value]);
    },
    [onValueChange],
  );

  const isPortraitMode = item.config.portraitLayout;

  if (isPortraitMode) {
    return (
      <PortraitGrid
        itemId={item.id}
        value={value}
        options={options}
        onValueChange={onHandleValueChange}
        replaceText={replaceText}
        isDisabled={isDisabled}
      />
    );
  }

  return (
    <RegularGrid
      itemId={item.id}
      value={value}
      options={options}
      onValueChange={onHandleValueChange}
      replaceText={replaceText}
      isDisabled={isDisabled}
    />
  );
};
