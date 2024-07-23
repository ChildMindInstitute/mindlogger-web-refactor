import { ParagraphTextItem as ParagraphItemType } from '../../lib';

import { TextItem as BaseTextItem } from '~/shared/ui';

type TextItemProps = {
  item: ParagraphItemType;
  value: string;
  onValueChange: (value: string[]) => void;
  isDisabled: boolean;
};

export const ParagraphTextItem = ({ item, value, onValueChange, isDisabled }: TextItemProps) => {
  const { maxResponseLength } = item.config;

  const onHandleValueChange = (value: string) => {
    if (value.length > maxResponseLength) {
      return;
    }

    if (value.length === 0) {
      return onValueChange([]);
    }

    return onValueChange([value]);
  };

  return (
    <BaseTextItem
      value={value}
      onValueChange={onHandleValueChange}
      disabled={isDisabled}
      isLarge={true}
    />
  );
};
