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
import {
  ROUTES,
  secureUserPrivateKeyStorage,
  useCustomNavigation,
  useCustomTranslation,
  useEncryption,
  useModal,
} from "~/shared/utils"

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

  const [isSubmitModalOpen, openSubmitModal, closeSubmitModal] = useModal()
  const [isRequiredModalOpen, openRequiredModal, closeRequiredModal] = useModal()
  const [isInvalidAnswerModalOpen, openInvalidAnswerModal, closeInvalidAnswerModal] = useModal()

  const [invalidItemIds, setInvalidItemIds] = useState<Array<string>>([])

  const { generateUserPrivateKey } = useEncryption()

  const isAllItemsSkippable = activityDetails.isSkippable

  const onSaveAnswerSuccess = () => {
    // Step 4 - Clear progress state related to activity
    clearActivityItemsProgressById(activityDetails.id, eventId)
    updateGroupInProgressByIds({
      appletId: appletDetails.id,
      eventId,
      activityId: activityDetails.id,
      progressPayload: {
        endAt: Date.now(),
      },
    })

    // Step 5 - Redirect to "Thanks screen"

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
  const { currentActivityEventProgress, userEvents, activityEvents } =
    activityModel.hooks.useActivityEventProgressState({
      activityId: activityDetails.id,
      eventId,
    })

  const isOnePageAssessment = activityDetails.showAllAtOnce
  const isSummaryScreen = false // Mock

  const onSubmitButtonClick = useCallback(() => {
    const invalidItemIds = validateAnswerBeforeSubmit(currentActivityEventProgress, { isAllItemsSkippable })

    const hasInvalidItems = invalidItemIds.length > 0

    if (hasInvalidItems) {
      setInvalidItemIds(invalidItemIds)
      return openRequiredModal()
    }

    return openSubmitModal()
  }, [currentActivityEventProgress, isAllItemsSkippable, openRequiredModal, openSubmitModal])

  const onPrimaryButtonClick = useCallback(() => {
    // Step 1 - Collect answers from store and transform to answer payload
    const itemAnswers = mapToAnswers(activityEvents)
    const preparedItemAnswers = prepareItemAnswers(itemAnswers)

    // Step 2 - Encrypt answers
    let privateKey: number[] | null = null

    if (isPublic) {
      privateKey = generateUserPrivateKey({ userId: uuidV4(), email: uuidV4(), password: uuidV4() })
    } else {
      privateKey = secureUserPrivateKeyStorage.getUserPrivateKey()
    }

    const userPublicKey = generateUserPublicKey(appletDetails?.encryption, privateKey)

    const encryptedAnswers = encryptePayload(appletDetails.encryption, preparedItemAnswers.answer, privateKey)
    const encryptedUserEvents = encryptePayload(appletDetails.encryption, userEvents, privateKey)

    const groupInProgress = getGroupInProgressByIds({
      appletId: appletDetails.id,
      activityId: activityDetails.id,
      eventId,
    })

    const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(activityEvents)
    const encryptedIdentifier = firstTextItemAnserWithIdentifier
      ? encryptePayload(appletDetails.encryption, firstTextItemAnserWithIdentifier, privateKey)
      : null

    // Step 3 - Send answers to backend
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
        startTime: getUnixTime(new Date(groupInProgress.startAt!)),
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
    activityEvents,
    appletDetails.encryption,
    appletDetails.id,
    appletDetails.version,
    encryptePayload,
    eventId,
    eventsRawData,
    generateUserPrivateKey,
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
