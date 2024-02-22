import Button from '@mui/material/Button';

import { useNavbarTranslation } from '../lib/useNavbarTranslation';

import { ROUTES } from '~/shared/constants';
import { useCustomNavigation } from '~/shared/utils';

type Props = {
  toggleMenuOpen: () => void;
};

const LoginButton = ({ toggleMenuOpen }: Props) => {
  const { t } = useNavbarTranslation();
  const navigator = useCustomNavigation();

  const onLoginButtonClickHandler = () => {
    toggleMenuOpen();
    return navigator.navigate(ROUTES.login.path);
  };

  return (
    <Button
      variant="text"
      onClick={onLoginButtonClickHandler}
      sx={{ color: 'rgba(255, 255, 255, 0.55)', textTransform: 'none' }}
    >
      {t('logIn')}
    </Button>
  );
};

export default LoginButton;
