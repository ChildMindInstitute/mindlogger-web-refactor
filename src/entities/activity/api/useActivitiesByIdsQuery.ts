import { useQueries } from '@tanstack/react-query';

import { ActivityApiProxyService } from '~/shared/api';

type Props = {
  ids: Array<string>;
  isPublic: boolean;
  enabled?: boolean;
};

export const useActivitiesByIdsQuery = ({ ids, enabled, isPublic }: Props) => {
  return useQueries({
    queries: ids.map((activityId) => {
      return {
        queryKey: ['activity', activityId],
        queryFn: () => ActivityApiProxyService.getActivityById(activityId, { isPublic }),
        enabled,
      };
    }),
  });
};
