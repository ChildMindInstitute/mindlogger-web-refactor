import { ErrorScreen } from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import { ScreenManager } from './ScreenManager';
import { SurveyContext, mapRawDataToSurveyContext } from '../lib';
import { useSurveyDataQuery } from '../model/hooks';

import { useBanners } from '~/entities/banner/model';
import { useCustomTranslation, useOnceEffect } from '~/shared/utils';

type Props = {
  publicAppletKey: string | null;

  appletId: string;
  activityId: string;
  eventId: string;

  flowId: string | null;
};

export const SurveyWidget = (props: Props) => {
  const { publicAppletKey, appletId, activityId, eventId, flowId } = props;

  const { t } = useCustomTranslation();
  const { removeAllBanners } = useBanners();

  // Remove any stale banners on mount
  useOnceEffect(() => removeAllBanners());

  const { activityDTO, appletDTO, eventsDTO, respondentMeta, isLoading, isError, error } =
    useSurveyDataQuery({ publicAppletKey, appletId, activityId });

  if (isLoading) {
    return <LoadingScreen publicAppletKey={publicAppletKey} appletId={appletId} />;
  }

  if (isError) {
    return (
      <ErrorScreen
        publicAppletKey={publicAppletKey}
        appletId={appletId}
        errorLabel={
          publicAppletKey ? t('additional.invalid_public_url') : error?.evaluatedMessage ?? ''
        }
      />
    );
  }

  if (!appletDTO || !activityDTO || !eventsDTO) {
    return (
      <ErrorScreen
        errorLabel={t('common_loading_error')}
        publicAppletKey={publicAppletKey}
        appletId={appletId}
      />
    );
  }

  return (
    <SurveyContext.Provider
      value={mapRawDataToSurveyContext({
        activityDTO,
        appletDTO,
        eventsDTO,
        respondentMeta,
        currentEventId: eventId,
        flowId,
        publicAppletKey,
      })}
    >
      <ScreenManager />
    </SurveyContext.Provider>
  );
};
