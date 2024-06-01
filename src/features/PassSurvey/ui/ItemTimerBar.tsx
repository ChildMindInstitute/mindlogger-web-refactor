import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { convertSecondsToMinSec } from '~/shared/utils';

type Props = {
  totalDuration: number; // seconds
  currentTime: number; // seconds
  progress: number; // percentage
};

export const ItemTimerBar = ({ currentTime, progress, totalDuration }: Props) => {
  const getProgressBarShift = (progress: number) => {
    return progress - 100;
  };

  const FIVE_SECONDS = 5;
  const lessThan5Seconds = currentTime && currentTime < FIVE_SECONDS;

  const isPassedMoreThan = (timeMS: number) => {
    return currentTime && currentTime < totalDuration - timeMS;
  };

  return (
    <Box width="100%" position="absolute" top={1} left={0} overflow="hidden">
      <Box
        bgcolor={lessThan5Seconds ? Theme.colors.light.error : Theme.colors.light.primary}
        height="2px"
        width="100%"
        sx={{
          transform: `translateX(${getProgressBarShift(progress)}%)`,
          transitionDuration: '1s',
          transitionTimingFunction: 'linear',
          animation: lessThan5Seconds ? 'blinking 1s infinite' : 'none',
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
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color={lessThan5Seconds ? Theme.colors.light.error : Theme.colors.light.outline}
            sx={{
              textAlign: 'center',
              transform: isPassedMoreThan(5600) ? 'translateX(40px)' : 'none',
              transition: '0.5s',
              cursor: 'default',

              animation: lessThan5Seconds ? 'blinking 1s infinite' : 'none',
              '@keyframes blinking': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.1 },
                '100%': { opacity: 1 },
              },
            }}
          >
            {`${convertSecondsToMinSec(currentTime)} remaining `}
            <Box
              component="span"
              sx={{
                opacity: isPassedMoreThan(5000) ? '0' : '1',
                transition: '0.6s',
              }}
            >
              for this item
            </Box>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
