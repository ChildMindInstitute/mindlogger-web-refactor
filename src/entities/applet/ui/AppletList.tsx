import { useMemo } from "react"

import classNames from "classnames"
import { Container, Row, Spinner } from "react-bootstrap"

import { useAppletListQuery } from "../api"
import { AppletSchema } from "../lib/applet.schema"
import AppletCard from "./AppletCard"

const AppletList = () => {
  const { data, isLoading } = useAppletListQuery()

  const appletList = useMemo(() => {
    return data?.data?.result.map(applet => AppletSchema.parse(applet))
  }, [data])

  return (
    <Row className={classNames("applet-list", "justify-content-center", { "h-100": isLoading })}>
      {isLoading && (
        <Container className={classNames("d-flex", "h-100", "w-100", "justify-content-center", "align-items-center")}>
          <Spinner as="div" animation="border" role="status" aria-hidden="true" />
        </Container>
      )}
      {!isLoading && appletList?.map(applet => <AppletCard key={applet.id} applet={applet} />)}
    </Row>
  )
}

export default AppletList
