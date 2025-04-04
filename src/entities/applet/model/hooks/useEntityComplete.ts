import { useCallback } from 'react';

import { t } from 'i18next';
import type { NavigateOptions } from 'react-router/dist/lib/context';

import { useProlific } from './useProlific';

import { ActivityPipelineType } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { useProlificCompletionCodeQuery } from '~/entities/applet/api/integrations/useProlificCompletionCodeQuery';
import { prolificParamsSelector } from '~/entities/applet/model/selectors';
import { useBanners } from '~/entities/banner/model';
import { ActivityFlowDTO } from '~/shared/api';
import ROUTES from '~/shared/constants/routes';
import { useAppSelector, useCustomNavigation } from '~/shared/utils';

type CompletionType = 'regular' | 'autoCompletion';

type Props = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;

  flowId: string | null;
  publicAppletKey: string | null;

  appletId: string;
  flow: ActivityFlowDTO | null;
};

type CompleteOptions = {
  type: CompletionType;
};

export const useEntityComplete = (props: Props) => {
  const navigator = useCustomNavigation();

  const { isInMultiInformantFlow } = appletModel.hooks.useMultiInformantState();

  const { removeActivityProgress } = appletModel.hooks.useActivityProgress();

  const { entityCompleted, flowUpdated, getGroupProgress } =
    appletModel.hooks.useGroupProgressStateManager();

  const prolificParams = useAppSelector(prolificParamsSelector);
  const { isError: isCompletionCodesReponseError, refetch: fetchCompletionCodes } =
    useProlificCompletionCodeQuery(
      {
        appletId: props.appletId,
        studyId: prolificParams?.studyId ?? '',
      },
      {
        enabled: false,
      },
    );

  const { addErrorBanner } = useBanners();

  const { clearProlificParams } = useProlific();

  const completeEntityAndRedirect = useCallback(
    async (completionType: CompletionType) => {
      entityCompleted({
        entityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
        targetSubjectId: props.targetSubjectId,
      });

      const isAutoCompletion = completionType === 'autoCompletion';

      if (isAutoCompletion) {
        return;
      }

      if (prolificParams && props.publicAppletKey) {
        removeActivityProgress({
          activityId: props.activityId,
          eventId: props.eventId,
          targetSubjectId: props.targetSubjectId,
        });

        const { data: completionCodesReponse } = await fetchCompletionCodes();
        if (!isCompletionCodesReponseError && completionCodesReponse) {
          clearProlificParams(); // Resetting redux state after completion

          const { completionCodes } = completionCodesReponse.data;
          for (const code of completionCodes) {
            if (code.codeType === 'COMPLETED') {
              return window.location.replace(
                `https://app.prolific.com/submissions/complete?cc=${code.code}`,
              );
            }
          }
        }

        addErrorBanner({ children: t('prolific.nocode'), duration: null });
        return navigator.navigate(
          ROUTES.publicJoin.navigateTo(props.publicAppletKey, prolificParams),
          {
            replace: true,
          },
        );
      }

      if (props.publicAppletKey) {
        return navigator.navigate(ROUTES.publicJoin.navigateTo(props.publicAppletKey), {
          replace: true,
        });
      }

      const navigateOptions: NavigateOptions = {
        replace: true,
      };

      if (isInMultiInformantFlow()) {
        navigateOptions.state = { showTakeNowSuccessModal: true };
      }

      return navigator.navigate(ROUTES.appletDetails.navigateTo(props.appletId), navigateOptions);
    },
    [
      entityCompleted,
      isInMultiInformantFlow,
      navigator,
      prolificParams,
      fetchCompletionCodes,
      isCompletionCodesReponseError,
      clearProlificParams,
      addErrorBanner,
      removeActivityProgress,
      props.activityId,
      props.appletId,
      props.eventId,
      props.flowId,
      props.publicAppletKey,
      props.targetSubjectId,
    ],
  );

  const redirectToNextActivity = useCallback(
    (activityId: string) => {
      if (props.publicAppletKey) {
        return navigator.navigate(
          ROUTES.publicSurvey.navigateTo({
            appletId: props.appletId,
            activityId,
            eventId: props.eventId,
            entityType: 'flow',
            publicAppletKey: props.publicAppletKey,
            flowId: props.flowId,
          }),
          { replace: true },
        );
      }

      return navigator.navigate(
        ROUTES.survey.navigateTo({
          appletId: props.appletId,
          activityId,
          eventId: props.eventId,
          targetSubjectId: props.targetSubjectId,
          entityType: 'flow',
          flowId: props.flowId,
        }),
        { replace: true },
      );
    },
    [
      navigator,
      props.appletId,
      props.eventId,
      props.flowId,
      props.publicAppletKey,
      props.targetSubjectId,
    ],
  );

  const completeFlow = useCallback(
    (input?: CompleteOptions) => {
      const isAutoCompletion = input?.type === 'autoCompletion';

      const groupProgress = getGroupProgress({
        entityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
        targetSubjectId: props.targetSubjectId,
      });

      if (!groupProgress) {
        return;
      }

      const isFlow = groupProgress.type === ActivityPipelineType.Flow;

      if (!isFlow) {
        return;
      }

      const currentPipelineActivityOrder = groupProgress.pipelineActivityOrder;

      if (!props.flow) {
        throw new Error('[UseEntityComplete:completeFlow] Flow not found');
      }

      const nextActivityId = props.flow.activityIds[currentPipelineActivityOrder + 1];

      flowUpdated({
        activityId: nextActivityId ? nextActivityId : props.flow.activityIds[0],
        flowId: props.flow.id,
        eventId: props.eventId,
        targetSubjectId: props.targetSubjectId,
        pipelineActivityOrder: nextActivityId ? currentPipelineActivityOrder + 1 : 0,
      });

      removeActivityProgress({
        activityId: props.activityId,
        eventId: props.eventId,
        targetSubjectId: props.targetSubjectId,
      });

      if (nextActivityId && !isAutoCompletion) {
        return redirectToNextActivity(nextActivityId);
      }

      if (!nextActivityId) {
        return completeEntityAndRedirect(input?.type || 'regular');
      }
    },
    [
      completeEntityAndRedirect,
      flowUpdated,
      getGroupProgress,
      props.activityId,
      props.eventId,
      props.flow,
      props.flowId,
      props.targetSubjectId,
      redirectToNextActivity,
      removeActivityProgress,
    ],
  );

  const completeActivity = useCallback(
    (input?: CompleteOptions) => {
      if (!prolificParams) {
        removeActivityProgress({
          activityId: props.activityId,
          eventId: props.eventId,
          targetSubjectId: props.targetSubjectId,
        });
      }

      return completeEntityAndRedirect(input?.type || 'regular');
    },
    [
      completeEntityAndRedirect,
      props.activityId,
      props.eventId,
      props.targetSubjectId,
      removeActivityProgress,
      prolificParams,
    ],
  );

  return {
    completeActivity,
    completeFlow,
  };
};
