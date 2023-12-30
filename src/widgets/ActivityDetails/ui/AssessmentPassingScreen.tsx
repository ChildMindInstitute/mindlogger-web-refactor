import { useContext, useEffect } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { ActivityDetailsContext } from "../lib"
import { useAssessmentActions } from "../model/hooks/useAssessmentActions"
import { useStepperStateManager } from "../model/hooks/useStepperStateManager"
import { validateIsItemAnswerShouldBeEmpty, validateIsNumericOnly, validateItem } from "../model/validateItem"
import { AssessmentLayoutFooter } from "./AssessmentLayoutFooter"
import { AssessmentLayoutHeader } from "./AssessmentLayoutHeader"

import { ActivityCardItem, ItemCardButton, activityModel, useTextVariablesReplacer } from "~/entities/activity"
import { useSaveActivityItemAnswer, useSetAnswerUserEvent } from "~/entities/activity/model/hooks"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, RespondentMetaDTO } from "~/shared/api"
import { Theme } from "~/shared/constants"
import { NotificationCenter, useNotification } from "~/shared/ui"
import { eventEmitter, useCustomTranslation, usePrevious } from "~/shared/utils"

type Props = {
  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO
  respondentMeta?: RespondentMetaDTO
}

export const AssessmentPassingScreen = (props: Props) => {
  const { t } = useCustomTranslation()

  const context = useContext(ActivityDetailsContext)
  const publicAppletKey = context.isPublic ? context.publicAppletKey : null

  const { showWarningNotification } = useNotification()

  const { toNextStep, toPrevStep, currentItem, items, hasNextStep, hasPrevStep, step } = useStepperStateManager({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { saveActivityItemAnswer } = useSaveActivityItemAnswer({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { saveSetAnswerUserEvent } = useSetAnswerUserEvent({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const prevStep = usePrevious(step)

  const isAllItemsSkippable = props.activityDetails.isSkippable

  const { saveUserEventByType } = activityModel.hooks.useUserEvent({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const { onSubmit, onSubmitLoading } = useAssessmentActions(props)

  const onNextButtonClick = () => {
    if (!currentItem) {
      throw new Error("[Next button click] CurrentItem is not defined")
    }

    const shouldBeEmpty = validateIsItemAnswerShouldBeEmpty(currentItem)

    const isItemHasAnswer = currentItem.answer.length
    const isItemSkippable = currentItem.config.skippableItem || isAllItemsSkippable

    if (!shouldBeEmpty && !isItemHasAnswer && !isItemSkippable) {
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
      return onSubmit()
    }

    if (!isItemHasAnswer && isItemSkippable) {
      saveUserEventByType("SKIP", currentItem)
    } else {
      saveUserEventByType("NEXT", currentItem)
    }

    return toNextStep()
  }

  function onBackButtonClick() {
    if (!currentItem) {
      throw new Error("[Back button click] CurrentItem is not defined")
    }

    const hasConditionlLogic = currentItem.conditionalLogic

    if (hasConditionlLogic) {
      // If the current item participate in any conditional logic
      // we need to reset the answer to the initial state

      saveActivityItemAnswer(currentItem.id, [])
      saveSetAnswerUserEvent({
        ...currentItem,
        answer: [],
      })
    }

    saveUserEventByType("PREV", currentItem)

    return toPrevStep()
  }

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map(item => item.answer),
    activityId: props.activityDetails.id,
    respondentMeta: props.respondentMeta,
  })

  useEffect(() => {
    const test = () => {
      console.log("onSingleSelectAnswered triggered")
    }

    eventEmitter.on("onSingleSelectAnswered", test)

    return () => {
      eventEmitter.off("onSingleSelectAnswered", test)
    }
  }, [])

  return (
    <Box
      id="assessment-screen-layout"
      display="flex"
      flex={1}
      flexDirection="column"
      bgcolor={Theme.colors.light.surface}>
      <AssessmentLayoutHeader
        title={props.activityDetails.name}
        appletId={props.appletDetails.id}
        activityId={props.activityDetails.id}
        eventId={context.eventId}
        isPublic={context.isPublic}
        publicKey={publicAppletKey}
      />

      <Box id="assessment-content-container" display="flex" flex={1} flexDirection="column" overflow="scroll">
        <NotificationCenter />
        <Container sx={{ display: "flex", flex: 1, justifyContent: "center" }}>
          <Box maxWidth="900px" display="flex" alignItems="center" flex={1} justifyContent="center">
            {currentItem && (
              <ActivityCardItem
                key={currentItem.id}
                activityId={props.activityDetails.id}
                eventId={context.eventId}
                activityItem={currentItem}
                values={currentItem.answer}
                replaceText={replaceTextVariables}
                watermark={props.appletDetails.watermark}
                allowToSkipAllItems={isAllItemsSkippable}
                step={step}
                prevStep={prevStep}
              />
            )}
          </Box>
        </Container>
      </Box>

      <AssessmentLayoutFooter>
        <ItemCardButton
          isSubmitShown={!hasNextStep}
          isBackShown={hasPrevStep && !currentItem?.config.removeBackButton && props.activityDetails.responseIsEditable}
          isLoading={onSubmitLoading}
          onNextButtonClick={onNextButtonClick}
          onBackButtonClick={onBackButtonClick}
        />
      </AssessmentLayoutFooter>
    </Box>
  )
}
