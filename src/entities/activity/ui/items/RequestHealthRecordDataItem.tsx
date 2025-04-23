import { useContext, useMemo } from 'react';

import { Box } from '@mui/material';

import {
  RadioValues,
  RequestHealthRecordDataItemStep,
  RequestHealthRecordDataItem as RequestHealthRecordDataItemType,
} from '../../lib';
import { Answer } from '../../lib';
import { RegularGrid } from './RadioItem/RegularGrid';

import { REQUEST_HEALTH_RECORD_DATA_LINK } from '~/abstract/lib/constants';
import requestHealthRecordDataIconSuccess from '~/assets/request-health-record-data-icon-success.svg';
import requestHealthRecordDataIcon from '~/assets/request-health-record-data-icon.svg';
import requestHealthRecordDataPartnership from '~/assets/request-health-record-data-partnership.svg';
import { appletModel } from '~/entities/applet';
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
  const { activity, activityId, eventId, targetSubject } = useContext(SurveyContext);
  const { saveItemCustomProperty } = appletModel.hooks.useSaveItemAnswer({
    activityId,
    eventId,
    targetSubjectId: targetSubject?.id ?? null,
  });

  const consentMarkdown = useMemo(() => {
    const markdown = replaceText(item.question);

    return `${markdown}\n\n&nbsp;\n\n<a href="${REQUEST_HEALTH_RECORD_DATA_LINK}" target="_blank" rel="noreferrer">${t('requestHealthRecordData.linkText')}</a>`;
  }, [item.question, replaceText, t]);

  const content = useMemo(() => {
    switch (item.subStep) {
      case RequestHealthRecordDataItemStep.ConsentPrompt:
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
            mb="48px"
            gap="24px"
          >
            <Box display="flex" justifyContent="center">
              <img
                src={requestHealthRecordDataIcon}
                alt={String(t('requestHealthRecordData.title'))}
              />
            </Box>

            <Box mb="24px">
              <ItemMarkdown
                markdown={consentMarkdown}
                isOptional={item.config.skippableItem || activity.isSkippable}
              />
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

      case RequestHealthRecordDataItemStep.Partnership:
        return (
          <Box
            display="flex"
            flexDirection="column"
            fontWeight="400"
            fontSize="18px"
            lineHeight="28px"
            mb="48px"
            gap="24px"
            textAlign="center"
          >
            <Box display="flex" justifyContent="center" my="22px">
              <img
                src={requestHealthRecordDataPartnership}
                alt={String(t('requestHealthRecordData.title'))}
              />
            </Box>

            <Markdown
              markdown={t('requestHealthRecordData.partnershipText')}
              sx={{ '&& p': { mb: '24px' } }}
            />
          </Box>
        );

      case RequestHealthRecordDataItemStep.OneUpHealth:
        return <p>TODO: iframe</p>;

      case RequestHealthRecordDataItemStep.AdditionalPrompt:
        const additionalOptions: RadioValues['options'] = [
          {
            id: 'requested',
            text: t('additional.yes'),
            tooltip: null,
            image: null,
            score: null,
            color: null,
            isHidden: false,
            alert: null,
            value: 'requested',
          },
          {
            id: 'done',
            text: t('additional.no'),
            tooltip: null,
            image: null,
            score: null,
            color: null,
            isHidden: false,
            alert: null,
            value: 'done',
          },
        ];

        return (
          <Box
            display="flex"
            flexDirection="column"
            fontWeight="400"
            fontSize="18px"
            lineHeight="28px"
            mb="48px"
            gap="24px"
            textAlign="center"
          >
            <Box display="flex" justifyContent="center">
              <img
                src={requestHealthRecordDataIconSuccess}
                alt={String(t('requestHealthRecordData.title'))}
              />
            </Box>

            <Markdown
              markdown={t('requestHealthRecordData.additionalPromptText')}
              sx={{ '&& p': { mb: '24px' } }}
            />

            <RegularGrid
              itemId={`${item.id}-additional-prompt`}
              value={item.additionalEHRs}
              options={additionalOptions}
              onValueChange={(value) =>
                saveItemCustomProperty<RequestHealthRecordDataItemType>(
                  item.id,
                  'additionalEHRs',
                  value,
                )
              }
              replaceText={replaceText}
              isDisabled={false}
            />
          </Box>
        );
    }
  }, [
    item.subStep,
    item.responseValues.optInOutOptions,
    item.config.skippableItem,
    item.id,
    item.answer,
    item.additionalEHRs,
    t,
    consentMarkdown,
    activity.isSkippable,
    replaceText,
    onValueChange,
    saveItemCustomProperty,
  ]);

  const prevSubStep = usePrevious(item.subStep);

  return (
    <SliderAnimation step={item.subStep} prevStep={prevSubStep ?? item.subStep} key={item.subStep}>
      {content}
    </SliderAnimation>
  );
};
