import { useCallback } from 'react';

import { ErrorScreen } from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import { ScreenManager } from './ScreenManager';

import { useBanners } from '~/entities/banner/model';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import {
  SurveyContext,
  mapRawDataToSurveyContext,
  useSurveyDataQuery,
} from '~/features/PassSurvey';
import ROUTES from '~/shared/constants/routes';
import { MuiModal } from '~/shared/ui';
import { useCustomNavigation, useCustomTranslation, useModal, useOnceEffect } from '~/shared/utils';

type Props = {
  publicAppletKey: string | null;

  appletId: string;
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;

  flowId: string | null;
};

export const SurveyWidget = (props: Props) => {
  const { publicAppletKey, appletId, activityId, eventId, flowId, targetSubjectId } = props;

  const { t } = useCustomTranslation();
  const navigator = useCustomNavigation();

  const { removeAllBanners } = useBanners();

  const autoCompletionState = AutoCompletionModel.useAutoCompletionRecord({
    entityId: props.flowId ?? props.activityId,
    eventId: props.eventId,
    targetSubjectId,
  });

  const isTimesUpModalModalByDefault: boolean =
    !!autoCompletionState &&
    autoCompletionState.activityIdsToSubmit.length !==
      autoCompletionState.successfullySubmittedActivityIds.length;

  const [isTimesUpModalOpen, openTimesUpModal, closeTimesUpModal] = useModal(
    isTimesUpModalModalByDefault,
  );

  // Remove any stale banners on mount
  useOnceEffect(() => removeAllBanners());

  const onTimesUpModalOKClick = useCallback(() => {
    closeTimesUpModal();

    const { appletId, activityId, flowId, eventId, publicAppletKey } = props;

    const navigateToProps = {
      appletId,
      activityId,
      flowId,
      eventId,
      targetSubjectId,
      publicAppletKey,
    };

    const screenToNavigate = props.publicAppletKey
      ? ROUTES.publicAutoCompletion.navigateTo(navigateToProps)
      : ROUTES.autoCompletion.navigateTo(navigateToProps);

    return navigator.navigate(screenToNavigate);
  }, [closeTimesUpModal, navigator, props, targetSubjectId]);

  const {
    activityDTO,
    appletDTO,
    appletBaseDTO,
    eventsDTO,
    respondentMeta,
    targetSubject,
    isLoading,
    isError,
    error,
  } = useSurveyDataQuery({ publicAppletKey, appletId, activityId, targetSubjectId });

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
        appletBaseDTO,
        eventsDTO,
        respondentMeta,
        currentEventId: eventId,
        flowId,
        targetSubject,
        publicAppletKey,
      })}
    >
      <ScreenManager openTimesUpModal={openTimesUpModal} />
      <MuiModal
        isOpen={isTimesUpModalOpen}
        title={t('timesupModal.title')}
        label={t('timesupModal.description')}
        footerPrimaryButton={t('additional.okay')}
        onPrimaryButtonClick={onTimesUpModalOKClick}
        testId="times-up-modal"
      />
    </SurveyContext.Provider>
  );
};
