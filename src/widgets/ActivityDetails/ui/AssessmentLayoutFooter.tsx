import { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';

import { Theme } from '~/shared/constants';

type Props = PropsWithChildren<unknown>;

export const AssessmentLayoutFooter = ({ children }: Props) => {
  return (
    <Box sx={{ borderTop: `1px solid ${Theme.colors.light.surfaceVariant}` }} padding="23px 0px">
      {children}
    </Box>
  );
};
