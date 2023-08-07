import Box from "@mui/material/Box"

import { ActivityAssessmentLayout } from "./ActivityAssessmentLayout"
import { ActivityItemList } from "./ActivityItemList"

import { ActivityDTO, AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"

type Props = {
  eventsRawData: AppletEventsResponse
  activityDetails: ActivityDTO
  appletDetails: AppletDetailsDTO
  eventId: string

  isPublic: boolean
  publicAppletKey?: string
}

export const AssessmentScreen = (props: Props) => {
  return (
    <ActivityAssessmentLayout
      title={props.activityDetails.name}
      activityId={props.activityDetails.id}
      eventId={props.eventId}
      buttons={
        <Box width="100%" display="flex" justifyContent="center">
          <div>test</div>
        </Box>
      }>
      <Box height="100%" width="100%" display="flex" justifyContent="center" paddingTop="80px">
        <ActivityItemList
          appletId={props.appletDetails.id}
          appletEncryption={props.appletDetails.encryption}
          appletVersion={props.appletDetails.version}
          appletWatermark={props.appletDetails.watermark}
          eventId={props.eventId}
          eventsRawData={props.eventsRawData}
          activityDetails={props.activityDetails}
          isPublic={props.isPublic}
          publicAppletKey={props.publicAppletKey}
        />
      </Box>
    </ActivityAssessmentLayout>
  )
}
