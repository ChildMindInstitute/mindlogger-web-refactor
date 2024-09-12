import { useState } from 'react';

import { Box } from '@mui/material';

import { TextItem as TextItemType } from '../../lib';

import { Theme } from '~/shared/constants';
import { TextItem as BaseTextItem } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

type TextItemProps = {
  item: TextItemType;
  value: string;
  onValueChange: (value: string[]) => void;
  isDisabled: boolean;
};

export const TextItem = ({ item, value, onValueChange, isDisabled }: TextItemProps) => {
  const { maxResponseLength } = item.config;
  const [hasError, setHasError] = useState(
    maxResponseLength > 0 && value?.length > maxResponseLength,
  );

  const numCharacters = value?.length || 0;

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
        isMultiline={false}
      />
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        fontSize="small"
        color={hasError ? `${Theme.colors.light.error}` : Theme.colors.light.outline}
        mr={2}
      >
        {t('charactersCount', { numCharacters, maxCharacters: maxResponseLength })}
      </Box>
    </Box>
  );
};
