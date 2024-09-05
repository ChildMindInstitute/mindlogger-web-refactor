import { ActivityLabelTypography } from './ActivityLabelTypography';

import { Theme } from '~/shared/constants';
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
        backgroundColor: Theme.colors.light.primary95,
      }}
    >
      <ActivityLabelTypography
        text={t('questionCount', { count: props.activityLength })}
        color={Theme.colors.light.onPrimaryContainer}
      />
    </Box>
  );
};
