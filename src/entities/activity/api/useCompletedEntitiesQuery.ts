import { useSelector } from 'react-redux';

import { userIdSelector } from '~/entities/user/model/selectors';
import { QueryOptions, ReturnAwaited, activityService, useBaseQuery } from '~/shared/api';

type FetchFn = typeof activityService.getCompletedEntities;
type Options<TData> = QueryOptions<FetchFn, TData>;

type Params = {
  appletId: string;
  version: string;
  fromDate: string;
};

export const useCompletedEntitiesQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  const userId = useSelector(userIdSelector);

  const key: [string, Record<string, unknown>] = [
    'completedEntities',
    { userId: userId ?? '', ...params },
  ];

  return useBaseQuery(key, () => activityService.getCompletedEntities(params), {
    ...options,
    enabled: !!userId && (options?.enabled ?? true),
  });
};
