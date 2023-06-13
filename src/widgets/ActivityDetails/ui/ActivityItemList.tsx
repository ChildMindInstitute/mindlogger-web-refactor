import { useCallback, useState } from "react"

import { getUnixTime } from "date-fns"
import { v4 as uuidV4 } from "uuid"

import Modal from "../../Modal"
import {
  generateUserPublicKey,
  getFirstResponseDataIdentifierTextItem,
  getScheduledTimeFromEvents,
  mapToAnswers,
} from "../model"
import { prepareItemAnswers } from "../model/prepareItemAnswers"
import { validateAnswerBeforeSubmit } from "../model/validateItemsBeforeSubmit"

import {
  ActivityItemStepper,
  ActivityListItem,
  ActivityOnePageAssessment,
  activityModel,
  useEncryptPayload,
  usePublicSaveAnswerMutation,
  useSaveAnswerMutation,
} from "~/entities/activity"
import { ActivityFlow, AppletDetails } from "~/entities/applet"
import { ActivityDTO, AnswerPayload, AppletEventsResponse } from "~/shared/api"
import { ROUTES, useCustomNavigation, useCustomTranslation } from "~/shared/utils"

type ActivityItemListProps = {
  isPublic: boolean
  publicAppletKey?: string
  appletDetails: AppletDetails<ActivityListItem, ActivityFlow>
  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse | undefined
  eventId: string
}

export const ActivityItemList = (props: ActivityItemListProps) => {
  const { activityDetails, eventId, appletDetails, isPublic, eventsRawData } = props

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

  const { encryptePayload } = useEncryptPayload()

  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { updateGroupInProgressByIds, getGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()
  const { currentActivityEventProgress, userEvents } = activityModel.hooks.useActivityEventProgressState({
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
    const itemAnswers = mapToAnswers(currentActivityEventProgress)

    const userPublicKey = generateUserPublicKey(appletDetails?.encryption)

    const preparedItemAnswers = prepareItemAnswers(itemAnswers)

    const encryptedAnswers = encryptePayload(appletDetails.encryption, preparedItemAnswers.answer)
    const encryptedUserEvents = encryptePayload(appletDetails.encryption, userEvents)

    const groupInProgress = getGroupInProgressByIds({
      appletId: appletDetails.id,
      activityId: activityDetails.id,
      eventId,
    })

    const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(currentActivityEventProgress)
    const encryptedIdentifier = firstTextItemAnserWithIdentifier
      ? encryptePayload(appletDetails.encryption, firstTextItemAnserWithIdentifier)
      : null

    // Step 2 - Send answers to backend
    const answer: AnswerPayload = {
      appletId: appletDetails.id,
      version: appletDetails.version,
      flowId: null,
      activityId: activityDetails.id,
      submitId: uuidV4(),
      answer: {
        answer: encryptedAnswers,
        itemIds: preparedItemAnswers.itemIds,
        events: encryptedUserEvents,
        userPublicKey,
        startTime: getUnixTime(groupInProgress.startAt!),
        endTime: getUnixTime(new Date()),
        identifier: encryptedIdentifier,
      },
    }

    const scheduledTime = getScheduledTimeFromEvents(eventsRawData, activityDetails.id)
    if (scheduledTime) {
      answer.answer.scheduledTime = scheduledTime
    }

    return isPublic ? publicSaveAnswer(answer) : saveAnswer(answer) // Next steps in onSuccess mutation handler
  }, [
    activityDetails.id,
    appletDetails.encryption,
    appletDetails.id,
    appletDetails.version,
    currentActivityEventProgress,
    encryptePayload,
    eventId,
    eventsRawData,
    getGroupInProgressByIds,
    isPublic,
    publicSaveAnswer,
    saveAnswer,
    userEvents,
  ])

  return (
    <>
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
