import { useCallback, useContext, useMemo } from 'react';

import { RequestHealthRecordDataItem, RequestHealthRecordDataItemStep } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { ItemRecord } from '~/entities/applet/model/types';
import { SurveyContext } from '~/features/PassSurvey';
import { EHRConsent } from '~/shared/api';
import {
  addSurveyPropsToEvent,
  Mixpanel,
  MixpanelEventType,
  useCustomTranslation,
} from '~/shared/utils';

type UseSubStepsProps = {
  item: ItemRecord;
};

export const useSubSteps = ({ item }: UseSubStepsProps) => {
  const { t } = useCustomTranslation();
  const { applet, activityId, flow, eventId, targetSubject } = useContext(SurveyContext);
  const { setSubStep: setActivitySubStep } = appletModel.hooks.useActivityProgress();

  const setSubStep = useCallback(
    (subStep: number) => {
      setActivitySubStep({
        activityId,
        eventId,
        targetSubjectId: targetSubject?.id ?? null,
        item,
        subStep,
      });
    },
    [setActivitySubStep, activityId, eventId, targetSubject?.id, item],
  );

  const { saveItemCustomProperty } = appletModel.hooks.useSaveItemAnswer({
    activityId,
    eventId,
    targetSubjectId: targetSubject?.id ?? null,
  });

  const subStep = useMemo(() => {
    if (item.responseType === 'requestHealthRecordData') {
      return item.subStep;
    }

    return null;
  }, [item]);

  /**
   * Returns true if there is a next sub-step (and handleNextSubStep should be called when the
   * Next button is pressed), false otherwise.
   */
  const hasNextSubStep = useMemo(() => {
    if (subStep === null) return false;

    if (item.responseType === 'requestHealthRecordData') {
      return (
        // Go to the next substep only if the user has opted in to sharing EHR data, and
        (item.answer[0] as EHRConsent) === EHRConsent.OptIn &&
        // we're not on the OneUpHealth step (user should be skipped to next item instead), and
        subStep !== RequestHealthRecordDataItemStep.OneUpHealth &&
        // we're before the last sub-step OR additional EHRs have been requested
        (subStep < RequestHealthRecordDataItemStep.AdditionalPrompt ||
          item.additionalEHRs === 'requested')
      );
    }

    return false;
  }, [item, subStep]);

  /**
   * Returns true if there is a previous sub-step (and handlePrevSubStep should be called when the
   * Back button is pressed), false otherwise.
   */
  const hasPrevSubStep = useMemo(() => {
    if (subStep === null) return false;

    if (item.responseType === 'requestHealthRecordData') {
      return (
        // Go to the previous substep only if we're after the first step, and
        subStep > RequestHealthRecordDataItemStep.ConsentPrompt &&
        // we're not on the AdditionalPrompt step
        subStep !== RequestHealthRecordDataItemStep.AdditionalPrompt
      );
    }

    return false;
  }, [item, subStep]);

  /**
   * Handle any submission logic for a sub-step, called before navigating to the next sub-step (or
   * submitting the activity, if the item is the last step).
   */
  const handleSubmitSubStep = useCallback(() => {
    if (subStep === null) return;

    if (item.responseType === 'requestHealthRecordData') {
      if (subStep === RequestHealthRecordDataItemStep.OneUpHealth) {
        // When clicking next on this step, it means the user has skipped the EHR search
        if (item.additionalEHRs === null) {
          // Only track a skipped status (used for Mixpanel tracking) and Mixpanel event if no
          // additional EHRs have been requested yet
          saveItemCustomProperty<RequestHealthRecordDataItem>(item.id, 'ehrSearchSkipped', true);

          Mixpanel.track(
            addSurveyPropsToEvent(
              { action: MixpanelEventType.EHRProviderSearchSkipped },
              {
                applet,
                activityId,
                flowId: flow?.id,
              },
            ),
          );
        }
      }
    }
  }, [subStep, item, saveItemCustomProperty, applet, activityId, flow?.id]);

  /**
   * Handles the logic for controlling navigation to the next sub-step when the Next button is
   * pressed.
   */
  const handleNextSubStep = useCallback(() => {
    if (!hasNextSubStep || subStep === null) return;

    if (item.responseType === 'requestHealthRecordData') {
      if (subStep === RequestHealthRecordDataItemStep.AdditionalPrompt) {
        if (item.additionalEHRs === 'requested') {
          // If requested to add additional EHRs, return to OneUpHealth step
          setSubStep(RequestHealthRecordDataItemStep.OneUpHealth);
        }
      } else {
        // Go to the next substep
        setSubStep(subStep + 1);
      }
    }
  }, [hasNextSubStep, subStep, item, setSubStep]);

  /**
   * Handles the logic for controlling navigation to the previous sub-step when the Back button is
   * pressed.
   */
  const handlePrevSubStep = useCallback(() => {
    if (!hasPrevSubStep || subStep === null) return;

    if (item.responseType === 'requestHealthRecordData') {
      if (
        subStep === RequestHealthRecordDataItemStep.OneUpHealth &&
        item.additionalEHRs === 'requested'
      ) {
        // Go back to the AdditionalPrompt step if we're on the OneUpHealth step and
        // additional EHRs have been requested
        setSubStep(RequestHealthRecordDataItemStep.AdditionalPrompt);
      } else {
        // Else go to the previous substep
        setSubStep(subStep - 1);
      }
    }
  }, [hasPrevSubStep, item, setSubStep, subStep]);

  /**
   * Returns the text to be displayed on the "Next" button.
   */
  const nextButtonText = useMemo(() => {
    if (item.responseType === 'requestHealthRecordData') {
      if (subStep === RequestHealthRecordDataItemStep.OneUpHealth) {
        // If at the OneUpHealth step, the "Next" button should show "Skip"
        return t('requestHealthRecordData.skipButtonText');
      }
    }

    return undefined;
  }, [item, subStep, t]);

  return {
    subStep,
    setSubStep,
    hasNextSubStep,
    hasPrevSubStep,
    handleSubmitSubStep,
    handleNextSubStep,
    handlePrevSubStep,
    nextButtonText,
  };
};
