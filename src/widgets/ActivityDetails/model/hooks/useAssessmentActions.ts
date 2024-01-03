import { useContext } from "react"

import { ActivityDetailsContext } from "../../lib"
import { validateIsItemAnswerShouldBeEmpty, validateIsNumericOnly, validateItem } from "../validateItem"
import { useAnswer } from "./useAnswers"
import { useEntityComplete } from "./useEntityComplete"
import { useStepperStateManager } from "./useStepperStateManager"

import { usePublicSaveAnswerMutation, useSaveAnswerMutation } from "~/entities/activity"
import { appletModel } from "~/entities/applet"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, RespondentMetaDTO } from "~/shared/api"
import { useNotification } from "~/shared/ui"
import { Mixpanel, useCustomTranslation, useFlowType } from "~/shared/utils"

type Props = {
  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO
  respondentMeta?: RespondentMetaDTO

  toNextStep: () => void
  toPrevStep: () => void
  hasNextStep: boolean
}

export const useAssessmentActions = (props: Props) => {
  const { t } = useCustomTranslation()

  const flowParams = useFlowType()

  const context = useContext(ActivityDetailsContext)
  const publicAppletKey = context.isPublic ? context.publicAppletKey : null

  const { showWarningNotification } = useNotification()

  const { currentItem, items, userEvents } = useStepperStateManager({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { saveUserEventByType } = appletModel.hooks.useUserEvent({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { saveActivityItemAnswer } = appletModel.hooks.useSaveActivityItemAnswer({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { saveSetAnswerUserEvent } = appletModel.hooks.useSetAnswerUserEvent({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { processAnswers } = useAnswer({
    appletDetails: props.appletDetails,
    activityId: props.activityDetails.id,
    eventId: context.eventId,
    eventsRawData: props.eventsRawData,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  })

  const { completeActivity, completeFlow } = useEntityComplete({
    appletDetails: props.appletDetails,
    activityId: props.activityDetails.id,
    eventId: context.eventId,
    publicAppletKey,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  })

  function onSaveAnswerSuccess() {
    if (flowParams.isFlow) {
      return completeFlow(flowParams.flowId)
    } else {
      return completeActivity()
    }
  }

  const { mutate: saveAnswer, isLoading: submitLoading } = useSaveAnswerMutation({
    onSuccess() {
      Mixpanel.track("Assessment completed")

      return onSaveAnswerSuccess()
    },
  })
  const { mutate: publicSaveAnswer } = usePublicSaveAnswerMutation({
    onSuccess() {
      Mixpanel.track("Assessment completed")

      return onSaveAnswerSuccess()
    },
  })

  function submitAnswers() {
    if (!currentItem) {
      throw new Error("[Submit answers] CurrentItem is not defined")
    }
    saveUserEventByType("DONE", currentItem)

    const answer = processAnswers({
      items,
      userEvents,
      isPublic: context.isPublic,
    })

    return context.isPublic ? publicSaveAnswer(answer) : saveAnswer(answer)
  }

  function onNextButtonClick() {
    if (!currentItem) {
      throw new Error("[Next button click] CurrentItem is not defined")
    }

    const shouldBeEmpty = validateIsItemAnswerShouldBeEmpty(currentItem)

    const isItemHasAnswer = currentItem.answer.length
    const isItemSkippable = currentItem.config.skippableItem || props.activityDetails.isSkippable

    if (!shouldBeEmpty && !isItemHasAnswer && !isItemSkippable) {
      return showWarningNotification(t("pleaseAnswerTheQuestion"))
    }

    const isAnswerCorrect = validateItem({ item: currentItem })

    if (!isAnswerCorrect && !isItemSkippable) {
      return showWarningNotification(t("incorrect_answer"))
    }

    const isNumericOnly = validateIsNumericOnly(currentItem)

    if (isNumericOnly) {
      return showWarningNotification(t("onlyNumbersAllowed"))
    }

    if (!props.hasNextStep) {
      return submitAnswers()
    }

    if (!isItemHasAnswer && isItemSkippable) {
      saveUserEventByType("SKIP", currentItem)
    } else {
      saveUserEventByType("NEXT", currentItem)
    }

    return props.toNextStep()
  }

  function onBackButtonClick() {
    if (!currentItem) {
      throw new Error("[Back button click] CurrentItem is not defined")
    }

    const hasConditionlLogic = currentItem.conditionalLogic

    if (hasConditionlLogic) {
      // If the current item participate in any conditional logic
      // we need to reset the answer to the initial state

      saveActivityItemAnswer(currentItem.id, [])
      saveSetAnswerUserEvent({
        ...currentItem,
        answer: [],
      })
    }

    saveUserEventByType("PREV", currentItem)

    return props.toPrevStep()
  }

  return {
    onSubmit: submitAnswers,
    onSubmitLoading: submitLoading,
    onBack: onBackButtonClick,
    onNext: onNextButtonClick,
  }
}
