import classNames from "classnames"
import { Container } from "react-bootstrap"
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
    <Container className={classNames("mt-3", "pt-3")}>
      {joinLinkKey && <FetchPrivateInvitation keyParams={joinLinkKey} redirectState={redirectState} />}
    </Container>
  )
}
