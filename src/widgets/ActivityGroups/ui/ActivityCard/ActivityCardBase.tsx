import { PropsWithChildren } from 'react';

import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';

type Props = PropsWithChildren<{
  isFlow: boolean;
  isLoading?: boolean;
  isDisabled: boolean;
}>;

export const ActivityCardBase = (props: Props) => {
  return (
    <Box
      data-testid={props.isFlow ? 'flow-card' : 'activity-card'}
      sx={{
        backgroundColor: variables.palette.surface,
        padding: '24px',
        marginBottom: '16px',
        border: `1px solid ${variables.palette.surfaceVariant}`,
        borderRadius: '16px',
        minWidth: '343px',
        maxWidth: '1200px',
        display: 'flex',
        minHeight: '122px',
        flex: 1,
        opacity: props.isDisabled ? 0.65 : 1,
        alignItems: 'center',
      }}
    >
      {props.children}
    </Box>
  );
};
