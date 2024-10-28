import { useMemo, useContext, useCallback, useRef, useState } from 'react';

import { Avatar, Button } from '@mui/material';
import { format as formatDate } from 'date-fns';
import { isMobile } from 'react-device-detect';
import { v4 as uuidV4 } from 'uuid';

import { Document as ActionPlanDocument } from './ActionPlan/Document';
import { usePhrasalTemplateTranslation } from '../../lib/usePhrasalTemplateTranslation';

import downloadIconLight from '~/assets/download-icon-light.svg';
import downloadIconDark from '~/assets/download-icon.svg';
import { PhrasalTemplateItem as PhrasalTemplateItemType } from '~/entities/activity/lib';
import { downloadPhrasalTemplateItem } from '~/entities/activity/lib/downloadPhrasalTemplateItem';
import { SurveyContext } from '~/features/PassSurvey';
import { Theme } from '~/shared/constants';
import { Markdown } from '~/shared/ui';
import { Box, Text } from '~/shared/ui';
import { addSurveyPropsToEvent, Mixpanel, MixpanelEventType, useOnceEffect } from '~/shared/utils';

type PhrasalTemplateItemProps = {
  item: PhrasalTemplateItemType;
  replaceText: (value: string) => string;
};

export const PhrasalTemplateItem = ({ item, replaceText }: PhrasalTemplateItemProps) => {
  const { appletDisplayName } = useContext(SurveyContext);
  const phrasalTemplateCardTitle = item.responseValues.cardTitle;
  const [downloadIcon, setDownloadIcon] = useState(downloadIconDark);
  const questionText = useMemo(() => replaceText(item.question), [item.question, replaceText]);
  const documentIdRef = useRef<string>(uuidV4());
  const { t } = usePhrasalTemplateTranslation();
  const { applet, activityId, flow } = useContext(SurveyContext);

  const handleDownloadImage = useCallback(async () => {
    Mixpanel.track(
      addSurveyPropsToEvent(
        { action: MixpanelEventType.ReportDownloadClicked },
        { applet, activityId, flowId: flow?.id },
      ),
    );

    await downloadPhrasalTemplateItem({
      documentId: documentIdRef.current,
      filename: [
        appletDisplayName,
        phrasalTemplateCardTitle,
        formatDate(new Date(), 'MM_dd_yyyy'),
      ].join('_'),
      share: isMobile,
      single: false,
    });
  }, [activityId, applet, appletDisplayName, flow?.id, phrasalTemplateCardTitle]);

  useOnceEffect(() =>
    Mixpanel.track(
      addSurveyPropsToEvent(
        { action: MixpanelEventType.ReportGenerated },
        { applet, activityId, flowId: flow?.id },
      ),
    ),
  );

  return (
    <Box gap="24px" display={'flex'} flexDirection={'column'} alignItems="center">
      <Box gap="8px" display={'flex'} flexDirection={'column'} alignItems="center">
        <Text fontWeight="400" fontSize="24px" lineHeight="32px">
          {t('title')}
        </Text>
        {questionText && questionText.trim().length > 0 ? (
          <Box
            sx={{
              fontWeight: '400',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.15px',
              textAlign: 'center',
            }}
          >
            <Markdown markdown={questionText} />
          </Box>
        ) : null}
      </Box>
      <Button
        type="button"
        variant="contained"
        disableElevation={true}
        onMouseEnter={() => setDownloadIcon(downloadIconLight)}
        onMouseLeave={() => setDownloadIcon(downloadIconDark)}
        onClick={handleDownloadImage}
        sx={{
          width: '172px',
          height: '48px',
          padding: '10px 24px 10px 16px',
          borderRadius: '100px',
          backgroundColor: Theme.colors.light.secondaryContainer,

          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '20px',
          letterSpacing: '0.1px',
          color: Theme.colors.light.onSecondaryContainer,
          textTransform: 'none',

          // Hover styles
          '&:hover': {
            color: Theme.colors.light.onPrimary,
          },
        }}
        startIcon={
          <Avatar src={downloadIcon} variant="square" sx={{ width: '18px', height: '18px' }} />
        }
      >
        {t('download')}
      </Button>
      <ActionPlanDocument
        documentId={documentIdRef.current}
        appletTitle={appletDisplayName}
        phrasalTemplateCardTitle={phrasalTemplateCardTitle}
        phrases={item.responseValues.phrases}
      />
    </Box>
  );
};
