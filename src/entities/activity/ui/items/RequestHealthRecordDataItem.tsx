import { useCallback, useContext, useMemo } from 'react';

import { Box } from '@mui/material';

import {
  RadioValues,
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataItem as RequestHealthRecordDataItemType,
} from '../../lib';
import { Answer } from '../../lib';
import { RegularGrid } from './RadioItem/RegularGrid';

import { REQUEST_HEALTH_RECORD_DATA_LINK } from '~/abstract/lib/constants';
import requestHealthRecordDataIcon from '~/assets/request-health-record-data-icon.svg';
import { SurveyContext } from '~/features/PassSurvey';
import { SliderAnimation } from '~/shared/animations';
import { Markdown, ItemMarkdown } from '~/shared/ui';
import { useCustomTranslation, usePrevious } from '~/shared/utils';

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
  const { t } = useCustomTranslation();
  const { activity } = useContext(SurveyContext);
  const consentMarkdown = useMemo(() => {
    const markdown = replaceText(item.question);

    return `${markdown}\n\n&nbsp;\n\n<a href="${REQUEST_HEALTH_RECORD_DATA_LINK}" target="_blank" rel="noreferrer">${t('requestHealthRecordData.linkText')}</a>`;
  }, [item.question, replaceText, t]);

  // Map opt-in and opt-out options to RadioValues format
  const options: RadioValues['options'] = useMemo(
    () =>
      item.responseValues.optInOutOptions.map((option) => ({
        id: option.id,
        text: option.label,
        tooltip: null,
        image: null,
        color: null,
        isHidden: false,
        alert: null,
        score: null,
        value: option.id,
      })),
    [item.responseValues.optInOutOptions],
  );

  const selectedOption = useMemo(
    () => (item.answer.length > 0 ? item.answer[0] : null),
    [item.answer],
  );

  const handleValueChange = useCallback(
    (optionId: string) => {
      onValueChange([optionId]);
    },
    [onValueChange],
  );

  const content = useMemo(() => {
    if (item.subStep === RequestHealthRecordDataItemStep.ConsentPrompt) {
      return (
        <Box
          display="flex"
          flex={1}
          flexDirection="column"
          fontWeight="400"
          fontSize="18px"
          lineHeight="28px"
          mb="48px"
          gap="24px"
        >
          <Box display="flex" justifyContent="center">
            <img
              src={requestHealthRecordDataIcon}
              alt={String(t('requestHealthRecordData.title'))}
            />
          </Box>

          <ItemMarkdown
            markdown={consentMarkdown}
            isOptional={item.config.skippableItem || activity.isSkippable}
          />

          <RegularGrid
            itemId={item.id}
            value={selectedOption}
            options={options}
            onValueChange={handleValueChange}
            replaceText={replaceText}
            isDisabled={false}
          />
        </Box>
      );
    }

    // TODO: Display appropriate substep screen for RequestHealthRecordDataItem
    return (
      <p>
        Step {item.subStep + 1} of {RequestHealthRecordDataItemStep.AdditionalPrompt + 1}
      </p>
    );
  }, [
    item.subStep,
    questionText,
    t,
    handleValueChange,
    item.id,
    options,
    replaceText,
    selectedOption,
  ]);

  const prevSubStep = usePrevious(item.subStep);

  return (
    <SliderAnimation step={item.subStep} prevStep={prevSubStep ?? item.subStep} key={item.subStep}>
      {content}
    </SliderAnimation>
  );
};
