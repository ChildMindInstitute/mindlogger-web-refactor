import { validateBeforeMoveForward } from './validateItem';

import { RequestHealthRecordDataItem, RequestHealthRecordDataItemStep } from '~/entities/activity';
import { EHRConsent, ActivityDTO } from '~/shared/api';

describe('validateBeforeMoveForward', () => {
  // Mock functions for warnings
  const showWarning = jest.fn();
  const hideWarning = jest.fn();

  // Mock activity
  const activity: ActivityDTO = {
    id: 'test-activity',
    name: 'Test Activity',
    description: 'Test activity description',
    splashScreen: '',
    isSkippable: false,
    isReviewable: false,
    responseIsEditable: false,
    isHidden: false,
    scoresAndReports: {
      generateReport: false,
      showScoreSummary: false,
      reports: [],
    },
    items: [],
    showAllAtOnce: false,
    createdAt: '2023-01-01T00:00:00Z',
    image: '',
    order: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RequestHealthRecordData item type', () => {
    it('should allow skipping when skippableItem is true', () => {
      // Create a RequestHealthRecordData item with skippableItem set to true
      const item: RequestHealthRecordDataItem = {
        id: 'test-item',
        name: 'Test Item',
        question: 'Test question',
        order: 1,
        responseType: 'requestHealthRecordData',
        config: {
          removeBackButton: false,
          skippableItem: true,
        },
        responseValues: {
          type: 'requestHealthRecordData',
          optInOutOptions: [
            {
              id: EHRConsent.OptIn,
              label: 'Opt In',
            },
            {
              id: EHRConsent.OptOut,
              label: 'Opt Out',
            },
          ],
        },
        answer: [],
        conditionalLogic: null,
        isHidden: false,
        subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
        additionalEHRs: null,
      };

      // Test validation
      const result = validateBeforeMoveForward({
        item,
        activity,
        showWarning,
        hideWarning,
      });

      // Expect the validation to pass (allow skipping)
      expect(result).toBe(true);
      expect(hideWarning).toHaveBeenCalled();
      expect(showWarning).not.toHaveBeenCalled();
    });

    it('should not allow skipping when skippableItem is false', () => {
      // Create a RequestHealthRecordData item with skippableItem set to false
      const item: RequestHealthRecordDataItem = {
        id: 'test-item',
        name: 'Test Item',
        question: 'Test question',
        order: 1,
        responseType: 'requestHealthRecordData',
        config: {
          removeBackButton: false,
          skippableItem: false,
        },
        responseValues: {
          type: 'requestHealthRecordData',
          optInOutOptions: [
            {
              id: EHRConsent.OptIn,
              label: 'Opt In',
            },
            {
              id: EHRConsent.OptOut,
              label: 'Opt Out',
            },
          ],
        },
        answer: [],
        conditionalLogic: null,
        isHidden: false,
        subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
        additionalEHRs: null,
      };

      // Test validation
      const result = validateBeforeMoveForward({
        item,
        activity,
        showWarning,
        hideWarning,
      });

      // Expect the validation to fail (not allow skipping)
      expect(result).toBe(false);
      expect(hideWarning).not.toHaveBeenCalled();
      expect(showWarning).toHaveBeenCalledWith('pleaseAnswerTheQuestion');
    });

    it('should allow skipping when activity is skippable regardless of item config', () => {
      // Create a RequestHealthRecordData item with skippableItem set to false
      const item: RequestHealthRecordDataItem = {
        id: 'test-item',
        name: 'Test Item',
        question: 'Test question',
        order: 1,
        responseType: 'requestHealthRecordData',
        config: {
          removeBackButton: false,
          skippableItem: false,
        },
        responseValues: {
          type: 'requestHealthRecordData',
          optInOutOptions: [
            {
              id: EHRConsent.OptIn,
              label: 'Opt In',
            },
            {
              id: EHRConsent.OptOut,
              label: 'Opt Out',
            },
          ],
        },
        answer: [],
        conditionalLogic: null,
        isHidden: false,
        subStep: RequestHealthRecordDataItemStep.ConsentPrompt,
        additionalEHRs: null,
      };

      // Create a skippable activity
      const skippableActivity: ActivityDTO = {
        ...activity,
        isSkippable: true,
      };

      // Test validation
      const result = validateBeforeMoveForward({
        item,
        activity: skippableActivity,
        showWarning,
        hideWarning,
      });

      // Expect the validation to pass (allow skipping)
      expect(result).toBe(true);
      expect(hideWarning).toHaveBeenCalled();
      expect(showWarning).not.toHaveBeenCalled();
    });
  });
});
