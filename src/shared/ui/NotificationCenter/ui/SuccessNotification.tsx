import { forwardRef } from 'react';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { Theme } from '~/shared/constants';
import { Markdown } from '~/shared/ui';
import Box from '~/shared/ui/Box';

type Props = {
  id: string;
  message: string;
  duration: number;
};

export const SuccessNotification = forwardRef((props: Props, ref) => {
  return (
    <Box
      ref={ref}
      id={`success-notification-${props.id}`}
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding="12px 16px"
      gap="12px"
      minHeight="72px"
      bgcolor={Theme.colors.light.accentGreen30}
    >
      <CheckCircleRoundedIcon sx={{ color: Theme.colors.light.accentGreen }} />
      <Markdown markdown={props.message} />
    </Box>
  );
});

SuccessNotification.displayName = 'SuccessNotification';
