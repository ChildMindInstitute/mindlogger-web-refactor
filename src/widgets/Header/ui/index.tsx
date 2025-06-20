import { useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';

import AccountDropdown from './AccountDropdown';
import LoginButton from './LoginButton';

import curiousLogo from '~/assets/curious_logo--white.png';
import { userModel } from '~/entities/user';
import { LanguageDropdown } from '~/features/language';
import ROUTES from '~/shared/constants/routes';
import { variables } from '~/shared/constants/theme/variables';
import { AvatarBase, Box } from '~/shared/ui';
import { useCustomMediaQuery, useCustomNavigation } from '~/shared/utils';

const Header = (): JSX.Element | null => {
  const navigator = useCustomNavigation();
  const { lessThanSM } = useCustomMediaQuery();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthorized, user } = userModel.hooks.useAuthorization();

  const toggleMenuOpen = () => {
    return setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    return setIsMenuOpen(false);
  };

  const onLogoClick = () => {
    closeMenu();

    if (isAuthorized) {
      return navigator.navigate(ROUTES.appletList.path);
    } else {
      return navigator.navigate(ROUTES.login.path);
    }
  };

  return (
    <Box sx={{ backgroundColor: variables.palette.primary, padding: '8px 16px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <ButtonBase onClick={onLogoClick} disableRipple sx={{ marginY: '15px' }}>
          <AvatarBase src={curiousLogo} name="" width="148.48px" height="32px" variant="square" />
        </ButtonBase>

        {lessThanSM && (
          <IconButton onClick={toggleMenuOpen}>
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>
        )}

        {!lessThanSM && (
          <Box display="flex">
            <LanguageDropdown toggleMenuOpen={closeMenu} />

            {isAuthorized ? (
              <AccountDropdown
                title={`${user.firstName} ${user.lastName}`}
                toggleMenuOpen={closeMenu}
              />
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
            <AccountDropdown
              title={`${user.firstName} ${user.lastName}`}
              toggleMenuOpen={closeMenu}
            />
          ) : (
            <LoginButton toggleMenuOpen={closeMenu} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default Header;
