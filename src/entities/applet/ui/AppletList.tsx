import classNames from "classnames"
import { Container, Row, Spinner } from "react-bootstrap"

import { useAppletListQuery } from "../api"
import AppletCard from "./AppletCard"

const AppletList = () => {
  const { data, isLoading } = useAppletListQuery()

  return (
    <Row className={classNames("applet-list", "justify-content-center", { "h-100": isLoading })}>
      {isLoading && (
        <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
          <Spinner as="div" animation="border" role="status" aria-hidden="true" />
        </Container>
      )}
      {!isLoading && data?.data?.result?.map(applet => <AppletCard key={applet.id} applet={applet} />)}
    </Row>
  )
}

export default AppletList
