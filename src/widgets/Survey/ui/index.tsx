import { useContext } from 'react';

import { ErrorScreen } from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import { ScreenManager } from './ScreenManager';
import { SurveyBasicContext, SurveyContext } from '../lib';
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
      value={{
        activity: activityDTO,
        applet: appletDTO,
        events: eventsDTO,
        respondentMeta,
      }}
    >
      <ScreenManager />
    </SurveyContext.Provider>
  );
};
