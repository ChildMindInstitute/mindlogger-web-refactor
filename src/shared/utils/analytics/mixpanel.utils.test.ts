import {
  ActivityRestartedEvent,
  MixpanelEventType,
  MixpanelFeature,
  MixpanelProps,
  WithFeature,
} from './mixpanel.types';
import { addFeatureToEvent, addSurveyPropsToEvent } from './mixpanel.utils';

import { AppletBaseDTO } from '~/shared/api';

describe('addFeatureToEvent', () => {
  it('should add a feature to an empty event', () => {
    const event: WithFeature = {};
    const feature = MixpanelFeature.MultiInformant;

    addFeatureToEvent(event, feature);

    expect(event[MixpanelProps.Feature]).toEqual([feature]);
  });

  it('should add a feature to an existing event', () => {
    const event: WithFeature = {
      [MixpanelProps.Feature]: [MixpanelFeature.SSI],
    };
    const feature = MixpanelFeature.MultiInformant;

    addFeatureToEvent(event, feature);

    expect(event[MixpanelProps.Feature]).toEqual([MixpanelFeature.SSI, feature]);
  });

  it('should handle undefined features array', () => {
    const event: WithFeature = {
      [MixpanelProps.Feature]: undefined,
    };
    const feature = MixpanelFeature.MultiInformant;

    addFeatureToEvent(event, feature);

    expect(event[MixpanelProps.Feature]).toEqual([feature]);
  });
});

describe('addSurveyPropsToEvent', () => {
  const applet: AppletBaseDTO = {
    id: 'appletId',
    activities: [
      {
        id: 'activityId',
        containsResponseTypes: ['text', 'phrasalTemplate'],
      },
    ],
  } as AppletBaseDTO;

  it('should create event with applet id', () => {
    const event: ActivityRestartedEvent = addSurveyPropsToEvent(
      { action: MixpanelEventType.ActivityRestarted },
      { applet },
    );

    expect(event[MixpanelProps.AppletId]).toBe(applet.id);
    expect(event).not.toHaveProperty(MixpanelProps.ActivityId);
    expect(event).not.toHaveProperty(MixpanelProps.ActivityFlowId);
  });

  it('should include activityId if provided', () => {
    const event: ActivityRestartedEvent = addSurveyPropsToEvent(
      { action: MixpanelEventType.ActivityRestarted },
      { applet, activityId: 'activityId' },
    );

    expect(event[MixpanelProps.ActivityId]).toBe('activityId');
  });

  it('should include flowId if provided', () => {
    const event: ActivityRestartedEvent = addSurveyPropsToEvent(
      { action: MixpanelEventType.ActivityRestarted },
      { applet, flowId: 'flowId' },
    );

    expect(event[MixpanelProps.ActivityFlowId]).toBe('flowId');
  });

  it('should add item types to event', () => {
    const event: ActivityRestartedEvent = addSurveyPropsToEvent(
      { action: MixpanelEventType.ActivityRestarted },
      { applet, activityId: 'activityId' },
    );

    expect(event[MixpanelProps.ItemTypes]).toEqual(['text', 'phrasalTemplate']);
  });

  it('should add SSI feature if phrasalTemplate is present', () => {
    const event: ActivityRestartedEvent = addSurveyPropsToEvent(
      { action: MixpanelEventType.ActivityRestarted },
      { applet, activityId: 'activityId' },
    );

    expect(event[MixpanelProps.Feature]).toContain('SSI');
  });

  it('should return event without item types if activity is not found', () => {
    const event: ActivityRestartedEvent = addSurveyPropsToEvent(
      { action: MixpanelEventType.ActivityRestarted },
      { applet, activityId: 'nonExistentActivityId' },
    );

    expect(event).not.toHaveProperty(MixpanelProps.ItemTypes);
  });
});
