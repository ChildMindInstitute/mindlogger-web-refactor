import { Avatar } from '@mui/material';

import ErrorIcon from '~/assets/banner-error.svg';
import InfoIcon from '~/assets/banner-info.svg';
import SuccessIcon from '~/assets/banner-success.svg';
import WarningIcon from '~/assets/banner-warning.svg';

const getIcon = (icon: string) => <Avatar src={icon} sx={{ width: '32px', height: '32px' }} />;

export const BANNER_ICONS = {
  info: getIcon(InfoIcon),
  success: getIcon(SuccessIcon),
  warning: getIcon(WarningIcon),
  error: getIcon(ErrorIcon),
};
