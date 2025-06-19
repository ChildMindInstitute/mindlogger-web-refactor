import { ActivityLabelTypography } from './ActivityLabelTypography';

import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  activityLength: number;
  countOfCompletedQuestions: number;
};

export const ActivityInProgressLabel = (props: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box
      data-testid="activity-in-progress-label"
      sx={{
        padding: '4px 8px',
        borderRadius: '8px',
        backgroundColor: variables.palette.yellowAlpha30,
      }}
    >
      <ActivityLabelTypography
        text={t('countOfCompletedQuestions', {
          count: props.activityLength,
          countOfCompletedQuestions: props.countOfCompletedQuestions,
        })}
        color={variables.palette.onSurface}
      />
    </Box>
  );
};
