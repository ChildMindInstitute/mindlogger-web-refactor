import Box from '@mui/material/Box';

import { ActivityLabelTypography } from './ActivityLabelTypography';

import { Theme } from '~/shared/constants';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  activityLength: number;
};

export const ActivityAvailableLabel = (props: Props) => {
  const { t } = useCustomTranslation();

  const isActivitiesMoreThanOne = props.activityLength > 1;

  const activityLabel = isActivitiesMoreThanOne
    ? t('question_count_plural', { length: props.activityLength })
    : t('question_count_singular', { length: props.activityLength });

  return (
    <Box
      data-testid="activity-available-label"
      sx={{
        padding: '4px 8px',
        borderRadius: '8px',
        backgroundColor: Theme.colors.light.primary95,
      }}
    >
      <ActivityLabelTypography text={activityLabel} color={Theme.colors.light.onPrimaryContainer} />
    </Box>
  );
};
