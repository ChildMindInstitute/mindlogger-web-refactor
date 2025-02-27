import { ProlificService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof ProlificService.prolificUserExists;
type Options<TData> = QueryOptions<FetchFn, TData>;

type Params = {
  prolificPid: string;
  studyId: string;
};

export const useProlificUserExistsQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['prolificUserExists', params],
    () => ProlificService.prolificUserExists(params.prolificPid, params.studyId),
    options,
  );
};
