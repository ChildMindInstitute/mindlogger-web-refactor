import { useContext } from 'react';

import { Body } from './Body';
import { DocumentContext } from './DocumentContext';
import { Header } from './Header';
import {
  usePageWidth,
  useCorrelatedPageMaxHeightLineCount,
  useXScaledDimension,
  usePageMinHeight,
} from './hooks';
import { ActivitiesPhrasalData } from './phrasalData';
import { Phrase } from './Phrase';
import { StretchySvg } from './StretchySvg';
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
  const pageMinHeight = usePageMinHeight();
  const correlatedPageMaxHeightLineCount = useCorrelatedPageMaxHeightLineCount();
  const pageMaxHeight = correlatedPageMaxHeightLineCount.maxHeight;
  const scaledPadding = useXScaledDimension(16);
  const scaledTopPadding = useXScaledDimension(40);
  const scaledRightPadding = useXScaledDimension(40);
  const scaledBottomPadding = useXScaledDimension(80);
  const scaledLeftPadding = useXScaledDimension(36.5);
  const scaledHeaderGap = useXScaledDimension(32);
  const scaledFooterWidth = useXScaledDimension(113);
  const scaledFooterHeight = useXScaledDimension(16);
  const scaledFooterOffset = useXScaledDimension(25);

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
        display="flex"
        paddingTop={`${scaledTopPadding}px`}
        paddingRight={`${scaledRightPadding}px`}
        paddingBottom={`${scaledBottomPadding}px`}
        paddingLeft={`${scaledLeftPadding}px`}
        minHeight={`${pageMinHeight}px`}
        maxHeight={`${pageMaxHeight}px`}
      >
        <Box position="absolute" top={1} left={-1} right={0} height={25} zIndex={1}>
          <StretchySvg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 612 25"
            fill="none"
          >
            <path
              d="M478 4L390 9L260.5 4H109L39 6.24658L20 24.5H592.5L571.5 6.71461L478 4Z"
              fill="#FCFCFF"
            />
          </StretchySvg>
        </Box>
        <Box position="absolute" top={25} left={0} right={0} bottom={64} zIndex={1}>
          <StretchySvg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 612 234"
            fill="none"
          >
            <path
              d="M598.5 83.2626L591.994 29.1325V0H19L14 38.5287L27.5069 87.7735L19.5 144.535L27.5069 158.631L19.5 177.802V234H584.988L598.5 208.373V158.631L589 120.888L598.5 83.2626Z"
              fill="#FCFCFF"
            />
          </StretchySvg>
        </Box>
        <Box position="absolute" left={2.5} right={-2} bottom={0} height={64} zIndex={1}>
          <StretchySvg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 612 64"
            fill="none"
          >
            <g clipPath="url(#clip0_1105_7)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M580.079 18.0243L582.721 0.0402002L583.902 -8H17V22.5528L61.5 42.008L173.5 56L286.5 50.3276L404 56H495L539.545 36.4951L595.5 56L580.079 18.0243Z"
                fill="#FCFCFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_1105_7">
                <rect width="612" height="64" fill="white" />
              </clipPath>
            </defs>
          </StretchySvg>
        </Box>
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          gap={`${scaledHeaderGap}px`}
          width="100%"
          height="auto"
          overflow="hidden"
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
          left="0"
          bottom="0"
          width="100%"
          sx={{ margin: `0 auto ${scaledFooterOffset}px auto`, zIndex: 2 }}
        >
          <img
            src={footerLogo}
            alt={t('credit') || ''}
            width={scaledFooterWidth}
            height={scaledFooterHeight}
          />
        </Box>
      </Box>
    </Box>
  );
};

Page.displayName = 'Page';
