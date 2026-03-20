import { useCallback, useContext, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';

import { ActivityCardBase } from './ActivityCardBase';
import { ActivityCardDescription } from './ActivityCardDescription';
import { ActivityCardIcon } from './ActivityCardIcon';
import { ActivityCardProgressBar } from './ActivityCardProgressBar';
import { ActivityCardRestartResume } from './ActivityCardRestartResume';
import { ActivityCardTitle } from './ActivityCardTitle';
import { ActivityLabel } from './ActivityLabel';
import TimeStatusLabel from './TimeStatusLabel';
import { AppletDetailsContext } from '../../lib';
import { useEntityCardDetails } from '../../model/hooks';

import { getProgressId, openStoreLink } from '~/abstract/lib';
import { ActivityListItem } from '~/abstract/lib/GroupBuilder';
import { appletModel } from '~/entities/applet';
import { useProlificStudyStateQuery } from '~/entities/applet/api/integrations/useProlificIntegrationEnabledQuery';
import { useProlificUserExistsQuery } from '~/entities/applet/api/integrations/useProlificUserExistsQuery';
import { prolificParamsSelector } from '~/entities/applet/model/selectors';
import { useBanners } from '~/entities/banner/model';
import { useAutoCompletionRecord } from '~/features/AutoCompletion/model';
import { useStartSurvey } from '~/features/PassSurvey';
import appletService from '~/shared/api/services/applet.service';
import { variables } from '~/shared/constants/theme/variables';
import { MuiModal } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import {
  MixpanelEventType,
  Mixpanel,
  useAppSelector,
  useCustomMediaQuery,
  addSurveyPropsToEvent,
} from '~/shared/utils';
import { TargetSubjectLabel } from '~/widgets/TargetSubjectLabel';

type Props = {
  activityListItem: ActivityListItem;
};

export const ActivityCard = ({ activityListItem }: Props) => {
  const { lessThanSM } = useCustomMediaQuery();

  const context = useContext(AppletDetailsContext);
  const queryClient = useQueryClient();
  const [isFlowDeletedAlertOpen, setIsFlowDeletedAlertOpen] = useState(false);
  const [isActivityDeletedAlertOpen, setIsActivityDeletedAlertOpen] = useState(false);
  const [pendingFreshResponse, setPendingFreshResponse] = useState<unknown>(null);

  const {
    title,
    image,
    description,
    isFlow,
    showActivityFlowBudget,
    isDisabled,
    isInProgress,
    isEntitySupported,
  } = useEntityCardDetails({
    activityListItem,
    applet: context.applet,
  });

  const activityEventId = getProgressId(
    activityListItem.activityId,
    activityListItem.eventId,
    activityListItem.targetSubject?.id,
  );

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

  const autoCompletionRecord = useAutoCompletionRecord({
    entityId: activityListItem.flowId ?? activityListItem.activityId,
    eventId: activityListItem.eventId,
    targetSubjectId: activityListItem.targetSubject?.id ?? null,
  });

  const step = activityProgress?.step || 0;

  const items = activityProgress?.items || [];

  const progress = ((step + 1) / items.length) * 100;

  const countOfCompletedQuestions = items.filter((item) => item.answer.length).length || 0;

  const numberOfActivitiesInFlow =
    activityListItem.activityFlowDetails?.numberOfActivitiesInFlow || 0;

  const { startSurvey } = useStartSurvey({
    applet: context.applet,
    isPublic: context.isPublic,
    publicAppletKey: context.isPublic ? context.publicAppletKey : null,
  });

  const getCompletedActivitiesFromPosition = (position: number) => position - 1;

  const countOfCompletedActivities = getCompletedActivitiesFromPosition(
    activityListItem.activityFlowDetails?.activityPositionInFlow || 0,
  );

  const activityLength = context.applet?.activities.find(
    (act) => act.id === activityListItem.activityId,
  )?.itemCount;

  const flowProgress = (countOfCompletedActivities / numberOfActivitiesInFlow) * 100;

  const { addErrorBanner } = useBanners();

  const prolificParams = useAppSelector(prolificParamsSelector);
  const { data: prolificUser } = useProlificUserExistsQuery(
    {
      studyId: prolificParams?.studyId ?? '',
      prolificPid: prolificParams?.prolificPid ?? '',
    },
    {
      enabled: !!prolificParams,
    },
  );
  const { refetch: refetchProlificStudyState } = useProlificStudyStateQuery(
    context.isPublic
      ? {
          isPublic: true,
          publicAppletKey: context.publicAppletKey,
          prolificStudyId: prolificParams?.studyId ?? null,
        }
      : {
          isPublic: false,
          appletId: context.applet?.id,
          prolificStudyId: prolificParams?.studyId ?? null,
        },
    {
      enabled: !!prolificParams,
    },
  );

  const prolificValidated = async () => {
    const { data: updatedProlificStydy } = await refetchProlificStudyState();
    const isValidStudy = !!updatedProlificStydy?.data?.accepted;
    if (!isValidStudy) {
      addErrorBanner(t('prolific.invalid'));
      return false;
    }

    const userExists = !!prolificUser?.data?.exists;
    if (userExists) {
      addErrorBanner(t('prolific.alreadyAnswered'));
      return false;
    }

    return true;
  };

  const onStartActivity = async () => {
    if (isDisabled) return;

    if (prolificParams && !(await prolificValidated())) {
      return;
    }

    if (!isEntitySupported) {
      return openStoreLink();
    }

    const flowId = activityListItem.flowId;

    if (flowId) {
      const freshResult = await fetchFreshEntityData(flowId, 'flow').catch((error) => {
        console.error(error);
        return undefined;
      });
      if (!freshResult || freshResult.deleted) return;

      startSurvey({
        activityId: activityListItem.activityId,
        eventId: activityListItem.eventId,
        targetSubjectId: activityListItem.targetSubject?.id ?? null,
        flowId,
        shouldRestart: false,
        freshFlowActivityIds: freshResult.activityIds,
      });
    } else {
      // For standalone activities, check if the activity still exists
      const freshResult = await fetchFreshEntityData(activityListItem.activityId, 'activity').catch(
        (error) => {
          console.error(error);
          return undefined;
        },
      );
      if (!freshResult || freshResult.deleted) return;

      startSurvey({
        activityId: activityListItem.activityId,
        eventId: activityListItem.eventId,
        targetSubjectId: activityListItem.targetSubject?.id ?? null,
        flowId: null,
        shouldRestart: false,
      });
    }
  };

  const startActivity = useCallback(
    (shouldRestart: boolean) => {
      if (!isEntitySupported) {
        return openStoreLink();
      }

      return startSurvey({
        activityId: activityListItem.activityId,
        eventId: activityListItem.eventId,
        targetSubjectId: activityListItem.targetSubject?.id ?? null,
        flowId: activityListItem.flowId,
        shouldRestart,
      });
    },
    [isEntitySupported, startSurvey, activityListItem],
  );

  const fetchFreshEntityData = useCallback(
    async (entityId: string, entityType: 'flow' | 'activity') => {
      const appletId = context.applet.id;
      const response = context.isPublic
        ? await appletService.getPublicBaseDetailsByKey(context.publicAppletKey)
        : await appletService.getBaseDetailsById(appletId);

      if (entityType === 'flow') {
        const freshFlow = response.data.result.activityFlows.find((f) => f.id === entityId);

        if (!freshFlow) {
          // Stash the response — apply to cache only when user dismisses the modal
          setPendingFreshResponse(response);
          setIsFlowDeletedAlertOpen(true);
          return { deleted: true as const, activityIds: undefined };
        }

        // Entity still exists — safe to refresh cache immediately
        queryClient.setQueryData(
          [
            'appletBaseDetailsById',
            context.isPublic
              ? { isPublic: true, publicAppletKey: context.publicAppletKey }
              : { isPublic: false, appletId },
          ],
          response,
        );

        return { deleted: false as const, activityIds: freshFlow.activityIds };
      } else {
        const freshActivity = response.data.result.activities.find((a) => a.id === entityId);

        if (!freshActivity) {
          // Stash the response — apply to cache only when user dismisses the modal
          setPendingFreshResponse(response);
          setIsActivityDeletedAlertOpen(true);
          return { deleted: true as const, activityIds: undefined };
        }

        // Entity still exists — safe to refresh cache immediately
        queryClient.setQueryData(
          [
            'appletBaseDetailsById',
            context.isPublic
              ? { isPublic: true, publicAppletKey: context.publicAppletKey }
              : { isPublic: false, appletId },
          ],
          response,
        );

        return { deleted: false as const, activityIds: undefined };
      }
    },
    [context, queryClient],
  );

  const dismissDeletedEntityAlert = useCallback(() => {
    setIsFlowDeletedAlertOpen(false);
    setIsActivityDeletedAlertOpen(false);

    // Now apply the stashed fresh response to the cache so the card disappears
    if (pendingFreshResponse) {
      const appletId = context.applet.id;

      queryClient.setQueryData(
        [
          'appletBaseDetailsById',
          context.isPublic
            ? { isPublic: true, publicAppletKey: context.publicAppletKey }
            : { isPublic: false, appletId },
        ],
        pendingFreshResponse,
      );

      void queryClient.invalidateQueries(['eventsByAppletId']);
      setPendingFreshResponse(null);
    }
  }, [pendingFreshResponse, context, queryClient]);

  const restartActivity = useCallback(async () => {
    const flowId = activityListItem.flowId;

    if (!isEntitySupported) {
      return openStoreLink();
    }

    if (flowId) {
      const freshResult = await fetchFreshEntityData(flowId, 'flow').catch((error) => {
        console.error(error);
        return undefined;
      });
      if (!freshResult || freshResult.deleted) return;

      startSurvey({
        activityId: activityListItem.activityId,
        eventId: activityListItem.eventId,
        targetSubjectId: activityListItem.targetSubject?.id ?? null,
        flowId,
        shouldRestart: true,
        freshFlowActivityIds: freshResult.activityIds,
      });
    } else {
      // For standalone activities, check if the activity still exists
      const freshResult = await fetchFreshEntityData(activityListItem.activityId, 'activity').catch(
        (error) => {
          console.error(error);
          return undefined;
        },
      );
      if (!freshResult || freshResult.deleted) return;

      startSurvey({
        activityId: activityListItem.activityId,
        eventId: activityListItem.eventId,
        targetSubjectId: activityListItem.targetSubject?.id ?? null,
        flowId: null,
        shouldRestart: true,
      });
    }

    Mixpanel.track(
      addSurveyPropsToEvent(
        { action: MixpanelEventType.ActivityRestarted },
        {
          applet: context.applet,
          activityId: activityListItem.activityId,
          flowId: activityListItem.flowId,
        },
      ),
    );
  }, [
    activityListItem.flowId,
    activityListItem.activityId,
    activityListItem.eventId,
    activityListItem.targetSubject?.id,
    context,
    isEntitySupported,
    startSurvey,
    fetchFreshEntityData,
  ]);

  const resumeActivity = () => {
    startActivity(false);

    Mixpanel.track(
      addSurveyPropsToEvent(
        { action: MixpanelEventType.ActivityResumed },
        {
          applet: context.applet,
          activityId: activityListItem.activityId,
          flowId: activityListItem.flowId,
        },
      ),
    );
  };

  return (
    <ActivityCardBase isDisabled={isDisabled} isFlow={isFlow}>
      <Box
        display="flex"
        flex={1}
        gap={lessThanSM ? '8px' : '24px'}
        flexDirection={lessThanSM ? 'column' : 'row'}
        data-testid="activity-card-content-wrapper"
        sx={{ textTransform: 'none' }}
      >
        <ActivityCardIcon src={image} isFlow={isFlow} />

        <Box
          display="flex"
          flex={1}
          justifyContent="center"
          alignItems="flex-start"
          flexDirection="column"
          gap="8px"
        >
          <ActivityCardTitle title={title} isFlow={isFlow} />

          {isInProgress && (
            <ActivityCardProgressBar
              percentage={isFlow && showActivityFlowBudget ? flowProgress : progress}
              isFlow={isFlow}
            />
          )}

          <Box display="flex" gap="8px" flexWrap="wrap">
            <ActivityLabel
              isFlow={isFlow && showActivityFlowBudget}
              activityLength={activityLength ?? 0}
              isSupportedActivity={isEntitySupported}
              isActivityInProgress={isInProgress}
              countOfCompletedQuestions={countOfCompletedQuestions}
              countOfCompletedActivities={countOfCompletedActivities}
              numberOfActivitiesInFlow={numberOfActivitiesInFlow}
            />

            {!!activityListItem.targetSubject && (
              <TargetSubjectLabel subject={activityListItem.targetSubject} />
            )}
          </Box>

          {description && <ActivityCardDescription description={description} isFlow={isFlow} />}

          {isEntitySupported && <TimeStatusLabel activity={activityListItem} />}
        </Box>
        <ActivityCardRestartResume
          activityStatus={activityListItem.status}
          onRestartClick={restartActivity}
          onResumeClick={resumeActivity}
          onStartClick={async () => await onStartActivity()}
          activityName={title}
          isDisabled={isDisabled}
          isAutoCompletionRecordDefined={!!autoCompletionRecord}
          isRestartDisabled={activityListItem.isDeletedFlow}
        />
      </Box>

      <MuiModal
        testId="flow-deleted-alert-modal"
        isOpen={isFlowDeletedAlertOpen}
        onHide={dismissDeletedEntityAlert}
        title={t('additional.flow_deleted_title')}
        titleProps={{
          fontWeight: '400',
          marginY: 2,
        }}
        labelComponent={
          <Text color={variables.palette.onSurface} sx={{ textTransform: 'none' }}>
            {t('additional.flow_deleted_body')}
          </Text>
        }
        footerPrimaryButton={t('additional.okay')}
        onPrimaryButtonClick={dismissDeletedEntityAlert}
        footerWrapperSXProps={{
          marginLeft: 'auto',
          marginTop: 2,
        }}
        maxWidth="sm"
      />

      <MuiModal
        testId="activity-deleted-alert-modal"
        isOpen={isActivityDeletedAlertOpen}
        onHide={dismissDeletedEntityAlert}
        title={t('additional.activity_deleted_title')}
        titleProps={{
          fontWeight: '400',
          marginY: 2,
        }}
        labelComponent={
          <Text color={variables.palette.onSurface} sx={{ textTransform: 'none' }}>
            {t('additional.activity_deleted_body')}
          </Text>
        }
        footerPrimaryButton={t('additional.okay')}
        onPrimaryButtonClick={dismissDeletedEntityAlert}
        footerWrapperSXProps={{
          marginLeft: 'auto',
          marginTop: 2,
        }}
        maxWidth="sm"
      />
    </ActivityCardBase>
  );
};
