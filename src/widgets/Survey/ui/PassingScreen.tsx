import { useCallback, useContext, useEffect, useMemo } from 'react';

import { AxiosError } from 'axios';

import { validateBeforeMoveForward } from '../model';
import { useAutoForward, useSubSteps, useSurveyState } from '../model/hooks';

import { ActivityPipelineType, FlowProgress, FlowSummaryData, getProgressId } from '~/abstract/lib';
import { ActivityCardItem, Answer, useTextVariablesReplacer } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { useProlific } from '~/entities/applet/model/hooks/useProlific';
import { useBanners } from '~/entities/banner/model';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import {
  SurveyContext,
  SurveyLayout,
  SurveyManageButtons,
  useAnswerBuilder,
  useItemTimer,
  useSubmitAnswersMutations,
  useSummaryData,
} from '~/features/PassSurvey';
import { interactionEvents } from '~/shared/constants';
import { MuiModal } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import { useAppSelector, useCustomTranslation, useModal, usePrevious } from '~/shared/utils';
import { useIdleTimer } from '~/widgets/InactivityTracker';

type Props = {
  onTimerFinish: () => void;
};

const PassingScreen = (props: Props) => {
  const { t } = useCustomTranslation();

  const [isSubmitModalOpen, openSubmitModal, closeSubmitModal] = useModal();

  const { addWarningBanner, addSuccessBanner, removeWarningBanner, addErrorBanner } = useBanners();

  const context = useContext(SurveyContext);

  const targetSubjectId = context.targetSubject?.id ?? null;

  const activityProgress = useAppSelector((state) =>
    appletModel.selectors.selectActivityProgress(
      state,
      getProgressId(context.activityId, context.eventId, context.targetSubject?.id),
    ),
  );

  const { handleProlificSubmitError, prolificParams } = useProlific();

  const groupProgress = appletModel.hooks.useGroupProgressRecord({
    entityId: context.entityId,
    eventId: context.eventId,
    targetSubjectId,
  });

  const autoCompletionState = AutoCompletionModel.useAutoCompletionRecord({
    entityId: context.entityId,
    eventId: context.eventId,
    targetSubjectId,
  });

  const { saveSummaryDataInContext } = appletModel.hooks.useGroupProgressStateManager();

  const completedEntities = useAppSelector(appletModel.selectors.completedEntitiesSelector);

  const items = useMemo(() => activityProgress?.items ?? [], [activityProgress.items]);

  const { incrementStep, decrementStep, openSummaryScreen } =
    appletModel.hooks.useActivityProgress();

  const { saveUserEventByType, saveSetAnswerUserEvent, saveSetAdditionalTextUserEvent } =
    appletModel.hooks.useUserEvents({
      activityId: context.activityId,
      eventId: context.eventId,
      targetSubjectId,
    });

  const { saveItemAnswer, saveItemAdditionalText, removeItemAnswer } =
    appletModel.hooks.useSaveItemAnswer({
      activityId: context.activityId,
      eventId: context.eventId,
      targetSubjectId,
    });

  const { getSummaryForCurrentActivity } = useSummaryData({
    activityId: context.activityId,
    activityName: context.activity.name,
    eventId: context.eventId,
    targetSubjectId,
    scoresAndReports: context.activity.scoresAndReports,
    flowId: null,
  });

  const { step, item, hasPrevStep, hasNextStep, progress, conditionallyHiddenItemIds } =
    useSurveyState(activityProgress);

  const { hasNextSubStep, hasPrevSubStep, handleNextSubStep, handlePrevSubStep, nextButtonText } =
    useSubSteps({ item });

  const canGoBack = !item?.config.removeBackButton && context.activity.responseIsEditable;

  const prevStep = usePrevious(step);

  const { completeActivity, completeFlow } = appletModel.hooks.useEntityComplete({
    activityId: context.activityId,
    eventId: context.eventId,
    targetSubjectId,
    publicAppletKey: context.publicAppletKey,
    flowId: context.flow?.id ?? null,
    appletId: context.appletId,
    flow: context.flow,
  });

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map((item) => item.answer),
    respondentMeta: context.respondentMeta,
    completedEntityTime: completedEntities[context.activityId],
  });

  const onSubmitSuccess = () => {
    const isSummaryScreenOn = context.activity.scoresAndReports?.showScoreSummary ?? false;

    if (!groupProgress) {
      throw new Error('[obSubmitSuccess] GroupProgress is not defined');
    }

    const isFlowGroup = groupProgress.type === ActivityPipelineType.Flow;

    const nextActivityIndex = (groupProgress as FlowProgress).pipelineActivityOrder + 1;

    const nextActivity = context.flow?.activityIds[nextActivityIndex] ?? null;

    const isLastActivity = nextActivity === null;

    const summaryData = getSummaryForCurrentActivity();

    const isAlertsExist = summaryData.alerts.length > 0;
    const isScoreExist = summaryData.scores.length > 0;

    const isSummaryDataExist = isAlertsExist || isScoreExist;

    if (isSummaryScreenOn) {
      if (isSummaryDataExist) {
        const summaryDataContext: FlowSummaryData = {
          alerts: summaryData.alerts,
          scores: {
            activityName: context.activity.name,
            scores: summaryData.scores,
          },
          order: isFlowGroup ? groupProgress.pipelineActivityOrder : 0,
        };

        saveSummaryDataInContext({
          entityId: context.entityId,
          eventId: context.eventId,
          targetSubjectId,

          activityId: context.activityId,
          summaryData: summaryDataContext,
        });
      }
    }

    const hasAnySummaryScreenResults =
      Object.keys(groupProgress.context.summaryData ?? {}).length > 0;

    // Show notification
    if (isFlowGroup && !isLastActivity) {
      addSuccessBanner(t('toast.next_activity'));
    } else {
      addSuccessBanner({ children: t('toast.answers_submitted'), duration: null });
    }

    if (isFlowGroup && context.flow) {
      if (isLastActivity && hasAnySummaryScreenResults) {
        return openSummaryScreen({
          activityId: context.activityId,
          eventId: context.eventId,
          targetSubjectId,
        });
      }

      return completeFlow();
    }

    if (isSummaryScreenOn && isSummaryDataExist) {
      return openSummaryScreen({
        activityId: context.activityId,
        eventId: context.eventId,
        targetSubjectId,
      });
    }

    return completeActivity();
  };

  const onSubmitError = (error?: AxiosError) => {
    closeSubmitModal();
    if (!error) {
      return;
    }

    handleProlificSubmitError(error, addErrorBanner);
  };

  const { submitAnswers, isLoading } = useSubmitAnswersMutations({
    onSubmitSuccess,
    onSubmitError,
    isPublic: !!context.publicAppletKey,
  });

  const answerBuilder = useAnswerBuilder();

  const onSubmit = () => {
    const doneEvent = saveUserEventByType('DONE', item);

    const answer = answerBuilder.build({
      activityId: context.activityId,
      userEvents: activityProgress.userEvents.concat(doneEvent),
      items: activityProgress.items,
      prolificParams,
    });

    return submitAnswers(answer);
  };

  const onNext = useCallback(() => {
    const isItemHasAnswer = item.answer.length;
    const isItemSkippable = item.config.skippableItem || context.activity.isSkippable;

    if (!isItemHasAnswer && isItemSkippable) {
      saveUserEventByType('SKIP', item);
    } else {
      saveUserEventByType('NEXT', item);
    }

    // If the current item has subSteps and there are more subSteps to go through
    if (hasNextSubStep) {
      return handleNextSubStep();
    }

    // Otherwise, proceed to the next step
    return incrementStep({
      activityId: context.activityId,
      eventId: context.eventId,
      targetSubjectId,
    });
  }, [
    item,
    context.activity.isSkippable,
    context.activityId,
    context.eventId,
    incrementStep,
    hasNextSubStep,
    handleNextSubStep,
    targetSubjectId,
    saveUserEventByType,
  ]);

  const onBack = useCallback(() => {
    saveUserEventByType('PREV', item);

    // If the current item has subSteps and we're not at the first subStep
    if (hasPrevSubStep) {
      return handlePrevSubStep();
    }

    // If we're at the first subStep or there are no subSteps and we're not at the first step, go to
    // the previous step
    if (hasPrevStep) {
      return decrementStep({
        activityId: context.activityId,
        eventId: context.eventId,
        targetSubjectId,
      });
    }
  }, [
    context.activityId,
    context.eventId,
    decrementStep,
    hasPrevStep,
    hasPrevSubStep,
    handlePrevSubStep,
    item,
    saveUserEventByType,
    targetSubjectId,
  ]);

  const onMoveForward = useCallback(() => {
    if (!item) {
      throw new Error('[onMoveForward] CurrentItem is not defined');
    }

    const isValid = validateBeforeMoveForward({
      item,
      activity: context.activity,
      showWarning: (key: string) => addWarningBanner(t(key)),
      hideWarning: removeWarningBanner,
    });

    if (!isValid) {
      return;
    }

    conditionallyHiddenItemIds?.forEach(removeItemAnswer);

    // If there are no more steps and no more subSteps, open the submit modal
    if (!hasNextStep && !hasNextSubStep) {
      return openSubmitModal();
    }

    return onNext();
  }, [
    item,
    context.activity,
    removeWarningBanner,
    conditionallyHiddenItemIds,
    removeItemAnswer,
    hasNextStep,
    hasNextSubStep,
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
    activityId: context.activityId,
    eventId: context.eventId,
    targetSubjectId,
    isSubmitModalOpen,
    onTimerEnd: hasNextStep ? onNext : openSubmitModal,
  });

  const IdleTimer = useIdleTimer({
    events: interactionEvents,
    timerName: 'idleTimer',
  });

  // This effect is responsible for starting the timer when the user is inactive
  useEffect(() => {
    const idleTimer = groupProgress?.event?.timers?.idleTimer;

    if (!idleTimer) {
      return;
    }

    // If current entity already has record in the AutoCompletion state, we don't need to launch the Idle Timer logic
    if (autoCompletionState) {
      return;
    }

    const listener = IdleTimer.createListener(idleTimer, props.onTimerFinish);

    IdleTimer.start(listener);

    return () => {
      IdleTimer.stop(listener);
    };
  }, [
    IdleTimer,
    autoCompletionState,
    groupProgress?.event?.timers?.idleTimer,
    props.onTimerFinish,
  ]);

  return (
    <>
      <SurveyLayout
        progress={progress}
        isSaveAndExitButtonShown={true}
        entityTimer={groupProgress?.event?.timers?.timer ?? undefined}
        footerActions={
          <SurveyManageButtons
            timerSettings={!isSubmitModalOpen ? timerSettings : undefined}
            isLoading={false}
            isBackShown={(hasPrevStep || hasPrevSubStep) && canGoBack}
            onBackButtonClick={onBack}
            onNextButtonClick={onMoveForward}
            backButtonText={String(t('Consent.back'))}
            nextButtonText={String(nextButtonText ?? t('Consent.next'))}
          />
        }
      >
        <Box maxWidth="900px" display="flex" alignItems="center" flex={1}>
          {item && (
            <ActivityCardItem
              key={item.id}
              item={item}
              replaceText={replaceTextVariables}
              watermark={context.watermark}
              allowToSkipAllItems={context.activity.isSkippable}
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
