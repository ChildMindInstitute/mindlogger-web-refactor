import classNames from "classnames"
import { Container, Row, Spinner } from "react-bootstrap"

import { useAppletListQuery } from "../api"
import { appletBuilder } from "../model"
import AppletCard from "./AppletCard"

const AppletList = () => {
  const { data, isLoading, isError, error } = useAppletListQuery()

  const applets = appletBuilder.convertToAppletList(data?.data?.result)
  const isAppletsEmpty = !applets.length

  if (isError) {
    return (
      <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
        <span>{error.evaluatedMessage}</span>
      </Container>
    )
  }

  return (
    <Row className={classNames("justify-content-center", { "h-100": isLoading || isAppletsEmpty })}>
      {isLoading && (
        <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
          <Spinner as="div" animation="border" role="status" aria-hidden="true" />
        </Container>
      )}
      {!isLoading && isAppletsEmpty && (
        <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
          No applets
        </Container>
      )}
      {!isLoading && !isAppletsEmpty && applets.map(value => <AppletCard key={value.id} applet={value} />)}
    </Row>
  )
}

export default AppletList
