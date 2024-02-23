import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Theme } from '~/shared/constants';

type Props = {
  description: string;
  isFlow: boolean;
};

export const ActivityCardDescription = ({ description, isFlow }: Props) => {
  return (
    <Box data-testid={isFlow ? 'flow-card-description' : 'activity-card-description'}>
      <Typography
        variant="body1"
        color={Theme.colors.light.onSurface}
        sx={{
          fontSize: '16px',
          fontFamily: 'Atkinson',
          fontWeight: 400,
          fontStyle: 'normal',
          lineHeight: '24px',
          letterSpacing: '0.15px',
          textAlign: 'left',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
