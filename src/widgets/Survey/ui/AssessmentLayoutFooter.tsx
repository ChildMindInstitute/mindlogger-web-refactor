import { PropsWithChildren } from 'react';

import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';

type Props = PropsWithChildren<unknown>;

export const AssessmentLayoutFooter = ({ children }: Props) => {
  return (
    <Box
      sx={{
        borderTop: `1px solid ${Theme.colors.light.surfaceVariant}`,
      }}
    >
      {children}
    </Box>
  );
};
