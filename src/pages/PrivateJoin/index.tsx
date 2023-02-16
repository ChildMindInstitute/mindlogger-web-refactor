import classNames from "classnames"
import { Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

export const PrivateJoinPage = () => {
  const { joinLinkKey } = useParams()

  return (
    <Container className={classNames("mt-3", "pt-3")}>
      <div>{`Private join - ${joinLinkKey}`}</div>
    </Container>
  )
}
