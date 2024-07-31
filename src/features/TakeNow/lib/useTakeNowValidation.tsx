import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';

import { useValidateMultiInformantAssessmentQuery } from '~/entities/answer';
import { useAppletByIdQuery } from '~/entities/applet';
import { useSubjectQuery } from '~/entities/subject';
import { useGetMySubjectQuery } from '~/entities/subject/api/useGetMySubjectQuery';
import { useUserState } from '~/entities/user/model/hooks';
import {
  TakeNowParams,
  TakeNowValidatedState,
  TakeNowValidationError,
} from '~/features/TakeNow/lib/types';
import { useCustomTranslation } from '~/shared/utils';

export const useTakeNowValidation = ({
  appletId,
  targetSubjectId,
  sourceSubjectId,
  startActivityOrFlow,
  respondentId,
  multiInformantAssessmentId,
}: TakeNowParams): TakeNowValidatedState => {
  const [fetchSourceSubject, setFetchSourceSubject] = useState<boolean>();
  const [fetchTargetSubject, setFetchTargetSubject] = useState<boolean>();

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
    isError: isMySubjectError,
    data: mySubjectData,
    isLoading: isLoadingMySubject,
  } = useGetMySubjectQuery(appletId);

  const {
    data: sourceSubjectData,
    error: sourceSubjectError,
    isFetching: isLoadingSourceSubject,
  } = useSubjectQuery(sourceSubjectId, {
    enabled: fetchSourceSubject === true,
  });

  const {
    data: targetSubjectData,
    error: targetSubjectError,
    isFetching: isLoadingTargetSubject,
  } = useSubjectQuery(targetSubjectId, {
    enabled: fetchTargetSubject === true,
  });

  const {
    isError: isAppletError,
    data: appletData,
    isLoading: isLoadingApplet,
  } = useAppletByIdQuery({ isPublic: false, appletId });

  useEffect(() => {
    if (mySubjectData?.data?.result) {
      const { id: currentUserSubjectId } = mySubjectData.data.result;

      setFetchSourceSubject(currentUserSubjectId !== sourceSubjectId);

      setFetchTargetSubject(
        currentUserSubjectId !== targetSubjectId && sourceSubjectId !== targetSubjectId,
      );
    }
  }, [mySubjectData, sourceSubjectId, targetSubjectId]);

  const { t } = useCustomTranslation();
  const { user } = useUserState();

  const loadingState: TakeNowValidatedState = {
    isLoading: true,
    isError: false,
    isSuccess: false,
  };

  const errorState = (error: TakeNowValidationError | null): TakeNowValidatedState => ({
    isLoading: false,
    isError: true,
    isSuccess: false,
    error,
  });

  if (respondentId !== user.id) {
    return errorState({
      type: 'mismatchedRespondent',
      error: t('takeNow.mismatchedRespondent'),
    });
  }

  if (isLoadingValidation) {
    return loadingState;
  }

  if (isValidationError && validationError) {
    if (validationError.response?.status === 403) {
      return errorState({
        type: 'invalidRespondent',
        error: t('takeNow.invalidRespondent'),
      });
    } else if (validationError.response?.status === 404) {
      return errorState({
        type: 'invalidApplet',
        error: t('takeNow.invalidApplet'),
      });
    } else if (validationError.response?.status === 422) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const axiosError = validationError as AxiosError<any, any>;
      const param = axiosError.response?.data?.result?.[0]?.path?.[1] as string | undefined;

      if (!param) return errorState(null);

      switch (param) {
        case 'activityOrFlowId':
          return errorState({
            type: 'invalidActivity',
            error: t('takeNow.invalidActivity'),
          });
        case 'sourceSubjectId':
        case 'targetSubjectId':
          return errorState({
            type: 'invalidSubject',
            error: t('takeNow.invalidSubject'),
          });
      }
    }
  }

  if (validationData?.data?.result && validationData?.data?.result.code) {
    switch (validationData.data.result.code) {
      case 'invalid_activity_or_flow_id':
        return errorState({
          type: 'invalidActivity',
          error: t('takeNow.invalidActivity'),
        });
      case 'invalid_source_subject':
      case 'invalid_target_subject':
        return errorState({
          type: 'invalidSubject',
          error: t('takeNow.invalidSubject'),
        });
      case 'no_access_to_applet':
        return errorState({
          type: 'invalidRespondent',
          error: t('takeNow.invalidRespondent'),
        });
      default:
        return errorState(null);
    }
  }

  if (isLoadingApplet) {
    return loadingState;
  }

  if (isAppletError || !appletData?.data?.result) {
    return errorState({
      type: 'invalidApplet',
      error: t('takeNow.invalidApplet'),
    });
  }

  if (isLoadingMySubject) {
    return loadingState;
  }

  if (isMySubjectError || !mySubjectData || !mySubjectData?.data?.result) {
    // If we're unable to fetch the subject ID for the current user, we can't start the multi-informant flow
    // eslint-disable-next-line no-console
    console.error('Unable to fetch subject ID for current user');
    return errorState(null);
  }

  const {
    id: currentUserSubjectId,
    nickname: currentUserSubjectNickname,
    secretUserId: currentUserSecretUserId,
  } = mySubjectData.data.result;

  if (
    fetchSourceSubject === undefined ||
    isLoadingSourceSubject ||
    fetchTargetSubject === undefined ||
    isLoadingTargetSubject
  ) {
    return loadingState;
  }

  let sourceSubjectNickname: string | null;
  let targetSubjectNickname: string | null;
  let sourceSecretUserId: string;
  let targetSecretUserId: string;

  if (!fetchSourceSubject) {
    sourceSubjectNickname = currentUserSubjectNickname;
    sourceSecretUserId = currentUserSecretUserId;
  } else if (
    sourceSubjectError &&
    'status' in sourceSubjectError.response &&
    sourceSubjectError.response.status === 403
  ) {
    return errorState({
      type: 'invalidRespondent',
      error: t('takeNow.invalidRespondent'),
    });
  } else if (
    !sourceSubjectData?.data?.result ||
    sourceSubjectData.data.result.appletId !== appletId
  ) {
    return errorState({
      type: 'invalidSubject',
      error: t('takeNow.invalidSubject'),
    });
  } else {
    sourceSubjectNickname = sourceSubjectData.data.result.nickname;
    sourceSecretUserId = sourceSubjectData.data.result.secretUserId;
  }

  if (!fetchTargetSubject) {
    if (currentUserSubjectId === targetSubjectId) {
      targetSubjectNickname = currentUserSubjectNickname;
      targetSecretUserId = currentUserSecretUserId;
    } else {
      targetSubjectNickname = sourceSubjectNickname;
      targetSecretUserId = sourceSecretUserId;
    }
  } else if (
    targetSubjectError &&
    'status' in targetSubjectError.response &&
    targetSubjectError.response.status === 403
  ) {
    return errorState({
      type: 'invalidRespondent',
      error: t('takeNow.invalidRespondent'),
    });
  } else if (
    !targetSubjectData?.data?.result ||
    targetSubjectData.data.result.appletId !== appletId
  ) {
    return errorState({
      type: 'invalidSubject',
      error: t('takeNow.invalidSubject'),
    });
  } else {
    targetSubjectNickname = targetSubjectData.data.result.nickname;
    targetSecretUserId = targetSubjectData.data.result.secretUserId;
  }

  // Finally, determine if this is an activity or activity flow for analytics.
  const { activities, activityFlows } = appletData.data.result;
  const activityId = activities.some(({ id }) => id === startActivityOrFlow)
    ? startActivityOrFlow
    : null;

  let activityFlowId: string | null = null;
  if (!activityId) {
    activityFlowId = activityFlows.some(({ id }) => id === startActivityOrFlow)
      ? startActivityOrFlow
      : null;
  }

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
      appletId,
      activityId,
      activityFlowId,
      multiInformantAssessmentId,
      submitId: null,
    },
  };
};
