import Box from "@mui/material/Box"
import { useLocation, useParams } from "react-router-dom"

import { PageContainer } from "~/shared/ui"
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
    <PageContainer id="invitation-page" dataTestId="invitation-page">
      <Box margin="24px 0px">
        {inviteId && (
          <AuthorizationGuard fallback={<AuthorizationButtons redirectState={redirectState} />}>
            <FetchInvitation keyParams={inviteId} />
          </AuthorizationGuard>
        )}
      </Box>
    </PageContainer>
  )
}

export default InvitationPage
