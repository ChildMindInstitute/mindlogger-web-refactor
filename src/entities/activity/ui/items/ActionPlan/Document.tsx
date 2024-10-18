import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';

import { Box } from '@mui/material';
import { v4 as uuidV4 } from 'uuid';

import { DocumentContext, IdentifiablePhrasalTemplatePhrase } from './Document.type';
import { useAvailableBodyWidth, usePageMaxHeight } from './hooks';
import { Page } from './Page';
import { buildPageData, PageData } from './pageComponent';
import { extractActivitiesPhrasalData } from './phrasalData';

import { getProgressId } from '~/abstract/lib';
import { PhrasalTemplatePhrase } from '~/entities/activity/lib';
import { useActionPlanTranslation } from '~/entities/activity/lib/useActionPlanTranslation';
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

  const pageData = useMemo<PageData>(
    () => buildPageData(t, activitiesPhrasalData, identifiablePhrases),
    [t, activitiesPhrasalData, identifiablePhrases],
  );
  console.log('!!! pageData', pageData);

  const availableWidth = useAvailableBodyWidth();
  const pageMaxHeight = usePageMaxHeight();
  const [pages, setPages] = useState<React.ReactNode[]>([]);

  const renderPages = useCallback(async () => {
    const renderedPages: React.ReactNode[] = [];

    const tmpPage = (
      <Page
        key={`page-${1}`}
        documentId={documentId}
        pageNumber={1}
        appletTitle={appletTitle}
        phrasalTemplateCardTitle={phrasalTemplateCardTitle}
        pageData={pageData}
      />
    );

    const tmpPageHeight = await measureComponentHeight(availableWidth, tmpPage);
    console.log('!!! tmpPageHeight', tmpPageHeight, 'pageMaxHeight', pageMaxHeight);

    renderedPages.push(tmpPage);

    setPages(renderedPages);
  }, [documentId, appletTitle, availableWidth, pageMaxHeight, phrasalTemplateCardTitle, pageData]);

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
