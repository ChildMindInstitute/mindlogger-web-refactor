import { useContext } from 'react';

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
import { useStartSurvey } from '~/features/PassSurvey';
import Box from '~/shared/ui/Box';
import {
  MixpanelEvents,
  Mixpanel,
  MixpanelProps,
  useAppSelector,
  useCustomMediaQuery,
  MixpanelPayload,
  useOnceLayoutEffect,
} from '~/shared/utils';

type Props = {
  activityListItem: ActivityListItem;
};

export const ActivityCard = ({ activityListItem }: Props) => {
  const { lessThanSM } = useCustomMediaQuery();

  const context = useContext(AppletDetailsContext);

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

  const activityEventId = getProgressId(activityListItem.activityId, activityListItem.eventId);

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

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

  const onStartActivity = (shouldRestart: boolean) => {
    if (isDisabled) return;

    if (!isEntitySupported) {
      return openStoreLink();
    }

    return startSurvey({
      activityId: activityListItem.activityId,
      eventId: activityListItem.eventId,
      status: activityListItem.status,
      flowId: activityListItem.flowId,
      shouldRestart,
    });
  };

  const restartActivity = () => {
    onStartActivity(true);

    const analyticsPayload: MixpanelPayload = {
      [MixpanelProps.AppletId]: context.applet.id,
      [MixpanelProps.ActivityId]: activityListItem.activityId,
    };

    if (isFlow) {
      analyticsPayload[MixpanelProps.ActivityFlowId] = activityListItem.flowId;
    }

    Mixpanel.track(MixpanelEvents.ActivityRestarted, analyticsPayload);
  };

  const resumeActivity = () => {
    onStartActivity(false);

    const analyticsPayload: MixpanelPayload = {
      [MixpanelProps.AppletId]: context.applet.id,
      [MixpanelProps.ActivityId]: activityListItem.activityId,
    };

    if (isFlow) {
      analyticsPayload[MixpanelProps.ActivityFlowId] = activityListItem.flowId;
    }

    Mixpanel.track(MixpanelEvents.ActivityResumed, analyticsPayload);
  };

  // Start activity on mount if doing Take Now on this activity.
  useOnceLayoutEffect(() => {
    if (
      context.startActivityOrFlow &&
      ((!isFlow && context.startActivityOrFlow === activityListItem.activityId) ||
        (isFlow && context.startActivityOrFlow === activityListItem.flowId))
    ) {
      // Pass `true` to ensure activity doesn't resume from a previous progress state.
      onStartActivity(true);
    }
  });

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

          <ActivityLabel
            isFlow={isFlow && showActivityFlowBudget}
            activityLength={activityLength ?? 0}
            isSupportedActivity={isEntitySupported}
            isActivityInProgress={isInProgress}
            countOfCompletedQuestions={countOfCompletedQuestions}
            countOfCompletedActivities={countOfCompletedActivities}
            numberOfActivitiesInFlow={numberOfActivitiesInFlow}
          />

          {description && <ActivityCardDescription description={description} isFlow={isFlow} />}

          {isEntitySupported && <TimeStatusLabel activity={activityListItem} />}
        </Box>
        <ActivityCardRestartResume
          activityStatus={activityListItem.status}
          onRestartClick={restartActivity}
          onResumeClick={resumeActivity}
          onStartClick={() => onStartActivity(false)}
          activityName={title}
          isDisabled={isDisabled}
        />
      </Box>
    </ActivityCardBase>
  );
};
