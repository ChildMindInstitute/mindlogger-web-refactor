import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Avatar, Button } from '@mui/material';
import { format as formatDate } from 'date-fns';
import { isMobile } from 'react-device-detect';
import { v4 as uuidV4 } from 'uuid';

import { Document as ActionPlanDocument } from './ActionPlan/Document';
import { usePhrasalTemplateTranslation } from '../../lib/usePhrasalTemplateTranslation';

import downloadIconLight from '~/assets/download-icon-light.svg';
import downloadIconDark from '~/assets/download-icon.svg';
import { PhrasalTemplateItem as PhrasalTemplateItemType } from '~/entities/activity/lib';
import {
  dataUriToFile,
  downloadPhrasalTemplateItemDesktop,
  getDocumentImageDataUris,
} from '~/entities/activity/lib/downloadPhrasalTemplateItem';
import { SurveyContext } from '~/features/PassSurvey';
import { Box, Markdown, Text } from '~/shared/ui';
import {
  addSurveyPropsToEvent,
  Mixpanel,
  MixpanelEventType,
  MixpanelProps,
  useOnceEffect,
} from '~/shared/utils';

type PhrasalTemplateItemProps = {
  item: PhrasalTemplateItemType;
  replaceText: (value: string) => string;
};

export const PhrasalTemplateItem = ({ item, replaceText }: PhrasalTemplateItemProps) => {
  const { appletDisplayName, applet, activity, activityId, flow } = useContext(SurveyContext);
  const phrasalTemplateCardTitle = item.responseValues.cardTitle;
  const [downloadIcon, setDownloadIcon] = useState(downloadIconDark);
  const questionText = useMemo(() => replaceText(item.question), [item.question, replaceText]);
  const documentIdRef = useRef<string>(uuidV4());
  const { t } = usePhrasalTemplateTranslation();
  const [mobileDownloadFiles, setMobileDownloadFiles] = useState<File[] | null>(null);

  const phraseBuilderCount = activity.items.filter(
    (i) => i.responseType === 'phrasalTemplate',
  ).length;

  const handleDownloadImage = useCallback(() => {
    Mixpanel.track(
      addSurveyPropsToEvent(
        {
          action: MixpanelEventType.ResponseReportDownloadClicked,
          [MixpanelProps.ItemId]: item.id,
          [MixpanelProps.TotalResponseReports]: phraseBuilderCount,
        },
        { applet, activityId, flowId: flow?.id },
      ),
    );

    if (isMobile) {
      if (mobileDownloadFiles && mobileDownloadFiles.length > 0) {
        void navigator.share({ files: mobileDownloadFiles });
      }
    } else {
      void downloadPhrasalTemplateItemDesktop({
        documentId: documentIdRef.current,
        filename: [
          appletDisplayName,
          phrasalTemplateCardTitle,
          formatDate(new Date(), 'MM_dd_yyyy'),
        ].join('_'),
        single: false,
      });
    }
  }, [
    activityId,
    applet,
    appletDisplayName,
    flow?.id,
    item.id,
    phrasalTemplateCardTitle,
    phraseBuilderCount,
    mobileDownloadFiles,
  ]);

  useOnceEffect(() => {
    Mixpanel.track(
      addSurveyPropsToEvent(
        {
          action: MixpanelEventType.ResponseReportGenerated,
          [MixpanelProps.ItemId]: item.id,
          [MixpanelProps.TotalResponseReports]: phraseBuilderCount,
        },
        { applet, activityId, flowId: flow?.id },
      ),
    );
  });

  useLayoutEffect(() => {
    if (!isMobile) {
      return;
    }

    // Fetch mobile download files
    const interval = setInterval(async () => {
      if (documentIdRef.current) {
        const dataUris = await getDocumentImageDataUris({
          documentId: documentIdRef.current,
          single: false,
        });

        const fileName = [
          appletDisplayName,
          phrasalTemplateCardTitle,
          formatDate(new Date(), 'MM_dd_yyyy'),
        ].join('_');

        const getFilename = (index: number) => {
          const filename =
            dataUris.length <= 1 ? fileName : `${fileName}_${index + 1}of${dataUris.length}`;
          return `${filename}.jpg`;
        };

        const imageFiles: File[] = [];
        for (let dataUriIndex = 0; dataUriIndex < dataUris.length; dataUriIndex++) {
          const file = dataUriToFile(dataUris[dataUriIndex], getFilename(dataUriIndex));
          imageFiles.push(file);
        }

        if (imageFiles.length > 0) {
          clearInterval(interval);
          setMobileDownloadFiles(imageFiles);
        }
      }
    }, 0);

    return () => clearInterval(interval);
  }, [appletDisplayName, documentIdRef, phrasalTemplateCardTitle]);

  return (
    <Box gap="24px" display={'flex'} flexDirection={'column'} alignItems="center">
      <Box gap="8px" display={'flex'} flexDirection={'column'} alignItems="center">
        <Text variant="headlineSmall">{t('title')}</Text>
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
        variant="tonal"
        disableElevation={true}
        onMouseEnter={() => setDownloadIcon(downloadIconLight)}
        onMouseLeave={() => setDownloadIcon(downloadIconDark)}
        onClick={handleDownloadImage}
        disabled={isMobile && !mobileDownloadFiles}
        sx={{
          width: '172px',
          padding: '10px 24px 10px 16px',
        }}
        startIcon={
          <Avatar src={downloadIcon} variant="square" sx={{ width: '18px', height: '18px' }} />
        }
      >
        <Text variant="titleSmall">{t('download')}</Text>
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
