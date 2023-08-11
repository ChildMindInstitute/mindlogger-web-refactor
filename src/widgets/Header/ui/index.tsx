import { useState } from "react"

import { Navbar, Nav } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

import { useNavbarTranslation } from "../lib/useNavbarTranslation"
import AccountDropdown from "./AccountDropdown"
import LoginButton from "./LoginButton"

import { userModel } from "~/entities/user"
import { LanguageDropdown } from "~/features/language"
import { Theme } from "~/shared/constants"
import { ROUTES } from "~/shared/constants"

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
    <Navbar
      expand="md"
      variant="dark"
      className="header"
      expanded={expanded}
      onToggle={onNavbarToggle}
      style={{ backgroundColor: Theme.colors.light.primary }}>
      <Navbar.Brand role="button" onClick={onLogoClick}>
        {t("mindLogger")}
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <LanguageDropdown onSelectExtended={closeExpandedNavbar} />
          {user?.id ? (
            <AccountDropdown title={`${user?.firstName} ${user?.lastName}`} onSelectExtended={closeExpandedNavbar} />
          ) : (
            <LoginButton onClickExtended={closeExpandedNavbar} />
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
