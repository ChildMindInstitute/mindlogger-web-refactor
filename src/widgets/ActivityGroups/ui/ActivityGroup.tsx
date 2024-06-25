import { ActivityCard } from './ActivityCard';

import { ActivityListGroup } from '~/abstract/lib/GroupBuilder';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  group: ActivityListGroup;
};

export const ActivityGroup = ({ group }: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box data-testid={`${group.name}-block`}>
      <Text
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
        }}
      >
        {t(group.name)}
      </Text>

      <Box display="flex" flex={1} flexDirection="column">
        {group.activities.map((activity) => {
          return (
            <ActivityCard
              key={activity.eventId}
              keyProp={activity.eventId}
              activityListItem={activity}
            />
          );
        })}
      </Box>
    </Box>
  );
};
