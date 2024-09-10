import { assignmentService, QueryOptions, ReturnAwaited, useBaseQuery } from '~/shared/api';

type FetchFn = typeof assignmentService.getMyAssignments;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useMyAssignmentsQuery = <TData = ReturnAwaited<FetchFn>>(
  appletId?: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['myAssignments', { appletId }],
    () => assignmentService.getMyAssignments({ appletId: String(appletId) }),
    options,
  );
};
