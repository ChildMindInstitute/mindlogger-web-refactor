import { variables } from '~/shared/constants/theme/variables';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { convertMillisecondsToMinSec, useCustomTranslation } from '~/shared/utils';

type Props = {
  duration: number; // seconds
  time: number; // seconds
  progress: number; // percentage
};

export const ItemTimerBar = ({ time, progress, duration }: Props) => {
  const { t } = useCustomTranslation();
  const getProgressBarShift = (progress: number) => {
    return progress - 100;
  };

  const timeMS = time * 1000;
  const durationMS = duration * 1000;

  const TEN_SECONDS = 10000;
  const lessThan10Seconds = timeMS < TEN_SECONDS;

  const isPassedMoreThan = (value: number) => {
    return timeMS < durationMS - value;
  };

  return (
    <Box
      width="100%"
      position="absolute"
      top={1}
      left={0}
      overflow="hidden"
      data-testid="activity-item-timer"
    >
      <Box
        bgcolor={lessThan10Seconds ? variables.palette.error : variables.palette.primary}
        height="2px"
        width="100%"
        sx={{
          transform: `translateX(${getProgressBarShift(progress)}%)`,
          transitionDuration: '1s',
          transitionTimingFunction: 'linear',
          animation: lessThan10Seconds ? 'blinking 1s infinite' : 'none',
          '@keyframes blinking': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.1 },
            '100%': { opacity: 1 },
          },
        }}
      />
      <Box width="100%" display="flex" justifyContent="center">
        <Box overflow="hidden">
          <Text
            variant="bodyMedium"
            color={lessThan10Seconds ? variables.palette.error : variables.palette.outline}
            sx={{
              textAlign: 'center',
              transform: isPassedMoreThan(5600) ? 'translateX(40px)' : 'none',
              transition: '0.5s',
              cursor: 'default',

              animation: lessThan10Seconds ? 'blinking 1s infinite' : 'none',
              '@keyframes blinking': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.1 },
                '100%': { opacity: 1 },
              },
            }}
          >
            {t('timeRemaining', { time: convertMillisecondsToMinSec(timeMS) })}
            <Box
              component="span"
              sx={{
                opacity: isPassedMoreThan(5000) ? '0' : '1',
                transition: '0.6s',
              }}
            >
              {` ${t('forItem')}`}
            </Box>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
