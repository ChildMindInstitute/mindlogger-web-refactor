import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { Theme } from '../../constants';

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
            backgroundColor: Theme.colors.light.surfaceVariant,
          },
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: Theme.colors.light.primary,
          },
        }}
      />
    </Box>
  );
};
