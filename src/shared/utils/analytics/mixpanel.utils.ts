import {
  ActivityRestartedEvent,
  ActivityResumedEvent,
  AssessmentCompletedEvent,
  AssessmentStartedEvent,
  MixpanelFeature,
  MixpanelProps,
  ResponseReportDownloadClickedEvent,
  ResponseReportGeneratedEvent,
  SaveAndExitClickedEvent,
  WithFeature,
} from './mixpanel.types';

import { AppletBaseDTO } from '~/shared/api';

export const addFeatureToEvent = (event: WithFeature, feature: MixpanelFeature) => {
  const features = event[MixpanelProps.Feature] ?? [];
  event[MixpanelProps.Feature] = [...features, feature];

  return event;
};

export const addSurveyPropsToEvent = <
  T extends
    | ActivityRestartedEvent
    | ActivityResumedEvent
    | AssessmentCompletedEvent
    | AssessmentStartedEvent
    | ResponseReportDownloadClickedEvent
    | ResponseReportGeneratedEvent
    | SaveAndExitClickedEvent,
>(
  event: T,
  {
    applet,
    activityId,
    flowId,
  }: {
    applet: AppletBaseDTO;
    activityId?: string | null;
    flowId?: string | null;
  },
) => {
  event[MixpanelProps.AppletId] = applet.id;

  if (activityId) {
    event[MixpanelProps.ActivityId] = activityId;
  }
  if (flowId) {
    event[MixpanelProps.ActivityFlowId] = flowId;
  }

  // Add item types for this activity
  const activity = applet.activities.find((x) => x.id === activityId);
  if (!activity) return event;

  const { containsResponseTypes } = activity;

  event[MixpanelProps.ItemTypes] = containsResponseTypes;

  if (containsResponseTypes.includes('phrasalTemplate')) {
    addFeatureToEvent(event, MixpanelFeature.SSI);
  }

  return event;
};
