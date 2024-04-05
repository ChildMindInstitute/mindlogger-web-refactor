import { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';

import { AxisItem, AxisListItem } from './AxisListItem';
import { MatrixCell } from './MatrixCell';

import { Theme } from '~/shared/constants';

type Props = PropsWithChildren<{
  isEven: boolean;
  item: AxisItem | null;
}>;

export const MatrixRow = ({ children, item, isEven }: Props) => {
  return (
    <Box
      display="flex"
      flex={1}
      bgcolor={isEven ? Theme.colors.light.surface3 : undefined}
      data-testid="matrix-row-container"
    >
      <MatrixCell isRowLabel={true}>
        {item && <AxisListItem maxWidth={1} axisHeaderFor="row" item={item} />}
      </MatrixCell>
      {children}
    </Box>
  );
};
