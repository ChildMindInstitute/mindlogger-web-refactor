import Box from '@mui/material/Box';

import { BaseProgressBar } from '~/shared/ui';

type Props = {
  percentage: number;
  isFlow: boolean;
};

export const ActivityCardProgressBar = ({ percentage, isFlow }: Props) => {
  return (
    <Box
      sx={{ minWidth: '295px', maxWidth: '320px' }}
      data-testid={isFlow ? 'flow-card-progress-bar' : 'activity-card-progress-bar'}
    >
      <BaseProgressBar percentage={percentage} hasInitialPercentage={false} height="4px" />
    </Box>
  );
};
