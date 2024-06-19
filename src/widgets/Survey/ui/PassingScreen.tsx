import { useCallback, useContext, useMemo } from 'react';

import SurveyLayout from './SurveyLayout';
import { SurveyBasicContext, SurveyContext } from '../lib';
import { validateBeforeMoveForward } from '../model';
import {
  useAnswer,
  useAutoForward,
  useSubmitAnswersMutations,
  useSurveyState,
} from '../model/hooks';

import { ActivityPipelineType, FlowProgress, FlowSummaryData, getProgressId } from '~/abstract/lib';
import { ActivityCardItem, Answer, useTextVariablesReplacer } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { useBanners } from '~/entities/banner/model';
import { SurveyManageButtons, useItemTimer, useSummaryData } from '~/features/PassSurvey';
import { MuiModal } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import { useAppSelector, useCustomTranslation, useModal, usePrevious } from '~/shared/utils';

const PassingScreen = () => {
  const { t } = useCustomTranslation();

  const [isSubmitModalOpen, openSubmitModal, closeSubmitModal] = useModal();

  const { addWarningBanner, addSuccessBanner, removeWarningBanner } = useBanners();

  const surveyBasicContext = useContext(SurveyBasicContext); // This is basic context with { eventId, appletId, activityId, isPublic, publicAppletKey }
  const surveyContext = useContext(SurveyContext); // This is full context with { applet, activity, events, respondentMeta }

  const applet = surveyContext.applet;

  const activity = surveyContext.activity;

  const activityId = activity.id;

  const eventId = surveyBasicContext.eventId;

  const activityEventId = getProgressId(activityId, eventId);

  const entityTimer = surveyContext.event.timers.timer ?? null;

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(state, activityEventId),
  );

  const { getGroupProgress, saveGroupContext } = appletModel.hooks.useGroupProgressState();

  const completedEntities = useAppSelector(appletModel.selectors.completedEntitiesSelector);

  const userEvents = useMemo(
    () => activityProgress?.userEvents ?? [],
    [activityProgress?.userEvents],
  );

  const items = useMemo(() => activityProgress?.items ?? [], [activityProgress.items]);

  const { incrementStep, decrementStep, openSummaryScreen } =
    appletModel.hooks.useActivityProgress();

  const { saveUserEventByType, saveSetAnswerUserEvent, saveSetAdditionalTextUserEvent } =
    appletModel.hooks.useUserEvents({
      activityId,
      eventId,
    });

  const { saveItemAnswer, saveItemAdditionalText, removeItemAnswer } =
    appletModel.hooks.useSaveItemAnswer({
      activityId,
      eventId,
    });

  const { getSummaryForCurrentActivity } = useSummaryData({
    activityId,
    activityName: activity.name,
    eventId,
    scoresAndReports: activity.scoresAndReports,
    flowId: null,
  });

  const { step, item, hasPrevStep, hasNextStep, progress, conditionallyHiddenItemIds } =
    useSurveyState(activityProgress);

  const canGoBack = !item?.config.removeBackButton && activity.responseIsEditable;

  const prevStep = usePrevious(step);

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    applet,
    activityId,
    eventId,
    publicAppletKey: surveyBasicContext.isPublic ? surveyBasicContext.publicAppletKey : null,
    flowId: surveyBasicContext.flowId,
  });

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map((item) => item.answer),
    respondentMeta: surveyContext.respondentMeta,
    completedEntityTime: completedEntities[activityId],
  });

  const onSubmitSuccess = () => {
    const groupProgress = getGroupProgress({
      entityId: surveyBasicContext.flowId ? surveyBasicContext.flowId : activityId,
      eventId,
    });

    const isFlowGroup = groupProgress?.type === ActivityPipelineType.Flow;

    const currentFlow = applet.activityFlows.find((flow) => flow.id === surveyBasicContext.flowId);

    const nextActivityIndex = (groupProgress as FlowProgress).pipelineActivityOrder + 1;

    const nextActivity = currentFlow?.activityIds[nextActivityIndex] ?? null;

    const isLastActivity = nextActivity === null;

    // Show notification
    if (isFlowGroup && !isLastActivity) {
      addSuccessBanner(t('toast.next_activity'));
    } else {
      addSuccessBanner(t('toast.answers_submitted'));
    }

    const isSummaryScreenOn = activity.scoresAndReports?.showScoreSummary ?? false;

    const summaryData = getSummaryForCurrentActivity();

    const isAlertsExist = summaryData.alerts.length > 0;
    const isScoreExist = summaryData.scores.length > 0;

    const isSummaryDataExist = isAlertsExist || isScoreExist;

    if (isSummaryScreenOn) {
      if (isSummaryDataExist) {
        const summaryDataContext: FlowSummaryData = {
          alerts: summaryData.alerts,
          scores: {
            activityName: activity.name,
            scores: summaryData.scores,
          },
          order: isFlowGroup ? groupProgress.pipelineActivityOrder : 0,
        };

        saveGroupContext({
          activityId: surveyBasicContext.flowId ? surveyBasicContext.flowId : activityId,
          eventId,
          context: {
            summaryData: {
              ...groupProgress?.context.summaryData,
              [activityId]: summaryDataContext,
            },
          },
        });
      }
    }

    const hasAnySummaryScreenResults =
      Object.keys(groupProgress?.context.summaryData ?? {}).length > 0;

    if (!isFlowGroup && !surveyBasicContext.flowId) {
      if (isSummaryScreenOn && isSummaryDataExist) {
        return openSummaryScreen({ activityId, eventId });
      }

      return completeActivity();
    }

    if (isLastActivity && hasAnySummaryScreenResults) {
      return openSummaryScreen({ activityId, eventId });
    }

    return surveyBasicContext.flowId && completeFlow(surveyBasicContext.flowId);
  };

  const { submitAnswers, isLoading } = useSubmitAnswersMutations({
    onSubmitSuccess,
    isPublic: surveyBasicContext.isPublic,
  });

  const { processAnswers } = useAnswer();

  const onSubmit = useCallback(() => {
    const doneUserEvent = saveUserEventByType('DONE', item);

    const answer = processAnswers({
      items,
      userEvents: [...userEvents, doneUserEvent],
      isPublic: surveyBasicContext.isPublic,
    });

    return submitAnswers(answer);
  }, [
    surveyBasicContext.isPublic,
    item,
    items,
    processAnswers,
    saveUserEventByType,
    submitAnswers,
    userEvents,
  ]);

  const onNext = useCallback(() => {
    const isItemHasAnswer = item.answer.length;
    const isItemSkippable = item.config.skippableItem || activity.isSkippable;

    if (!isItemHasAnswer && isItemSkippable) {
      saveUserEventByType('SKIP', item);
    } else {
      saveUserEventByType('NEXT', item);
    }

    return incrementStep({ activityId, eventId });
  }, [activityId, eventId, incrementStep, item, activity.isSkippable, saveUserEventByType]);

  const onBack = useCallback(() => {
    saveUserEventByType('PREV', item);

    if (!hasPrevStep) {
      return;
    }

    return decrementStep({ activityId, eventId });
  }, [activityId, decrementStep, eventId, hasPrevStep, item, saveUserEventByType]);

  const onMoveForward = useCallback(() => {
    if (!item) {
      throw new Error('[onMoveForward] CurrentItem is not defined');
    }

    const isValid = validateBeforeMoveForward({
      item,
      activity,
      showWarning: (key: string) => addWarningBanner(t(key)),
      hideWarning: removeWarningBanner,
    });

    if (!isValid) {
      return;
    }

    conditionallyHiddenItemIds?.forEach(removeItemAnswer);

    if (!hasNextStep) {
      return openSubmitModal();
    }

    return onNext();
  }, [
    item,
    activity,
    removeWarningBanner,
    conditionallyHiddenItemIds,
    removeItemAnswer,
    hasNextStep,
    onNext,
    addWarningBanner,
    t,
    openSubmitModal,
  ]);

  const onItemValueChange = (value: Answer) => {
    saveItemAnswer(item.id, value);

    saveSetAnswerUserEvent({
      ...item,
      answer: value,
    } as appletModel.ItemRecord);
  };

  const onItemAdditionalTextChange = (value: string) => {
    saveItemAdditionalText(item.id, value);
    saveSetAdditionalTextUserEvent({
      ...item,
      additionalText: value,
    });
  };

  useAutoForward({
    item,
    hasNextStep,
    onForward: onNext,
  });

  const timerSettings = useItemTimer({
    item,
    activityId,
    eventId,
    isSubmitModalOpen,
    onTimerEnd: hasNextStep ? onNext : openSubmitModal,
  });

  return (
    <>
      <SurveyLayout
        progress={progress}
        isSaveAndExitButtonShown={true}
        entityTimer={entityTimer ?? undefined}
        footerActions={
          <SurveyManageButtons
            timerSettings={!isSubmitModalOpen ? timerSettings : undefined}
            isLoading={false}
            isBackShown={hasPrevStep && canGoBack}
            onBackButtonClick={onBack}
            onNextButtonClick={onMoveForward}
            backButtonText={t('Consent.back') ?? undefined}
            nextButtonText={t('Consent.next')}
          />
        }
      >
        <Box maxWidth="900px" display="flex" alignItems="center" flex={1}>
          {item && (
            <ActivityCardItem
              key={item.id}
              item={item}
              replaceText={replaceTextVariables}
              watermark={applet.watermark}
              allowToSkipAllItems={activity.isSkippable}
              step={step}
              prevStep={prevStep}
              onValueChange={onItemValueChange}
              onItemAdditionalTextChange={onItemAdditionalTextChange}
            />
          )}
        </Box>
      </SurveyLayout>

      <MuiModal
        isOpen={isSubmitModalOpen}
        onHide={closeSubmitModal}
        title={t('submitAnswerModalTitle')}
        label={canGoBack ? t('submitAnswerModalDescription') : undefined}
        footerPrimaryButton={t('submit')}
        onPrimaryButtonClick={onSubmit}
        isPrimaryButtonLoading={isLoading}
        footerSecondaryButton={canGoBack ? t('goBack') : undefined}
        onSecondaryButtonClick={canGoBack ? closeSubmitModal : undefined}
        testId="submit-response-modal"
      />
    </>
  );
};

export default PassingScreen;
