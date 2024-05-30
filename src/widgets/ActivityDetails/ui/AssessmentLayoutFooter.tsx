import { PropsWithChildren } from 'react';

import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';

type Props = PropsWithChildren<{
  timerTime?: number;
  timerProgress?: number;
}>;

export const AssessmentLayoutFooter = ({ children, timerTime, timerProgress }: Props) => {
  const getProgressBarShift = (progress: number) => {
    return progress - 100;
  };

  return (
    <Box
      sx={{
        borderTop: `1px solid ${Theme.colors.light.surfaceVariant}`,
      }}
      position="relative"
      padding="23px 0px"
    >
      {timerTime && timerProgress && (
        <Box
          position="absolute"
          top={1}
          left={0}
          width="100%"
          height="2px"
          bgcolor={Theme.colors.light.primary}
          sx={{
            transform: `translateX(${getProgressBarShift(timerProgress)}%)`,
            transitionDuration: '1s',
            transitionTimingFunction: 'linear',
          }}
        ></Box>
      )}
      {children}
    </Box>
  );
};
