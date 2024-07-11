import { Theme } from '~/shared/constants';
import { CheckCircle } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import Text from '~/shared/ui/Text';

type Props = {
  isCompleted: boolean;

  activityName: string;
  currentActivityIndex: number;
  activitiesCount: number;
};

export const ProgressBar = ({
  currentActivityIndex,
  activitiesCount,
  activityName,
  isCompleted,
}: Props) => {
  return (
    <Box display="flex">
      <Box display="flex" flex={1} justifyContent="center" alignItems="center">
        {isCompleted ? (
          <CheckCircle width="48px" height="48px" color={Theme.colors.light.accentGreen} />
        ) : (
          <Loader />
        )}
      </Box>
      <Box flex={4}>
        <Text variant="body1">{`Activity ${currentActivityIndex} of ${activitiesCount}`}</Text>
        <Text variant="h5">{activityName}</Text>
      </Box>
    </Box>
  );
};
