import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useLocation, useSearchParams } from "react-router-dom"

import { Invitation } from "~/entities/invitation"
import { AuthorizationButtons } from "~/features/AuthorizationButtons"
import { AuthorizationGuard } from "~/features/AuthorizationGuard"
import { InvitationAcceptButton } from "~/features/InvitationAccept"
import { InvitationDeclineButton } from "~/features/InvitationDecline"

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
      {keyParams && emailParams ? (
        <AuthorizationGuard fallback={<AuthorizationButtons redirectState={redirectState} />}>
          <Invitation
            keyParams={keyParams}
            actionComponent={
              <div className={classNames("d-flex", "justify-content-center", "align-items-center", "flex-row")}>
                <InvitationAcceptButton invitationKey={keyParams} />
                <InvitationDeclineButton invitationKey={keyParams} />
              </div>
            }
          />
        </AuthorizationGuard>
      ) : (
        <div>Some invitation error</div>
      )}
    </Container>
  )
}

export default InvitationPage
