import { Row } from "react-bootstrap"

import { useAppletListQuery } from "../api"
import AppletCard from "./AppletCard"

const AppletList = () => {
  const { data } = useAppletListQuery()

  return (
    <Row className="applet-list justify-content-center">
      {data?.data.results.map(value => (
        <AppletCard key={value.id} applet={value} />
      ))}
    </Row>
  )
}

export default AppletList
