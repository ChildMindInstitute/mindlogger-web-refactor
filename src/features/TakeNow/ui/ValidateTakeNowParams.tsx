import { useState } from 'react';

import { useActivityByIdQuery } from '~/entities/activity';
import { useAppletByIdQuery } from '~/entities/applet';
import { useSubjectQuery } from '~/entities/subject';
import { useUserState } from '~/entities/user/model/hooks';
import { useWorkspaceRolesQuery } from '~/entities/workspace';
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

const TAKE_NOW_ROLES: WorkspaceRole[] = ['super_admin', 'owner', 'manager', 'coordinator'];

function ValidateTakeNowParams({
  appletId,
  subjectId,
  startActivityOrFlow,
  respondentId,
}: ValidateTakeNowParamsProps) {
  const { isError: isSubjectError, isLoading: isLoadingSubject } = useSubjectQuery(subjectId);

  const {
    isError: isAppletError,
    data: appletData,
    isLoading: isLoadingApplet,
  } = useAppletByIdQuery({ isPublic: false, appletId });

  const { isError: isActivityError, isLoading: isLoadingActivity } = useActivityByIdQuery({
    isPublic: false,
    activityId: startActivityOrFlow,
  });

  const [workspaceId, setWorkspaceId] = useState<string>('');

  const {
    isError: isWorkspaceRolesError,
    data: workspaceRolesData,
    isLoading: isLoadingWorkspaceRoles,
  } = useWorkspaceRolesQuery(workspaceId, {
    appletIds: [appletId],
  });

  const { showErrorNotification } = useNotification();
  const { t } = useCustomTranslation();
  const { user } = useUserState();

  const ActivityList = () => <ActivityGroups isPublic={false} appletId={appletId} />;

  if (respondentId !== user.id) {
    setTimeout(() => showErrorNotification(t('takeNow.invalidRespondent')));
    return <ActivityList />;
  }

  if (isLoadingSubject || isLoadingActivity) {
    return <Loader />;
  }

  if (isSubjectError) {
    setTimeout(() => showErrorNotification(t('takeNow.invalidSubject')));
    return <ActivityList />;
  }

  if (isActivityError) {
    setTimeout(() => showErrorNotification(t('takeNow.invalidActivity')));
    return <ActivityList />;
  }

  if (isLoadingApplet) {
    return <Loader />;
  }

  if (isAppletError || !appletData?.data?.result) {
    setTimeout(() => showErrorNotification(t('takeNow.invalidApplet')));
    return <ActivityList />;
  }

  if (!workspaceId) {
    const localWorkspaceId = appletData?.data?.result?.encryption?.accountId;
    if (!localWorkspaceId) {
      setTimeout(() => showErrorNotification(t('common_loading_error')));
      return <ActivityList />;
    } else {
      setWorkspaceId(localWorkspaceId);
    }
  } else {
    if (isLoadingWorkspaceRoles) {
      return <Loader />;
    }

    if (isWorkspaceRolesError || !workspaceRolesData?.data?.result) {
      setTimeout(() => showErrorNotification(t('common_loading_error')));
      return <ActivityList />;
    }

    const roles = workspaceRolesData.data.result[appletId];
    const hasCorrectRole = TAKE_NOW_ROLES.some((role) => roles.includes(role));

    if (!hasCorrectRole) {
      setTimeout(() => showErrorNotification(t('takeNow.invalidRespondent')));
      return <ActivityList />;
    }
  }

  // TODO: Get the subject ID of the current logged in user

  // TODO: Create something in redux to indicate that we're in a MI context

  return (
    <ActivityGroups
      isPublic={false}
      appletId={appletId}
      startActivityOrFlow={startActivityOrFlow}
    />
  );
}

export default ValidateTakeNowParams;
