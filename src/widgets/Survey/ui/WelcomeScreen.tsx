import { useCallback, useContext, useEffect } from 'react';

import { Avatar } from '@mui/material';

import { ActivityMetaData } from './ActivityMetaData';

import { ActivityPipelineType } from '~/abstract/lib';
import SubjectIcon from '~/assets/subject-icon.svg';
import { appletModel } from '~/entities/applet';
import { useBanners } from '~/entities/banner/model';
import { StartSurveyButton, SurveyContext, SurveyLayout } from '~/features/PassSurvey';
import { variables } from '~/shared/constants/theme/variables';
import { AvatarBase } from '~/shared/ui/Avatar';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { getSubjectName, useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

const WelcomeScreen = () => {
  const { greaterThanSM } = useCustomMediaQuery();

  const { t } = useCustomTranslation();

  const { addWarningBanner, removeWarningBanner } = useBanners();

  const context = useContext(SurveyContext);

  const { startActivity, startFlow } = appletModel.hooks.useEntityStart();

  const { setInitialProgress } = appletModel.hooks.useActivityProgress();

  const { updateAppletVersion } = appletModel.hooks.useGroupProgressStateManager();

  const isFlow = !!context.flow;
  const targetSubjectId = context.targetSubject?.id ?? null;

  const groupProgress = appletModel.hooks.useGroupProgressRecord({
    entityId: context.entityId,
    eventId: context.eventId,
    targetSubjectId,
  });

  const isTimedActivity = !!groupProgress?.event?.timers?.timer;

  // When restarting, the restart reducer (flowRestarted/activityRestarted) may have set a stale
  // applet version from the dashboard's cached applet data. Now that we have the fresh version
  // from the API (via SurveyContext), update the group progress to use the correct version.
  // This runs on mount (before user clicks Start) so the version is correct for answer submission.
  useEffect(() => {
    const isGroupStarted = groupProgress && groupProgress.startAt && !groupProgress.endAt;

    if (
      isGroupStarted &&
      context.shouldRestart &&
      groupProgress.appletVersion !== context.appletVersion
    ) {
      updateAppletVersion({
        entityId: context.entityId,
        eventId: context.eventId,
        targetSubjectId,
        appletVersion: context.appletVersion,
        flowActivityIds: context.flow?.activityIds,
        flowName: context.flow?.name,
      });
    }
  }, [
    context.shouldRestart,
    context.appletVersion,
    context.entityId,
    context.eventId,
    context.flow?.activityIds,
    context.flow?.name,
    targetSubjectId,
    groupProgress,
    updateAppletVersion,
  ]);

  const startAssessment = useCallback(() => {
    const isGroupDefined = !!groupProgress;

    const isGroupStarted = isGroupDefined && groupProgress.startAt && !groupProgress.endAt;

    const event = groupProgress?.event ?? context.event;

    if (context.flow && !isGroupStarted) {
      startFlow(event, context.flow, targetSubjectId, context.appletVersion, context.appletId);
    }

    // Only start a standalone activity if we're NOT in a flow context.
    // For deleted flows, context.flow is null but context.entityId still
    // differs from context.activityId, indicating a flow-type entity.
    const isFlowContext = context.entityId !== context.activityId;
    if (!context.flow && !isFlowContext) {
      startActivity(
        context.activityId,
        event,
        targetSubjectId,
        context.appletVersion,
        context.appletId,
      );
    }

    return setInitialProgress({
      activity: context.activity,
      eventId: context.event.id,
      targetSubjectId,
    });
  }, [
    context.activity,
    context.activityId,
    context.appletId,
    context.appletVersion,
    context.entityId,
    context.event,
    context.flow,
    targetSubjectId,
    groupProgress,
    setInitialProgress,
    startActivity,
    startFlow,
  ]);

  const calculateActivityOrder = (): number | null => {
    if (!isFlow) {
      return null;
    }

    if (groupProgress?.type === ActivityPipelineType.Flow) {
      // If flow is completed, the next start will be from Activity 1
      if (groupProgress.endAt) return 1;
      return groupProgress.pipelineActivityOrder + 1;
    }

    // If we dont have group progress yet, we assume that this is the first activity
    return 1;
  };

  useEffect(() => {
    if (context.targetSubject) {
      addWarningBanner({
        children: t('targetSubjectBanner', { name: getSubjectName(context.targetSubject) }),
        duration: null,
        hasCloseButton: false,
        iconMapping: {
          warning: (
            <Avatar src={SubjectIcon} sx={{ width: '32px', height: '32px', borderRadius: 0 }} />
          ),
        },
      });

      return () => {
        removeWarningBanner();
      };
    }
  }, [addWarningBanner, context.targetSubject, removeWarningBanner, t]);

  return (
    <SurveyLayout
      progress={0}
      isSaveAndExitButtonShown={true}
      entityTimer={groupProgress?.event?.timers.timer ?? undefined}
      footerActions={
        <StartSurveyButton
          width={greaterThanSM ? '375px' : '335px'}
          onClick={startAssessment}
          text={isTimedActivity ? t('startTimedActivity') : t('start')}
        />
      }
    >
      <Box
        id="welcome-screen-activity-details"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="80px"
        maxWidth="570px"
      >
        <AvatarBase
          src={context.activity.image}
          name={context.activity.name}
          width="124px"
          height="124px"
          testid="flow-welcome-screen-avatar"
        />

        <Text
          // Must use `<div />` here because `<ActivityMetaData />` renders
          // bunch of `div`s, but `<Text />`'s default component is a `<p />`,
          // which can not contain `<div />`.
          component="div"
          variant="bodyLarger"
          color={variables.palette.onSurfaceVariant}
          sx={{ marginTop: '24px' }}
        >
          <ActivityMetaData
            isFlow={isFlow}
            activityLength={context.activity.items.length}
            activityOrderInFlow={calculateActivityOrder()}
          />
        </Text>
        <Box display="flex" alignItems="center" gap="6px">
          <Text
            variant="titleLargishBold"
            color={variables.palette.onSurface}
            margin="16px 0px"
            testid="flow-welcome-screen-title"
          >
            {context.activity.name}
          </Text>
          {isTimedActivity && (
            <Text variant="bodyLarger">
              {t('timedActivityTitle', { activityName: context.activity.name })}
            </Text>
          )}
        </Box>

        <Text
          variant="bodyLarger"
          color={variables.palette.onSurface}
          testid="flow-welcome-screen-decription"
          sx={{ textAlign: 'center' }}
        >
          {context.activity.description}
        </Text>

        {isTimedActivity && (
          <Box textAlign="center" marginTop="16px">
            <Text variant="bodyLarger">
              {t('youWillHaveToCompleteIt', {
                hours: groupProgress.event?.timers.timer?.hours,
                minutes: groupProgress.event?.timers.timer?.minutes,
              })}
            </Text>
            <Text variant="bodyLarger">{t('yourWorkWillBeSubmitted')}</Text>
          </Box>
        )}
      </Box>
    </SurveyLayout>
  );
};

export default WelcomeScreen;
