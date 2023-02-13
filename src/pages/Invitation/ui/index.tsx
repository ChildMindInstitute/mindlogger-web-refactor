import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useSearchParams } from "react-router-dom"

import { InvitationGuard } from "~/widgets/Invitation"

const InvitationPage = () => {
  const [searchParams] = useSearchParams()

  const keyParams = searchParams.get("key")
  const emailParams = searchParams.get("email")

  return (
    <Container className={classNames("mt-3", "pt-3")}>
      {keyParams && emailParams ? (
        <InvitationGuard keyParams={keyParams} emailParams={emailParams} />
      ) : (
        <div>Some invitation error</div>
      )}
    </Container>
  )
}

export default InvitationPage
