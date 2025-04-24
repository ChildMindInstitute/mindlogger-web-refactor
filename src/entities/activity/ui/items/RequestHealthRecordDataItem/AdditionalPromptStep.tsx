import { useContext } from 'react';

import { Box, useTheme, useMediaQuery } from '@mui/material';

import { RegularGrid } from '../RadioItem/RegularGrid';

import requestHealthRecordDataIconSuccess from '~/assets/request-health-record-data-icon-success.svg';
import { RequestHealthRecordDataItem } from '~/entities/activity/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { Markdown } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

type AdditionalPromptStepProps = {
  item: RequestHealthRecordDataItem;
  replaceText: (value: string) => string;
};

export const AdditionalPromptStep = ({ item, replaceText }: AdditionalPromptStepProps) => {
  const { t } = useCustomTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { activityId, eventId, targetSubject } = useContext(SurveyContext);
  const { saveItemCustomProperty } = appletModel.hooks.useSaveItemAnswer({
    activityId,
    eventId,
    targetSubjectId: targetSubject?.id ?? null,
  });

  const additionalOptions = [
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
      gap="24px"
      textAlign={isMobile ? 'left' : 'center'}
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
          saveItemCustomProperty<RequestHealthRecordDataItem>(item.id, 'additionalEHRs', value)
        }
        replaceText={replaceText}
        isDisabled={false}
      />
    </Box>
  );
};
