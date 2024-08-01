import { QueryOptions, ReturnAwaited, subjectService, useBaseQuery } from '~/shared/api';

type FetchFn = typeof subjectService.getMySubjectByAppletId;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useGetMySubjectQuery = <TData = ReturnAwaited<FetchFn>>(
  appletId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['mySubject', { appletId }],
    () => subjectService.getMySubjectByAppletId({ appletId }),
    options,
  );
};
