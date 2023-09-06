import { useCallback } from "react"

import Modal from "../../Modal"
import { useAnswer } from "../model/hooks/useAnswers"
import { useEntityComplete } from "../model/hooks/useEntityComplete"
import { useStepperStateManager } from "../model/hooks/useStepperStateManager"
import { validateItem } from "../model/validateItem"
import { ActivityAssessmentLayout } from "./ActivityAssessmentLayout"

import {
  ActivityCardItem,
  ItemCardButton,
  activityModel,
  usePublicSaveAnswerMutation,
  useSaveAnswerMutation,
  useTextVariablesReplacer,
} from "~/entities/activity"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, RespondentMetaDTO } from "~/shared/api"
import { useCustomTranslation, useFlowType, useModal } from "~/shared/utils"

type Props = {
  eventId: string

  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO
  respondentMeta?: RespondentMetaDTO

  isPublic: boolean
  publicAppletKey?: string
}

export const AssessmentPassingScreen = (props: Props) => {
  const { t } = useCustomTranslation()

  const flowParams = useFlowType()

  const [isInvalidAnswerModalOpen, openInvalidAnswerModal, closeInvalidAnswerModal] = useModal()

  const { processAnswers } = useAnswer({
    appletDetails: props.appletDetails,
    activityId: props.activityDetails.id,
    eventId: props.eventId,
    eventsRawData: props.eventsRawData,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  })

  const { completeActivity, completeFlow } = useEntityComplete({
    appletDetails: props.appletDetails,
    activityId: props.activityDetails.id,
    eventId: props.eventId,
    publicAppletKey: props.publicAppletKey ?? null,
    flowId: flowParams.isFlow ? flowParams.flowId : null,
  })

  const { toNextStep, toPrevStep, currentItem, items, userEvents, hasNextStep, hasPrevStep } = useStepperStateManager({
    activityId: props.activityDetails.id,
    eventId: props.eventId,
  })

  const isAllItemsSkippable = props.activityDetails.isSkippable

  const { saveUserEventByType } = activityModel.hooks.useUserEvent({
    activityId: props.activityDetails.id,
    eventId: props.eventId,
  })

  const onSaveAnswerSuccess = () => {
    if (flowParams.isFlow) {
      completeFlow(flowParams.flowId)
    } else {
      return completeActivity()
    }
  }

  const { mutate: saveAnswer, isLoading: submitLoading } = useSaveAnswerMutation({
    onSuccess() {
      return onSaveAnswerSuccess()
    },
  })
  const { mutate: publicSaveAnswer } = usePublicSaveAnswerMutation({
    onSuccess() {
      return onSaveAnswerSuccess()
    },
  })

  const onNextButtonClick = () => {
    if (!currentItem) {
      return
    }

    const isAnswerCorrect = validateItem({ item: currentItem })

    if (!isAnswerCorrect && !isAllItemsSkippable && !currentItem?.config.skippableItem) {
      return openInvalidAnswerModal()
    }

    if (!currentItem?.answer.length && (isAllItemsSkippable || currentItem?.config.skippableItem)) {
      saveUserEventByType("SKIP", currentItem)
    } else {
      saveUserEventByType("NEXT", currentItem)
    }

    return toNextStep()
  }

  const onBackButtonClick = () => {
    if (currentItem) {
      saveUserEventByType("PREV", currentItem)
    }

    return toPrevStep()
  }

  const submitAnswers = useCallback(() => {
    if (currentItem) {
      saveUserEventByType("DONE", currentItem)
    }

    const answer = processAnswers({
      items,
      userEvents,
      isPublic: props.isPublic,
    })

    return props.isPublic ? publicSaveAnswer(answer) : saveAnswer(answer)
  }, [
    currentItem,
    items,
    processAnswers,
    props.isPublic,
    publicSaveAnswer,
    saveAnswer,
    saveUserEventByType,
    userEvents,
  ])

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map(item => item.answer),
    activityId: props.activityDetails.id,
    respondentMeta: props.respondentMeta,
  })

  const onEnterPress = () => {
    if (!hasNextStep) {
      return submitAnswers()
    }

    return onNextButtonClick()
  }

  const onKeyDownHandler = (key: string) => {
    if (key === "Enter") {
      return onEnterPress()
    }
  }

  return (
    <>
      <ActivityAssessmentLayout
        title={props.activityDetails.name}
        appletId={props.appletDetails.id}
        activityId={props.activityDetails.id}
        eventId={props.eventId}
        isPublic={props.isPublic}
        publicKey={props.publicAppletKey ?? null}
        onKeyDownHandler={onKeyDownHandler}
        buttons={
          <ItemCardButton
            currentItem={currentItem}
            isSubmitShown={!hasNextStep}
            isLoading={submitLoading}
            hasPrevStep={hasPrevStep}
            isAllItemsSkippable={isAllItemsSkippable}
            onNextButtonClick={onNextButtonClick}
            onBackButtonClick={onBackButtonClick}
            onSubmitButtonClick={submitAnswers}
          />
        }>
        {currentItem && (
          <ActivityCardItem
            key={currentItem.id}
            activityId={props.activityDetails.id}
            eventId={props.eventId}
            activityItem={currentItem}
            values={currentItem.answer}
            replaceText={replaceTextVariables}
            watermark={props.appletDetails.watermark}
          />
        )}
      </ActivityAssessmentLayout>

      <Modal
        show={isInvalidAnswerModalOpen}
        onHide={closeInvalidAnswerModal}
        title={t("failed")}
        label={t("incorrect_answer")}
      />
    </>
  )
}
