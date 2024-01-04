import { useContext, useEffect } from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

import { ActivityDetailsContext } from "../lib"
import { useAssessmentActions } from "../model/hooks/useAssessmentActions"
import { useStepperStateManager } from "../model/hooks/useStepperStateManager"
import { AssessmentLayoutFooter } from "./AssessmentLayoutFooter"
import { AssessmentLayoutHeader } from "./AssessmentLayoutHeader"

import { ActivityCardItem, ItemCardButton, useTextVariablesReplacer } from "~/entities/activity"
import { appletModel } from "~/entities/applet"
import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse, RespondentMetaDTO } from "~/shared/api"
import { Theme } from "~/shared/constants"
import { NotificationCenter } from "~/shared/ui"
import { eventEmitter, useAppSelector, usePrevious } from "~/shared/utils"

type Props = {
  activityDetails: ActivityDTO
  eventsRawData: AppletEventsResponse
  appletDetails: AppletDetailsDTO
  respondentMeta?: RespondentMetaDTO
}

export const AssessmentPassingScreen = (props: Props) => {
  const context = useContext(ActivityDetailsContext)

  const publicAppletKey = context.isPublic ? context.publicAppletKey : null

  const completedEntities = useAppSelector(appletModel.selectors.completedEntitiesSelector)

  const { toNextStep, toPrevStep, currentItem, items, hasNextStep, hasPrevStep, step } = useStepperStateManager({
    activityId: props.activityDetails.id,
    eventId: context.eventId,
  })

  const prevStep = usePrevious(step)

  const { onNext, onBack, onSubmitLoading } = useAssessmentActions({ ...props, toNextStep, toPrevStep, hasNextStep })

  const { replaceTextVariables } = useTextVariablesReplacer({
    items,
    answers: items.map(item => item.answer),
    respondentMeta: props.respondentMeta,
    completedEntityTime: completedEntities[props.activityDetails.id],
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
                allowToSkipAllItems={props.activityDetails.isSkippable}
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
          onNextButtonClick={onNext}
          onBackButtonClick={onBack}
        />
      </AssessmentLayoutFooter>
    </Box>
  )
}
