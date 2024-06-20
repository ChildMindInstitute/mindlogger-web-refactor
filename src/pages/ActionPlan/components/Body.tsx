import React, { PropsWithChildren } from 'react';

import { useXScaledDimension } from '~/pages/ActionPlan/hooks';
import Box from '~/shared/ui/Box';

export function Body({ children }: PropsWithChildren) {
  const gap = useXScaledDimension(32);
  return (
    <Box display="flex" flexDirection="column" gap={`${gap}px`}>
      {children}
    </Box>
  );
}
