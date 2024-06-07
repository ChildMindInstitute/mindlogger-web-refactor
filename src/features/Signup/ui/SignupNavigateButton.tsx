import { useNavigate } from 'react-router-dom';

import ROUTES from '~/shared/constants/routes';
import { BaseButton } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

interface SignupNavigateButtonProps {
  redirectState?: Record<string, unknown>;
}

export const SignupNavigateButton = ({ redirectState }: SignupNavigateButtonProps) => {
  const { t } = useCustomTranslation();
  const navigate = useNavigate();

  const onSignupClick = () => {
    navigate(ROUTES.signup.path, { state: redirectState });
  };

  return (
    <BaseButton type="button" variant="contained" onClick={onSignupClick} text={t('singUp')} />
  );
};
