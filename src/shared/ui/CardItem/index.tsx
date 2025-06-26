import { PropsWithChildren } from 'react';

import { Box, ItemMarkdown } from '~/shared/ui';
import { useCustomMediaQuery } from '~/shared/utils';

interface CardItemProps extends PropsWithChildren {
  watermark?: string;
  isInvalid?: boolean;
  isOptional?: boolean;
  markdown?: string | null;
  testId?: string;
}

export const CardItem = ({ children, markdown, isOptional, testId }: CardItemProps) => {
  const { greaterThanSM } = useCustomMediaQuery();

  return (
    <Box
      data-testid={testId || 'active-item'}
      display="flex"
      flex={1}
      padding={greaterThanSM ? '72px 48px' : '36px 16px'}
      flexDirection="column"
      gap="48px"
    >
      <ItemMarkdown markdown={markdown ?? ''} isOptional={isOptional} />
      <Box>{children}</Box>
    </Box>
  );
};
