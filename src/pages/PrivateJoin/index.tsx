import Box from "@mui/material/Box"
import { useLocation, useParams } from "react-router-dom"

import { FetchPrivateInvitation } from "~/widgets/FetchInvitation"

export const PrivateJoinPage = () => {
  const { joinLinkKey } = useParams()
  const location = useLocation()

  const redirectState = {
    isInvitationFlow: true,
    backRedirectPath: `${location.pathname}${location.search}`,
  }

  return (
    <Box display="flex" flex={1} margin="24px">
      {joinLinkKey && <FetchPrivateInvitation keyParams={joinLinkKey} redirectState={redirectState} />}
    </Box>
  )
}
