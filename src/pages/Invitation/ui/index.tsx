import Box from "@mui/material/Box"
import { useLocation, useParams } from "react-router-dom"

import { AuthorizationGuard } from "~/widgets/AuthorizationGuard"
import { AuthorizationButtons } from "~/widgets/AuthorizationNavigateButtons"
import { FetchInvitation } from "~/widgets/FetchInvitation"

const InvitationPage = () => {
  const { inviteId } = useParams()
  const location = useLocation()

  const redirectState = {
    isInvitationFlow: true,
    backRedirectPath: `${location.pathname}${location.search}`,
  }

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" margin="24px">
      {inviteId && (
        <AuthorizationGuard fallback={<AuthorizationButtons redirectState={redirectState} />}>
          <FetchInvitation keyParams={inviteId} />
        </AuthorizationGuard>
      )}
    </Box>
  )
}

export default InvitationPage
