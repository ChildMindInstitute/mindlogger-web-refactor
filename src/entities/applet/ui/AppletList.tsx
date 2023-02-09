import classNames from "classnames"
import { Container, Row, Spinner } from "react-bootstrap"

import { useAppletListQuery } from "../api"
import { Applet } from "../lib/applet.schema"
import AppletCard from "./AppletCard"

const AppletList = () => {
  const { data, isLoading } = useAppletListQuery()

  const applets = data?.data?.result as Applet[]

  return (
    <Row className={classNames("applet-list", "justify-content-center", { "h-100": isLoading })}>
      {isLoading && (
        <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
          <Spinner as="div" animation="border" role="status" aria-hidden="true" />
        </Container>
      )}
      {!isLoading && applets.map(value => <AppletCard key={value.id} applet={value} />)}
    </Row>
  )
}

export default AppletList
