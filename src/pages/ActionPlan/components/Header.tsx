import React from 'react';

import { Text } from '@react-pdf/renderer';

import { useXScaledDimension } from '~/pages/ActionPlan/hooks';
import { Theme } from '~/shared/constants';

export function Header({ children }: { children: string }) {
  const headerFontSize = useXScaledDimension(20);

  return (
    <Text
      style={{
        fontSize: `${headerFontSize}px`,
        fontWeight: 400,
        lineHeight: '28px',
        color: Theme.colors.light.onSurfaceVariant,
      }}
    >
      {children}
    </Text>
  );
}
