import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

import { ActivityLabelTypography } from './ActivityLabelTypography';

import DocumentsIcon from '~/assets/documents-icon.svg';
import { Theme } from '~/shared/constants';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  activityFlowLength: number;
  countOfCompletedActivities: number;
};

export const ActivityFlowInProgressLabel = (props: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box
      display="flex"
      alignItems="center"
      gap="8px"
      data-testid="flow-in-progress-label"
      sx={{
        padding: '4px 8px',
        borderRadius: '8px',
        backgroundColor: Theme.colors.light.accentYellow30,
      }}>
      <Avatar src={DocumentsIcon} sx={{ width: '18px', height: '18px' }} />
      <ActivityLabelTypography
        text={t('countOfCompletedActivities', {
          length: props.activityFlowLength,
          countOfCompletedActivities: props.countOfCompletedActivities,
        })}
        color={Theme.colors.light.onSurface}
      />
    </Box>
  );
};
