import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

export const PublicJoinPage = () => {
  const { joinLinkKey } = useParams()

  return (
    <Container className={classNames("mt-3", "pt-3")}>
      <div>{`Public join - ${joinLinkKey}`}</div>
    </Container>
  )
}
