import { QueryOptions, ReturnAwaited, subjectService, useBaseQuery } from '~/shared/api';

type FetchFn = typeof subjectService.getSubjectById;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useSubjectQuery = <TData = ReturnAwaited<FetchFn>>(
  subjectId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['subjectDetails', { subjectId }],
    () => subjectService.getSubjectById({ subjectId }),
    options,
  );
};
