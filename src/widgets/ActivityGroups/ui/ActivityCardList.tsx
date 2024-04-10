import { ActivityCard } from './ActivityCard';

import { ActivityListItem } from '~/abstract/lib/GroupBuilder';
import { Box } from '~/shared/ui';

type Props = {
  activities: ActivityListItem[];
};

export const ActivityCardList = ({ activities }: Props) => {
  return (
    <Box display="flex" flex={1} flexDirection="column">
      {activities.map((activity) => {
        return <ActivityCard key={activity.eventId} activityListItem={activity} />;
      })}
    </Box>
  );
};
