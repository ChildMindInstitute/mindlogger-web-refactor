import { useEffect, useState } from 'react';

import { MultiInformantState } from '~/abstract/lib/types/multiInformant';
import { useActivityByIdQuery } from '~/entities/activity';
import { useAppletByIdQuery } from '~/entities/applet';
import { useSubjectQuery } from '~/entities/subject';
import { useUserState } from '~/entities/user/model/hooks';
import { useWorkspaceRolesQuery } from '~/entities/workspace';
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
  targetSubjectId,
  sourceSubjectId,
  startActivityOrFlow,
  respondentId,
}: TakeNowParams): TakeNowValidatedState => {
  const [workspaceId, setWorkspaceId] = useState<string | null>();

  const {
    isError: isTargetSubjectError,
    data: targetSubjectData,
    error: targetSubjectError,
    isLoading: isLoadingTargetSubject,
  } = useSubjectQuery(targetSubjectId);

  const {
    isError: isSourceSubjectError,
    data: sourceSubjectData,
    error: sourceSubjectError,
    isLoading: isLoadingSourceSubject,
  } = useSubjectQuery(sourceSubjectId);

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
  } = useWorkspaceRolesQuery(workspaceId ?? '', {
    appletIds: [appletId],
    options: { enabled: !!workspaceId },
  });

  useEffect(() => {
    if (!workspaceId && !isLoadingApplet && appletData) {
      const localWorkspaceId = appletData?.data.result.encryption?.accountId;
      setWorkspaceId(localWorkspaceId || null);
    }
  }, [appletData, isLoadingApplet, workspaceId]);

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

  if (isLoadingTargetSubject || isLoadingSourceSubject || isLoadingActivity) {
    return loadingState;
  }

  const subjectPermissionError =
    (isTargetSubjectError &&
      targetSubjectError &&
      'status' in targetSubjectError.response &&
      targetSubjectError.response.status === 403) ||
    (isSourceSubjectError &&
      sourceSubjectError &&
      'status' in sourceSubjectError.response &&
      sourceSubjectError.response.status === 403);

  if (subjectPermissionError) {
    // The logged-in user doesn't have permission to fetch the subject details,
    // so they probably don't have permission to perform the activity
    return errorState(t('takeNow.invalidRespondent'));
  }

  if (
    isTargetSubjectError ||
    !targetSubjectData?.data?.result ||
    targetSubjectData.data.result.appletId !== appletId ||
    isSourceSubjectError ||
    !sourceSubjectData?.data?.result ||
    sourceSubjectData.data.result.appletId !== appletId
  ) {
    return errorState(t('takeNow.invalidSubject'));
  }

  const { nickname: targetSubjectNickname, secretUserId: targetSecretUserId } =
    targetSubjectData.data.result;

  const { nickname: sourceSubjectNickname, secretUserId: sourceSecretUserId } =
    sourceSubjectData.data.result;

  if (isActivityError) {
    return errorState(t('takeNow.invalidActivity'));
  }

  // At this point we have the subject, applet, and activity data
  // We can't fetch the workspace roles before we have the applet data
  // because that's where we get the workspace ID

  if (workspaceId === undefined || isLoadingWorkspaceRoles) {
    return loadingState;
  }

  if (workspaceId === null) {
    return errorState(t('common_loading_error'));
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

  return {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      sourceSubject: {
        id: sourceSubjectId,
        nickname: sourceSubjectNickname,
        secretId: sourceSecretUserId,
      },
      targetSubject: {
        id: targetSubjectId,
        nickname: targetSubjectNickname,
        secretId: targetSecretUserId,
      },
    },
  };
};
