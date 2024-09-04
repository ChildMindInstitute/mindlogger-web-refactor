import { useContext } from 'react';

import { Body } from './Body';
import { DocumentContext } from './DocumentContext';
import { Header } from './Header';
import {
  usePDFPageWidth,
  useXScaledDimension,
  useBackgroundHeight,
  useBackgroundWidth,
} from './hooks';
import { ActivitiesPhrasalData } from './phrasalData';
import { Phrase } from './Phrase';
import { Title } from './Title';

import footerLogo from '~/assets/mindlogger-action-plan-footer-logo.svg';
import { PhrasalTemplatePhrase } from '~/entities/activity/lib';
import { useActionPlanTranslation } from '~/entities/activity/lib/useActionPlanTranslation';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';

type PageProps = {
  pageNumber: number;
  phrases: PhrasalTemplatePhrase[];
  phrasalData: ActivitiesPhrasalData;
  appletTitle: string;
  phrasalTemplateCardTitle: string;
};

export const Page = ({
  appletTitle,
  phrasalTemplateCardTitle,
  phrases,
  phrasalData,
  pageNumber,
}: PageProps) => {
  const { totalPages } = useContext(DocumentContext);
  const { t } = useActionPlanTranslation();
  const pageWidth = usePDFPageWidth();
  const width = useBackgroundWidth();
  const height = useBackgroundHeight();
  const scaledPadding = useXScaledDimension(16);
  const scaledTopPadding = useXScaledDimension(28);
  const scaledRightPadding = useXScaledDimension(40);
  const scaledBottomPadding = useXScaledDimension(40);
  const scaledLeftPadding = useXScaledDimension(36.5);

  const noImage = phrases.filter((phrase) => !!phrase.image).length <= 0;

  return (
    <Box
      sx={{
        width: `${pageWidth}px`,
        padding: `0 ${scaledPadding}px ${scaledPadding}px`,
        backgroundColor: Theme.colors.light.primaryFixed,
        borderRadius: '16px',
      }}
    >
      <Title>{appletTitle}</Title>
      <Box
        paddingTop={`${scaledTopPadding}px`}
        paddingRight={`${scaledRightPadding}px`}
        paddingBottom={`${scaledBottomPadding}px`}
        paddingLeft={`${scaledLeftPadding}px`}
        width={`${width}px`}
        height={`${height}px`}
        sx={{
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(/action-plan-page-background.svg)`,
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="24px"
          width="100%"
          height="100%"
          sx={{ overflow: 'hidden' }}
        >
          <Header>
            {totalPages > 1
              ? `${phrasalTemplateCardTitle} (${pageNumber}/${totalPages})`
              : phrasalTemplateCardTitle}
          </Header>
          <Body>
            {phrases.map((phrase, index) => (
              <Phrase key={index} phrase={phrase} phrasalData={phrasalData} noImage={noImage} />
            ))}
          </Body>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          sx={{ margin: '10px 0' }}
        >
          <img src={footerLogo} alt={t('credit') || ''} />
        </Box>
      </Box>
    </Box>
  );
};
