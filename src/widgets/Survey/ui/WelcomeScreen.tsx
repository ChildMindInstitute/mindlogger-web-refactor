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

  const isFlow = !!context.flow;
  const targetSubjectId = context.targetSubject?.id ?? null;

  const groupProgress = appletModel.hooks.useGroupProgressRecord({
    entityId: context.entityId,
    eventId: context.eventId,
    targetSubjectId,
  });

  const isTimedActivity = !!groupProgress?.event?.timers?.timer;

  const startAssessment = useCallback(() => {
    const isGroupDefined = !!groupProgress;

    const isGroupStarted = isGroupDefined && groupProgress.startAt && !groupProgress.endAt;

    const event = groupProgress?.event ?? context.event;

    if (context.flow && !isGroupStarted) {
      startFlow(event, context.flow, targetSubjectId);
    }

    if (!context.flow) {
      startActivity(context.activityId, event, targetSubjectId);
    }

    return setInitialProgress({
      activity: context.activity,
      eventId: context.event.id,
      targetSubjectId,
    });
  }, [
    context.activity,
    context.activityId,
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
