import { QueryOptions, ReturnAwaited, useBaseQuery, workspaceService } from '~/shared/api';

type FetchFn = typeof workspaceService.getWorkspaceRoles;
type Options<TData> = QueryOptions<FetchFn, TData>;
type OptionalArgs<TData = ReturnAwaited<FetchFn>> = {
  appletIds?: string[];
  options?: Options<TData>;
};

export const useWorkspaceRolesQuery = <TData = ReturnAwaited<FetchFn>>(
  workspaceId: string,
  optionalArgs?: OptionalArgs<TData>,
) => {
  const queryKeySuffix: Record<string, unknown> = { workspaceId };
  if (optionalArgs?.appletIds) {
    queryKeySuffix.appletIds = optionalArgs.appletIds;
  }

  return useBaseQuery(
    ['workspaceRoles', queryKeySuffix],
    () => workspaceService.getWorkspaceRoles({ workspaceId }),
    optionalArgs?.options,
  );
};
