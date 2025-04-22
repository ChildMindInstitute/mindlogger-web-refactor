import { useCallback, useContext, useMemo } from 'react';

import { RequestHealthRecordDataItemStep } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { ItemRecord } from '~/entities/applet/model/types';
import { SurveyContext } from '~/features/PassSurvey';

type UseSubStepsProps = {
  item: ItemRecord;
};

export const useSubSteps = ({ item }: UseSubStepsProps) => {
  const context = useContext(SurveyContext);
  const { setSubStep: setActivitySubStep } = appletModel.hooks.useActivityProgress();
  const setSubStep = useCallback(
    (subStep: number) => {
      setActivitySubStep({
        activityId: context.activityId,
        eventId: context.eventId,
        targetSubjectId: context.targetSubject?.id ?? null,
        subStep,
      });
    },
    [context.activityId, context.eventId, context.targetSubject?.id, setActivitySubStep],
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
      return subStep < RequestHealthRecordDataItemStep.AdditionalPrompt;
    }

    return false;
  }, [item, subStep]);

  const hasPrevSubStep = useMemo(() => {
    if (subStep === null) return false;

    if (item.responseType === 'requestHealthRecordData') {
      return subStep > RequestHealthRecordDataItemStep.ConsentPrompt;
    }

    return false;
  }, [item, subStep]);

  const handleNextSubStep = useCallback(() => {
    if (!hasNextSubStep || subStep === null) return;

    if (item.responseType === 'requestHealthRecordData') {
      setSubStep(subStep + 1);
    }
  }, [hasNextSubStep, item.responseType, setSubStep, subStep]);

  const handlePrevSubStep = useCallback(() => {
    if (!hasPrevSubStep || subStep === null) return;

    if (item.responseType === 'requestHealthRecordData') {
      setSubStep(subStep - 1);
    }
  }, [hasPrevSubStep, item.responseType, setSubStep, subStep]);

  return {
    subStep,
    hasNextSubStep,
    hasPrevSubStep,
    handleNextSubStep,
    handlePrevSubStep,
  };
};
