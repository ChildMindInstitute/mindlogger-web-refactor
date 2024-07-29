import { ParagraphTextItem as ParagraphItemType } from '../../lib';

import { TextItem as BaseTextItem, Box } from '~/shared/ui';

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
  const numCharacters = value?.length || 0;

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
    <Box>
      <BaseTextItem
        value={value}
        onValueChange={onHandleValueChange}
        disabled={isDisabled}
        isMultiline={true}
        maxCharacters={maxResponseLength}
      />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        fontSize="small"
        color="#72777F"
        mr={2}
      >{`${numCharacters}/${maxResponseLength} characters`}</Box>
    </Box>
  );
};
