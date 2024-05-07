import { QueryOptions, ReturnAwaited, useBaseQuery, workspaceService } from '~/shared/api';

type FetchFn = typeof workspaceService.getWorkspaceAppletRespondent;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useWorkspaceAppletRespondent = <TData = ReturnAwaited<FetchFn>>(
  workspaceId: string,
  appletId: string,
  respondentId: string,
  options?: Options<TData>,
) => {
  return useBaseQuery(
    ['workspaceAppletRespondent', { workspaceId, appletId, respondentId }],
    () => workspaceService.getWorkspaceAppletRespondent({ workspaceId, respondentId, appletId }),
    options,
  );
};
