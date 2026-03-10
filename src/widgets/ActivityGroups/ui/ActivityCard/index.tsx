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
    const freshResult = flowId
      ? await fetchFreshFlowData(flowId).catch(() => undefined)
      : undefined;

    if (freshResult?.deleted) return;

    startSurvey({
      activityId: activityListItem.activityId,
      eventId: activityListItem.eventId,
      targetSubjectId: activityListItem.targetSubject?.id ?? null,
      flowId,
      shouldRestart: false,
      freshFlowActivityIds: freshResult?.activityIds,
    });
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

  const fetchFreshFlowData = useCallback(
    async (flowId: string) => {
      const appletId = context.applet.id;
      const response = context.isPublic
        ? await appletService.getPublicBaseDetailsByKey(context.publicAppletKey)
        : await appletService.getBaseDetailsById(appletId);

      const freshFlows = response.data.result.activityFlows;
      const freshFlow = freshFlows.find((f) => f.id === flowId);

      if (!freshFlow) {
        // Flow was deleted — show alert and refresh the cached applet data
        setIsFlowDeletedAlertOpen(true);

        queryClient.setQueryData(
          [
            'appletBaseDetailsById',
            context.isPublic
              ? { isPublic: true, publicAppletKey: context.publicAppletKey }
              : { isPublic: false, appletId },
          ],
          response,
        );

        void queryClient.invalidateQueries(['eventsByAppletId']);

        return { deleted: true as const };
      }

      return { deleted: false as const, activityIds: freshFlow.activityIds };
    },
    [context, queryClient],
  );

  const restartActivity = useCallback(async () => {
    const flowId = activityListItem.flowId;

    const freshResult = flowId
      ? await fetchFreshFlowData(flowId).catch(() => undefined)
      : undefined;

    if (freshResult?.deleted) return;

    if (!isEntitySupported) {
      return openStoreLink();
    }

    startSurvey({
      activityId: activityListItem.activityId,
      eventId: activityListItem.eventId,
      targetSubjectId: activityListItem.targetSubject?.id ?? null,
      flowId: activityListItem.flowId,
      shouldRestart: true,
      freshFlowActivityIds: freshResult?.activityIds,
    });

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
    fetchFreshFlowData,
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
        onHide={() => setIsFlowDeletedAlertOpen(false)}
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
        onPrimaryButtonClick={() => setIsFlowDeletedAlertOpen(false)}
        footerWrapperSXProps={{
          marginLeft: 'auto',
          marginTop: 2,
        }}
        maxWidth="sm"
      />
    </ActivityCardBase>
  );
};
