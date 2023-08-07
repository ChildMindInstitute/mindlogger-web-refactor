import { useCallback, useState } from "react"

import { v4 as uuidV4 } from "uuid"

import Modal from "../../Modal"
import {
  generateUserPublicKey,
  getFirstResponseDataIdentifierTextItem,
  getScheduledTimeFromEvents,
  mapAlerts,
  mapToAnswers,
} from "../model"
import { prepareItemAnswers } from "../model/prepareItemAnswers"
import { validateAnswerBeforeSubmit } from "../model/validateItemsBeforeSubmit"

import {
  ActivityItemStepper,
  ActivityOnePageAssessment,
  activityModel,
  useEncryptPayload,
  usePublicSaveAnswerMutation,
  useSaveAnswerMutation,
} from "~/entities/activity"
import { ActivityDTO, AnswerPayload, AppletEncryptionDTO, AppletEventsResponse } from "~/shared/api"
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

  appletId: string
  appletEncryption: AppletEncryptionDTO | null
  appletVersion: string
  appletWatermark: string

  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse | null
  eventId: string
}

export const ActivityItemList = (props: ActivityItemListProps) => {
  const { activityDetails, eventId, isPublic, eventsRawData } = props

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
      appletId: props.appletId,
      eventId,
      activityId: activityDetails.id,
      progressPayload: {
        endAt: Date.now(),
      },
    })

    // Step 5 - Redirect to "Thanks screen"

    return navigator.navigate(ROUTES.thanks.navigateTo(isPublic ? props.publicAppletKey! : props.appletId, isPublic))
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

    const preparedAlerts = mapAlerts(activityEvents)

    // Step 2 - Encrypt answers
    let privateKey: number[] | null = null

    if (isPublic) {
      privateKey = generateUserPrivateKey({ userId: uuidV4(), email: uuidV4(), password: uuidV4() })
    } else {
      privateKey = secureUserPrivateKeyStorage.getUserPrivateKey()
    }

    const userPublicKey = generateUserPublicKey(props.appletEncryption, privateKey)

    const encryptedAnswers = encryptePayload(props.appletEncryption, preparedItemAnswers.answer, privateKey)
    const encryptedUserEvents = encryptePayload(props.appletEncryption, userEvents, privateKey)

    const groupInProgress = getGroupInProgressByIds({
      appletId: props.appletId,
      activityId: activityDetails.id,
      eventId,
    })

    if (!groupInProgress) {
      throw new Error("[Activity item list] Group in progress not found")
    }

    const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(activityEvents)
    const encryptedIdentifier = firstTextItemAnserWithIdentifier
      ? encryptePayload(props.appletEncryption, firstTextItemAnserWithIdentifier, privateKey)
      : null

    // Step 3 - Send answers to backend
    const answer: AnswerPayload = {
      appletId: props.appletId,
      version: props.appletVersion,
      flowId: null,
      activityId: activityDetails.id,
      submitId: uuidV4(),
      answer: {
        answer: encryptedAnswers,
        itemIds: preparedItemAnswers.itemIds,
        events: encryptedUserEvents,
        userPublicKey,
        startTime: new Date(groupInProgress.startAt!).getTime(),
        endTime: new Date().getTime(),
        identifier: encryptedIdentifier,
      },
      alerts: preparedAlerts,
      client: {
        appId: "mindlogger-web",
        appVersion: import.meta.env.VITE_BUILD_VERSION,
        width: window.innerWidth,
        height: window.innerHeight,
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
    encryptePayload,
    eventId,
    eventsRawData,
    generateUserPrivateKey,
    getGroupInProgressByIds,
    isPublic,
    props.appletEncryption,
    props.appletId,
    props.appletVersion,
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
          watermark={props.appletWatermark}
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
          watermark={props.appletWatermark}
        />
      )}

      <Modal
        show={isSubmitModalOpen}
        onHide={closeSubmitModal}
        title={t("additional.response_submit")}
        label={t("additional.response_submit_text")}
        footerPrimaryButton={t("additional.yes")}
        primaryButtonDisabled={submitLoading}
        onPrimaryButtonClick={onPrimaryButtonClick}
        footerSecondaryButton={t("additional.no")}
        secondaryButtonDisabled={submitLoading}
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
