import { useState } from 'react';

import { MultiInformantState } from '~/abstract/lib/types/multiInformant';
import { useActivityByIdQuery } from '~/entities/activity';
import { useAppletByIdQuery } from '~/entities/applet';
import { useSubjectQuery } from '~/entities/subject';
import { useUserState } from '~/entities/user/model/hooks';
import { useWorkspaceAppletRespondent, useWorkspaceRolesQuery } from '~/entities/workspace';
import { TakeNowParams } from '~/features/TakeNow/lib/TakeNowParams.types';
import { WorkspaceRole } from '~/shared/api/types/workspace';
import { useCustomTranslation } from '~/shared/utils';

const TAKE_NOW_ROLES: WorkspaceRole[] = ['super_admin', 'owner', 'manager'];

type TakeNowValidatedState = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: string | null;
  data?: Required<MultiInformantState>;
};

export const useTakeNowValidation = ({
  appletId,
  subjectId: targetSubjectId,
  startActivityOrFlow,
  respondentId,
}: TakeNowParams): TakeNowValidatedState => {
  const [workspaceId, setWorkspaceId] = useState<string>('');

  const {
    isError: isSubjectError,
    data: subjectData,
    error: subjectError,
    isLoading: isLoadingSubject,
  } = useSubjectQuery(targetSubjectId);

  const {
    isError: isAppletError,
    data: appletData,
    isLoading: isLoadingApplet,
  } = useAppletByIdQuery({ isPublic: false, appletId });

  const { isError: isActivityError, isLoading: isLoadingActivity } = useActivityByIdQuery({
    isPublic: false,
    activityId: startActivityOrFlow,
  });

  const {
    isError: isWorkspaceRolesError,
    data: workspaceRolesData,
    isLoading: isLoadingWorkspaceRoles,
  } = useWorkspaceRolesQuery(workspaceId, {
    appletIds: [appletId],
  });

  const {
    isError: isRespondentError,
    data: respondentData,
    isLoading: isLoadingRespondent,
  } = useWorkspaceAppletRespondent(workspaceId, appletId, respondentId);

  const { t } = useCustomTranslation();
  const { user } = useUserState();

  const loadingState: TakeNowValidatedState = {
    isLoading: true,
    isError: false,
    isSuccess: false,
  };

  const errorState = (error: string | null): TakeNowValidatedState => ({
    isLoading: false,
    isError: true,
    isSuccess: false,
    error,
  });

  if (respondentId !== user.id) {
    return errorState(t('takeNow.invalidRespondent'));
  }

  if (isLoadingApplet) {
    return loadingState;
  }

  if (isAppletError || !appletData?.data?.result) {
    return errorState(null);
  }

  if (isLoadingSubject || isLoadingActivity) {
    return loadingState;
  }

  if (
    isSubjectError &&
    subjectError &&
    'status' in subjectError.response &&
    subjectError.response.status === 403
  ) {
    // The logged-in user doesn't have permission to fetch the subject details,
    // so they probably don't have permission to perform the activity
    return errorState(t('takeNow.invalidRespondent'));
  }

  if (
    isSubjectError ||
    !subjectData?.data?.result ||
    subjectData.data.result.appletId !== appletId
  ) {
    return errorState(t('takeNow.invalidSubject'));
  }

  if (isActivityError) {
    return errorState(t('takeNow.invalidActivity'));
  }

  // At this point we have the subject, applet, and activity data
  // We can't fetch the workspace roles before we have the applet data
  // because that's where we get the workspace ID

  if (!workspaceId) {
    const localWorkspaceId = appletData.data.result.encryption?.accountId;
    if (!localWorkspaceId) {
      // We can't verify the roles of the current user in this workspace,
      // so we can't proceed with a multi-informant flow
      return errorState(t('common_loading_error'));
    }

    setWorkspaceId(localWorkspaceId);
    return loadingState;
  }

  if (isLoadingWorkspaceRoles || isLoadingRespondent) {
    return loadingState;
  }

  if (isWorkspaceRolesError || !workspaceRolesData?.data?.result) {
    // Same as above - we can't verify the roles of the current user in this workspace,
    // so we can't proceed with a multi-informant flow
    return errorState(t('common_loading_error'));
  }

  const roles = workspaceRolesData.data.result[appletId];
  const hasCorrectRole = TAKE_NOW_ROLES.some((role) => roles.includes(role));

  if (!hasCorrectRole) {
    return errorState(t('takeNow.invalidRespondent'));
  }

  if (isRespondentError || !respondentData || !respondentData?.data?.result) {
    // If we're unable to fetch the subject ID for the current user, we can't start the multi-informant flow
    // eslint-disable-next-line no-console
    console.error('Unable to fetch subject ID for current user');
    return errorState(null);
  }

  const { subjectId: sourceSubjectId } = respondentData.data.result;

  return {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      sourceSubjectId,
      targetSubjectId,
    },
  };
};
