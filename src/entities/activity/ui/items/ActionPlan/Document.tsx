import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';

import { Box } from '@mui/material';
import { v4 as uuidV4 } from 'uuid';

import { DocumentContext } from './DocumentContext';
import { useAvailableBodyWidth, useCorrelatedPageMaxHeightLineCount } from './hooks';
import { Page } from './Page';
import { extractActivitiesPhrasalData } from './phrasalData';

import { getProgressId } from '~/abstract/lib';
import { PhrasalTemplatePhrase } from '~/entities/activity/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { useAppSelector } from '~/shared/utils';
import measureComponentHeight from '~/shared/utils/measureComponentHeight';

type DocumentProps = {
  documentId: string;
  phrases: PhrasalTemplatePhrase[];
  appletTitle: string;
  phrasalTemplateCardTitle: string;
};

type IdentifiablePhrasalTemplatePhrase = PhrasalTemplatePhrase & { id: string };

export const Document = ({
  documentId,
  appletTitle,
  phrases,
  phrasalTemplateCardTitle,
}: DocumentProps) => {
  const context = useContext(SurveyContext);

  const noImage = useMemo(() => phrases.filter((phrase) => !!phrase.image).length <= 0, [phrases]);

  const identifiablePhrases = useMemo(
    () =>
      phrases.map<IdentifiablePhrasalTemplatePhrase>((phrase) => {
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
      getProgressId(context.activityId, context.eventId, context.targetSubject?.id),
    ),
  );

  const activitiesPhrasalData = useMemo(
    () => extractActivitiesPhrasalData(activityProgress.items),
    [activityProgress],
  );

  const availableWidth = useAvailableBodyWidth();
  const correlatedPageMaxHeightLineCount = useCorrelatedPageMaxHeightLineCount();
  const pageMaxHeight = correlatedPageMaxHeightLineCount.maxHeight;
  const [pages, setPages] = useState<React.ReactNode[]>([]);

  const renderPages = useCallback(async () => {
    const renderedPages: React.ReactNode[] = [];

    const renderPage = async (
      pagePhrases: IdentifiablePhrasalTemplatePhrase[],
    ): Promise<[React.ReactNode, IdentifiablePhrasalTemplatePhrase[]]> => {
      const curPageNumber = renderedPages.length + 1;

      const curPage = (
        <Page
          key={`page-${curPageNumber}`}
          documentId={documentId}
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
        const splits: [IdentifiablePhrasalTemplatePhrase, IdentifiablePhrasalTemplatePhrase] = [
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
      }, [] as IdentifiablePhrasalTemplatePhrase[]);

      return [newPage, recombinedLeftoverPhrases];
    };

    const _renderPages = async (_pagePhrases: IdentifiablePhrasalTemplatePhrase[]) => {
      const [renderedPage, leftoverPhrases] = await renderPage(_pagePhrases);
      renderedPages.push(renderedPage);

      if (leftoverPhrases.length > 0) {
        await _renderPages(leftoverPhrases);
      }
    };

    await _renderPages(identifiablePhrases);

    setPages(renderedPages);
  }, [
    documentId,
    activitiesPhrasalData,
    appletTitle,
    availableWidth,
    pageMaxHeight,
    phrasalTemplateCardTitle,
    identifiablePhrases,
    noImage,
  ]);

  useEffect(() => {
    void renderPages();
  }, [renderPages]);

  return (
    <Box
      data-phrasal-template-document={true}
      data-phrasal-template-document-id={documentId}
      gap="24px"
      display={'flex'}
      flexDirection={'column'}
      alignItems="center"
    >
      <DocumentContext.Provider value={{ totalPages: pages.length }}>
        {pages}
      </DocumentContext.Provider>
    </Box>
  );
};

Document.displayName = 'Document';
