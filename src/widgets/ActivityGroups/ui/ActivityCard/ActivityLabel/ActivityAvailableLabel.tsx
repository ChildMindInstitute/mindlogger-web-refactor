import { ActivityLabelTypography } from './ActivityLabelTypography';

import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  activityLength: number;
};

export const ActivityAvailableLabel = (props: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box
      data-testid="activity-available-label"
      sx={{
        padding: '4px 8px',
        borderRadius: '8px',
        backgroundColor: variables.palette.primary95,
      }}
    >
      <ActivityLabelTypography
        text={t('questionCount', { count: props.activityLength })}
        color={variables.palette.onPrimaryContainer}
      />
    </Box>
  );
};
