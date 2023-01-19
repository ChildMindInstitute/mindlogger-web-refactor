import { Row } from "react-bootstrap"

import AppletCard from "./AppletCard"

const AppletList = () => {
  const testArr = [1, 2, 3]

  return (
    <Row className="applet-list justify-content-center">
      {testArr.map(value => (
        <AppletCard key={value} />
      ))}
    </Row>
  )
}

export default AppletList
