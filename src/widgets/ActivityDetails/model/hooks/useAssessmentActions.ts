import { useContext } from "react"

import { ActivityDetailsContext } from "../../lib"
import { useAnswer } from "./useAnswers"
import { useEntityComplete } from "./useEntityComplete"
import { useStepperStateManager } from "./useStepperStateManager"

import { activityModel, usePublicSaveAnswerMutation, useSaveAnswerMutation } from "~/entities/activity"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, RespondentMetaDTO } from "~/shared/api"
import { Mixpanel, useFlowType } from "~/shared/utils"

type Props = {
  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO
  respondentMeta?: RespondentMetaDTO
}

export const useAssessmentActions = (props: Props) => {
  const flowParams = useFlowType()

  const context = useContext(ActivityDetailsContext)
  const publicAppletKey = context.isPublic ? context.publicAppletKey : null

  const { currentItem, items, userEvents } = useStepperStateManager({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { saveUserEventByType } = activityModel.hooks.useUserEvent({
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

  return {
    onSubmit: submitAnswers,
    onSubmitLoading: submitLoading,
  }
}
