import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';

interface BaseProgressBarProps {
  percentage: number;
  hasInitialPercentage?: boolean;
  height?: string;
  testid?: string;
}

export const BaseProgressBar = ({
  percentage,
  hasInitialPercentage = true,
  height = '16px',
  testid,
}: BaseProgressBarProps) => {
  const initialPercentage = hasInitialPercentage ? 3 : 0;

  const progress = percentage > initialPercentage ? percentage : initialPercentage;

  return (
    <Box data-testid={testid}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height,
          borderRadius: '100px',
          [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: variables.palette.surfaceVariant,
          },
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: variables.palette.green,
          },
        }}
      />
    </Box>
  );
};
