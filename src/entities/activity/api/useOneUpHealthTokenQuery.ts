import { OneUpHealthService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof OneUpHealthService.retrieveTokenBySubmitId;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useOneUpHealthTokenQuery = <TData = ReturnAwaited<FetchFn>>(
  { appletId, submitId }: { appletId: string; submitId?: string },
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['oneUpHealthToken', { appletId, submitId }],
    () =>
      OneUpHealthService.retrieveTokenBySubmitId({
        appletId,
        submitId: submitId as string,
      }),
    {
      retry: 1,
      enabled: !!submitId,
      ...options,
    },
  );
};
