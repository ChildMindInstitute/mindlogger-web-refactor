import { useMemo } from 'react';

import { Box } from '@mui/material';

import { RegularGrid } from '../RadioItem/RegularGrid';

import { REQUEST_HEALTH_RECORD_DATA_LINK } from '~/abstract/lib/constants';
import requestHealthRecordDataIcon from '~/assets/request-health-record-data-icon.svg';
import { Answer, RadioValues, RequestHealthRecordDataItem } from '~/entities/activity/lib';
import { ItemMarkdown } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

type ConsentPromptStepProps = {
  item: RequestHealthRecordDataItem;
  replaceText: (value: string) => string;
  onValueChange: (value: Answer) => void;
  isSkippable: boolean;
};

export const ConsentPromptStep = ({
  item,
  replaceText,
  onValueChange,
  isSkippable,
}: ConsentPromptStepProps) => {
  const { t } = useCustomTranslation();

  const consentMarkdown = useMemo(() => {
    const markdown = replaceText(item.question);

    return `${markdown}\n\n&nbsp;\n\n<a href="${REQUEST_HEALTH_RECORD_DATA_LINK}" target="_blank" rel="noreferrer">${t('requestHealthRecordData.linkText')}</a>`;
  }, [item.question, replaceText, t]);

  // Map opt-in and opt-out options to RadioValues format
  const consentOptions: RadioValues['options'] = item.responseValues.optInOutOptions.map(
    (option) => ({
      id: option.id,
      text: option.label,
      tooltip: null,
      image: null,
      color: null,
      isHidden: false,
      alert: null,
      score: null,
      value: option.id,
    }),
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      fontWeight="400"
      fontSize="18px"
      lineHeight="28px"
      gap="24px"
    >
      <Box display="flex" justifyContent="center">
        <img src={requestHealthRecordDataIcon} alt={String(t('requestHealthRecordData.title'))} />
      </Box>

      <Box mb="24px">
        <ItemMarkdown markdown={consentMarkdown} isOptional={isSkippable} />
      </Box>

      <RegularGrid
        itemId={item.id}
        value={item.answer.length > 0 ? item.answer[0] : null}
        options={consentOptions}
        onValueChange={(optionId: string) => onValueChange([optionId])}
        replaceText={replaceText}
        isDisabled={false}
      />
    </Box>
  );
};
