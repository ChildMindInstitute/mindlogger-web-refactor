import { useState } from "react"

import Modal from "../../Modal"

import { ActivityItemStepper, ActivityOnePageAssessment } from "~/entities/activity"
import { ActivityDTO } from "~/shared/api"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityItemListProps {
  appletId: string
  eventId: string
  activityDetails: ActivityDTO
}

export const ActivityItemList = ({ activityDetails, eventId }: ActivityItemListProps) => {
  const { t } = useCustomTranslation()
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false)

  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const closeSubmitModal = () => {
    setIsSubmitModalOpen(false)
  }

  const onPrimaryButtonClick = () => {
    // Will be implemented in the next tasks
    // Step 1 - Collect answers from store
    // Step 2 - Send answers to backend
    // Step 3 - Clear progress state related to activity (Need to clarify)
    // Step 4 - Redirect to "Thanks screen"
  }

  const onSubmitButtonClick = () => {
    setIsSubmitModalOpen(true)
  }

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && (
        <ActivityOnePageAssessment
          eventId={eventId}
          activityId={activityDetails.id}
          onSubmitButtonClick={onSubmitButtonClick}
        />
      )}
      {!isSummaryScreen && !isOnePageAssessment && (
        <ActivityItemStepper
          eventId={eventId}
          activityId={activityDetails.id}
          onSubmitButtonClick={onSubmitButtonClick}
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
    </>
  )
}
