import { useCallback, useState } from "react"

import Modal from "../../Modal"

import {
  ActivityItemStepper,
  ActivityListItem,
  ActivityOnePageAssessment,
  activityModel,
  useSaveAnswerMutation,
} from "~/entities/activity"
import { ActivityFlow, AppletDetails } from "~/entities/applet"
import { ActivityDTO, AnswerPayload } from "~/shared/api"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

interface ActivityItemListProps {
  appletDetails: AppletDetails<ActivityListItem, ActivityFlow>
  activityDetails: ActivityDTO
  eventId: string
}

export const ActivityItemList = ({ activityDetails, eventId, appletDetails }: ActivityItemListProps) => {
  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false)
  const [isRequiredModalOpen, setIsRequiredModalOpen] = useState<boolean>(false)

  const { mutate: saveAnswer } = useSaveAnswerMutation({
    onSuccess() {
      // Step 3 - Clear progress state related to activity
      clearActivityItemsProgressById(activityDetails.id, eventId)
      updateGroupInProgressByIds({
        appletId: appletDetails.id,
        eventId,
        activityId: activityDetails.id,
        progressPayload: {
          endAt: new Date(),
        },
      })

      // Step 4 - Redirect to "Thanks screen"
      return navigator.navigate(ROUTES.thanks.navigateTo(appletDetails.id))
    },
  })

  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { updateGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()
  const { currentActivityEventProgress } = activityModel.hooks.useActivityEventProgressState({
    activityId: activityDetails.id,
    eventId,
  })

  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const closeSubmitModal = useCallback(() => {
    setIsSubmitModalOpen(false)
  }, [])
  const onSubmitButtonClick = useCallback(() => {
    setIsSubmitModalOpen(true)
  }, [])

  const closeRequiredModal = useCallback(() => {
    setIsRequiredModalOpen(false)
  }, [])
  const openRequiredModal = useCallback(() => {
    setIsRequiredModalOpen(true)
  }, [])

  const onPrimaryButtonClick = useCallback(() => {
    // Step 1 - Collect answers from store and transform to answer payload
    const itemAnswers = activityModel.activityBuilder.convertToAnswers(currentActivityEventProgress)

    // Step 2 - Send answers to backend
    const answer: AnswerPayload = {
      appletId: appletDetails?.id,
      version: appletDetails?.version,
      flowId: null,
      activityId: activityDetails.id,
      answers: itemAnswers,
      createdAt: new Date().getTime(),
    }
    return saveAnswer(answer) // Next steps in onSuccess handler
  }, [activityDetails.id, appletDetails?.id, appletDetails?.version, currentActivityEventProgress, saveAnswer])

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && (
        <ActivityOnePageAssessment
          eventId={eventId}
          activityId={activityDetails.id}
          onSubmitButtonClick={onSubmitButtonClick}
          openRequiredModal={openRequiredModal}
        />
      )}
      {!isSummaryScreen && !isOnePageAssessment && (
        <ActivityItemStepper
          eventId={eventId}
          activityId={activityDetails.id}
          onSubmitButtonClick={onSubmitButtonClick}
          openRequiredModal={openRequiredModal}
        />
      )}

      <Modal
        show={isSubmitModalOpen}
        onHide={closeSubmitModal}
        title={t("additional.response_submit")}
        label={t("additional.response_submit_text")}
        footerPrimaryButton={t("additional.yes")}
        onPrimaryButtonClick={onPrimaryButtonClick}
        footerSecondaryButton={t("additional.no")}
        onSecondaryButtonClick={closeSubmitModal}
      />

      <Modal show={isRequiredModalOpen} onHide={closeRequiredModal} title={t("failed")} label={t("incorrect_answer")} />
    </>
  )
}
