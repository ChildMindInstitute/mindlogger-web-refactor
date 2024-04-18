import { BaseSuccessResponse } from '~/shared/api';

export interface GetWorkspaceRoles {
  workspaceId: string;
  appletIds?: string[];
}

export type WorkspaceRole =
  | 'super_admin'
  | 'owner'
  | 'manager'
  | 'coordinator'
  | 'editor'
  | 'reviewer'
  | 'respondent';

export type WorkspaceRolesDTO = {
  [appletId: string]: WorkspaceRole[];
};

export type GetWorkspaceRolesSuccessResponse = BaseSuccessResponse<WorkspaceRolesDTO>;
