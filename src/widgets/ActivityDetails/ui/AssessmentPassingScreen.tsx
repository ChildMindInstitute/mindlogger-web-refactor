import { useCallback, useContext } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { ActivityDetailsContext } from "../lib"
import { validateIsItemAnswerShouldBeEmpty, validateIsNumericOnly, validateItem } from "../model"
import { useAnswer, useSubmitAnswersMutations } from "../model/hooks"
import { useEntityComplete } from "../model/hooks/useEntityComplete"
import { useStepperStateManager } from "../model/hooks/useStepperStateManager"
import { AssessmentLayoutFooter } from "./AssessmentLayoutFooter"
import { AssessmentLayoutHeader } from "./AssessmentLayoutHeader"

import { ActivityCardItem, ItemCardButton, useTextVariablesReplacer } from "~/entities/activity"
import { appletModel } from "~/entities/applet"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, RespondentMetaDTO } from "~/shared/api"
import { Theme } from "~/shared/constants"
import { NotificationCenter, useNotification } from "~/shared/ui"
import { useAppSelector, useCustomTranslation, useFlowType, usePrevious } from "~/shared/utils"

type Props = {
  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO
  respondentMeta?: RespondentMetaDTO
}

export const AssessmentPassingScreen = (props: Props) => {
  const { t } = useCustomTranslation()

  const { showWarningNotification } = useNotification()

  const context = useContext(ActivityDetailsContext)

  const flowParams = useFlowType()

  const applet = props.appletDetails

  const activityId = props.activityDetails.id

  const eventId = context.eventId

  const completedEntities = useAppSelector(appletModel.selectors.completedEntitiesSelector)

  const { saveUserEventByType, saveSetAnswerUserEvent } = appletModel.hooks.useUserEvents({
    activityId,
    eventId,
  })

  const { saveItemAnswer } = appletModel.hooks.useSaveItemAnswer({
    activityId,
    eventId,
  })

  const { items, userEvents, lastStep } = appletModel.hooks.useProgressState({
    eventId,
    activityId,
  })

  const { toNextStep, toPrevStep, currentItem, hasNextStep, hasPrevStep } = useStepperStateManager({
    activityId,
    eventId,
    items,
    step: lastStep,
  })

  const { completeActivity, completeFlow } = useEntityComplete({
    applet,
    activityId,
    eventId,
    publicAppletKey: context.isPublic ? context.publicAppletKey : null,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  })

  const onSubmitSuccess = () => (flowParams.isFlow ? completeFlow(flowParams.flowId) : completeActivity())

  const { submitAnswers, isLoading } = useSubmitAnswersMutations({
    onSubmitSuccess,
    isPublic: context.isPublic,
  })

  const { processAnswers } = useAnswer({
    applet,
    activityId,
    eventId,
    eventsRawData: props.eventsRawData,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  })

  const prevStep = usePrevious(lastStep)

  const onSubmit = useCallback(() => {
    if (!currentItem) {
      throw new Error("[onSubmit] CurrentItem is not defined")
    }

    saveUserEventByType("DONE", currentItem)

    const answer = processAnswers({
      items,
      userEvents,
      isPublic: context.isPublic,
    })

    return submitAnswers(answer)
  }, [context.isPublic, currentItem, items, processAnswers, saveUserEventByType, submitAnswers, userEvents])

  const onBeforeMoveForward = useCallback((): boolean => {
    if (!currentItem) {
      throw new Error("[onBeforeMoveForward] CurrentItem is not defined")
    }

    const shouldBeEmpty = validateIsItemAnswerShouldBeEmpty(currentItem)

    const isItemHasAnswer = currentItem.answer.length
    const isItemSkippable = currentItem.config.skippableItem || props.activityDetails.isSkippable

    if (!shouldBeEmpty && !isItemHasAnswer && !isItemSkippable) {
      showWarningNotification(t("pleaseAnswerTheQuestion"))
      return false
    }

    const isAnswerCorrect = validateItem({ item: currentItem })

    if (!isAnswerCorrect && !isItemSkippable) {
      showWarningNotification(t("incorrect_answer"))
      return false
    }

    const isNumericOnly = validateIsNumericOnly(currentItem)

    if (isNumericOnly) {
      showWarningNotification(t("onlyNumbersAllowed"))
      return false
    }

    return true
  }, [currentItem, props.activityDetails.isSkippable, showWarningNotification, t])

  const onNext = useCallback(() => {
    if (!currentItem) {
      throw new Error("[onNext] CurrentItem is not defined")
    }

    const isItemHasAnswer = currentItem.answer.length
    const isItemSkippable = currentItem.config.skippableItem || props.activityDetails.isSkippable

    if (!isItemHasAnswer && isItemSkippable) {
      saveUserEventByType("SKIP", currentItem)
    } else {
      saveUserEventByType("NEXT", currentItem)
    }

    return toNextStep()
  }, [currentItem, props.activityDetails.isSkippable, saveUserEventByType, toNextStep])

  const onBack = useCallback(() => {
    if (!currentItem) {
      throw new Error("[onBack] CurrentItem is not defined")
    }

    const hasConditionlLogic = currentItem.conditionalLogic

    if (hasConditionlLogic) {
      // If the current item participate in any conditional logic
      // we need to reset the answer to the initial state

      saveItemAnswer(currentItem.id, [])
      saveSetAnswerUserEvent({
        ...currentItem,
        answer: [],
      })
    }

    saveUserEventByType("PREV", currentItem)

    return toPrevStep()
  }, [currentItem, saveItemAnswer, saveSetAnswerUserEvent, saveUserEventByType, toPrevStep])

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map(item => item.answer),
    respondentMeta: props.respondentMeta,
    completedEntityTime: completedEntities[activityId],
  })

  const onMoveForward = useCallback(() => {
    const ok = onBeforeMoveForward()

    if (!ok) {
      return
    }

    if (!hasNextStep) {
      return onSubmit()
    }

    return onNext()
  }, [hasNextStep, onBeforeMoveForward, onNext, onSubmit])

  return (
    <Box
      id="assessment-screen-layout"
      display="flex"
      flex={1}
      flexDirection="column"
      bgcolor={Theme.colors.light.surface}>
      <AssessmentLayoutHeader
        title={props.activityDetails.name}
        appletId={applet.id}
        activityId={activityId}
        eventId={eventId}
        isPublic={context.isPublic}
        publicKey={context.isPublic ? context.publicAppletKey : null}
      />

      <Box id="assessment-content-container" display="flex" flex={1} flexDirection="column" overflow="scroll">
        <NotificationCenter />
        <Container sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
          <Box maxWidth="900px" display="flex" alignItems="center" flex={1} justifyContent="center">
            {currentItem && (
              <ActivityCardItem
                key={currentItem.id}
                activityId={activityId}
                eventId={eventId}
                activityItem={currentItem}
                values={currentItem.answer}
                replaceText={replaceTextVariables}
                watermark={props.appletDetails.watermark}
                allowToSkipAllItems={props.activityDetails.isSkippable}
                step={lastStep}
                prevStep={prevStep}
              />
            )}
          </Box>
        </Container>
      </Box>

      <AssessmentLayoutFooter>
        <ItemCardButton
          isSubmitShown={!hasNextStep}
          isBackShown={hasPrevStep && !currentItem?.config.removeBackButton && props.activityDetails.responseIsEditable}
          isLoading={isLoading}
          onNextButtonClick={onMoveForward}
          onBackButtonClick={onBack}
        />
      </AssessmentLayoutFooter>
    </Box>
  )
}
