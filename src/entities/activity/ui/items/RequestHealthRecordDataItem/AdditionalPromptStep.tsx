import { useContext } from 'react';

import { Box } from '@mui/material';

import { RegularGrid } from '../RadioItem/RegularGrid';

import requestHealthRecordDataIconSuccess from '~/assets/request-health-record-data-icon-success.svg';
import { RequestHealthRecordDataItem } from '~/entities/activity/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { ItemMarkdown } from '~/shared/ui';
import {
  addSurveyPropsToEvent,
  Mixpanel,
  MixpanelEventType,
  useCustomTranslation,
  useOnceEffect,
} from '~/shared/utils';

type AdditionalPromptStepProps = {
  item: RequestHealthRecordDataItem;
  replaceText: (value: string) => string;
};

export const AdditionalPromptStep = ({ item, replaceText }: AdditionalPromptStepProps) => {
  const { t } = useCustomTranslation();

  const { applet, activityId, flow, eventId, targetSubject } = useContext(SurveyContext);
  const { saveItemCustomProperty } = appletModel.hooks.useSaveItemAnswer({
    activityId,
    eventId,
    targetSubjectId: targetSubject?.id ?? null,
  });

  useOnceEffect(() => {
    if (item.ehrShareSuccess) {
      Mixpanel.track(
        addSurveyPropsToEvent(
          { action: MixpanelEventType.EHRProviderShareSuccess },
          {
            applet,
            activityId,
            flowId: flow?.id,
          },
        ),
      );
    }
  });

  const baseOption = {
    tooltip: null,
    image: null,
    score: null,
    color: null,
    isHidden: false,
    alert: null,
  };

  const additionalOptions = [
    {
      ...baseOption,
      id: 'requested',
      text: t('additional.yes'),
      value: 'requested',
    },
    {
      ...baseOption,
      id: 'done',
      text: t('additional.no'),
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
      gap="24px"
    >
      <Box display="flex" justifyContent="center">
        <img
          src={requestHealthRecordDataIconSuccess}
          alt={String(t('requestHealthRecordData.title'))}
        />
      </Box>

      <ItemMarkdown
        markdown={t('requestHealthRecordData.additionalPromptText')}
        sx={{ '&& > p': { mb: '24px' } }}
      />

      <RegularGrid
        itemId={`${item.id}-additional-prompt`}
        value={item.additionalEHRs}
        options={additionalOptions}
        onValueChange={(value) =>
          saveItemCustomProperty<RequestHealthRecordDataItem>(item.id, 'additionalEHRs', value)
        }
        replaceText={replaceText}
        isDisabled={false}
      />
    </Box>
  );
};
