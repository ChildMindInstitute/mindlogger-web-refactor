import { ActivityApiProxyService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof ActivityApiProxyService.getActivityById;
type Options<TData> = QueryOptions<FetchFn, TData>;

type Params = {
  isPublic: boolean;
  activityId: string;
};

export const useActivityByIdQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['activityById', params],
    () => ActivityApiProxyService.getActivityById(params.activityId, { isPublic: params.isPublic }),
    options,
  );
};
