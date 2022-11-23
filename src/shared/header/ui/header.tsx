import { useTranslation } from "react-i18next"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import LanguageDropdown from "../../languageDropdown"

import "./header.scss"
import LoginButton from "../../loginButton"

const Header = (): JSX.Element | null => {
  const { t } = useTranslation("translation", { keyPrefix: "Navbar" })

  return (
    <Navbar expand="md" variant="dark" className="header">
      <Navbar.Brand role="button">{t("mindLogger")}</Navbar.Brand>

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Row>
            <Col xs={12} md={6} className="App container justify-content-center">
              <LanguageDropdown />
            </Col>
            <Col xs={12} md={6} className="App container justify-content-center">
              <LoginButton />
            </Col>
          </Row>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
