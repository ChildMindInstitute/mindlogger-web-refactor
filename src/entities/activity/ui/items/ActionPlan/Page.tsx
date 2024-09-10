import { useContext } from 'react';

import { Body } from './Body';
import { DocumentContext } from './DocumentContext';
import { Header } from './Header';
import { usePageWidth, usePageMaxHeight, useXScaledDimension } from './hooks';
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
  noImage: boolean;
};

export const Page = ({
  appletTitle,
  phrasalTemplateCardTitle,
  phrases,
  phrasalData,
  pageNumber,
  noImage,
}: PageProps) => {
  const { totalPages } = useContext(DocumentContext);
  const { t } = useActionPlanTranslation();
  const pageWidth = usePageWidth();
  const pageMaxHeight = usePageMaxHeight();
  const scaledPadding = useXScaledDimension(16);
  const scaledTopPadding = useXScaledDimension(28);
  const scaledRightPadding = useXScaledDimension(40);
  const scaledBottomPadding = useXScaledDimension(40);
  const scaledLeftPadding = useXScaledDimension(36.5);

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
        position="relative"
        display="grid"
        paddingTop={`${scaledTopPadding}px`}
        paddingRight={`${scaledRightPadding}px`}
        paddingBottom={`${scaledBottomPadding}px`}
        paddingLeft={`${scaledLeftPadding}px`}
        // TODO: Implement truncation
        maxHeight={`${pageMaxHeight}px`}
        overflow="hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="580"
          height="100%"
          viewBox="0 0 580 760"
          preserveAspectRatio="none"
          fill="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            zIndex: 1,
          }}
        >
          <path
            d="M71.5 0L9.5 29.2502L1.5 75.1427V180.04L9.5 310.657L1.5 462.96L9.5 500.783L1.5 552.223V703.013L46 741.34L158 760L271 752.435L388.5 760H479.5L527 732.263L545.5 721.672L564.5 710.073L573.5 628.374L564.5 500.783L580 298.553L573.5 153.311V29.2502L527 0H452.5H348.5L188 8.06901L71.5 0Z"
            fill="#FCFCFF"
          />
          <path d="M580 760L554 677.5L502.5 718L580 760Z" fill="#FCFCFF" />
        </svg>
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          gap="24px"
          width="100%"
          height="100%"
          sx={{ overflow: 'hidden' }}
          zIndex={2}
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
          position="absolute"
          bottom="0"
          justifySelf="center"
          sx={{ margin: '10px 0' }}
        >
          <img src={footerLogo} alt={t('credit') || ''} />
        </Box>
      </Box>
    </Box>
  );
};

Page.displayName = 'Page';
