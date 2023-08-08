import { useCallback } from "react"

import Box from "@mui/material/Box"
import { v4 as uuidV4 } from "uuid"

import Modal from "../../Modal"
import {
  generateUserPublicKey,
  getFirstResponseDataIdentifierTextItem,
  getScheduledTimeFromEvents,
  mapAlerts,
  mapToAnswers,
} from "../model"
import { useStepperStateManager } from "../model/hooks/useStepperStateManager"
import { prepareItemAnswers } from "../model/prepareItemAnswers"
import { ActivityAssessmentLayout } from "./ActivityAssessmentLayout"

import {
  ActivityCardItem,
  ItemCardButton,
  ItemCardButtonsConfig,
  activityModel,
  useEncryptPayload,
  usePublicSaveAnswerMutation,
  useSaveAnswerMutation,
  useTextVariablesReplacer,
} from "~/entities/activity"
import { ActivityDTO, AnswerPayload, AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import {
  ROUTES,
  secureUserPrivateKeyStorage,
  useCustomNavigation,
  useCustomTranslation,
  useEncryption,
  useModal,
} from "~/shared/utils"

type Props = {
  eventId: string

  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO

  isPublic: boolean
  publicAppletKey?: string
}

export const AssessmentScreen = (props: Props) => {
  const { t } = useCustomTranslation()
  const navigator = useCustomNavigation()

  const { generateUserPrivateKey } = useEncryption()
  const { encryptePayload } = useEncryptPayload()

  const [isRequiredModalOpen, openRequiredModal, closeRequiredModal] = useModal()
  const [isInvalidAnswerModalOpen, openInvalidAnswerModal, closeInvalidAnswerModal] = useModal()

  const { clearActivityItemsProgressById } = activityModel.hooks.useActivityClearState()
  const { updateGroupInProgressByIds, getGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()
  const { toNextStep, toPrevStep, currentItem, items, userEvents, hasNextStep, hasPrevStep } = useStepperStateManager({
    activityId: props.activityDetails.id,
    eventId: props.eventId,
  })

  const isMessageItem = currentItem?.responseType === "message"
  const isAudioPlayerItem = currentItem?.responseType === "audioPlayer"

  const isItemWithoutAnswer = isMessageItem || isAudioPlayerItem

  const isAllItemsSkippable = props.activityDetails.isSkippable

  const buttonConfig: ItemCardButtonsConfig = {
    isNextDisabled: isItemWithoutAnswer ? false : !currentItem?.answer || !currentItem.answer.length,
    isSkippable: currentItem?.config.skippableItem || isAllItemsSkippable,
    isBackShown: hasPrevStep && !currentItem?.config.removeBackButton,
  }

  const { saveUserEventByType } = activityModel.hooks.useUserEvent({
    activityId: props.activityDetails.id,
    eventId: props.eventId,
  })
  const { saveSetAnswerUserEvent } = activityModel.hooks.useSetAnswerUserEvent({
    activityId: props.activityDetails.id,
    eventId: props.eventId,
  })
  const { saveActivityItemAnswer } = activityModel.hooks.useSaveActivityItemAnswer({
    activityId: props.activityDetails.id,
    eventId: props.eventId,
  })

  const onSaveAnswerSuccess = () => {
    // Step 4 - Clear progress state related to activity
    clearActivityItemsProgressById(props.activityDetails.id, props.eventId)
    updateGroupInProgressByIds({
      appletId: props.appletDetails.id,
      eventId: props.eventId,
      activityId: props.activityDetails.id,
      progressPayload: {
        endAt: Date.now(),
      },
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

  const validateCorrectAnswer = () => {
    if (currentItem?.responseType === "text" && currentItem?.config.correctAnswerRequired) {
      const isAnswerCorrect = currentItem?.answer[0] === currentItem?.config.correctAnswer

      return isAnswerCorrect
    }

    return true
  }

  const onNextButtonClick = () => {
    if (!toNextStep) {
      return
    }

    const isAnswerCorrect = validateCorrectAnswer()

    if (!isAnswerCorrect && !isAllItemsSkippable && !currentItem?.config.skippableItem) {
      return openInvalidAnswerModal()
    }

    if (!currentItem?.answer.length && (isAllItemsSkippable || currentItem?.config.skippableItem)) {
      saveUserEventByType("SKIP", currentItem!)
    } else {
      saveUserEventByType("NEXT", currentItem!)
    }

    return toNextStep()
  }

  const onBackButtonClick = () => {
    if (!toPrevStep) {
      return
    }

    saveUserEventByType("PREV", currentItem!)
    return toPrevStep()
  }

  const submitAnswers = useCallback(() => {
    // const isAnswerCorrect = validateCorrectAnswer()

    // if (!isAnswerCorrect && !isAllItemsSkippable && !currentItem?.config.skippableItem) {
    //   return openInvalidAnswerModal()
    // }

    saveUserEventByType("DONE", currentItem!)

    // Step 1 - Collect answers from store and transform to answer payload
    const itemAnswers = mapToAnswers(items)
    const preparedItemAnswers = prepareItemAnswers(itemAnswers)

    const preparedAlerts = mapAlerts(items)

    // Step 2 - Encrypt answers
    let privateKey: number[] | null = null

    if (props.isPublic) {
      privateKey = generateUserPrivateKey({ userId: uuidV4(), email: uuidV4(), password: uuidV4() })
    } else {
      privateKey = secureUserPrivateKeyStorage.getUserPrivateKey()
    }

    const userPublicKey = generateUserPublicKey(props.appletDetails.encryption, privateKey)

    const encryptedAnswers = encryptePayload(props.appletDetails.encryption, preparedItemAnswers.answer, privateKey)
    const encryptedUserEvents = encryptePayload(props.appletDetails.encryption, userEvents, privateKey)

    const groupInProgress = getGroupInProgressByIds({
      appletId: props.appletDetails.id,
      activityId: props.activityDetails.id,
      eventId: props.eventId,
    })

    if (!groupInProgress) {
      throw new Error("[Activity item list] Group in progress not found")
    }

    const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(items)
    const encryptedIdentifier = firstTextItemAnserWithIdentifier
      ? encryptePayload(props.appletDetails.encryption, firstTextItemAnserWithIdentifier, privateKey)
      : null

    // Step 3 - Send answers to backend
    const answer: AnswerPayload = {
      appletId: props.appletDetails.id,
      version: props.appletDetails.version,
      flowId: null,
      activityId: props.activityDetails.id,
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

    const scheduledTime = getScheduledTimeFromEvents(props.eventsRawData, props.activityDetails.id)
    if (scheduledTime) {
      answer.answer.scheduledTime = scheduledTime
    }

    return props.isPublic ? publicSaveAnswer(answer) : saveAnswer(answer) // Next steps in onSuccess mutation handler
  }, [
    currentItem,
    encryptePayload,
    generateUserPrivateKey,
    getGroupInProgressByIds,
    items,
    props.activityDetails.id,
    props.appletDetails.encryption,
    props.appletDetails.id,
    props.appletDetails.version,
    props.eventId,
    props.eventsRawData,
    props.isPublic,
    publicSaveAnswer,
    saveAnswer,
    saveUserEventByType,
    userEvents,
  ])

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map(item => item.answer),
  })

  return (
    <>
      <ActivityAssessmentLayout
        title={props.activityDetails.name}
        activityId={props.activityDetails.id}
        eventId={props.eventId}
        buttons={
          <Box width="100%">
            <ItemCardButton
              config={buttonConfig}
              isSubmitShown={!hasNextStep}
              onNextButtonClick={onNextButtonClick}
              onBackButtonClick={onBackButtonClick}
              onSubmitButtonClick={submitAnswers}
            />
          </Box>
        }>
        <Box height="100%" width="100%" display="flex" justifyContent="center" paddingTop="80px">
          <ActivityCardItem
            key={currentItem!.id}
            activityItem={currentItem!}
            values={currentItem!.answer}
            setValue={saveActivityItemAnswer}
            saveSetAnswerUserEvent={saveSetAnswerUserEvent}
            replaceText={replaceTextVariables}
            watermark={props.appletDetails.watermark}
          />
        </Box>
      </ActivityAssessmentLayout>

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
