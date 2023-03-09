import classNames from "classnames"
import { Container } from "react-bootstrap"
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
    <Container className={classNames("mt-3", "pt-3")}>
      {inviteId && (
        <AuthorizationGuard fallback={<AuthorizationButtons redirectState={redirectState} />}>
          <FetchInvitation keyParams={inviteId} />
        </AuthorizationGuard>
      )}
    </Container>
  )
}

export default InvitationPage
