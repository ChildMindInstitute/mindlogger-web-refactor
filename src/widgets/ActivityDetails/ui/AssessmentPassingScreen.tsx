import { useCallback, useContext, useMemo, useState } from 'react';

import { AssessmentLayout } from './AssessmentLayout';
import { ActivityDetailsContext } from '../lib';
import { validateBeforeMoveForward } from '../model';
import {
  useAnswer,
  useAutoForward,
  useEntityComplete,
  useSubmitAnswersMutations,
  useSurvey,
} from '../model/hooks';

import { ActivityPipelineType, FlowProgress, FlowSummaryData, getProgressId } from '~/abstract/lib';
import { ActivityCardItem, Answer, useTextVariablesReplacer } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { SurveyManageButtons, useSummaryData } from '~/features/PassSurvey';
import {
  ActivityDTO,
  AppletDetailsDTO,
  AppletEventsResponse,
  RespondentMetaDTO,
} from '~/shared/api';
import { MuiModal, useNotification } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import { useAppSelector, useCustomTranslation, useFlowType, usePrevious } from '~/shared/utils';

type Props = {
  activityDetails: ActivityDTO;
  eventsRawData: AppletEventsResponse;
  appletDetails: AppletDetailsDTO;
  respondentMeta?: RespondentMetaDTO;
};

export const AssessmentPassingScreen = (props: Props) => {
  const { t } = useCustomTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showWarningNotification } = useNotification();

  const context = useContext(ActivityDetailsContext);

  const flowParams = useFlowType();

  const applet = props.appletDetails;

  const activityId = props.activityDetails.id;

  const eventId = context.eventId;

  const activityEventId = getProgressId(activityId, eventId);

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
    activityName: props.activityDetails.name,
    eventId,
    scoresAndReports: props.activityDetails.scoresAndReports,
  });

  const { step, item, hasPrevStep, hasNextStep, progress, conditionallyHiddenItemIds } =
    useSurvey(activityProgress);

  const canGoBack = !item?.config.removeBackButton && props.activityDetails.responseIsEditable;

  const prevStep = usePrevious(step);

  const { completeActivity, completeFlow } = useEntityComplete({
    applet,
    activityId,
    eventId,
    publicAppletKey: context.isPublic ? context.publicAppletKey : null,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  });

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map((item) => item.answer),
    respondentMeta: props.respondentMeta,
    completedEntityTime: completedEntities[activityId],
  });

  const onSubmitSuccess = () => {
    const groupProgress = getGroupProgress({
      entityId: flowParams.isFlow ? flowParams.flowId : activityId,
      eventId,
    });

    const isFlowGroup = groupProgress?.type === ActivityPipelineType.Flow;

    const summaryData = getSummaryForCurrentActivity();

    const summaryDataContext: FlowSummaryData = {
      alerts: summaryData.alerts,
      scores: {
        activityName: props.activityDetails.name,
        scores: summaryData.scores,
      },
      order: isFlowGroup ? groupProgress.pipelineActivityOrder : 0,
    };

    saveGroupContext({
      activityId: flowParams.isFlow ? flowParams.flowId : activityId,
      eventId,
      context: {
        summaryData: {
          ...groupProgress?.context.summaryData,
          [activityId]: summaryDataContext,
        },
      },
    });

    const showSummaryScreen = props.activityDetails.scoresAndReports?.showScoreSummary ?? false;

    if (!showSummaryScreen) {
      return flowParams.isFlow ? completeFlow(flowParams.flowId) : completeActivity();
    }

    if (!isFlowGroup && !flowParams.isFlow) {
      // Show summary screen
      return openSummaryScreen({ activityId, eventId });
    }

    const currentFlow = applet.activityFlows.find((flow) => flow.id === flowParams.flowId);

    const nextActivityIndex = (groupProgress as FlowProgress).pipelineActivityOrder + 1;

    const nextActivity = currentFlow?.activityIds[nextActivityIndex] ?? null;

    const isLastActivity = nextActivity === null;

    if (isLastActivity) {
      // Show summary screen
      return openSummaryScreen({ activityId, eventId });
    }

    return flowParams.isFlow ? completeFlow(flowParams.flowId) : completeActivity();
  };

  const { submitAnswers, isLoading } = useSubmitAnswersMutations({
    onSubmitSuccess,
    isPublic: context.isPublic,
  });

  const { processAnswers } = useAnswer({
    applet,
    activityId,
    eventId,
    eventsRawData: props.eventsRawData,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  });

  const onSubmit = useCallback(() => {
    const doneUserEvent = saveUserEventByType('DONE', item);

    const answer = processAnswers({
      items,
      userEvents: [...userEvents, doneUserEvent],
      isPublic: context.isPublic,
    });

    return submitAnswers(answer);
  }, [
    context.isPublic,
    item,
    items,
    processAnswers,
    saveUserEventByType,
    submitAnswers,
    userEvents,
  ]);

  const onNext = useCallback(() => {
    const isItemHasAnswer = item.answer.length;
    const isItemSkippable = item.config.skippableItem || props.activityDetails.isSkippable;

    if (!isItemHasAnswer && isItemSkippable) {
      saveUserEventByType('SKIP', item);
    } else {
      saveUserEventByType('NEXT', item);
    }

    return incrementStep({ activityId, eventId });
  }, [
    activityId,
    eventId,
    incrementStep,
    item,
    props.activityDetails.isSkippable,
    saveUserEventByType,
  ]);

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
      activity: props.activityDetails,
      showWarning: (key: string) => showWarningNotification(t(key)),
    });

    if (!isValid) {
      return;
    }

    conditionallyHiddenItemIds?.forEach(removeItemAnswer);

    if (!hasNextStep) {
      return setIsModalOpen(true);
    }

    return onNext();
  }, [
    item,
    props.activityDetails,
    conditionallyHiddenItemIds,
    removeItemAnswer,
    hasNextStep,
    onNext,
    showWarningNotification,
    t,
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

  return (
    <>
      <AssessmentLayout
        activityName={props.activityDetails.name}
        progress={progress}
        appletId={applet.id}
        activityId={activityId}
        eventId={eventId}
        isPublic={context.isPublic}
        publicAppletKey={context.isPublic ? context.publicAppletKey : null}
        isSaveAndExitButtonShown={true}
        footerActions={
          <SurveyManageButtons
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
              watermark={props.appletDetails.watermark}
              allowToSkipAllItems={props.activityDetails.isSkippable}
              step={step}
              prevStep={prevStep}
              onValueChange={onItemValueChange}
              onItemAdditionalTextChange={onItemAdditionalTextChange}
            />
          )}
        </Box>
      </AssessmentLayout>

      <MuiModal
        isOpen={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        title={t('submitAnswerModalTitle')}
        label={canGoBack ? t('submitAnswerModalDescription') : undefined}
        footerPrimaryButton={t('submit')}
        onPrimaryButtonClick={onSubmit}
        isPrimaryButtonLoading={isLoading}
        footerSecondaryButton={canGoBack ? t('goBack') : undefined}
        onSecondaryButtonClick={canGoBack ? () => setIsModalOpen(false) : undefined}
        testId="submit-response-modal"
      />
    </>
  );
};
