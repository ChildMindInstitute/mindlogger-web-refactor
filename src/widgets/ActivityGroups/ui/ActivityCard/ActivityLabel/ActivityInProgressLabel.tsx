import Box from '@mui/material/Box';

import { ActivityLabelTypography } from './ActivityLabelTypography';

import { Theme } from '~/shared/constants';
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
        backgroundColor: Theme.colors.light.accentYellow30,
      }}>
      <ActivityLabelTypography
        text={t('countOfCompletedQuestions', {
          length: props.activityLength,
          countOfCompletedQuestions: props.countOfCompletedQuestions,
        })}
        color={Theme.colors.light.onSurface}
      />
    </Box>
  );
};
