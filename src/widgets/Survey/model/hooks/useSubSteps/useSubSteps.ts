import { useCallback, useContext, useMemo } from 'react';

import { RequestHealthRecordDataItemStep } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { ItemRecord } from '~/entities/applet/model/types';
import { SurveyContext } from '~/features/PassSurvey';

type UseSubStepsProps = {
  item: ItemRecord;
};

export const useSubSteps = ({ item }: UseSubStepsProps) => {
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
      if (item.answer[0] !== 'opt_in') {
        return false;
      }

      return (
        item.additionalEHRs === 'requested' ||
        subStep < RequestHealthRecordDataItemStep.AdditionalPrompt
      );
    }

    return false;
  }, [item, subStep]);

  const hasPrevSubStep = useMemo(() => {
    if (subStep === null) return false;

    if (item.responseType === 'requestHealthRecordData') {
      return (
        subStep > RequestHealthRecordDataItemStep.ConsentPrompt &&
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
          // If requested to add additional EHRs, return to OneUpHealth
          setSubStep(RequestHealthRecordDataItemStep.OneUpHealth);
        }
      } else {
        setSubStep(subStep + 1);
      }
    }
  }, [hasNextSubStep, item, setSubStep, subStep]);

  const handlePrevSubStep = useCallback(() => {
    if (!hasPrevSubStep || subStep === null) return;

    if (item.responseType === 'requestHealthRecordData') {
      setSubStep(subStep - 1);
    }
  }, [hasPrevSubStep, item, setSubStep, subStep]);

  const isBackHidden = useMemo(() => {
    if (item.responseType === 'requestHealthRecordData') {
      return subStep === RequestHealthRecordDataItemStep.OneUpHealth;
    }

    return false;
  }, [item, subStep]);

  const isNextHidden = useMemo(() => {
    if (item.responseType === 'requestHealthRecordData') {
      return subStep === RequestHealthRecordDataItemStep.OneUpHealth;
    }

    return false;
  }, [item, subStep]);

  return {
    subStep,
    setSubStep,
    hasNextSubStep,
    hasPrevSubStep,
    handleNextSubStep,
    handlePrevSubStep,
    isBackHidden,
    isNextHidden,
  };
};
