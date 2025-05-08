import { useMemo, useContext, useCallback, useRef, useState, useLayoutEffect } from 'react';

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
  downloadPhrasalTemplateItem,
  getDocumentImageDataUris,
  objectUrlToFile,
} from '~/entities/activity/lib/downloadPhrasalTemplateItem';
import { SurveyContext } from '~/features/PassSurvey';
import { Theme } from '~/shared/constants';
import { Markdown } from '~/shared/ui';
import { Box, Text } from '~/shared/ui';
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

    console.log('Downloading image files');
    console.log('isMobile:', isMobile);

    if (isMobile) {
      if (mobileDownloadFiles && mobileDownloadFiles.length > 0) {
        console.log(`Downloading ${mobileDownloadFiles.length} files`);
        void navigator.share({ files: mobileDownloadFiles });
      } else {
        console.log('No files to download');
      }
    } else {
      void downloadPhrasalTemplateItem({
        documentId: documentIdRef.current,
        filename: [
          appletDisplayName,
          phrasalTemplateCardTitle,
          formatDate(new Date(), 'MM_dd_yyyy'),
        ].join('_'),
        share: false,
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
    // Fetch mobile download files
    async function effect() {
      if (documentIdRef.current) {
        console.log('Fetching mobile download files');
        const dataUris = await getDocumentImageDataUris({
          documentId: documentIdRef.current,
          single: false,
        });

        console.log('dataUris:', dataUris);

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
          const file = await objectUrlToFile(dataUris[dataUriIndex], getFilename(dataUriIndex));
          imageFiles.push(file);
        }

        console.log('imageFiles:', imageFiles);

        setMobileDownloadFiles(imageFiles);
      }
    }

    void effect();
  }, [appletDisplayName, documentIdRef, phrasalTemplateCardTitle]);

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
