import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  isFlow: boolean;
  activityLength: number;
  activityOrderInFlow: number | null;
};

export const ActivityMetaData = ({ activityLength, isFlow, activityOrderInFlow }: Props) => {
  const { t } = useCustomTranslation();

  const activityLengthLabel = t('questionCount', { count: activityLength });

  if (!isFlow && !activityOrderInFlow) {
    return <>{activityLengthLabel}</>;
  }

  return (
    <Box data-testid="flow-welcome-screen-metadata">
      <Text
        variant="body1"
        component="span"
        testid="metadata-activity-serial-number"
      >{`${t('activity')} ${activityOrderInFlow} `}</Text>
      &bull;
      <Text
        variant="body1"
        component="span"
        testid="metadata-activity-length"
      >{` ${activityLengthLabel}`}</Text>
    </Box>
  );
};
