import React, { useEffect, useState } from 'react';

import { Document } from '@react-pdf/renderer';

import { PDFDocumentContext } from './PDFDocumentContext';

import { ActionPlanPDFPage } from '~/pages/ActionPlan/ActionPlanPDFPage';
import { measureComponentHeight } from '~/pages/ActionPlan/component-utils';
import { PhraseCard } from '~/pages/ActionPlan/components/PhraseCard';
import { useAvailableBodyHeight, useAvailableBodyWidth } from '~/pages/ActionPlan/hooks';
import { Phrase } from '~/pages/ActionPlan/types';

export type ActionPlanPDFDocumentProps = {
  phrases: Phrase[];
  title: string;
};

export const ActionPlanPDFDocument = ({ title, phrases }: ActionPlanPDFDocumentProps) => {
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const headerPrefix = 'My Action Plan';
  const availableHeight = useAvailableBodyHeight(headerPrefix);
  const availableWidth: number = (useAvailableBodyWidth as () => number)();
  const gap = 32;

  useEffect(() => {
    const layout = async () => {
      let runningHeight = 0;
      let pagePhrases: Phrase[] = [];
      const _pages: React.ReactNode[] = [];

      for (const phrase of phrases) {
        const height = await measureComponentHeight(availableWidth, () => (
          <PhraseCard key={phrase.id} phrase={phrase} />
        ));
        const pageNumber = _pages.length + 1;

        if (runningHeight + height <= availableHeight) {
          runningHeight += height + gap;
          pagePhrases.push(phrase);
        } else {
          _pages.push(
            <ActionPlanPDFPage
              title={title}
              headerPrefix={headerPrefix}
              key={`${pageNumber}p`}
              phrases={pagePhrases}
              pageNumber={pageNumber}
            />,
          );
          runningHeight = height + gap;
          pagePhrases = [phrase];
        }
      }

      if (pagePhrases.length > 0) {
        _pages.push(
          <ActionPlanPDFPage
            title={title}
            headerPrefix={headerPrefix}
            key={`${_pages.length + 1}p`}
            phrases={pagePhrases}
            pageNumber={_pages.length + 1}
          />,
        );
      }

      setPages(_pages);
    };

    void layout();
  }, [phrases, availableWidth, availableHeight, title]);

  return (
    <PDFDocumentContext.Provider value={{ totalPages: pages.length }}>
      <Document
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          width: '100%',
          height: '100%',
        }}
      >
        {pages}
      </Document>
    </PDFDocumentContext.Provider>
  );
};

ActionPlanPDFDocument.displayName = 'ActionPlanPDFDocument';
