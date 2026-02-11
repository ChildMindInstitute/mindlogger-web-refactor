import { useCallback, useEffect } from 'react';

import { subMonths } from 'date-fns';

import { ErrorScreen } from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import { ScreenManager } from './ScreenManager';

import { FlowProgress, getProgressId } from '~/abstract/lib';
import { useCompletedEntitiesQuery } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { useBanners } from '~/entities/banner/model';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import {
  SurveyContext,
  mapRawDataToSurveyContext,
  useSurveyDataQuery,
} from '~/features/PassSurvey';
import ROUTES from '~/shared/constants/routes';
import { MuiModal } from '~/shared/ui';
import {
  formatToDtoDate,
  useAppSelector,
  useCustomNavigation,
  useCustomTranslation,
  useModal,
  useOnceEffect,
} from '~/shared/utils';
import { isFlowResumeEnabled } from '~/shared/utils/featureFlags';
import { useFeatureFlags } from '~/shared/utils/hooks';
import { FeatureFlag } from '~/shared/utils/types/featureFlags';
import { useEntitiesSync } from '~/widgets/ActivityGroups/model/hooks';

type Props = {
  publicAppletKey: string | null;

  appletId: string;
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;

  flowId: string | null;

  shouldRestart?: boolean;
};

export const SurveyWidget = (props: Props) => {
  const { publicAppletKey, appletId, activityId, eventId, flowId, targetSubjectId, shouldRestart } =
    props;

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

  const { featureFlag } = useFeatureFlags();
  const flowResumeFlag = featureFlag(FeatureFlag.EnableFlowResume, []);
  const flowResumeEnabled = isFlowResumeEnabled(flowResumeFlag, appletId);

  const shouldFetchCompletedEntities = flowResumeEnabled && !publicAppletKey && !shouldRestart;

  const { data: completedEntities, isFetching } = useCompletedEntitiesQuery(
    {
      appletId,
      fromDate: formatToDtoDate(subMonths(new Date(), 1)),
      includeInProgress: true,
    },
    {
      select: (data) => data.data.result,
      enabled: shouldFetchCompletedEntities,
    },
  );

  // Sync with server
  // - gate on shouldRestart to avoid passing in cached completedEntities
  // - gate on applet loading to ensure respondentMeta?.subjectId is available
  // - gate on fresh data to avoid syncing with stale cache
  const { changes } = useEntitiesSync({
    completedEntities:
      !shouldFetchCompletedEntities || isLoading || isFetching ? undefined : completedEntities,
    respondentSubjectId: respondentMeta?.subjectId ?? null,
    events: eventsDTO?.events ?? [],
    activityFlows: appletBaseDTO?.activityFlows ?? [],
    flowResumeEnabled,
  });

  // After server sync:
  // - Redirect to activity list if entity was completed on another device
  // - Redirect to latest activity if flow progressed on another device
  const groupProgressChanged = changes.includes(flowId ?? activityId);
  const groupProgressId = getProgressId(flowId ?? activityId, eventId, targetSubjectId);
  const groupProgress = useAppSelector((state) =>
    groupProgressId ? appletModel.selectors.selectGroupProgress(state, groupProgressId) : null,
  );
  const currentActivityId = !groupProgress?.endAt
    ? (groupProgress as FlowProgress)?.currentActivityId
    : null;

  useEffect(() => {
    // Only consider redirect if progress has changed
    if (!groupProgressChanged) return;

    // If entity was completed on another device, redirect to activity list
    if (groupProgress?.endAt) {
      navigator.navigate(ROUTES.appletDetails.navigateTo(appletId), { replace: true });
      return;
    }

    // If flow progressed on another device, redirect to latest activity
    if (currentActivityId && currentActivityId !== activityId) {
      const navigateToProps = {
        appletId,
        activityId: currentActivityId,
        entityType: 'flow' as const,
        eventId,
        flowId,
      };
      const screenToNavigate = publicAppletKey
        ? ROUTES.publicSurvey.navigateTo({ ...navigateToProps, publicAppletKey })
        : ROUTES.survey.navigateTo({ ...navigateToProps, targetSubjectId });
      navigator.navigate(screenToNavigate, { replace: true });
      return;
    }
  }, [activityId, currentActivityId, groupProgress?.endAt, groupProgressChanged]);

  const responseError = error?.evaluatedMessage ?? '';

  if (isLoading || isFetching) {
    // loading screen on initial load and when refetching completed entities
    return <LoadingScreen publicAppletKey={publicAppletKey} appletId={appletId} />;
  }

  if (isError) {
    return (
      <ErrorScreen
        publicAppletKey={publicAppletKey}
        appletId={appletId}
        errorLabel={publicAppletKey ? t('additional.invalid_public_url') : responseError}
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
