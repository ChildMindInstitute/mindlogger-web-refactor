import { QueryOptions, ReturnAwaited, activityService, useBaseQuery } from '~/shared/api';

type FetchFn = typeof activityService.getById;
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
    () =>
      params.isPublic
        ? activityService.getPublicById(params.activityId)
        : activityService.getById(params.activityId),
    options,
  );
};
