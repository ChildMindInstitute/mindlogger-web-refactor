import { useState } from "react"

import ButtonBase from "@mui/material/ButtonBase"
import { Navbar, Nav } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

import AccountDropdown from "./AccountDropdown"
import LoginButton from "./LoginButton"

import MLLogo from "~/assets/ml-logo.svg"
import { userModel } from "~/entities/user"
import { LanguageDropdown } from "~/features/language"
import { Theme } from "~/shared/constants"
import { ROUTES } from "~/shared/constants"
import { AvatarBase } from "~/shared/ui"

import "./header.scss"

const Header = (): JSX.Element | null => {
  const navigate = useNavigate()

  const { user } = userModel.hooks.useUserState()

  const [expanded, setExpanded] = useState<boolean>(false)

  const closeExpandedNavbar = () => {
    setExpanded(false)
  }

  const onLogoClick = () => {
    closeExpandedNavbar()

    if (user?.id) {
      return navigate(ROUTES.appletList.path)
    } else {
      return navigate(ROUTES.login.path)
    }
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
      <ButtonBase onClick={onLogoClick} disableRipple sx={{ marginY: "15px" }}>
        <AvatarBase src={MLLogo} name="" width="143px" height="24px" variant="square" />
      </ButtonBase>

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
