import { OneUpHealthService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof OneUpHealthService.retrieveTokenBySubmitId;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useOneUpHealthTokenQuery = <TData = ReturnAwaited<FetchFn>>(
  { appletId, submitId, activityId }: { appletId: string; submitId?: string; activityId?: string },
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['oneUpHealthToken', { appletId, submitId, activityId }],
    () =>
      OneUpHealthService.retrieveTokenBySubmitId({
        appletId,
        submitId: submitId as string,
        activityId: activityId as string,
      }),
    {
      retry: false,
      enabled: !!submitId && !!activityId,
      ...options,
    },
  );
};
