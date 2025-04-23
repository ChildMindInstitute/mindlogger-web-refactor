import { useMemo } from 'react';

import { Box } from '@mui/material';

import {
  RadioValues,
  RequestHealthRecordDataItem as RequestHealthRecordDataItemType,
} from '../../lib';
import { Answer } from '../../lib';
import { RegularGrid } from './RadioItem/RegularGrid';

import { REQUEST_HEALTH_RECORD_DATA_LINK } from '~/abstract/lib/constants';
import requestHealthRecordDataIcon from '~/assets/request-health-record-data-icon.svg';
import { Markdown } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

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
  const questionText = useMemo(() => replaceText(item.question), [item.question, replaceText]);

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

  const handleValueChange = (optionId: string) => {
    onValueChange([optionId]);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        fontWeight="400"
        fontSize="18px"
        lineHeight="28px"
        mb="48px"
        gap="24px"
      >
        <Box display="flex" justifyContent="center">
          <img src={requestHealthRecordDataIcon} alt={String(t('requestHealthRecordData.title'))} />
        </Box>

        {questionText && questionText.trim().length > 0 ? (
          <Markdown markdown={questionText} />
        ) : null}

        <p>
          <a href={REQUEST_HEALTH_RECORD_DATA_LINK} target="_blank" rel="noreferrer">
            {t('requestHealthRecordData.linkText')}
          </a>
        </p>
      </Box>

      <RegularGrid
        itemId={item.id}
        value={selectedOption}
        options={options}
        onValueChange={handleValueChange}
        replaceText={replaceText}
        isDisabled={false}
      />
    </>
  );
};
