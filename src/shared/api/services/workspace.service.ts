import { axiosService } from '~/shared/api';
import { GetWorkspaceRoles, GetWorkspaceRolesSuccessResponse } from '~/shared/api/types/workspace';

function workspaceService() {
  return {
    getWorkspaceRoles(payload: GetWorkspaceRoles) {
      return axiosService.get<GetWorkspaceRolesSuccessResponse>(
        `/workspaces/${payload.workspaceId}/roles`,
        {
          params: payload.appletIds
            ? {
                appletIds: payload.appletIds,
              }
            : undefined,
        },
      );
    },
  };
}

export default workspaceService();
