import React, { PropsWithChildren, useContext } from 'react';

import { Page, View } from '@react-pdf/renderer';

import { Body } from '~/pages/ActionPlan/components/Body';
import { Header } from '~/pages/ActionPlan/components/Header';
import { PhraseCard } from '~/pages/ActionPlan/components/PhraseCard';
import { Title } from '~/pages/ActionPlan/components/Title';
import {
  useBackgroundHeight,
  useBackgroundWidth,
  usePDFPageWidth,
  useXScaledDimension,
} from '~/pages/ActionPlan/hooks';
import { PDFDocumentContext } from '~/pages/ActionPlan/PDFDocumentContext';
import { Phrase } from '~/pages/ActionPlan/types';
import { Theme } from '~/shared/constants';

export type ActionPlanPDFPageProps = {
  pageNumber: number;
  phrases: Phrase[];
  title: string;
  headerPrefix: string;
};

export function BlueBorderContainer({ children }: PropsWithChildren) {
  const pageWidth = usePDFPageWidth();
  const scaledPadding = useXScaledDimension(16);

  return (
    <Page
      size="LETTER"
      orientation="portrait"
      style={{
        width: `${pageWidth}px`,
        padding: `0 ${scaledPadding}px ${scaledPadding}px`,
        backgroundColor: Theme.colors.light.primaryFixed,
        borderRadius: '16px',
      }}
    >
      {children}
    </Page>
  );
}

function WhiteBackgroundContainer({ children }: PropsWithChildren) {
  const scaledTopPadding = useXScaledDimension(28);
  const scaledRightPadding = useXScaledDimension(40);
  const scaledBottomPadding = useXScaledDimension(40);
  const scaledLeftPadding = useXScaledDimension(36.5);

  const width = useBackgroundWidth();
  const height = useBackgroundHeight();

  return (
    <View
      style={{
        // TODO: The <View /> doesn't support background images, so we'll have to find a workaround
        // backgroundSize: 'contain',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // backgroundImage: `url(/action-plan-page-background.svg)`,

        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '16px',
        paddingTop: `${scaledTopPadding}px`,
        paddingRight: `${scaledRightPadding}px`,
        paddingBottom: `${scaledBottomPadding}px`,
        paddingLeft: `${scaledLeftPadding}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
}

export function ActionPlanPDFPage({
  title,
  headerPrefix,
  phrases,
  pageNumber,
}: ActionPlanPDFPageProps) {
  const { totalPages } = useContext(PDFDocumentContext);
  const header = `${headerPrefix} (${pageNumber}/${totalPages})`;

  return (
    <BlueBorderContainer>
      <Title>{title}</Title>
      <WhiteBackgroundContainer>
        <Header>{header}</Header>
        <Body>
          {phrases.map((phrase) => (
            <PhraseCard key={phrase.id} phrase={phrase} />
          ))}
        </Body>
      </WhiteBackgroundContainer>
    </BlueBorderContainer>
  );
}
