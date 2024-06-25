import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Loader from '~/shared/ui/Loader';
import Text from '~/shared/ui/Text';

type Props = {
  isNotStarted: boolean;
  isCompleted: boolean;
  isInProgress: boolean;
  activityName: string;
  currentActivityIndex: number;
  activitiesCount: number;
};

export const ProgressBar = ({
  currentActivityIndex,
  activitiesCount,
  activityName,
  isInProgress,
}: Props) => {
  return (
    <Box
      display="flex"
      borderRadius="12px"
      padding="16px 8px"
      marginTop="16px"
      bgcolor={Theme.colors.light.primary012}
    >
      <Box flex={1}>
        <Loader />
      </Box>
      <Box flex={3}>
        <Text variant="body1">{`Activity ${currentActivityIndex} of ${activitiesCount}`}</Text>
        <Text variant="h5">{activityName}</Text>
      </Box>
    </Box>
  );
};
