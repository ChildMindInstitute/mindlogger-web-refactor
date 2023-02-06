import { useState } from "react"

import { Navbar, Nav, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

import { useNavbarTranslation } from "../lib/useNavbarTranslation"
import AccountDropdown from "./AccountDropdown"
import LoginButton from "./LoginButton"

import { userModel } from "~/entities/user"
import { LanguageDropdown } from "~/features/language"
import { ROUTES } from "~/shared/utils"

import "./header.scss"

const Header = (): JSX.Element | null => {
  const { t } = useNavbarTranslation()
  const navigate = useNavigate()

  const { user } = userModel.hooks.useUserState()

  const [expanded, setExpanded] = useState<boolean>(false)

  const closeExpandedNavbar = () => {
    setExpanded(false)
  }

  const onLogoClick = () => {
    if (user?.id) {
      navigate(ROUTES.applets.path)
    } else {
      navigate(ROUTES.login.path)
    }

    closeExpandedNavbar()
  }

  const onNavbarToggle = () => {
    setExpanded(prevValue => !prevValue)
  }

  return (
    <Navbar expand="md" variant="dark" className="header" expanded={expanded} onToggle={onNavbarToggle}>
      <Navbar.Brand role="button" onClick={onLogoClick}>
        {t("mindLogger")}
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Col xs={12} md={6} className="container justify-content-center">
            <LanguageDropdown onSelectExtended={closeExpandedNavbar} />
          </Col>
          <Col xs={12} md={6} className="container justify-content-center">
            {user?.id ? (
              <AccountDropdown title={user?.fullName as string} onSelectExtended={closeExpandedNavbar} />
            ) : (
              <LoginButton onClickExtended={closeExpandedNavbar} />
            )}
          </Col>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
