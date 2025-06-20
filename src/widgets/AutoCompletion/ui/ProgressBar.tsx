import { variables } from '~/shared/constants/theme/variables';
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
          <CheckCircle width="48px" height="48px" color={variables.palette.green} />
        ) : (
          <Loader />
        )}
      </Box>
      <Box flex={4}>
        <Text>{`Activity ${currentActivityIndex} of ${activitiesCount}`}</Text>
        <Text variant="titleMediumBold">{activityName}</Text>
      </Box>
    </Box>
  );
};
