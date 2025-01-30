import { ProlificService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof ProlificService.getStudyCompletionCodes;
type Options<TData> = QueryOptions<FetchFn, TData>;

type Params = {
  appletId: string;
  studyId: string;
};

export const useProlificCompletionCodeQuery = <TData = ReturnAwaited<FetchFn>>(
  params: Params,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['prolificCompletionCode', params],
    () => ProlificService.getStudyCompletionCodes(params.appletId, params.studyId),
    options,
  );
};
