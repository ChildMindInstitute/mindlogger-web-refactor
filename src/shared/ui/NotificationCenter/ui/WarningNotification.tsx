import { forwardRef } from 'react';

import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';
import { Markdown } from '~/shared/ui';

type Props = {
  id: string;
  message: string;
  duration: number;
};

export const WarningNotification = forwardRef((props: Props, ref) => {
  return (
    <Box
      ref={ref}
      id={`warning-notification-${props.id}`}
      display="flex"
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="12px 16px"
      gap="12px"
      minHeight="72px"
      bgcolor={Theme.colors.light.accentYellow30AnalogueWithoutOpacity}
    >
      <ErrorRoundedIcon sx={{ color: Theme.colors.light.accentYellow }} />
      <Markdown markdown={props.message} />
    </Box>
  );
});

WarningNotification.displayName = 'WarningNotification';
