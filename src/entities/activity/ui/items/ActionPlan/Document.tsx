import React, { forwardRef, useEffect, useState, useContext, useMemo, useCallback } from 'react';

import { Box } from '@mui/material';

import { DocumentContext } from './DocumentContext';
import { useAvailableBodyHeight, useAvailableBodyWidth } from './hooks';
import { Page } from './Page';
import { extractActivitiesPhrasalData } from './phrasalData';
import { Phrase } from './Phrase';

import { getProgressId } from '~/abstract/lib';
import { PhrasalTemplatePhrase } from '~/entities/activity/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { useAppSelector } from '~/shared/utils';
import measureComponentHeight from '~/shared/utils/measureComponentHeight';

type DocumentProps = {
  phrases: PhrasalTemplatePhrase[];
  appletTitle: string;
  phrasalTemplateCardTitle: string;
};

export const Document = forwardRef<HTMLDivElement, DocumentProps>(
  ({ appletTitle, phrases, phrasalTemplateCardTitle }, ref) => {
    const context = useContext(SurveyContext);

    const activityProgress = useAppSelector((state) =>
      appletModel.selectors.selectActivityProgress(
        state,
        getProgressId(context.activityId, context.eventId),
      ),
    );

    const activitiesPhrasalData = useMemo(
      () => extractActivitiesPhrasalData(activityProgress.items),
      [activityProgress],
    );

    const noImage = phrases.filter((phrase) => !!phrase.image).length <= 0;
    const [pages, setPages] = useState<React.ReactNode[]>([]);
    const availableHeight = useAvailableBodyHeight(phrasalTemplateCardTitle);
    const availableWidth: number = (useAvailableBodyWidth as () => number)();
    const gap = 32;

    const renderPages = useCallback(async () => {
      let runningHeight = 0;
      let pagePhrases: PhrasalTemplatePhrase[] = [];
      const _pages: React.ReactNode[] = [];

      for (const phrase of phrases) {
        const height = await measureComponentHeight(availableWidth, () => (
          <Phrase phrase={phrase} phrasalData={activitiesPhrasalData} noImage={noImage} />
        ));
        const pageNumber = _pages.length + 1;

        if (runningHeight + height <= availableHeight) {
          runningHeight += height + gap;
          pagePhrases.push(phrase);
        } else {
          _pages.push(
            <Page
              key={`page-${pageNumber}`}
              pageNumber={pageNumber}
              appletTitle={appletTitle}
              phrasalTemplateCardTitle={phrasalTemplateCardTitle}
              phrases={pagePhrases}
              phrasalData={activitiesPhrasalData}
            />,
          );
          runningHeight = height + gap;
          pagePhrases = [phrase];
        }
      }

      if (pagePhrases.length > 0) {
        _pages.push(
          <Page
            key={`page-${_pages.length + 1}`}
            pageNumber={_pages.length + 1}
            appletTitle={appletTitle}
            phrasalTemplateCardTitle={phrasalTemplateCardTitle}
            phrases={pagePhrases}
            phrasalData={activitiesPhrasalData}
          />,
        );
      }

      setPages(_pages);
    }, [
      noImage,
      appletTitle,
      phrasalTemplateCardTitle,
      phrases,
      activitiesPhrasalData,
      availableWidth,
      availableHeight,
    ]);

    useEffect(() => {
      void renderPages();
    }, [renderPages]);

    return (
      <Box gap="24px" display={'flex'} flexDirection={'column'} alignItems="center" ref={ref}>
        <DocumentContext.Provider value={{ totalPages: pages.length }}>
          {pages}
        </DocumentContext.Provider>
      </Box>
    );
  },
);

Document.displayName = 'Document';
