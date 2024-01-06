import { useState } from "react"

import MenuIcon from "@mui/icons-material/Menu"
import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import IconButton from "@mui/material/IconButton"

import AccountDropdown from "./AccountDropdown"
import LoginButton from "./LoginButton"

import MLLogo from "~/assets/ml-logo.svg"
import { userModel } from "~/entities/user"
import { LanguageDropdown } from "~/features/language"
import { Theme } from "~/shared/constants"
import { ROUTES } from "~/shared/constants"
import { AvatarBase } from "~/shared/ui"
import { useCustomMediaQuery, useCustomNavigation } from "~/shared/utils"

const Header = (): JSX.Element | null => {
  const navigator = useCustomNavigation()
  const { lessThanSM } = useCustomMediaQuery()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { isAuthorized, user } = userModel.hooks.useAuthorization()

  const toggleMenuOpen = () => {
    return setIsMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    return setIsMenuOpen(false)
  }

  const onLogoClick = () => {
    closeMenu()

    if (isAuthorized) {
      return navigator.navigate(ROUTES.appletList.path)
    } else {
      return navigator.navigate(ROUTES.login.path)
    }
  }

  return (
    <Box sx={{ backgroundColor: Theme.colors.light.primary, padding: "8px 16px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <ButtonBase onClick={onLogoClick} disableRipple sx={{ marginY: "15px" }}>
          <AvatarBase src={MLLogo} name="" width="143px" height="24px" variant="square" />
        </ButtonBase>

        {lessThanSM && (
          <IconButton onClick={toggleMenuOpen}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        )}

        {!lessThanSM && (
          <Box display="flex">
            <LanguageDropdown toggleMenuOpen={closeMenu} />

            {isAuthorized ? (
              <AccountDropdown title={`${user.firstName} ${user.lastName}`} toggleMenuOpen={closeMenu} />
            ) : (
              <LoginButton toggleMenuOpen={closeMenu} />
            )}
          </Box>
        )}
      </Box>

      {lessThanSM && isMenuOpen && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <LanguageDropdown toggleMenuOpen={closeMenu} />

          {isAuthorized ? (
            <AccountDropdown title={`${user.firstName} ${user.lastName}`} toggleMenuOpen={closeMenu} />
          ) : (
            <LoginButton toggleMenuOpen={closeMenu} />
          )}
        </Box>
      )}
    </Box>
  )
}

export default Header
