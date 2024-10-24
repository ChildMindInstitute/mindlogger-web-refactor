import { MixpanelPayload, MixpanelProps } from './mixpanel.types';

import { AppletBaseDTO } from '~/shared/api';

export const addFeatureToAnalyticsPayload = (payload: MixpanelPayload, feature: string) => {
  const features = (payload[MixpanelProps.Feature] as string[]) ?? [];
  payload[MixpanelProps.Feature] = [...features, feature];
};

export const getSurveyAnalyticsPayload = ({
  applet,
  activityId,
  flowId,
}: {
  applet: AppletBaseDTO;
  activityId?: string | null;
  flowId?: string | null;
}) => {
  const payload: MixpanelPayload = {
    [MixpanelProps.AppletId]: applet.id,
  };

  if (activityId) {
    payload[MixpanelProps.ActivityId] = activityId;
  }
  if (flowId) {
    payload[MixpanelProps.ActivityFlowId] = flowId;
  }

  // Add item types for this activity
  const activity = applet?.activities.find((x) => x.id === activityId);
  if (!activity) return payload;

  const { containsResponseTypes } = activity;

  payload[MixpanelProps.ItemTypes] = containsResponseTypes;

  if (containsResponseTypes.includes('phrasalTemplate')) {
    addFeatureToAnalyticsPayload(payload, 'SSI');
  }

  return payload;
};
