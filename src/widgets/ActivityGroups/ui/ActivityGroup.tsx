import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ActivityCardList } from './ActivityCardList';

import { ActivityListGroup } from '~/abstract/lib/GroupBuilder';
import { Theme } from '~/shared/constants';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  group: ActivityListGroup;
};

export const ActivityGroup = ({ group }: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box data-testid={`${group.name}-block`}>
      <Typography
        variant="h3"
        color={Theme.colors.light.onSurface}
        sx={{
          marginTop: '24px',
          marginBottom: '16px',
          fontFamily: 'Atkinson',
          fontSize: '22px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '28px',
        }}>
        {t(group.name)}
      </Typography>

      <ActivityCardList activities={group.activities} />
    </Box>
  );
};
