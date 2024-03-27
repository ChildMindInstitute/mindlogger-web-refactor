import { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';

import { AxisItem, AxisListItem } from './AxisListItem';
import { MatrixCell } from './MatrixCell';

type Props = PropsWithChildren<{
  isEven: boolean;
  item: AxisItem | null;
}>;

export const MatrixRow = ({ children, item }: Props) => {
  return (
    <Box display="flex" flex={1}>
      <MatrixCell isRowLabel={true}>
        {item && <AxisListItem maxWidth={1} axisHeaderFor="row" item={item} />}
      </MatrixCell>
      {children}
    </Box>
  );
};
