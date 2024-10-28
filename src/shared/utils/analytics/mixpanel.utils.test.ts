import { MixpanelPayload, MixpanelProps } from './mixpanel.types';
import { addFeatureToAnalyticsPayload, getSurveyAnalyticsPayload } from './mixpanel.utils';

import { AppletBaseDTO } from '~/shared/api';

describe('addFeatureToAnalyticsPayload', () => {
  it('should add a feature to an empty payload', () => {
    const payload: MixpanelPayload = {};
    const feature = 'newFeature';

    addFeatureToAnalyticsPayload(payload, feature);

    expect(payload[MixpanelProps.Feature]).toEqual([feature]);
  });

  it('should add a feature to an existing payload', () => {
    const payload: MixpanelPayload = {
      [MixpanelProps.Feature]: ['existingFeature'],
    };
    const feature = 'newFeature';

    addFeatureToAnalyticsPayload(payload, feature);

    expect(payload[MixpanelProps.Feature]).toEqual(['existingFeature', 'newFeature']);
  });

  it('should handle undefined features array', () => {
    const payload: MixpanelPayload = {
      [MixpanelProps.Feature]: undefined,
    };
    const feature = 'newFeature';

    addFeatureToAnalyticsPayload(payload, feature);

    expect(payload[MixpanelProps.Feature]).toEqual([feature]);
  });
});

describe('getSurveyAnalyticsPayload', () => {
  const applet: AppletBaseDTO = {
    id: 'appletId',
    activities: [
      {
        id: 'activityId',
        containsResponseTypes: ['text', 'phrasalTemplate'],
      },
    ],
  } as AppletBaseDTO;

  it('should create payload with applet id', () => {
    const payload = getSurveyAnalyticsPayload({ applet });

    expect(payload[MixpanelProps.AppletId]).toBe(applet.id);
    expect(payload).not.toHaveProperty(MixpanelProps.ActivityId);
    expect(payload).not.toHaveProperty(MixpanelProps.ActivityFlowId);
  });

  it('should include activityId if provided', () => {
    const payload = getSurveyAnalyticsPayload({ applet, activityId: 'activityId' });

    expect(payload[MixpanelProps.ActivityId]).toBe('activityId');
  });

  it('should include flowId if provided', () => {
    const payload = getSurveyAnalyticsPayload({ applet, flowId: 'flowId' });

    expect(payload[MixpanelProps.ActivityFlowId]).toBe('flowId');
  });

  it('should add item types to payload', () => {
    const payload = getSurveyAnalyticsPayload({ applet, activityId: 'activityId' });

    expect(payload[MixpanelProps.ItemTypes]).toEqual(['text', 'phrasalTemplate']);
  });

  it('should add SSI feature if phrasalTemplate is present', () => {
    const payload = getSurveyAnalyticsPayload({ applet, activityId: 'activityId' });

    expect(payload[MixpanelProps.Feature]).toContain('SSI');
  });

  it('should return payload without item types if activity is not found', () => {
    const payload = getSurveyAnalyticsPayload({ applet, activityId: 'nonExistentActivityId' });

    expect(payload).not.toHaveProperty(MixpanelProps.ItemTypes);
  });
});
