import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import LanguageDropdown from "../../../shared/languageDropdown"

import "./header.scss"
import LoginButton from "../../../shared/loginButton"
import { ROUTES } from "../../../app/system/routes/constants"
import { useState } from "react"

const Header = (): JSX.Element | null => {
  const { t } = useTranslation("translation", { keyPrefix: "Navbar" })
  const navigate = useNavigate()

  const [expanded, setExpanded] = useState<boolean>(false)

  const closeExpandedNavbar = () => {
    setExpanded(false)
  }

  const onLogoClickHandler = () => {
    navigate(ROUTES.main.path)
    closeExpandedNavbar()
  }

  const onNavbarToggleHandler = () => {
    setExpanded(prevValue => !prevValue)
  }

  return (
    <Navbar expand="md" variant="dark" className="header" expanded={expanded} onToggle={onNavbarToggleHandler}>
      <Navbar.Brand role="button" onClick={onLogoClickHandler}>
        {t("mindLogger")}
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Row>
            <Col xs={12} md={6} className="container justify-content-center">
              <LanguageDropdown closeExpandedNavbar={closeExpandedNavbar} />
            </Col>
            <Col xs={12} md={6} className="container justify-content-center">
              <LoginButton closeExpandedNavbar={closeExpandedNavbar} />
            </Col>
          </Row>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
