import Box from "@mui/material/Box"
import { useParams } from "react-router-dom"

import { useCustomTranslation } from "~/shared/utils"
import { ActivityWelcomeScreen } from "~/widgets/ActivityDetails"

export const ActivityDetailsPage = () => {
  const { appletId, activityId, eventId } = useParams()
  const { t } = useCustomTranslation()

  if (!appletId || !activityId || !eventId) {
    return <div>{t("wrondLinkParametrError")}</div>
  }

  return (
    <Box width="100%" height="100vh">
      <ActivityWelcomeScreen isPublic={false} appletId={appletId} activityId={activityId} eventId={eventId} />
    </Box>
  )
}
