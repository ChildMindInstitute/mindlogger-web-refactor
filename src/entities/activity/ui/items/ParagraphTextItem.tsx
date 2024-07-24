import { ParagraphTextItem as ParagraphItemType } from '../../lib';

import { TextItem as BaseTextItem } from '~/shared/ui';

type ParagraphItemProps = {
  item: ParagraphItemType;
  value: string;
  onValueChange: (value: string[]) => void;
  isDisabled: boolean;
};

export const ParagraphTextItem = ({
  item,
  value,
  onValueChange,
  isDisabled,
}: ParagraphItemProps) => {
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
      multiline={true}
    />
  );
};
