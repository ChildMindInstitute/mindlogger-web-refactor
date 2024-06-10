import { useNavigate } from 'react-router-dom';

import { useLogout } from '~/features/Logout';
import ROUTES from '~/shared/constants/routes';

export const useAccountDropdown = () => {
  const navigate = useNavigate();
  const { logout, isLoading } = useLogout();

  const accountDropdownOptions = [
    {
      tag: 'profile',
      onSelect: () => {
        navigate(ROUTES.profile.path);
      },
    },
    {
      tag: 'settings',
      onSelect: () => {
        navigate(ROUTES.settings.path);
      },
    },
    {
      tag: 'logOut',
      onSelect: () => {
        logout();
      },
    },
  ];

  return {
    accountDropdownOptions,
    logoutIsLoading: isLoading,
  };
};
