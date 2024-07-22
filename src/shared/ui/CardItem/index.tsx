import { PropsWithChildren } from 'react';

import { Theme } from '../../constants';
import { useCustomMediaQuery, useCustomTranslation } from '../../utils';

import { Markdown } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

interface CardItemProps extends PropsWithChildren {
  watermark?: string;
  isInvalid?: boolean;
  isOptional?: boolean;
  markdown: string;
  testId?: string;
}

export const CardItem = ({ children, markdown, isOptional, testId }: CardItemProps) => {
  const { greaterThanSM } = useCustomMediaQuery();

  const { t } = useCustomTranslation();

  return (
    <Box
      data-testid={testId || 'active-item'}
      display="flex"
      flex={1}
      padding={greaterThanSM ? '72px 48px' : '36px 16px'}
      flexDirection="column"
      gap="48px"
      sx={{ fontFamily: 'Atkinson', fontWeight: '400', fontSize: '18px', lineHeight: '28px' }}
    >
      <Box>
        <Markdown markdown={markdown} />
        {isOptional && (
          <Text
            variant="body1"
            color={Theme.colors.light.outline}
            testid="optional-item-label"
            fontWeight="400"
            fontSize="18px"
            lineHeight="28px"
          >
            {`(${t('optional')})`}
          </Text>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};
