import { useCallback, useContext } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { ActivityDetailsContext } from "../lib"
import { validateIsItemAnswerShouldBeEmpty, validateIsNumericOnly, validateItem } from "../model"
import { useAnswer, useEntityComplete, useSubmitAnswersMutations } from "../model/hooks"
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

  const { items, userEvents, step, item, hasNextStep, hasPrevStep, toNextStep, toPrevStep } =
    appletModel.hooks.useProgressState({
      eventId,
      activityId,
    })

  console.log("item", item)

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

  const prevStep = usePrevious(step)

  const onSubmit = useCallback(() => {
    if (!item) {
      throw new Error("[onSubmit] CurrentItem is not defined")
    }

    saveUserEventByType("DONE", item)

    const answer = processAnswers({
      items,
      userEvents,
      isPublic: context.isPublic,
    })

    return submitAnswers(answer)
  }, [context.isPublic, item, items, processAnswers, saveUserEventByType, submitAnswers, userEvents])

  const onBeforeMoveForward = useCallback((): boolean => {
    if (!item) {
      throw new Error("[onBeforeMoveForward] CurrentItem is not defined")
    }

    const shouldBeEmpty = validateIsItemAnswerShouldBeEmpty(item)

    console.log("onBeforeMoveForward", item)

    const isItemHasAnswer = item.answer.length
    const isItemSkippable = item.config.skippableItem || props.activityDetails.isSkippable

    if (!shouldBeEmpty && !isItemHasAnswer && !isItemSkippable) {
      showWarningNotification(t("pleaseAnswerTheQuestion"))
      return false
    }

    const isAnswerCorrect = validateItem({ item })

    if (!isAnswerCorrect && !isItemSkippable) {
      showWarningNotification(t("incorrect_answer"))
      return false
    }

    const isNumericOnly = validateIsNumericOnly(item)

    if (isNumericOnly) {
      showWarningNotification(t("onlyNumbersAllowed"))
      return false
    }

    return true
  }, [item, props.activityDetails.isSkippable, showWarningNotification, t])

  const onNext = useCallback(() => {
    if (!item) {
      throw new Error("[onNext] CurrentItem is not defined")
    }

    const isItemHasAnswer = item.answer.length
    const isItemSkippable = item.config.skippableItem || props.activityDetails.isSkippable

    if (!isItemHasAnswer && isItemSkippable) {
      saveUserEventByType("SKIP", item)
    } else {
      saveUserEventByType("NEXT", item)
    }

    return toNextStep()
  }, [item, props.activityDetails.isSkippable, saveUserEventByType, toNextStep])

  const onBack = useCallback(() => {
    if (!item) {
      throw new Error("[onBack] CurrentItem is not defined")
    }

    const hasConditionlLogic = item.conditionalLogic

    if (hasConditionlLogic) {
      // If the current item participate in any conditional logic
      // we need to reset the answer to the initial state

      saveItemAnswer(step, [])
      saveSetAnswerUserEvent({
        ...item,
        answer: [],
      })
    }

    saveUserEventByType("PREV", item)

    return toPrevStep()
  }, [item, saveItemAnswer, saveSetAnswerUserEvent, saveUserEventByType, step, toPrevStep])

  const { replaceTextVariables } = useTextVariablesReplacer({
    items: items,
    answers: items.map(item => item.answer),
    respondentMeta: props.respondentMeta,
    completedEntityTime: completedEntities[activityId],
  })

  const onMoveForward = useCallback(
    (force = false) => {
      const ok = onBeforeMoveForward()

      if (!ok) {
        return
      }

      console.log(`hasNextStep: ${hasNextStep}`)

      if (!hasNextStep && !force) {
        return onSubmit()
      }

      return onNext()
    },
    [hasNextStep, onBeforeMoveForward, onNext, onSubmit],
  )

  const onItemValueChange = (value: string[]) => {
    saveItemAnswer(step, value)
    saveSetAnswerUserEvent({
      ...item,
      answer: value,
    })
  }

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
            {item && (
              <ActivityCardItem
                key={item.id}
                item={item}
                values={item.answer}
                replaceText={replaceTextVariables}
                watermark={props.appletDetails.watermark}
                allowToSkipAllItems={props.activityDetails.isSkippable}
                step={step}
                prevStep={prevStep}
                onValueChange={onItemValueChange}
              />
            )}
          </Box>
        </Container>
      </Box>

      <AssessmentLayoutFooter>
        <ItemCardButton
          isSubmitShown={!hasNextStep}
          isBackShown={hasPrevStep && !item?.config.removeBackButton && props.activityDetails.responseIsEditable}
          isLoading={isLoading}
          onNextButtonClick={onMoveForward}
          onBackButtonClick={onBack}
        />
      </AssessmentLayoutFooter>
    </Box>
  )
}
