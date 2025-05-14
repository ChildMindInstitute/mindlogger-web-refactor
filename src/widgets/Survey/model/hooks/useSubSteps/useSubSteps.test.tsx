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
import { SubjectDTO, EHRConsent } from '~/shared/api';

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
        { id: EHRConsent.OptIn, label: 'Opt In' },
        { id: EHRConsent.OptOut, label: 'Opt Out' },
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

  test('should handle ConsentPrompt sub step', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      answer: [EHRConsent.OptIn],
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

  test('should handle OneUpHealth sub step without additional EHRs requested', () => {
    // Setup a requestHealthRecordData item with OneUpHealth step
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      answer: [EHRConsent.OptIn],
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

  test('should handle AdditionalPrompt sub step with additional EHRs requested', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
      answer: [EHRConsent.OptIn],
      additionalEHRs: 'requested',
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    expect(result.current.subStep).toBe(RequestHealthRecordDataItemStep.AdditionalPrompt);
    expect(result.current.hasNextSubStep).toBe(true); // Should have next step when additionalEHRs is requested
    expect(result.current.hasPrevSubStep).toBe(false); // AdditionalPrompt should not have prev step
    expect(result.current.nextButtonText).toBeUndefined();
  });

  test('should not have next step if user opted out', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      answer: [EHRConsent.OptOut],
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
      answer: [EHRConsent.OptIn],
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

  test('should handle previous sub step correctly without additional EHRs requested', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      answer: [EHRConsent.OptIn],
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

  test('should handle next sub step correctly with additional EHRs explicitly not requested', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      answer: [EHRConsent.OptIn],
      additionalEHRs: 'done',
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    // When additionalEHRs is 'done', we should not have a next step
    expect(result.current.hasNextSubStep).toBe(false);

    result.current.handleNextSubStep();

    expect(mockSetSubStep).not.toHaveBeenCalled();
  });

  test('should handle additional EHRs request - navigating from AdditionalPrompt to OneUpHealth', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
      answer: [EHRConsent.OptIn],
      additionalEHRs: 'requested',
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    // When additionalEHRs is 'requested', we should have a next step from AdditionalPrompt
    expect(result.current.hasNextSubStep).toBe(true);

    result.current.handleNextSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith({
      activityId: 'activity-123',
      eventId: 'event-123',
      targetSubjectId: 'subject-123',
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
    });
  });

  test('should handle additional EHRs request - navigating from OneUpHealth to AdditionalPrompt', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.OneUpHealth,
      answer: [EHRConsent.OptIn],
      additionalEHRs: 'requested',
    });

    const { result } = renderHook(() => useSubSteps({ item: mockItem as ItemRecord }), {
      wrapper,
    });

    result.current.handlePrevSubStep();

    expect(mockSetSubStep).toHaveBeenCalledWith({
      activityId: 'activity-123',
      eventId: 'event-123',
      targetSubjectId: 'subject-123',
      subStep: RequestHealthRecordDataItemStep.AdditionalPrompt,
    });
  });

  test('should handle setting sub step directly', () => {
    const mockItem = createMockEhrItem({
      subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
      answer: [EHRConsent.OptIn],
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
