import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useLocation, useSearchParams } from "react-router-dom"

import { AuthorizationGuard } from "~/widgets/AuthorizationGuard"
import { AuthorizationButtons } from "~/widgets/AuthorizationNavigateButtons"
import { FetchInvitation } from "~/widgets/FetchInvitation"

const InvitationPage = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const redirectState = {
    isInvitationFlow: true,
    backRedirectPath: `${location.pathname}${location.search}`,
  }

  const keyParams = searchParams.get("key")
  const emailParams = searchParams.get("email")

  return (
    <Container className={classNames("mt-3", "pt-3")}>
      {keyParams && emailParams && (
        <AuthorizationGuard fallback={<AuthorizationButtons redirectState={redirectState} />}>
          <FetchInvitation keyParams={keyParams} />
        </AuthorizationGuard>
      )}
    </Container>
  )
}

export default InvitationPage
