import { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';

import { useCustomMediaQuery } from '~/shared/utils';

type Props = PropsWithChildren<{
  isRowLabel?: boolean;
}>;

export const MatrixCell = ({ children, isRowLabel }: Props) => {
  const { lessThanTarget } = useCustomMediaQuery(700);

  const rowLabelWidth = lessThanTarget ? '100px' : '254px';

  return (
    <Box
      height={lessThanTarget ? '100px' : '112px'}
      padding={lessThanTarget ? '8px' : '14px'}
      justifyContent="center"
      alignItems="center"
      width={isRowLabel ? rowLabelWidth : '100%'}
      minWidth={lessThanTarget ? '70px' : '142px'}
      maxWidth="400px"
    >
      {children}
    </Box>
  );
};
