import { useCallback, useState } from "react"

import Modal from "../../Modal"
import { validateAnswerBeforeSubmit } from "../model/validateItemsBeforeSubmit"

import {
  ActivityItemStepper,
  ActivityListItem,
  ActivityOnePageAssessment,
  activityModel,
  useEncrypteAnswers,
  usePublicSaveAnswerMutation,
  useSaveAnswerMutation,
} from "~/entities/activity"
import { ActivityFlow, AppletDetails } from "~/entities/applet"
import { ActivityDTO, AnswerPayload } from "~/shared/api"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

type ActivityItemListProps = {
  isPublic: boolean
  publicAppletKey?: string
  appletDetails: AppletDetails<ActivityListItem, ActivityFlow>
  activityDetails: ActivityDTO
  eventId: string
}

export const ActivityItemList = (props: ActivityItemListProps) => {
  const { activityDetails, eventId, appletDetails, isPublic } = props

  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false)
  const [isRequiredModalOpen, setIsRequiredModalOpen] = useState<boolean>(false)
  const [isInvalidAnswerModalOpen, setIsInvalidAnswerModalOpen] = useState<boolean>(false)

  const [invalidItemIds, setInvalidItemIds] = useState<Array<string>>([])

  const isAllItemsSkippable = activityDetails.isSkippable

  const onSaveAnswerSuccess = () => {
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

    return navigator.navigate(ROUTES.thanks.navigateTo(isPublic ? props.publicAppletKey! : appletDetails.id, isPublic))
  }

  const { mutate: saveAnswer } = useSaveAnswerMutation({
    onSuccess() {
      return onSaveAnswerSuccess()
    },
  })
  const { mutate: publicSaveAnswer } = usePublicSaveAnswerMutation({
    onSuccess() {
      return onSaveAnswerSuccess()
    },
  })

  const { encrypteAnswers } = useEncrypteAnswers()

  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { updateGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()
  const { currentActivityEventProgress } = activityModel.hooks.useActivityEventProgressState({
    activityId: activityDetails.id,
    eventId,
  })

  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const closeSubmitModal = useCallback(() => {
    return setIsSubmitModalOpen(false)
  }, [])

  const closeRequiredModal = useCallback(() => {
    return setIsRequiredModalOpen(false)
  }, [])
  const openRequiredModal = useCallback(() => {
    return setIsRequiredModalOpen(true)
  }, [])

  const openInvalidAnswerModal = useCallback(() => {
    return setIsInvalidAnswerModalOpen(true)
  }, [])

  const closeInvalidAnswerModal = useCallback(() => {
    return setIsInvalidAnswerModalOpen(false)
  }, [])

  const onSubmitButtonClick = useCallback(() => {
    const invalidItemIds = validateAnswerBeforeSubmit(currentActivityEventProgress, { isAllItemsSkippable })

    const hasInvalidItems = invalidItemIds.length > 0

    if (hasInvalidItems) {
      setInvalidItemIds(invalidItemIds)
      return openRequiredModal()
    }

    return setIsSubmitModalOpen(true)
  }, [currentActivityEventProgress, isAllItemsSkippable, openRequiredModal])

  const onPrimaryButtonClick = useCallback(() => {
    // Step 1 - Collect answers from store and transform to answer payload
    const itemAnswers = activityModel.activityBuilder.convertToAnswers(currentActivityEventProgress)

    const encryptedAnswers = encrypteAnswers(appletDetails.encryption, { answers: itemAnswers })

    // Step 2 - Send answers to backend
    const answer: AnswerPayload = {
      appletId: appletDetails?.id,
      version: appletDetails?.version,
      flowId: null,
      activityId: activityDetails.id,
      answers: encryptedAnswers,
    }

    return isPublic ? publicSaveAnswer(answer) : saveAnswer(answer) // Next steps in onSuccess handler
  }, [
    activityDetails.id,
    appletDetails.encryption,
    appletDetails?.id,
    appletDetails?.version,
    currentActivityEventProgress,
    encrypteAnswers,
    isPublic,
    publicSaveAnswer,
    saveAnswer,
  ])

  return (
    <>
      {/* {isSummaryScreen && <ActivitySummary />} */}
      {!isSummaryScreen && isOnePageAssessment && (
        <ActivityOnePageAssessment
          eventId={eventId}
          activityId={activityDetails.id}
          invalidItemIds={invalidItemIds}
          onSubmitButtonClick={onSubmitButtonClick}
          openInvalidAnswerModal={openInvalidAnswerModal}
          isAllItemsSkippable={isAllItemsSkippable}
          watermark={appletDetails.watermark}
        />
      )}
      {!isSummaryScreen && !isOnePageAssessment && (
        <ActivityItemStepper
          eventId={eventId}
          activityId={activityDetails.id}
          invalidItemIds={invalidItemIds}
          onSubmitButtonClick={onSubmitButtonClick}
          openInvalidAnswerModal={openInvalidAnswerModal}
          isAllItemsSkippable={isAllItemsSkippable}
          watermark={appletDetails.watermark}
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

      <Modal
        show={isInvalidAnswerModalOpen}
        onHide={closeInvalidAnswerModal}
        title={t("failed")}
        label={t("incorrect_answer")}
      />
      <Modal
        show={isRequiredModalOpen}
        onHide={closeRequiredModal}
        title={t("additional.response_submit")}
        label={t("additional.fill_out_fields")}
        footerSecondaryButton={t("additional.okay")}
        onSecondaryButtonClick={closeRequiredModal}
      />
    </>
  )
}
