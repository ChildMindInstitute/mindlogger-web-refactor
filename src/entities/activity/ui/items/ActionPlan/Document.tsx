import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { v4 as uuidV4 } from 'uuid';

import {
  DocumentContext,
  DocumentData,
  IdentifiablePhrasalTemplatePhrase,
  PageComponent,
} from './Document.type';
import { useAvailableBodyWidth, usePageMaxHeight } from './hooks';
import { buildDocumentData, buildPageComponents } from './pageComponent';
import { pageRenderer, pagesRenderer } from './pageRenderer';
import { extractActivitiesPhrasalData } from './phrasalData';

import { getProgressId } from '~/abstract/lib';
import { PhrasalTemplatePhrase } from '~/entities/activity/lib';
import { useActionPlanTranslation } from '~/entities/activity/lib/useActionPlanTranslation';
import { appletModel } from '~/entities/applet';
import { SurveyContext } from '~/features/PassSurvey';
import { useAppSelector, useOnceEffect } from '~/shared/utils';

type DocumentProps = {
  documentId: string;
  phrases: PhrasalTemplatePhrase[];
  appletTitle: string;
  phrasalTemplateCardTitle: string;
};

export const Document = ({
  documentId,
  appletTitle,
  phrases,
  phrasalTemplateCardTitle,
}: DocumentProps) => {
  const { t } = useActionPlanTranslation();
  const context = useContext(SurveyContext);

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

  const identifiablePhrases = useMemo(
    () => phrases.map<IdentifiablePhrasalTemplatePhrase>((phrase) => ({ ...phrase, id: uuidV4() })),
    [phrases],
  );

  const documentData = useMemo<DocumentData>(
    () => buildDocumentData(identifiablePhrases),
    [identifiablePhrases],
  );

  const pageComponents = useMemo<PageComponent[]>(
    () => buildPageComponents(t, activitiesPhrasalData, identifiablePhrases),
    [t, activitiesPhrasalData, identifiablePhrases],
  );

  const availableWidth = useAvailableBodyWidth();
  const pageMaxHeight = usePageMaxHeight();
  const [pages, setPages] = useState<React.ReactNode[]>([]);

  const renderOnePage = useMemo(
    () =>
      pageRenderer(availableWidth, {
        documentId,
        documentData,
        appletTitle,
        phrasalTemplateCardTitle,
      }),
    [appletTitle, availableWidth, documentData, documentId, phrasalTemplateCardTitle],
  );

  const renderMorePage = useMemo(
    () => pagesRenderer(renderOnePage, pageMaxHeight),
    [pageMaxHeight, renderOnePage],
  );

  const renderAllPages = useCallback(async () => {
    const renderedPages = await renderMorePage(1, pageComponents);
    setPages(renderedPages);
  }, [pageComponents, renderMorePage]);
  useOnceEffect(() => {
    void renderAllPages();
  });

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
