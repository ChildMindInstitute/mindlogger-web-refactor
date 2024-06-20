import React from 'react';

import { useXScaledDimension } from '~/pages/ActionPlan/hooks';
import { Theme } from '~/shared/constants';
import Text from '~/shared/ui/Text';

export function Header({ children }: { children: string }) {
  const headerFontSize = useXScaledDimension(20);

  return (
    <Text
      fontSize={`${headerFontSize}px`}
      fontWeight="400"
      lineHeight="28px"
      color={Theme.colors.light.onSurfaceVariant}
    >
      {children}
    </Text>
  );
}
