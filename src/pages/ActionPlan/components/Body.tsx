import React, { PropsWithChildren } from 'react';

import { View } from '@react-pdf/renderer';

import { useXScaledDimension } from '~/pages/ActionPlan/hooks';

export function Body({ children }: PropsWithChildren) {
  const gap = useXScaledDimension(32);
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
      }}
    >
      {children}
    </View>
  );
}
