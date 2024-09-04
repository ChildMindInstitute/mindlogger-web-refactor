import { PropsWithChildren } from 'react';

import { useXScaledDimension } from './hooks';

import Box from '~/shared/ui/Box';

export const Body = ({ children }: PropsWithChildren) => {
  const gap = useXScaledDimension(32);

  return (
    <Box display="flex" flexDirection="column" gap={`${gap}px`}>
      {children}
    </Box>
  );
};
