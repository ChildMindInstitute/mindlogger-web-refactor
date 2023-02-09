import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useSearchParams } from "react-router-dom"

import { InvitationWidget } from "~/widgets/Invitation"

const InvitationPage = () => {
  const [searchParams] = useSearchParams()

  const keyParams = searchParams.get("key")

  if (!keyParams) {
    return <div>Key not exist error TODO: add correct error text</div>
  }

  return (
    <Container className={classNames("mt-3", "pt-3")}>
      <InvitationWidget keyParams={keyParams} />
    </Container>
  )
}

export default InvitationPage
