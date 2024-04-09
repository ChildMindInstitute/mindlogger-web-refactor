import Typography from '@mui/material/Typography';

import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';

type Props = {
  title: string;
  isFlow: boolean;
};

export const ActivityCardTitle = ({ title, isFlow }: Props) => {
  return (
    <Box data-testid={isFlow ? 'flow-card-title' : 'activity-card-title'}>
      <Typography
        variant="h3"
        color={Theme.colors.light.primary}
        sx={{
          fontSize: '20px',
          fontFamily: 'Atkinson',
          fontWeight: 700,
          fontStyle: 'normal',
          lineHeight: '28px',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};
