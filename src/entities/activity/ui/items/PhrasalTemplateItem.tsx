import { useMemo, useContext, useCallback, createRef, useState } from 'react';

import { Avatar, Button } from '@mui/material';
import html2canvas from 'html2canvas';

import { Document as ActionPlanDocument } from './ActionPlan/Document';
import { usePhrasalTemplateTranslation } from '../../lib/usePhrasalTemplateTranslation';

import downloadIconLight from '~/assets/download-icon-light.svg';
import downloadIconDark from '~/assets/download-icon.svg';
import { PhrasalTemplateItem as PhrasalTemplateItemType } from '~/entities/activity/lib';
import { SurveyContext } from '~/features/PassSurvey';
import { Theme } from '~/shared/constants';
import { Markdown } from '~/shared/ui';
import { Box, Text } from '~/shared/ui';

type PhrasalTemplateItemProps = {
  item: PhrasalTemplateItemType;
  replaceText: (value: string) => string;
};

export const PhrasalTemplateItem = ({ item, replaceText }: PhrasalTemplateItemProps) => {
  const { appletDisplayName } = useContext(SurveyContext);
  const [downloadIcon, setDownloadIcon] = useState(downloadIconDark);
  const questionText = useMemo(() => replaceText(item.question), [item.question, replaceText]);
  const ref = createRef<HTMLDivElement>();
  const { t } = usePhrasalTemplateTranslation();

  const handleDownloadImage = useCallback(async () => {
    if (!ref.current) {
      return;
    }

    const element = ref.current;
    const canvas = await html2canvas(element, { useCORS: true });

    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    link.href = data;
    link.download = `${t('filename', { appletName: appletDisplayName })}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [ref, t, appletDisplayName]);

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
        ref={ref}
        appletTitle={appletDisplayName}
        phrasalTemplateCardTitle={item.responseValues.cardTitle}
        phrases={item.responseValues.phrases}
      />
    </Box>
  );
};
