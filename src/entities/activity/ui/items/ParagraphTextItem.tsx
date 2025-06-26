import { useState } from 'react';

import { ParagraphTextItem as ParagraphItemType } from '../../lib';

import { variables } from '~/shared/constants/theme/variables';
import { TextItem as BaseTextItem, Box } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

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
  const [hasError, setHasError] = useState(numCharacters > maxResponseLength);
  const { t } = useCustomTranslation();

  const onHandleValueChange = (value: string) => {
    setHasError(value.length > maxResponseLength);

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
        hasError={hasError}
      />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        fontSize="small"
        color={hasError ? variables.palette.error : variables.palette.outline}
        mr={2}
      >
        {`${t('charactersCount', { numCharacters, maxCharacters: maxResponseLength })}`}
      </Box>
    </Box>
  );
};
