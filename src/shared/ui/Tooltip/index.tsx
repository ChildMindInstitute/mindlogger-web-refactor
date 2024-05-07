import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import { Markdown } from '../Markdown';

import TooltipIcon from '~/assets/tooltip-icon.svg';

type TooltipProps = {
  markdown: string;
};

export const CustomTooltip = ({ markdown }: TooltipProps) => {
  return (
    <Tooltip title={<Markdown markdown={markdown} />} data-testid="tooltip">
      <Avatar src={TooltipIcon} variant="square" sx={{ width: '24px', height: '24px' }} />
    </Tooltip>
  );
};
