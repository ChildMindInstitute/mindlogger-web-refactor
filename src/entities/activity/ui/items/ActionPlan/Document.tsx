import React, { forwardRef, useEffect, useState, useContext, useMemo, useCallback } from 'react';

import { Box } from '@mui/material';
import { v4 as uuidV4 } from 'uuid';

import { DocumentContext } from './DocumentContext';
import { useAvailableBodyWidth, usePageMaxHeight } from './hooks';
import { Page } from './Page';
import { extractActivitiesPhrasalData } from './phrasalData';

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

type IdentifiblePhrasalTemplatePhrase = PhrasalTemplatePhrase & { id: string };

export const Document = forwardRef<HTMLDivElement, DocumentProps>(
  ({ appletTitle, phrases, phrasalTemplateCardTitle }, ref) => {
    const context = useContext(SurveyContext);

    const noImage = useMemo(
      () => phrases.filter((phrase) => !!phrase.image).length <= 0,
      [phrases],
    );

    const identifiblePhrases = useMemo(
      () =>
        phrases.map<IdentifiblePhrasalTemplatePhrase>((phrase) => {
          return {
            ...phrase,
            id: uuidV4(),
          };
        }),
      [phrases],
    );

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

    const availableWidth = useAvailableBodyWidth();
    const pageMaxHeight = usePageMaxHeight();
    const [pages, setPages] = useState<React.ReactNode[]>([]);

    const renderPages = useCallback(async () => {
      const renderedPages: React.ReactNode[] = [];

      const renderPage = async (
        pagePhrases: IdentifiblePhrasalTemplatePhrase[],
      ): Promise<[React.ReactNode, IdentifiblePhrasalTemplatePhrase[]]> => {
        const curPageNumber = renderedPages.length + 1;

        const curPage = (
          <Page
            key={`page-${curPageNumber}`}
            pageNumber={curPageNumber}
            appletTitle={appletTitle}
            phrasalTemplateCardTitle={phrasalTemplateCardTitle}
            phrases={pagePhrases}
            phrasalData={activitiesPhrasalData}
            noImage={noImage}
          />
        );

        const pageHeight = await measureComponentHeight(availableWidth, curPage);
        if (pageHeight <= pageMaxHeight) {
          // If the rendered page fits into the maximum allowed page height,
          // then stop rendering.
          return [curPage, []];
        }

        if (pagePhrases.length <= 1) {
          const pagePhrase = pagePhrases[0];
          const pagePhraseFields = pagePhrase.fields;

          if (pagePhraseFields.length <= 1) {
            // If the rendered page does not fit into the maximum allowed page
            // height, and there is only 1 phrase for the page, but that phrase
            // has on 1 field (this means there is nothing left to split), then
            // stop rendering.
            return [curPage, []];
          }

          // If the rendered page does not fit into the maximum allowed page
          // height, and there is only 1 phrase for the page, and that phrase
          // has more than 1 field, then split the fields into multiple phrases
          // with the same ID and re-render.
          const splits: [IdentifiblePhrasalTemplatePhrase, IdentifiblePhrasalTemplatePhrase] = [
            {
              id: pagePhrase.id,
              image: pagePhrase.image,
              fields: pagePhraseFields.slice(0, pagePhraseFields.length - 1),
            },
            {
              id: pagePhrase.id,
              image: pagePhrase.image,
              fields: pagePhraseFields.slice(pagePhraseFields.length - 1),
            },
          ];

          const [newPage, newPageRestPhrases] = await renderPage([splits[0]]);
          const leftoverPhrases = [...newPageRestPhrases, splits[1]];
          return [newPage, leftoverPhrases];
        }

        // If the rendered page does not fit into the maximum allowed page
        // height, and the page has more than 1 phrase, then split the phrases
        // and re-render.
        const newPagePhrases = pagePhrases.slice(0, pagePhrases.length - 1);
        const curPageRestPhrases = pagePhrases.slice(pagePhrases.length - 1);
        const [newPage, newPageRestPhrases] = await renderPage(newPagePhrases);
        const leftoverPhrases = [...newPageRestPhrases, ...curPageRestPhrases];

        const recombinedLeftoverPhrases = leftoverPhrases.reduce((acc, phrase) => {
          const existingPhrase = acc.find(({ id }) => id === phrase.id);
          if (existingPhrase) {
            existingPhrase.fields = [...existingPhrase.fields, ...phrase.fields];
          } else {
            acc.push(phrase);
          }
          return acc;
        }, [] as IdentifiblePhrasalTemplatePhrase[]);

        return [newPage, recombinedLeftoverPhrases];
      };

      const _renderPages = async (_pagePhrases: IdentifiblePhrasalTemplatePhrase[]) => {
        const [renderedPage, leftoverPhrases] = await renderPage(_pagePhrases);
        renderedPages.push(renderedPage);

        if (leftoverPhrases.length > 0) {
          await _renderPages(leftoverPhrases);
        }
      };

      await _renderPages(identifiblePhrases);

      setPages(renderedPages);
    }, [
      activitiesPhrasalData,
      appletTitle,
      availableWidth,
      pageMaxHeight,
      phrasalTemplateCardTitle,
      identifiblePhrases,
      noImage,
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
