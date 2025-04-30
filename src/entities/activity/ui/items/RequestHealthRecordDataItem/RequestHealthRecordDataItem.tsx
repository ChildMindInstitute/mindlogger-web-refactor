import { useContext, useMemo } from 'react';

import { AdditionalPromptStep } from './AdditionalPromptStep';
import { ConsentPromptStep } from './ConsentPromptStep';
import { OneUpHealthStep } from './OneUpHealthStep';
import { PartnershipStep } from './PartnershipStep';

import {
  Answer,
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataItem as RequestHealthRecordDataItemType,
} from '~/entities/activity/lib';
import { SurveyContext } from '~/features/PassSurvey';
import { SliderAnimation } from '~/shared/animations';
import { usePrevious } from '~/shared/utils';

type RequestHealthRecordDataItemProps = {
  item: RequestHealthRecordDataItemType;
  replaceText: (value: string) => string;
  onValueChange: (value: Answer) => void;
};

export const RequestHealthRecordDataItem = ({
  item,
  replaceText,
  onValueChange,
}: RequestHealthRecordDataItemProps) => {
  const { activity } = useContext(SurveyContext);

  const content = useMemo(() => {
    switch (item.subStep) {
      case RequestHealthRecordDataItemStep.ConsentPrompt:
        return (
          <ConsentPromptStep
            item={item}
            replaceText={replaceText}
            onValueChange={onValueChange}
            isSkippable={item.config.skippableItem || activity.isSkippable}
          />
        );

      case RequestHealthRecordDataItemStep.Partnership:
        return <PartnershipStep />;

      case RequestHealthRecordDataItemStep.OneUpHealth:
        return <OneUpHealthStep />;

      case RequestHealthRecordDataItemStep.AdditionalPrompt:
        return <AdditionalPromptStep item={item} replaceText={replaceText} />;
    }
  }, [item, activity.isSkippable, replaceText, onValueChange]);

  const prevSubStep = usePrevious(item.subStep);

  // Custom animation direction logic
  const customPrevStep = useMemo(() => {
    // If additional EHRs have been requested:
    if (item.additionalEHRs === 'requested') {
      // and if we're moving between OneUpHealth and AdditionalPrompt steps:
      if (
        item.subStep === RequestHealthRecordDataItemStep.AdditionalPrompt &&
        prevSubStep === RequestHealthRecordDataItemStep.OneUpHealth
      ) {
        // force the animation to appear as if we're moving forward (from a higher step number)
        return RequestHealthRecordDataItemStep.AdditionalPrompt + 1;
      }

      // or if we're moving from AdditionalPrompt back to OneUpHealth:
      if (
        item.subStep === RequestHealthRecordDataItemStep.OneUpHealth &&
        prevSubStep === RequestHealthRecordDataItemStep.AdditionalPrompt
      ) {
        // force the animation to appear as if we're moving backward (from a lower step number)
        return RequestHealthRecordDataItemStep.OneUpHealth - 1;
      }
    }

    // Default behavior for all other cases
    return prevSubStep ?? item.subStep;
  }, [item.subStep, prevSubStep, item.additionalEHRs]);

  return (
    <SliderAnimation step={item.subStep} prevStep={customPrevStep} key={item.subStep}>
      {content}
    </SliderAnimation>
  );
};
