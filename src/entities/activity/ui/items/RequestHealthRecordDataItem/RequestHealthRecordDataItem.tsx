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

  return (
    <SliderAnimation step={item.subStep} prevStep={prevSubStep ?? item.subStep} key={item.subStep}>
      {content}
    </SliderAnimation>
  );
};
