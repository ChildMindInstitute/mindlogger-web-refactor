import { ActivityCard } from './ActivityCard';
import { EmptyState } from './EmptyState';

import { ActivityListGroup } from '~/abstract/lib/GroupBuilder';
import ChecklistIcon from '~/assets/checklist-icon.svg';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  group: ActivityListGroup;
};

export const ActivityGroup = ({ group: { name, activities } }: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box data-testid={`${name}-block`}>
      <Text
        variant="h3"
        color={Theme.colors.light.onSurface}
        sx={{
          marginBottom: '16px',
          fontFamily: 'Atkinson',
          fontSize: '22px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '28px',
        }}
      >
        {t(name)}
      </Text>

      <Box display="flex" flex={1} flexDirection="column">
        {activities.length ? (
          activities.map((activity) => {
            return (
              <ActivityCard
                key={`${activity.eventId}_${activity.targetSubject?.id}`}
                activityListItem={activity}
              />
            );
          })
        ) : (
          <EmptyState icon={ChecklistIcon} description={t('noActivities')} />
        )}
      </Box>
    </Box>
  );
};
