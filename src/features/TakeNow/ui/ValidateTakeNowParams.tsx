import { useCallback, useRef, useState } from 'react';

import { useActivityByIdQuery } from '~/entities/activity';
import { appletModel, useAppletByIdQuery } from '~/entities/applet';
import { useSubjectQuery } from '~/entities/subject';
import { useUserState } from '~/entities/user/model/hooks';
import { useWorkspaceAppletRespondent, useWorkspaceRolesQuery } from '~/entities/workspace';
import { WorkspaceRole } from '~/shared/api/types/workspace';
import { useNotification } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { useCustomTranslation } from '~/shared/utils';
import { ActivityGroups } from '~/widgets/ActivityGroups';

type ValidateTakeNowParamsProps = {
  appletId: string;
  startActivityOrFlow: string;
  subjectId: string;
  respondentId: string;
};

const TAKE_NOW_ROLES: WorkspaceRole[] = ['super_admin', 'owner', 'manager'];

function ValidateTakeNowParams({
  appletId,
  subjectId: targetSubjectId,
  startActivityOrFlow,
  respondentId,
}: ValidateTakeNowParamsProps) {
  const [workspaceId, setWorkspaceId] = useState<string>('');

  const {
    isError: isSubjectError,
    data: subjectData,
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

  const { showErrorNotification: showError } = useNotification();
  const { t } = useCustomTranslation();
  const { user } = useUserState();
  const { initiateTakeNow, getMultiInformantState } = appletModel.hooks.useMultiInformantState();
  const errorNotificationRef = useRef<number>(0);

  const ActivityList = () => <ActivityGroups isPublic={false} appletId={appletId} />;

  const showErrorNotification = useCallback(
    (message: string) => {
      if (errorNotificationRef.current < 2) {
        showError(message, {
          allowDuplicate: false,
        });
        errorNotificationRef.current += 1;
      }
    },
    [showError, errorNotificationRef],
  );

  if (respondentId !== user.id) {
    // No impersonation allowed... yet?
    showErrorNotification(t('takeNow.invalidRespondent'));
    return <ActivityList />;
  }

  if (isLoadingApplet) {
    return <Loader />;
  }

  if (isAppletError || !appletData?.data?.result) {
    // The applet is part of the URL, so we'll let the activity list page handle this error
    return <ActivityList />;
  }

  if (isLoadingSubject || isLoadingActivity) {
    return <Loader />;
  }

  if (
    isSubjectError ||
    !subjectData?.data?.result ||
    subjectData.data.result.appletId !== appletId
  ) {
    showErrorNotification(t('takeNow.invalidSubject'));
    return <ActivityList />;
  }

  if (isActivityError) {
    showErrorNotification(t('takeNow.invalidActivity'));
    return <ActivityList />;
  }

  // At this point we have the subject, applet, and activity data
  // We can't fetch the workspace roles before we have the applet data
  // because that's where we get the workspace ID

  if (!workspaceId) {
    const localWorkspaceId = appletData.data.result.encryption?.accountId;
    if (!localWorkspaceId) {
      // We can't verify the roles of the current user in this workspace,
      // so we can't proceed with a multi-informant flow
      showErrorNotification(t('common_loading_error'));
      return <ActivityList />;
    }

    setWorkspaceId(localWorkspaceId);
    return <Loader />;
  }

  if (isLoadingWorkspaceRoles || isLoadingRespondent) {
    return <Loader />;
  }

  if (isWorkspaceRolesError || !workspaceRolesData?.data?.result) {
    // Same as above - we can't verify the roles of the current user in this workspace,
    // so we can't proceed with a multi-informant flow
    showErrorNotification(t('common_loading_error'));
    return <ActivityList />;
  }

  const roles = workspaceRolesData.data.result[appletId];
  const hasCorrectRole = TAKE_NOW_ROLES.some((role) => roles.includes(role));

  if (!hasCorrectRole) {
    showErrorNotification(t('takeNow.invalidRespondent'));
    return <ActivityList />;
  }

  if (isRespondentError || !respondentData || !respondentData?.data?.result) {
    // If we're unable to fetch the subject ID for the current user, we can't start the multi-informant flow
    // eslint-disable-next-line no-console
    console.error('Unable to fetch subject ID for current user');
    return <ActivityList />;
  }

  const { subjectId: sourceSubjectId } = respondentData.data.result;
  const multiInformantState = getMultiInformantState();

  if (
    !multiInformantState ||
    !multiInformantState.sourceSubjectId ||
    !multiInformantState.targetSubjectId
  ) {
    if (sourceSubjectId !== targetSubjectId) {
      initiateTakeNow({ sourceSubjectId, targetSubjectId });
    }
  }

  return (
    <ActivityGroups
      isPublic={false}
      appletId={appletId}
      startActivityOrFlow={startActivityOrFlow}
    />
  );
}

export default ValidateTakeNowParams;
