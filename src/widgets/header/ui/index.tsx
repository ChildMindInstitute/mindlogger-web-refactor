import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Navbar, Nav, Col, Row } from "react-bootstrap"

import "./header.scss"

import { ROUTES } from "../../../app/system/routes/constants"
import { useCustomTranslation } from "../../../utils/hooks/useCustomTranslation"

import LanguageDropdown from "../../../features/language"
import LoginButton from "./LoginButton"

const Header = (): JSX.Element | null => {
  const { t } = useCustomTranslation({ keyPrefix: "Navbar" })
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
              <LanguageDropdown onSelectExtended={closeExpandedNavbar} />
            </Col>
            <Col xs={12} md={6} className="container justify-content-center">
              <LoginButton onClickExtended={closeExpandedNavbar} />
            </Col>
          </Row>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
