import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { useAnswer } from "../model/hooks/useAnswers"
import { useEntityComplete } from "../model/hooks/useEntityComplete"
import { useStepperStateManager } from "../model/hooks/useStepperStateManager"
import { validateItem } from "../model/validateItem"
import { AssessmentLayoutFooter } from "./AssessmentLayoutFooter"
import { AssessmentLayoutHeader } from "./AssessmentLayoutHeader"

import {
  ActivityCardItem,
  ItemCardButton,
  activityModel,
  usePublicSaveAnswerMutation,
  useSaveAnswerMutation,
  useTextVariablesReplacer,
} from "~/entities/activity"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, RespondentMetaDTO } from "~/shared/api"
import { Theme } from "~/shared/constants"
import { useNotification } from "~/shared/ui"
import { stringContainsOnlyNumbers, useCustomTranslation, useFlowType } from "~/shared/utils"
import Layout from "~/widgets/AppLayout"

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
  const { showWarningNotification } = useNotification()

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

  const submitAnswers = () => {
    if (currentItem) {
      saveUserEventByType("DONE", currentItem)
    }

    const answer = processAnswers({
      items,
      userEvents,
      isPublic: props.isPublic,
    })

    return props.isPublic ? publicSaveAnswer(answer) : saveAnswer(answer)
  }

  const validateIsItemWithoutAnswer = (currentItem: activityModel.types.ActivityEventProgressRecord) => {
    const isMessageItem = currentItem.responseType === "message"
    const isAudioPlayerItem = currentItem.responseType === "audioPlayer"

    const isItemWithoutAnswer = isMessageItem || isAudioPlayerItem

    return isItemWithoutAnswer
  }

  const validateIsNumericOnly = (currentItem: activityModel.types.ActivityEventProgressRecord) => {
    const isTextItem = currentItem.responseType === "text"

    if (!isTextItem) {
      return false
    }

    const isNumericOnly = currentItem.config.numericalResponseRequired

    if (isNumericOnly) {
      return !stringContainsOnlyNumbers(currentItem.answer[0])
    }

    return false
  }

  const onNextButtonClick = () => {
    if (!currentItem) {
      return
    }

    const isItemWithoutAnswer = validateIsItemWithoutAnswer(currentItem)

    const isItemHasAnswer = currentItem.answer.length
    const isItemSkippable = currentItem.config.skippableItem || isAllItemsSkippable

    if (!isItemWithoutAnswer && !isItemHasAnswer && !isItemSkippable) {
      return showWarningNotification(t("pleaseAnswerTheQuestion"))
    }

    const isAnswerCorrect = validateItem({ item: currentItem })

    if (!isAnswerCorrect && !isItemSkippable) {
      return showWarningNotification(t("incorrect_answer"))
    }

    const isNumericOnly = validateIsNumericOnly(currentItem)

    if (isNumericOnly) {
      return showWarningNotification(t("onlyNumbersAllowed"))
    }

    if (!hasNextStep) {
      return submitAnswers()
    }

    if (!isItemHasAnswer && isItemSkippable) {
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

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map(item => item.answer),
    activityId: props.activityDetails.id,
    respondentMeta: props.respondentMeta,
  })

  const onKeyDownHandler = (key: string) => {
    if (key === "Enter") {
      return onNextButtonClick()
    }
  }

  return (
    <Layout
      onKeyDownHandler={onKeyDownHandler}
      bgColor={Theme.colors.light.surface}
      header={
        <AssessmentLayoutHeader
          title={props.activityDetails.name}
          appletId={props.appletDetails.id}
          activityId={props.activityDetails.id}
          eventId={props.eventId}
          isPublic={props.isPublic}
          publicKey={props.publicAppletKey ?? null}
        />
      }
      footer={
        <AssessmentLayoutFooter>
          <ItemCardButton
            isSubmitShown={!hasNextStep}
            isBackShown={
              hasPrevStep && !currentItem?.config.removeBackButton && props.activityDetails.responseIsEditable
            }
            isLoading={submitLoading}
            onNextButtonClick={onNextButtonClick}
            onBackButtonClick={onBackButtonClick}
          />
        </AssessmentLayoutFooter>
      }>
      <Container sx={{ display: "flex", flex: 1, justifyContent: "center", overflow: "scroll" }}>
        <Box maxWidth="900px" display="flex" alignItems="center" flex={1} justifyContent="center">
          {currentItem && (
            <ActivityCardItem
              key={currentItem.id}
              activityId={props.activityDetails.id}
              eventId={props.eventId}
              activityItem={currentItem}
              values={currentItem.answer}
              replaceText={replaceTextVariables}
              watermark={props.appletDetails.watermark}
              allowToSkipAllItems={isAllItemsSkippable}
            />
          )}
        </Box>
      </Container>
    </Layout>
  )
}
