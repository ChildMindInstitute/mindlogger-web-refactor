import { useContext } from 'react';

import { ErrorScreen } from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import { ScreenManager } from './ScreenManager';
import { SurveyBasicContext, SurveyContext, mapRawDataToSurveyContext } from '../lib';
import { useSurveyDataQuery } from '../model/hooks';

import { useBanners } from '~/entities/banner/model';
import { useCustomTranslation, useOnceEffect } from '~/shared/utils';

export const SurveyWidget = () => {
  const { t } = useCustomTranslation();
  const { removeAllBanners } = useBanners();

  // Remove any stale banners on mount
  useOnceEffect(() => removeAllBanners());

  const context = useContext(SurveyBasicContext);

  const { activityDTO, appletDTO, eventsDTO, respondentMeta, isLoading, isError, error } =
    useSurveyDataQuery();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <ErrorScreen
        errorLabel={
          context.isPublic ? t('additional.invalid_public_url') : error?.evaluatedMessage ?? ''
        }
      />
    );
  }

  if (!appletDTO || !activityDTO || !eventsDTO) {
    return <ErrorScreen errorLabel={t('common_loading_error')} />;
  }

  return (
    <SurveyContext.Provider
      value={mapRawDataToSurveyContext({
        activityDTO,
        appletDTO,
        eventsDTO,
        respondentMeta,
        currentEventId: context.eventId,
      })}
    >
      <ScreenManager />
    </SurveyContext.Provider>
  );
};
