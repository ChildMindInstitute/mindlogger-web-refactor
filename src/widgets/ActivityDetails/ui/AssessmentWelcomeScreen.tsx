import Box from "@mui/material/Box"

import Layout from "../../AppLayout"
import { ActivityMetaData } from "./ActivityMetaData"
import { AssessmentLayoutFooter } from "./AssessmentLayoutFooter"
import { AssessmentLayoutHeader } from "./AssessmentLayoutHeader"

import { activityModel } from "~/entities/activity"
import { StartAssessmentButton } from "~/features/StartAssessment"
import { ActivityDTO } from "~/shared/api"
import { Theme } from "~/shared/constants"
import { AvatarBase, Text } from "~/shared/ui"
import { useCustomMediaQuery, useFlowType } from "~/shared/utils"

type Props = {
  activityDetails: ActivityDTO

  appletId: string
  eventId: string
  isPublic: boolean
  publicKey: string | null
}

export const AssessmentWelcomeScreen = (props: Props) => {
  const { greaterThanSM } = useCustomMediaQuery()

  const flowParams = useFlowType()

  const { saveActivityEventRecords } = activityModel.hooks.useSaveActivityEventProgress()
  const { getGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()

  const startAssessment = () => {
    const initialStep = 1
    return saveActivityEventRecords(props.activityDetails, props.eventId, initialStep)
  }

  const groupInProgress = getGroupInProgressByIds({
    appletId: props.appletId,
    eventId: props.eventId,
    activityId: flowParams.isFlow ? flowParams.flowId : props.activityDetails.id,
  })

  return (
    <Layout
      bgColor={Theme.colors.light.surface}
      header={
        <AssessmentLayoutHeader
          title={props.activityDetails.name}
          appletId={props.appletId}
          activityId={props.activityDetails.id}
          eventId={props.eventId}
          isPublic={props.isPublic}
          publicKey={props.publicKey}
        />
      }
      footer={
        <AssessmentLayoutFooter>
          <StartAssessmentButton width={greaterThanSM ? "375px" : "335px"} onClick={startAssessment} />
        </AssessmentLayoutFooter>
      }>
      <Box height="100%" width="100%" display="flex" justifyContent="center" paddingTop="80px">
        <Box
          id="welcome-screen-activity-details"
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxWidth="570px">
          <AvatarBase
            src={props.activityDetails.image}
            name={props.activityDetails?.name}
            width="124px"
            height="124px"
          />

          <Text fontSize="18px" fontWeight="400" color={Theme.colors.light.secondary} sx={{ marginTop: "24px" }}>
            <ActivityMetaData activityLength={props.activityDetails.items.length} groupInProgress={groupInProgress} />
          </Text>
          <Text fontSize="18px" fontWeight="700" color={Theme.colors.light.onSurface} margin="16px 0px">
            {props.activityDetails.name}
          </Text>

          <Text fontSize="18px" fontWeight="400" color={Theme.colors.light.onSurface} sx={{ textAlign: "center" }}>
            {props.activityDetails.description}
          </Text>
        </Box>
      </Box>
    </Layout>
  )
}
