import { useCallback } from "react"

import Modal from "../../Modal"
import { useAnswer } from "../model/hooks/useAnswers"
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
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { ROUTES } from "~/shared/constants"
import { useCustomNavigation, useCustomTranslation, useModal } from "~/shared/utils"

type Props = {
  eventId: string

  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO

  isPublic: boolean
  publicAppletKey?: string
}

export const AssessmentPassingScreen = (props: Props) => {
  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()

  const [isInvalidAnswerModalOpen, openInvalidAnswerModal, closeInvalidAnswerModal] = useModal()

  const { processAnswers } = useAnswer({
    appletId: props.appletDetails.id,
    appletEncryption: props.appletDetails.encryption,
    appletVersion: props.appletDetails.version,
    activityId: props.activityDetails.id,
    eventId: props.eventId,
    eventsRawData: props.eventsRawData,
  })

  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { entityCompleted } = activityModel.hooks.useActivityGroupsInProgressState()
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
    // Step 4 - Clear progress state related to activity
    clearActivityItemsProgressById(props.activityDetails.id, props.eventId)
    entityCompleted({
      appletId: props.appletDetails.id,
      entityId: props.activityDetails.id,
      eventId: props.eventId,
    })

    // Step 5 - Redirect to "Thanks screen"

    return navigator.navigate(
      ROUTES.thanks.navigateTo(props.isPublic ? props.publicAppletKey! : props.appletDetails.id, props.isPublic),
    )
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

    return props.isPublic ? publicSaveAnswer(answer) : saveAnswer(answer) // Next steps in onSuccess mutation handler
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
  })

  return (
    <>
      <ActivityAssessmentLayout
        title={props.activityDetails.name}
        activityId={props.activityDetails.id}
        eventId={props.eventId}
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
