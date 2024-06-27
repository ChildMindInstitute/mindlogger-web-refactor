import React from 'react';

import { Text, View } from '@react-pdf/renderer';

import { useXScaledDimension } from '~/pages/ActionPlan/hooks';
import { Theme } from '~/shared/constants';

export function Title({ children }: { children: string }) {
  const titleFontSize = useXScaledDimension(16);
  const scaledTopPadding = useXScaledDimension(24);
  const scaledRightPadding = useXScaledDimension(48);
  const scaledBottomPadding = useXScaledDimension(12);
  const scaledLeftPadding = useXScaledDimension(40);
  const letterSpacing = useXScaledDimension(0.15);

  return (
    <View
      style={{
        paddingTop: `${scaledTopPadding}px`,
        paddingBottom: `${scaledBottomPadding}px`,
        paddingRight: `${scaledRightPadding}px`,
        paddingLeft: `${scaledLeftPadding}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontSize: `${titleFontSize}px`,
          fontWeight: 700,
          lineHeight: '24px',
          letterSpacing: `${letterSpacing}px`,
          color: Theme.colors.light.onSurface,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
