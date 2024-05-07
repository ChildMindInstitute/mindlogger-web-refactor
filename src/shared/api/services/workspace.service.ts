import { axiosService } from '~/shared/api';
import {
  GetWorkspaceAppletRespondentPayload,
  GetWorkspaceAppletRespondentSuccessResponse,
  GetWorkspaceRoles,
  GetWorkspaceRolesSuccessResponse,
} from '~/shared/api/types/workspace';

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

    getWorkspaceAppletRespondent(payload: GetWorkspaceAppletRespondentPayload) {
      return axiosService.get<GetWorkspaceAppletRespondentSuccessResponse>(
        `/workspaces/${payload.workspaceId}/applets/${payload.appletId}/respondents/${payload.respondentId}`,
      );
    },
  };
}

export default workspaceService();
