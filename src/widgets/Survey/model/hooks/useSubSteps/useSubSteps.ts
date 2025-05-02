import { useCallback, useContext, useMemo } from 'react';

import { RequestHealthRecordDataItemStep } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { ItemRecord } from '~/entities/applet/model/types';
import { SurveyContext } from '~/features/PassSurvey';
import { EHRConsent } from '~/shared/api';
import { useCustomTranslation } from '~/shared/utils';

type UseSubStepsProps = {
  item: ItemRecord;
};

export const useSubSteps = ({ item }: UseSubStepsProps) => {
  const { t } = useCustomTranslation();
  const { activityId, eventId, targetSubject } = useContext(SurveyContext);
  const { setSubStep: setActivitySubStep } = appletModel.hooks.useActivityProgress();

  const setSubStep = useCallback(
    (subStep: number) => {
      setActivitySubStep({
        activityId,
        eventId,
        targetSubjectId: targetSubject?.id ?? null,
        subStep,
      });
    },
    [activityId, eventId, targetSubject?.id, setActivitySubStep],
  );

  const subStep = useMemo(() => {
    if (item.responseType === 'requestHealthRecordData') {
      return item.subStep;
    }

    return null;
  }, [item]);

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
  }, [hasNextSubStep, item, setSubStep, subStep]);

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
    handleNextSubStep,
    handlePrevSubStep,
    nextButtonText,
  };
};
