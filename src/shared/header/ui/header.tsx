import Navbar from "react-bootstrap/Navbar"

import "./header.scss"

const Header = (): JSX.Element | null => {
  return (
    <Navbar expand="md" variant="dark" className="header">
      <Navbar.Brand role="button">Salam Aleikum</Navbar.Brand>
    </Navbar>
  )
}

export default Header
