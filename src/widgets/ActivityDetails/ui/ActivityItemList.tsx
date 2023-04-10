import { useCallback, useState } from "react"

import Modal from "../../Modal"

import { ActivityItemStepper, ActivityOnePageAssessment, activityModel } from "~/entities/activity"
import { ActivityDTO } from "~/shared/api"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

interface ActivityItemListProps {
  appletId: string
  eventId: string
  activityDetails: ActivityDTO
}

export const ActivityItemList = ({ activityDetails, eventId, appletId }: ActivityItemListProps) => {
  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false)
  const [isRequiredModalOpen, setIsRequiredModalOpen] = useState<boolean>(false)

  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { updateGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()

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
    // Will be implemented in the next tasks
    // Step 1 - Collect answers from store
    // Step 2 - Send answers to backend
    // Step 3 - Clear progress state related to activity
    clearActivityItemsProgressById(activityDetails.id, eventId)
    updateGroupInProgressByIds({
      appletId,
      eventId,
      activityId: activityDetails.id,
      progressPayload: {
        endAt: new Date(),
      },
    })

    // Step 4 - Redirect to "Thanks screen"
    return navigator.navigate(ROUTES.thanks.navigateTo(appletId))
  }, [activityDetails.id, appletId, clearActivityItemsProgressById, eventId, navigator, updateGroupInProgressByIds])

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
