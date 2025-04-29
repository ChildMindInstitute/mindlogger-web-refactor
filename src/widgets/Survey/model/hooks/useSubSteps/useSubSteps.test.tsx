import { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { useSubSteps } from './useSubSteps';

import {
  RequestHealthRecordDataItem,
  RequestHealthRecordDataItemStep,
  TextItem,
} from '~/entities/activity';
import { ItemRecord } from '~/entities/applet/model/types';
import { SurveyContext } from '~/features/PassSurvey';
import { SubjectDTO } from '~/shared/api/types/subject';

// Mock dependencies
const mockSetSubStep = vi.fn();
const mockSaveItemCustomProperty = vi.fn();

vi.mock('~/entities/applet', () => ({
  appletModel: {
    hooks: {
      useActivityProgress: vi.fn(() => ({
        setSubStep: mockSetSubStep,
      })),
      useSaveItemAnswer: vi.fn(() => ({
        saveItemCustomProperty: mockSaveItemCustomProperty,
      })),
    },
  },
}));

describe('useSubSteps', () => {
  // Common test data
  const mockContext: Partial<SurveyContext> = {
    activityId: 'activity-123',
    eventId: 'event-123',
    targetSubject: { id: 'subject-123' } as SubjectDTO,
  };

  const createMockEhrItem = (
    props: Partial<RequestHealthRecordDataItem>,
  ): Partial<RequestHealthRecordDataItem> => ({
    id: 'item-1',
    name: 'EHR Item',
    question: 'EHR Question',
    responseType: 'requestHealthRecordData' as const,
    config: {
      removeBackButton: false,
      skippableItem: false,
    },
    responseValues: {
      type: 'requestHealthRecordData' as const,
      optInOutOptions: [
        { id: 'opt_in', label: 'Opt In' },
        { id: 'opt_out', label: 'Opt Out' },
      ],
    },
    ...props,
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <SurveyContext.Provider value={mockContext as SurveyContext}>{children}</SurveyContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return null subStep for non-requestHealthRecordData items', () => {
    const mockItem: Partial<TextItem> = {
      id: 'item-1',
      responseType: 'text',
      answer: [],
      config: {
        removeBackButton: false,
        skippableItem: false,
        maxResponseLength: 0,
        correctAnswerRequired: false,
        correctAnswer: '',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        responseRequired: false,
      },
      name: 'Test Item',
      question: 'Test Question',
      order: 1,
      responseValues: null,
      conditionalLogic: null,
      isHidden: false,
    };

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    expect(result.current.subStep).toBeNull();
    expect(result.current.hasNextSubStep).toBe(false);
    expect(result.current.hasPrevSubStep).toBe(false);
    expect(result.current.nextButtonText).toBeUndefined();
  });

  test('should handle requestHealthRecordData item with sub steps', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      answer: ['opt_in'],
      additionalEHRs: null,
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    expect(result.current.subStep).toBe(RequestHealthRecordDataItemStep.ConsentPrompt);
    expect(result.current.hasNextSubStep).toBe(true);
    expect(result.current.hasPrevSubStep).toBe(false); // ConsentPrompt is the first step
    expect(result.current.nextButtonText).toBeUndefined();
  });

  test('should handle requestHealthRecordData item on OneUpHealth sub step', () => {
    // Setup a requestHealthRecordData item with OneUpHealth step
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      answer: ['opt_in'],
      additionalEHRs: null,
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    expect(result.current.subStep).toBe(RequestHealthRecordDataItemStep.OneUpHealth);
    expect(result.current.hasNextSubStep).toBe(false);
    expect(result.current.hasPrevSubStep).toBe(true);
    expect(result.current.nextButtonText).toBe('requestHealthRecordData.skipButtonText');
  });

  test('should handle hasPrevSubStep on OneUpHealth sub step with additionalEHRs requested', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      answer: ['opt_in'],
      additionalEHRs: 'requested',
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    expect(result.current.hasPrevSubStep).toBe(false); // Should be false when at OneUpHealth with additionalEHRs requested
  });

  test('should not have next step if user opted out', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      answer: ['opt_out'],
      additionalEHRs: null,
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    expect(result.current.hasNextSubStep).toBe(false); // No next step when opted out
  });

  test('should handle next sub step correctly', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      answer: ['opt_in'],
      additionalEHRs: null,
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    result.current.handleNextSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith({
      activityId: 'activity-123',
      eventId: 'event-123',
      targetSubjectId: 'subject-123',
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt + 1,
    });
  });

  test('should handle previous sub step correctly', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      answer: ['opt_in'],
      additionalEHRs: null,
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    result.current.handlePrevSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith({
      activityId: 'activity-123',
      eventId: 'event-123',
      targetSubjectId: 'subject-123',
      subStep: RequestHealthRecordDataItemStep.OneUpHealth - 1,
    });
  });

  test('should handle additional EHRs request', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
      answer: ['opt_in'],
      additionalEHRs: 'requested',
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    result.current.handleNextSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith({
      activityId: 'activity-123',
      eventId: 'event-123',
      targetSubjectId: 'subject-123',
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
    });
  });

  test('should handle setting sub step directly', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      answer: ['opt_in'],
      additionalEHRs: null,
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    result.current.setSubStep(RequestHealthRecordDataItemStep.OneUpHealth);

    expect(mockSetSubStep).toHaveBeenCalledWith({
      activityId: 'activity-123',
      eventId: 'event-123',
      targetSubjectId: 'subject-123',
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
    });
  });
});
