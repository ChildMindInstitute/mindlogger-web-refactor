import { useNavigate } from 'react-router-dom';

import { ROUTES } from '~/shared/constants';
import { BaseButton } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

interface LoginNavigateButtonProps {
  redirectState?: Record<string, unknown>;
}

export const LoginNavigateButton = ({ redirectState }: LoginNavigateButtonProps) => {
  const { t } = useCustomTranslation();
  const navigate = useNavigate();

  const onLoginClick = () => {
    navigate(ROUTES.login.path, { state: redirectState });
  };

  return <BaseButton type="button" variant="contained" onClick={onLoginClick} text={t('login')} />;
};
