import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ActivityPipelineType, GroupProgress } from '~/abstract/lib';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  activityLength: number;
  groupInProgress: GroupProgress | null;
};

export const ActivityMetaData = ({ groupInProgress, activityLength }: Props) => {
  const { t } = useCustomTranslation();

  const isFlow = groupInProgress?.type === ActivityPipelineType.Flow;

  const isActivitiesMoreThanOne = activityLength > 1;

  const activityLengthLabel = isActivitiesMoreThanOne
    ? t('question_count_plural', { length: activityLength })
    : t('question_count_singular', { length: activityLength });

  if (!isFlow) {
    return <>{activityLengthLabel}</>;
  }

  return (
    <Box data-testid="flow-welcome-screen-metadata">
      <Typography variant="body1" component="span" data-testid="metadata-activity-serial-number">{`Activity ${
        groupInProgress.pipelineActivityOrder + 1
      } `}</Typography>
      &bull;
      <Typography
        variant="body1"
        component="span"
        data-testid="metadata-activity-length"
      >{` ${activityLengthLabel}`}</Typography>
    </Box>
  );
};
