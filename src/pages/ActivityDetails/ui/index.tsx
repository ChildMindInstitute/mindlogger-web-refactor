import Box from "@mui/material/Box"
import { useParams } from "react-router-dom"

import { useCustomTranslation } from "~/shared/utils"
import { ActivityDetailsWidget } from "~/widgets/ActivityDetails"

export const ActivityDetailsPage = () => {
  const { appletId, entityId, eventId } = useParams()
  const { t } = useCustomTranslation()

  if (!appletId || !entityId || !eventId) {
    return <div>{t("wrondLinkParametrError")}</div>
  }

  return (
    <Box height="100vh" display="flex" flex={1}>
      <ActivityDetailsWidget isPublic={false} appletId={appletId} activityId={entityId} eventId={eventId} />
    </Box>
  )
}
