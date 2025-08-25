import { PreloadedState } from '@reduxjs/toolkit';
import { Navigate } from 'react-router-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';

import NavigateToActiveAssessment from './index';

import { ActivityPipelineType } from '~/abstract/lib';
import { RequestHealthRecordDataItemStep } from '~/entities/activity';
import * as appletModel from '~/entities/applet/model';
import ROUTES from '~/shared/constants/routes';
import { RootState } from '~/shared/utils';
import { renderWithProviders } from '~/test/utils';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(() => null),
  };
});

// Mock dispatch function
const mockDispatch = vi.fn();

// Mock hooks and utilities
vi.mock('~/shared/utils', async () => {
  const actual = await vi.importActual('~/shared/utils');
  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});

describe('NavigateToActiveAssessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should navigate to applet list when no active assessment is found', () => {
    // Setup
    const mockActiveAssessment = null;

    // Render
    renderWithProviders(<NavigateToActiveAssessment />, {
      preloadedState: {
        applets: {
          activeAssessment: mockActiveAssessment,
        },
      } as unknown as PreloadedState<RootState>,
      disableRouter: true,
      mockDispatch,
    });

    // Assertions
    expect(Navigate).toHaveBeenCalledWith({ to: ROUTES.appletList.path }, expect.anything());
  });

  test('should navigate to applet list when active assessment has no matching groupProgress', () => {
    // Setup
    const mockActiveAssessment = {
      appletId: 'applet-123',
      groupProgressId: 'activity-123/event-123/subject-123',
      publicAppletKey: null,
    };

    renderWithProviders(<NavigateToActiveAssessment />, {
      preloadedState: {
        applets: {
          activeAssessment: mockActiveAssessment,
          // No entry for the groupProgressId, which will make selectGroupProgress return null
          groupProgress: {},
          progress: {},
        },
      } as unknown as PreloadedState<RootState>,
      disableRouter: true,
      mockDispatch,
    });

    // Assertions
    expect(Navigate).toHaveBeenCalledWith({ to: ROUTES.appletList.path }, expect.anything());
  });

  test('should handle EHR item step correctly', () => {
    // Setup
    const mockActiveAssessment = {
      appletId: 'applet-123',
      groupProgressId: 'activity-123/event-123/subject-123',
      publicAppletKey: null,
    };

    const mockGroupProgress = {
      type: ActivityPipelineType.Regular,
      currentActivityId: 'activity-123',
    };

    const mockActivityProgress = {
      step: 1,
      items: [
        { id: 'item-0', responseType: 'text' },
        {
          id: 'item-1',
          responseType: 'requestHealthRecordData',
          subStep: RequestHealthRecordDataItemStep.OneUpHealth,
          additionalEHRs: 'requested',
        },
      ],
    };

    // Render with preloaded state for both groupProgress and activityProgress
    renderWithProviders(<NavigateToActiveAssessment />, {
      preloadedState: {
        applets: {
          activeAssessment: mockActiveAssessment,
          groupProgress: {
            'activity-123/event-123/subject-123': mockGroupProgress,
          },
          progress: {
            'activity-123/event-123/subject-123': mockActivityProgress,
          },
        },
      } as unknown as PreloadedState<RootState>,
      disableRouter: true,
      mockDispatch,
    });

    // Assertions
    expect(mockDispatch).toHaveBeenCalledWith(
      appletModel.actions.saveCustomProperty({
        entityId: 'activity-123',
        eventId: 'event-123',
        targetSubjectId: 'subject-123',
        itemId: 'item-1',
        customProperty: 'subStep',
        value: RequestHealthRecordDataItemStep.AdditionalPrompt,
      }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      appletModel.actions.saveCustomProperty({
        entityId: 'activity-123',
        eventId: 'event-123',
        targetSubjectId: 'subject-123',
        itemId: 'item-1',
        customProperty: 'additionalEHRs',
        value: null,
      }),
    );
  });

  test('should handle EHR item step correctly when preceded by hidden item', () => {
    // Setup
    const mockActiveAssessment = {
      appletId: 'applet-123',
      groupProgressId: 'activity-123/event-123/subject-123',
      publicAppletKey: null,
    };

    const mockGroupProgress = {
      type: ActivityPipelineType.Regular,
      currentActivityId: 'activity-123',
    };

    const mockActivityProgress = {
      step: 0, // Step 0 in visibleItems array (EHR item becomes first visible item after hidden item is filtered out)
      items: [
        { id: 'item-0', responseType: 'text', isHidden: true }, // Hidden item that should be filtered out
        {
          id: 'item-1',
          responseType: 'requestHealthRecordData',
          subStep: RequestHealthRecordDataItemStep.OneUpHealth,
          additionalEHRs: 'requested',
        },
        { id: 'item-2', responseType: 'text' }, // Another visible item
      ],
    };

    // Render with preloaded state for both groupProgress and activityProgress
    renderWithProviders(<NavigateToActiveAssessment />, {
      preloadedState: {
        applets: {
          activeAssessment: mockActiveAssessment,
          groupProgress: {
            'activity-123/event-123/subject-123': mockGroupProgress,
          },
          progress: {
            'activity-123/event-123/subject-123': mockActivityProgress,
          },
        },
      } as unknown as PreloadedState<RootState>,
      disableRouter: true,
      mockDispatch,
    });

    // Assertions - The EHR item should still be found and processed correctly
    // even though there's a hidden item before it in the original items array
    expect(mockDispatch).toHaveBeenCalledWith(
      appletModel.actions.saveCustomProperty({
        entityId: 'activity-123',
        eventId: 'event-123',
        targetSubjectId: 'subject-123',
        itemId: 'item-1',
        customProperty: 'subStep',
        value: RequestHealthRecordDataItemStep.AdditionalPrompt,
      }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      appletModel.actions.saveCustomProperty({
        entityId: 'activity-123',
        eventId: 'event-123',
        targetSubjectId: 'subject-123',
        itemId: 'item-1',
        customProperty: 'additionalEHRs',
        value: null,
      }),
    );
  });

  test('should navigate to public survey when publicAppletKey is present', () => {
    // Setup
    const mockActiveAssessment = {
      appletId: 'applet-123',
      groupProgressId: 'activity-123/event-123/subject-123',
      publicAppletKey: 'public-key-123',
    };

    const mockGroupProgress = {
      type: ActivityPipelineType.Regular,
      currentActivityId: 'activity-123',
    };

    const mockActivityProgress = {
      step: 0,
      items: [{ id: 'item-0', responseType: 'text' }],
    };

    const mockNavigateTo =
      '/public-survey/public-key-123/applet-123/activity-123/regular/event-123';
    vi.spyOn(ROUTES.publicSurvey, 'navigateTo').mockReturnValue(mockNavigateTo);

    // Render with preloaded state for both groupProgress and activityProgress
    renderWithProviders(<NavigateToActiveAssessment />, {
      preloadedState: {
        applets: {
          activeAssessment: mockActiveAssessment,
          groupProgress: {
            'activity-123/event-123/subject-123': mockGroupProgress,
          },
          progress: {
            'activity-123/event-123/subject-123': mockActivityProgress,
          },
        },
      } as unknown as PreloadedState<RootState>,
      disableRouter: true,
      mockDispatch,
    });

    // Assertions
    expect(ROUTES.publicSurvey.navigateTo).toHaveBeenCalledWith({
      appletId: 'applet-123',
      activityId: 'activity-123',
      entityType: 'regular',
      eventId: 'event-123',
      flowId: null,
      publicAppletKey: 'public-key-123',
    });

    expect(Navigate).toHaveBeenCalledWith({ to: mockNavigateTo }, expect.anything());
  });

  test('should navigate to regular survey when publicAppletKey is not present', () => {
    // Setup
    const mockActiveAssessment = {
      appletId: 'applet-123',
      groupProgressId: 'activity-123/event-123/subject-123',
      publicAppletKey: null,
    };

    const mockGroupProgress = {
      type: ActivityPipelineType.Regular,
      currentActivityId: 'activity-123',
    };

    const mockActivityProgress = {
      step: 0,
      items: [{ id: 'item-0', responseType: 'text' }],
    };

    const mockNavigateTo = '/survey/applet-123/subject-123/activity-123/regular/event-123';
    vi.spyOn(ROUTES.survey, 'navigateTo').mockReturnValue(mockNavigateTo);

    // Render with preloaded state for both groupProgress and activityProgress
    renderWithProviders(<NavigateToActiveAssessment />, {
      preloadedState: {
        applets: {
          activeAssessment: mockActiveAssessment,
          groupProgress: {
            'activity-123/event-123/subject-123': mockGroupProgress,
          },
          progress: {
            'activity-123/event-123/subject-123': mockActivityProgress,
          },
        },
      } as unknown as PreloadedState<RootState>,
      disableRouter: true,
      mockDispatch,
    });

    // Assertions
    expect(ROUTES.survey.navigateTo).toHaveBeenCalledWith({
      appletId: 'applet-123',
      activityId: 'activity-123',
      entityType: 'regular',
      eventId: 'event-123',
      flowId: null,
      targetSubjectId: 'subject-123',
    });

    expect(Navigate).toHaveBeenCalledWith({ to: mockNavigateTo }, expect.anything());
  });

  test('should handle flow type correctly', () => {
    // Setup
    const mockActiveAssessment = {
      appletId: 'applet-123',
      groupProgressId: 'flow-123/event-123/subject-123',
      publicAppletKey: null,
    };

    const mockGroupProgress = {
      type: ActivityPipelineType.Flow,
      currentActivityId: 'activity-123',
    };

    const mockActivityProgress = {
      step: 0,
      items: [{ id: 'item-0', responseType: 'text' }],
    };

    const mockNavigateTo = '/survey/applet-123/subject-123/activity-123/flow/event-123';
    vi.spyOn(ROUTES.survey, 'navigateTo').mockReturnValue(mockNavigateTo);

    // Render with preloaded state for both groupProgress and activityProgress
    renderWithProviders(<NavigateToActiveAssessment />, {
      preloadedState: {
        applets: {
          activeAssessment: mockActiveAssessment,
          groupProgress: {
            'flow-123/event-123/subject-123': mockGroupProgress,
          },
          progress: {
            'activity-123/event-123/subject-123': mockActivityProgress,
          },
        },
      } as unknown as PreloadedState<RootState>,
      disableRouter: true,
      mockDispatch,
    });

    // Assertions
    expect(ROUTES.survey.navigateTo).toHaveBeenCalledWith({
      appletId: 'applet-123',
      activityId: 'activity-123',
      entityType: 'flow',
      eventId: 'event-123',
      flowId: 'flow-123',
      targetSubjectId: 'subject-123',
    });
  });
});
