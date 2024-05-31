/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';

import { MultiInformantState } from '~/abstract/lib/types/multiInformant';
import { useValidateMultiInformantAssessmentQuery } from '~/entities/answer';
import { useAppletByIdQuery } from '~/entities/applet';
import { useSubjectQuery } from '~/entities/subject';
import { useUserState } from '~/entities/user/model/hooks';
import { useWorkspaceAppletRespondent } from '~/entities/workspace';
import { TakeNowParams } from '~/features/TakeNow/lib/TakeNowParams.types';
import { useCustomTranslation } from '~/shared/utils';

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
    isError: isValidationError,
    error: validationError,
    data: validationData,
    isLoading: isLoadingValidation,
  } = useValidateMultiInformantAssessmentQuery(appletId, {
    sourceSubjectId,
    targetSubjectId,
    activityOrFlowId: startActivityOrFlow,
  });

  const {
    isError: isSourceSubjectError,
    data: sourceSubjectData,
    error: sourceSubjectError,
    isLoading: isLoadingSourceSubject,
  } = useSubjectQuery(sourceSubjectId);

  const {
    isError: isTargetSubjectError,
    data: targetSubjectData,
    error: targetSubjectError,
    isLoading: isLoadingTargetSubject,
  } = useSubjectQuery(targetSubjectId);

  const {
    isError: isRespondentError,
    data: respondentData,
    isLoading: isLoadingRespondent,
  } = useWorkspaceAppletRespondent(workspaceId ?? '', appletId, respondentId, {
    enabled: !!workspaceId,
  });

  const {
    isError: isAppletError,
    data: appletData,
    isLoading: isLoadingApplet,
  } = useAppletByIdQuery({ isPublic: false, appletId });

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

  if (isLoadingValidation) {
    return loadingState;
  }

  if (isValidationError && validationError) {
    if (validationError.response?.status === 403) {
      return errorState(t('takeNow.invalidRespondent'));
    } else if (validationError.response?.status === 404) {
      // Invalid applet ID
      return errorState(null);
    } else if (validationError.response?.status === 422) {
      const axiosError = validationError as AxiosError<any, any>;
      const param = axiosError.response?.data?.result?.[0]?.path?.[1] as string | undefined;

      if (!param) return errorState(null);

      switch (param) {
        case 'activityOrFlowId':
          return errorState(t('takeNow.invalidActivity'));
        case 'sourceSubjectId':
        case 'targetSubjectId':
          return errorState(t('takeNow.invalidSubject'));
      }
    }
  }

  if (validationData?.data?.result && validationData?.data?.result.code) {
    switch (validationData.data.result.code) {
      case 'invalid_activity_or_flow_id':
        return errorState(t('takeNow.invalidActivity'));
      case 'invalid_source_subject':
      case 'invalid_target_subject':
        return errorState(t('takeNow.invalidSubject'));
      case 'no_access_to_applet':
        return errorState(t('takeNow.invalidRespondent'));
      default:
        return errorState(null);
    }
  }

  if (isLoadingApplet) {
    return loadingState;
  }

  if (isAppletError || !appletData?.data?.result) {
    return errorState(null);
  }

  if (isLoadingTargetSubject || isLoadingSourceSubject) {
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

  // At this point we have the subject, applet, and activity data
  // We can't fetch the workspace roles before we have the applet data
  // because that's where we get the workspace ID

  if (workspaceId === undefined) {
    return loadingState;
  }

  if (workspaceId === null) {
    return errorState(t('common_loading_error'));
  }

  if (isLoadingRespondent) {
    return loadingState;
  }

  if (isRespondentError || !respondentData || !respondentData?.data?.result) {
    // If we're unable to fetch the subject ID for the current user, we can't start the multi-informant flow
    // eslint-disable-next-line no-console
    console.error('Unable to fetch subject ID for current user');
    return errorState(null);
  }

  const {
    subjectId: currentUserSubjectId,
    nickname: currentUserSubjectNickname,
    secretUserId: currentUserSecretUserId,
  } = respondentData.data.result;

  return {
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: {
      currentUserSubject: {
        id: currentUserSubjectId,
        nickname: currentUserSubjectNickname,
        secretId: currentUserSecretUserId,
      },
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
