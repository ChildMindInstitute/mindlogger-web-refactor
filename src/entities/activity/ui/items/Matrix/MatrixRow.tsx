import { PropsWithChildren } from 'react';

import { AxisItem, AxisListItem } from './AxisListItem';
import { MatrixCell } from './MatrixCell';

import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';

type Props = PropsWithChildren<{
  isEven: boolean;
  item: AxisItem | null;
}>;

export const MatrixRow = ({ children, item, isEven }: Props) => {
  return (
    <Box
      display="flex"
      flex={1}
      bgcolor={isEven ? variables.palette.surface3 : undefined}
      data-testid="matrix-row-container"
    >
      <MatrixCell isRowLabel={true}>
        {item && <AxisListItem maxWidth={1} axisHeaderFor="row" item={item} />}
      </MatrixCell>
      {children}
    </Box>
  );
};
